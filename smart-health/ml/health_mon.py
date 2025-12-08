"""

Simple Heart Monitor - Main Page Only

Real-time heart rate monitoring with animated heart

Requires: kivy, matplotlib

Install: pip install kivy matplotlib

"""



from kivy.app import App

from kivy.uix.boxlayout import BoxLayout

from kivy.uix.floatlayout import FloatLayout

from kivy.uix.label import Label

from kivy.graphics import Color, Ellipse, RoundedRectangle

from kivy.clock import Clock

from kivy.properties import NumericProperty

from kivy.core.window import Window

from kivy.uix.widget import Widget

from kivy.animation import Animation

from kivy.garden.matplotlib.backend_kivyagg import FigureCanvasKivyAgg

import matplotlib.pyplot as plt

from matplotlib.animation import FuncAnimation

from collections import deque

import numpy as np

import threading

import queue

import serial

import serial.tools.list_ports

import json

import time



# Performance config

from kivy.config import Config

Config.set('graphics', 'multisamples', '0')



Window.clearcolor = (0.95, 0.95, 0.97, 1)



class ArduinoReader(threading.Thread):

    """Background Arduino serial reader"""

    def __init__(self, data_queue, port=None, baudrate=115200):

        super().__init__(daemon=True)

        self.data_queue = data_queue

        self.port = port

        self.baudrate = baudrate

        self.running = True

        self.serial_conn = None

        

    def find_arduino(self):

        """Auto-detect Arduino port"""

        ports = serial.tools.list_ports.comports()

        for port in ports:

            if 'Arduino' in port.description or 'ACM' in port.device or 'USB' in port.device:

                return port.device

        return None

    

    def run(self):

        """Read from Arduino"""

        try:

            # Try to find and connect to Arduino

            if self.port is None:

                self.port = self.find_arduino()

            

            if self.port is None:

                print("No Arduino found, using simulation mode")

                self.simulate_data()

                return

            

            self.serial_conn = serial.Serial(self.port, self.baudrate, timeout=1)

            time.sleep(2)  # Wait for Arduino to reset

            

            print(f"Connected to Arduino on {self.port}")

            

            while self.running:

                try:

                    if self.serial_conn.in_waiting > 0:

                        line = self.serial_conn.readline().decode('utf-8').strip()

                        

                        # Try to parse JSON

                        try:

                            data = json.loads(line)

                            # Validate data has required fields
                            print(data)

                            if 'BPM' in data and 'IR' in data:

                                self.data_queue.put(data)

                        except json.JSONDecodeError:

                            # Skip non-JSON lines

                            if line and not line.startswith('{'):

                                print(f"Arduino: {line}")

                

                except Exception as e:

                    print(f"Read error: {e}")

                    time.sleep(0.1)

        

        except Exception as e:

            print(f"Connection error: {e}")

            print("Falling back to simulation mode")

            self.simulate_data()

    

    def simulate_data(self):

        """Fallback simulation if no Arduino"""

        counter = 0

        while self.running:

            counter += 1

            hr = 72 + np.sin(counter * 0.05) * 8 + np.random.randint(-3, 3)

            data = {

                'BPM': max(20, hr),

                'avg_bpm': max(20, int(hr)),

                'IR': 103240 if counter % 10 > 2 else 500,

                'hr_status': 'MEASURING' if counter % 10 > 2 else 'NO_FINGER'

            }

            self.data_queue.put(data)

            time.sleep(1)

    

    def stop(self):

        """Stop reading"""

        self.running = False

        if self.serial_conn:

            self.serial_conn.close()



class AnimatedHeart(Widget):

    """Animated beating heart using circles"""

    beat_scale = NumericProperty(1.0)

    is_beating = False

    

    def __init__(self, **kwargs):

        super().__init__(**kwargs)

        self.bind(pos=self.update_heart, size=self.update_heart)

        self.bind(beat_scale=self.update_heart)

        

    def update_heart(self, *args):

        """Update heart shape"""

        self.canvas.clear()

        

        cx = self.x + self.width / 2

        cy = self.y + self.height / 2

        base_size = min(self.width, self.height) * 0.4 * self.beat_scale

        

        with self.canvas:

            # Pulsing effect color

            alpha = 0.95 if self.is_beating else 0.7

            Color(0.9, 0.2, 0.2, alpha)

            

            # Left lobe

            Ellipse(pos=(cx - base_size * 0.6, cy), 

                   size=(base_size, base_size))

            # Right lobe

            Ellipse(pos=(cx - base_size * 0.4, cy), 

                   size=(base_size, base_size))

            # Bottom

            Ellipse(pos=(cx - base_size * 0.5, cy - base_size * 0.7), 

                   size=(base_size, base_size * 1.2))

    

    def start_beat(self):

        """Start beating animation"""

        if not self.is_beating:

            self.is_beating = True

            self.animate_beat()

    

    def stop_beat(self):

        """Stop beating"""

        self.is_beating = False

        self.beat_scale = 1.0

    

    def animate_beat(self):

        """Animate one heartbeat"""

        if not self.is_beating:

            return

        

        # Beat animation - quick expansion and contraction

        anim1 = Animation(beat_scale=1.2, duration=0.15)

        anim2 = Animation(beat_scale=1.0, duration=0.15)

        anim1.bind(on_complete=lambda *args: anim2.start(self))

        anim2.bind(on_complete=lambda *args: Clock.schedule_once(lambda dt: self.animate_beat(), 0.6))

        anim1.start(self)



