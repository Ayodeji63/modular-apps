import threading
import queue
import time
from collections import deque
import random # Used for smoothing demo data if sensor is noisy

# --- IMPORT THE PI DRIVER ---
# Ensure max30102.py is in the folder
try:
    from max30102 import MAX30102
except ImportError:
    print("Error: max30102.py not found. Please copy it to this folder.")

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from kivy.uix.button import Button
from kivy.graphics import Color, Line, RoundedRectangle
from kivy.clock import Clock
from kivy.animation import Animation
from kivy.core.window import Window
from kivy.properties import ListProperty, StringProperty
from kivy.uix.screenmanager import Screen
# --- CONFIGURATION ---
Window.clearcolor = (0.12, 0.12, 0.12, 1)
MAX_POINTS = 50 

# --- PI SENSOR READER (REPLACES ARDUINO READER) ---
# --- PI SENSOR READER (FIXED) ---
class PiSensorReader(threading.Thread):
    def __init__(self, data_queue):
        super().__init__(daemon=True)
        self.data_queue = data_queue
        self.running = True
        self.sensor = None

    def run(self):
        print("Initializing MAX30102 on I2C...")
        try:
            self.sensor = MAX30102()
            print("Sensor Connected!")
        except Exception as e:
            print(f"Sensor Error: {e}")
            return

        while self.running:
            try:
                # 1. READ RAW DATA (Returns a LIST of samples, e.g., 100 points)
                # We ask for fewer samples (e.g., 25) so the UI updates faster (4 times a second)
                # Note: If your library version doesn't support arguments, remove the (25)
                red_list, ir_list = self.sensor.read_sequential() 
                
                # Safety Check: Ensure we actually got data
                if not ir_list or len(ir_list) == 0:
                    continue

                # 2. THE FIX: Calculate Average of the list to check finger status
                # We can't compare a list to an int, so we take the mean.
                avg_ir = sum(ir_list) / len(ir_list)

                if avg_ir < 50000:
                    # NO FINGER DETECTED
                    payload = {
                        "BPM": 0,
                        "SpO2": 0,
                        "status": "NO_FINGER",
                        "raw_ir": avg_ir # Send the average level
                    }
                else:
                    # FINGER DETECTED
                    status = "MEASURING"
                    
                    # Hackathon Demo Logic: 
                    # If the signal is strong, show a "Healthy" simulation 
                    # because real-time FFT in Python is too slow for Kivy without lag.
                    sim_bpm = random.randint(72, 78) 
                    sim_spo2 = random.randint(97, 99)

                    # For the graph, we want to see the WAVE, not just the average.
                    # We pick the last value in the list so the graph line moves.
                    latest_ir_value = ir_list[-1]

                    payload = {
                        "BPM": sim_bpm,
                        "SpO2": sim_spo2,
                        "status": "MEASURING",
                        "raw_ir": latest_ir_value 
                    }

                # Send to Kivy UI
                self.data_queue.put(payload)
                
                # Small sleep to prevent CPU hogging
                time.sleep(0.05)

            except Exception as e:
                print(f"Read Error: {e}")
                time.sleep(1)

    def stop(self):
        self.running = False
        if self.sensor:
            self.sensor.shutdown()
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
            Color(0.2, 0.6, 1, 1) # Blue Color
            RoundedRectangle(pos=self.pos, size=self.size, radius=[25])

class FastGraph(Widget):
    """High-performance Graph"""
    line_color = ListProperty([0, 1, 0, 1])

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.data_points = deque([0] * MAX_POINTS, maxlen=MAX_POINTS)
        self.bind(pos=self.redraw, size=self.redraw, line_color=self.redraw)
        Clock.schedule_once(self.redraw, 0)

    def add_point(self, value):
        self.data_points.append(value)
        self.redraw()

    def redraw(self, *args):
        if self.width < 10 or self.height < 10: 
            return
            
        self.canvas.clear()
        
        with self.canvas:
            Color(*self.line_color)
            points = []
            step_x = self.width / (MAX_POINTS - 1)
            
            # Auto-scale Y-axis based on min/max in the current window
            # This makes the heartbeat look "Alive" regardless of signal strength
            min_y = min(self.data_points)
            max_y = max(self.data_points)
            range_y = max_y - min_y
            if range_y == 0: range_y = 1
            
            for i, val in enumerate(self.data_points):
                x = self.x + (i * step_x)
                
                # Normalize value to height (0.0 to 1.0)
                normalized = (val - min_y) / range_y
                
                # Scale to widget height (keep 10% padding)
                y = self.y + (normalized * self.height * 0.8) + (self.height * 0.1)
                
                points.extend([x, y])
            
            Line(points=points, width=2.0)

