import threading
import queue
import serial
import serial.tools.list_ports
import json
import time
from collections import deque

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from kivy.uix.button import Button
from kivy.graphics import Color, Line, RoundedRectangle, Rectangle
from kivy.clock import Clock
from kivy.animation import Animation
from kivy.core.window import Window
from kivy.properties import ListProperty, StringProperty

# --- CONFIGURATION ---
Window.clearcolor = (0.12, 0.12, 0.12, 1)
MAX_POINTS = 50 

# --- ARDUINO READER ---
class ArduinoReader(threading.Thread):
    def __init__(self, data_queue):
        super().__init__(daemon=True)
        self.data_queue = data_queue
        self.running = True
        self.port = None
        self.baudrate = 115200

    def find_arduino(self):
        ports = serial.tools.list_ports.comports()
        for port in ports:
            if 'Arduino' in port.description or 'ACM' in port.device or 'USB' in port.device:
                return port.device
        return None

    def run(self):
        self.port = self.find_arduino()
        if self.port:
            try:
                print(f"Connecting to {self.port}...")
                conn = serial.Serial(self.port, self.baudrate, timeout=1)
                time.sleep(2)
                print("Connected!")
                
                while self.running:
                    if conn.in_waiting:
                        try:
                            line = conn.readline().decode('utf-8').strip()
                            if line.startswith('{'):
                                data = json.loads(line)
                                self.data_queue.put(data)
                        except:
                            pass
            except Exception as e:
                print(f"Serial Error: {e}")
        else:
            print("No Arduino found.")

    def stop(self):
        self.running = False

# --- CUSTOM WIDGETS ---