class MatplotlibGraph(BoxLayout):

    """Matplotlib-based live graph"""

    def __init__(self, title, color='red', **kwargs):

        super().__init__(**kwargs)

        self.orientation = 'vertical'

        

        # Data storage

        self.data = deque(maxlen=50)

        self.x_data = deque(maxlen=50)

        self.counter = 0

        

        # Create matplotlib figure

        plt.style.use('seaborn-darkgrid')

        self.fig, self.ax = plt.subplots(figsize=(6, 4), facecolor='white')

        self.fig.patch.set_alpha(0.9)

        

        self.ax.set_title(title, fontsize=16, pad=10)

        self.ax.set_ylim(40, 120)

        self.ax.set_xlim(0, 50)

        self.ax.set_xlabel('Time (samples)', fontsize=10)

        self.ax.set_ylabel('BPM', fontsize=10)

        self.ax.grid(True, alpha=0.3)

        

        # Initial empty line

        self.line, = self.ax.plot([], [], color=color, linewidth=2.5)

        

        # Add canvas to widget

        self.canvas_widget = FigureCanvasKivyAgg(self.fig)

        self.add_widget(self.canvas_widget)

        

        # Background styling

        with self.canvas.before:

            Color(1, 1, 1, 0.9)

            self.bg = RoundedRectangle(pos=self.pos, size=self.size, radius=[15])

        self.bind(pos=self._update_bg, size=self._update_bg)

    

    def _update_bg(self, *args):

        self.bg.pos = self.pos

        self.bg.size = self.size

    

    def add_point(self, value):

        """Add data point and update graph"""

        self.counter += 1

        self.data.append(value)

        self.x_data.append(self.counter)

        

        # Update line data

        if len(self.data) > 0:

            x_list = list(self.x_data)

            y_list = list(self.data)

            

            # Normalize x to 0-50 range

            if len(x_list) > 0:

                x_normalized = [i for i in range(len(x_list))]

                self.line.set_data(x_normalized, y_list)

            

            # Redraw

            self.canvas_widget.draw()



class MainPage(FloatLayout):

    """Main page with animated heart and graphs"""

    def __init__(self, app, **kwargs):

        super().__init__(**kwargs)

        self.app = app

        

        layout = BoxLayout(orientation='vertical', padding=30, spacing=20)

        

        # Header

        header = BoxLayout(size_hint_y=0.12, spacing=20)

        title = Label(text="HealthWatch Pro", font_size='40sp', bold=True, 

                     color=(0.2, 0.2, 0.2, 1), halign='left')

        title.bind(size=title.setter('text_size'))


        self.time_label = Label(text="Monitoring Heart Rate", font_size='24sp', 

                               color=(0.3, 0.5, 0.8, 1), halign='right')

        self.time_label.bind(size=self.time_label.setter('text_size'))

        

        header.add_widget(title)

        header.add_widget(self.time_label)

        layout.add_widget(header)

        

        # Main content with heart

        content = BoxLayout(orientation='horizontal', size_hint_y=0.88, spacing=40)

        

        # Heart Rate Graph (Left)

        self.hr_graph = MatplotlibGraph("Heart Rate Graph", color='crimson')

        content.add_widget(self.hr_graph)

        

        # Animated Heart (Center)

        heart_container = FloatLayout()

        self.heart = AnimatedHeart(size_hint=(None, None), size=(350, 350))

        self.heart.pos_hint = {'center_x': 0.5, 'center_y': 0.5}

        

        self.heart_label = Label(text="-- BPM", font_size='52sp', bold=True,

                                color=(0.9, 0.2, 0.2, 1), 

                                pos_hint={'center_x': 0.5, 'center_y': 0.5})

        

        heart_container.add_widget(self.heart)

        heart_container.add_widget(self.heart_label)

        content.add_widget(heart_container)

        

        # Pulse Rate Graph (Right)

        self.pulse_graph = MatplotlibGraph("Pulse Rate Graph", color='royalblue')

        content.add_widget(self.pulse_graph)

        

        layout.add_widget(content)

        self.add_widget(layout)

    

    def update(self, data):

        """Update display with new data"""

        bpm = data.get('BPM', 0)

        avg_bpm = data.get('avg_bpm', bpm)

        ir = data.get('IR', 0)

        

        # Update heart animation

        if ir > 50000 and bpm > 20:

            if not self.heart.is_beating:

                self.heart.start_beat()

            self.heart_label.text = f"{int(bpm)} BPM"

        else:

            if self.heart.is_beating:

                self.heart.stop_beat()

            self.heart_label.text = "-- BPM"

        

        # Update graphs

        if bpm > 0 and bpm < 200:  # Sanity check

            self.hr_graph.add_point(bpm)

            self.pulse_graph.add_point(avg_bpm if avg_bpm > 0 else bpm)



class HeartMonitorApp(App):

    """Main application"""

    def __init__(self, arduino_port=None, **kwargs):

        super().__init__(**kwargs)

        self.arduino_port = arduino_port

        self.data_queue = queue.Queue()

        self.arduino_thread = None

        self.main_page = None

    

    def build(self):

        """Build app"""

        self.title = "HealthWatch Pro - Heart Monitor"

        self.main_page = MainPage(self)

        return self.main_page

    

    def process_queue(self, dt):

        """Process data queue"""

        try:

            while True:

                data = self.data_queue.get_nowait()

                self.main_page.update(data)

        except queue.Empty:

            pass

    

    def on_start(self):

        """Start background thread"""

        self.arduino_thread = ArduinoReader(self.data_queue, self.arduino_port)

        self.arduino_thread.start()

        Clock.schedule_interval(self.process_queue, 0.1)  # 10Hz update

    

    def on_stop(self):

        """Cleanup"""

        if self.arduino_thread:

            self.arduino_thread.stop()



if __name__ == '__main__':

    # Auto-detect Arduino or specify port

    # arduino_port = '/dev/ttyACM0'  # Uncomment and set your port

    arduino_port = None  # Will auto-detect

    

    HeartMonitorApp(arduino_port=arduino_port).run()