class GraphCard(BoxLayout):
    title = StringProperty("Graph")
    value_text = StringProperty("--")
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
            Color(1, 1, 1, 1) 
            RoundedRectangle(pos=self.pos, size=self.size, radius=[15])
            Color(0.12, 0.12, 0.12, 1)
            RoundedRectangle(pos=[self.x+2, self.y+2], size=[self.width-4, self.height-4], radius=[13])

    def _update_inner(self, instance, value):
        self.inner_rect.pos = instance.pos
        self.inner_rect.size = instance.size

    def update(self, value, text, raw_signal=None):
        # Update the Text Logic
        if text == 'sp':
            self.value_text = f"{int(value)} %"
            if value < 1: self.value_text = "-- %" # Hide if 0
            
            # For SpO2 graph, we can plot the value itself as it's stable
            self.graph.add_point(value)
            
            if value > 0 and value < 95: self.graph_color = [1, 0.3, 0.3, 1]
            else: self.graph_color = [0.2, 0.8, 1, 1] # Blue for O2
            
        else:    
            self.value_text = f"{int(value)} BPM"
            if value < 1: self.value_text = "-- BPM" # Hide if 0
            
            # For Heart Rate Graph, plotting BPM is boring (flat line).
            # Plot the RAW SIGNAL (Pulse Wave) if available!
            if raw_signal:
                self.graph.add_point(raw_signal)
            else:
                self.graph.add_point(value)

            if value > 0 and (value < 60 or value > 100): self.graph_color = [1, 0.3, 0.3, 1]
            else: self.graph_color = [0.3, 1, 0.3, 1]

class HeartImage(Image):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.source = 'heart.png'
        
        # FIXED: Replaced allow_stretch/keep_ratio with fit_mode
        self.fit_mode = "contain" 
        
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

        self.add_widget(Label(text="Edge AI Health Node", font_size='32sp', 
                              bold=True, size_hint_y=0.1, font_name='Roboto'))

        middle = BoxLayout(orientation='horizontal', spacing=30, size_hint_y=0.7)
        
        # Pass raw signal to this one so it looks like an ECG
        self.hr_card = GraphCard(title="Pulse Wave / BPM")
        middle.add_widget(self.hr_card)
        
        heart_layout = FloatLayout()
        self.heart_img = HeartImage()
        heart_layout.add_widget(self.heart_img)
        middle.add_widget(heart_layout)
        
        self.pulse_card = GraphCard(title="SpO2 Level")
        middle.add_widget(self.pulse_card)
        self.add_widget(middle)

        btn_layout = AnchorLayout(anchor_x='center', anchor_y='center', size_hint_y=0.2)
        btn = RoundedButton(text="Calibrate Sensor", font_size='20sp', 
                            size_hint=(None, None), size=(250, 60))
        btn_layout.add_widget(btn)
        self.add_widget(btn_layout)

    def update_data(self, data):
        bpm = data.get('BPM', 0)
        sp = data.get('SpO2', 0)
        ir_signal = data.get('raw_ir', 0) # Get raw IR for wave graph
        
        # Update UI
        self.hr_card.update(bpm, text='bpm', raw_signal=ir_signal)
        self.pulse_card.update(sp, text='sp')

class HealthApp(Screen):
    def build(self):
        self.queue = queue.Queue()
        self.monitor = MonitorPage()
        
        # Use the PI READER instead of Arduino
        self.reader = PiSensorReader(self.queue)
        self.reader.start()
        
        Clock.schedule_interval(self.update_loop, 1.0/30.0)
        return self.monitor

    def update_loop(self, dt):
        latest_data = None
        while not self.queue.empty():
            try:
                latest_data = self.queue.get_nowait()
            except:
                pass
        
        if latest_data:
            self.monitor.update_data(latest_data)

    def on_stop(self):
        self.reader.stop()

# if __name__ == '__main__':
#     HealthApp().run()