class RoundedButton(Button):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.background_normal = '' 
        self.background_color = (0, 0, 0, 0)
        self.bind(pos=self.update_canvas, size=self.update_canvas)

    def update_canvas(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            Color(0.2, 0.6, 1, 1)  # Blue Color
            RoundedRectangle(pos=self.pos, size=self.size, radius=[25])

class FastGraph(Widget):
    """High-performance Graph"""
    line_color = ListProperty([0, 1, 0, 1])

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # START WITH 75 (Middle) so lines are VISIBLE immediately
        self.data_points = deque([75] * MAX_POINTS, maxlen=MAX_POINTS)
        self.bind(pos=self.redraw, size=self.redraw, line_color=self.redraw)
        # Force redraw on next frame to ensure layout is ready
        Clock.schedule_once(self.redraw, 0)

    def add_point(self, value):
        self.data_points.append(value)
        self.redraw()

    def redraw(self, *args):
        # Safety check: Don't draw if widget has no size
        if self.width < 10 or self.height < 10: 
            return
            
        self.canvas.clear()
        
        with self.canvas:
            Color(*self.line_color)
            points = []
            step_x = self.width / (MAX_POINTS - 1)
            
            for i, val in enumerate(self.data_points):
                x = self.x + (i * step_x)
                
                # Math to keep line inside the box
                # Input assumed 0-150. We clamp it safely.
                clamped_val = max(0, min(val, 150)) 
                
                # Map value to height (leaving 10% padding top/bottom)
                normalized_h = (clamped_val / 150.0) * (self.height * 0.8) 
                y = self.y + normalized_h + (self.height * 0.1) 
                
                points.extend([x, y])
            
            # Simple line, no fancy caps (better for Pi compatibility)
            Line(points=points, width=2.0)

class GraphCard(BoxLayout):
    title = StringProperty("Graph")
    value_text = StringProperty("-- BPM")
    graph_color = ListProperty([0, 1, 0, 1])

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 5
        
        # Title
        self.lbl_title = Label(text=self.title, font_size='18sp', 
                               color=(0.9, 0.9, 0.9, 1), size_hint_y=None, height=30)
        self.add_widget(self.lbl_title)

        # Graph Container
        graph_box = BoxLayout(padding=10) 
        with graph_box.canvas.before:
            Color(0.18, 0.18, 0.18, 1)
            self.inner_rect = RoundedRectangle(radius=[10])
        
        graph_box.bind(pos=self._update_inner, size=self._update_inner)
        
        # Explicit size hint to force fill
        self.graph = FastGraph(line_color=self.graph_color, size_hint=(1, 1))
        graph_box.add_widget(self.graph)
        self.add_widget(graph_box)

        # Value
        self.lbl_value = Label(text=self.value_text, font_size='24sp', bold=True,
                               color=(1, 1, 1, 1), size_hint_y=None, height=40)
        self.add_widget(self.lbl_value)

        self.bind(title=self.lbl_title.setter('text'))
        self.bind(value_text=self.lbl_value.setter('text'))
        self.bind(graph_color=self.graph.setter('line_color'))
        self.bind(pos=self._update_card, size=self._update_card)

    def _update_card(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            Color(1, 1, 1, 1) # Border
            RoundedRectangle(pos=self.pos, size=self.size, radius=[15])
            Color(0.12, 0.12, 0.12, 1) # Background
            RoundedRectangle(pos=[self.x+2, self.y+2], size=[self.width-4, self.height-4], radius=[13])

    def _update_inner(self, instance, value):
        self.inner_rect.pos = instance.pos
        self.inner_rect.size = instance.size

    def update(self, value):
        self.graph.add_point(value)
        self.value_text = f"{int(value)} BPM"
        # Color Logic: Red if low, Green if normal
        if value < 60: self.graph_color = [1, 0.3, 0.3, 1]
        else: self.graph_color = [0.3, 1, 0.3, 1]

class HeartImage(Image):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.source = 'heart.png'
        self.allow_stretch = True
        self.keep_ratio = True
        self.size_hint = (None, None)
        self.size = (200, 200)
        self.pos_hint = {'center_x': 0.5, 'center_y': 0.5}
        Clock.schedule_interval(self.beat, 0.8)

    def beat(self, dt):
        anim = Animation(size=(230, 230), duration=0.1, t='out_quad') + \
               Animation(size=(200, 200), duration=0.2, t='out_bounce')
        anim.start(self)

class MonitorPage(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 30
        self.spacing = 10

        # Header
        self.add_widget(Label(text="Smart Health", font_size='32sp', 
                              bold=True, size_hint_y=0.1, font_name='Roboto'))

        # Middle Section
        middle = BoxLayout(orientation='horizontal', spacing=30, size_hint_y=0.7)
        self.hr_card = GraphCard(title="Heart Rate Graph")
        middle.add_widget(self.hr_card)
        
        heart_layout = FloatLayout()
        self.heart_img = HeartImage()
        heart_layout.add_widget(self.heart_img)
        middle.add_widget(heart_layout)
        
        self.pulse_card = GraphCard(title="Pulse Rate Graph")
        middle.add_widget(self.pulse_card)
        self.add_widget(middle)

        # Bottom Button Section
        btn_layout = AnchorLayout(anchor_x='center', anchor_y='center', size_hint_y=0.2)
        btn = RoundedButton(text="Smart Health", font_size='20sp', 
                            size_hint=(None, None), size=(250, 60))
        btn_layout.add_widget(btn)
        self.add_widget(btn_layout)

    def update_data(self, data):
        bpm = data.get('BPM', 0)
        self.hr_card.update(bpm)
        self.pulse_card.update(bpm)

class HealthApp(App):
    def build(self):
        self.queue = queue.Queue()
        self.monitor = MonitorPage()
        
        self.arduino = ArduinoReader(self.queue)
        self.arduino.start()
        
        Clock.schedule_interval(self.update_loop, 1.0/30.0)
        return self.monitor

    def update_loop(self, dt):
        # LAG FIX: Drain the queue completely and only use the LATEST data
        # This prevents the queue from getting clogged if Arduino is faster than the screen
        latest_data = None
        while not self.queue.empty():
            try:
                latest_data = self.queue.get_nowait()
            except:
                pass
        
        if latest_data:
            self.monitor.update_data(latest_data)

    def on_stop(self):
        self.arduino.stop()

if __name__ == '__main__':
    HealthApp().run()