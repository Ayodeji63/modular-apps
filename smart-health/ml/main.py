"""
Single Patient Health Monitoring System - Simplified & Responsive
Real-time monitoring with camera feed for one patient
Requires: kivy, opencv-python, numpy
Install: pip install kivy opencv-python numpy
"""

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.graphics import Color, Rectangle, RoundedRectangle, Line
from kivy.clock import Clock
from kivy.properties import NumericProperty, StringProperty
from kivy.core.window import Window
from kivy.graphics.texture import Texture

import cv2
import numpy as np
from datetime import datetime
import threading
import queue

# Performance config
from kivy.config import Config
Config.set('graphics', 'multisamples', '0')

# Make window responsive - will adapt to screen size
Window.clearcolor = (1, 1, 1, 1)

class PatientData:
    """Single patient data"""
    def __init__(self):
        self.name = "Chioma Okafor"
        self.patient_id = "P001"
        self.ward = "Ward 1"
        self.hr = 72
        self.spo2 = 98
        self.temp = 36.5
        self.humidity = 45
        self.status = "Normal"

class CameraWidget(Image):
    """Optimized camera widget with OpenCV"""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.capture = None
        self.is_running = False
        
        # Try to initialize camera
        try:
            self.capture = cv2.VideoCapture(0)  # 0 for default camera
            if self.capture.isOpened():
                self.is_running = True
                Clock.schedule_interval(self.update_frame, 1.0 / 30.0)  # 30 FPS
            else:
                self.show_placeholder()
        except:
            self.show_placeholder()
    
    def show_placeholder(self):
        """Show placeholder when camera not available"""
        # Create a placeholder image
        placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
        placeholder[:] = (20, 20, 40)  # Dark blue background
        
        # Add text
        cv2.putText(placeholder, "Camera Feed", (200, 220), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1.5, (100, 180, 255), 3)
        cv2.putText(placeholder, "No camera detected", (180, 280), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (150, 150, 150), 2)
        
        self.update_texture(placeholder)
    
    def update_frame(self, dt):
        """Update camera frame"""
        if not self.is_running or self.capture is None:
            return
        
        ret, frame = self.capture.read()
        if ret:
            # Flip and convert
            frame = cv2.flip(frame, 0)
            self.update_texture(frame)
    
    def update_texture(self, frame):
        """Update texture from frame"""
        buf = frame.tobytes()
        texture = Texture.create(size=(frame.shape[1], frame.shape[0]), colorfmt='bgr')
        texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
        self.texture = texture
    
    def stop(self):
        """Stop camera"""
        self.is_running = False
        if self.capture:
            self.capture.release()

class MetricCard(BoxLayout):
    """Responsive metric card"""
    value = NumericProperty(0)
    title = StringProperty("")
    unit = StringProperty("")
    
    def __init__(self, title, color, **kwargs):
        super().__init__(**kwargs)
        self.title = title
        self.color_rgb = color
        self.orientation = 'vertical'
        self.padding = [20, 15]
        self.spacing = 10
        
        # Rounded background
        with self.canvas.before:
            Color(*color, 0.9)
            self.bg = RoundedRectangle(pos=self.pos, size=self.size, radius=[15])
        self.bind(pos=self._update_bg, size=self._update_bg)
        
        # Title
        self.title_label = Label(
            text=title,
            size_hint_y=0.3,
            font_size='16sp',
            color=(1, 1, 1, 0.9),
            halign='center'
        )
        self.add_widget(self.title_label)
        
        # Value
        self.value_label = Label(
            text="0",
            size_hint_y=0.5,
            font_size='42sp',
            bold=True,
            color=(1, 1, 1, 1),
            halign='center'
        )
        self.add_widget(self.value_label)
        
        # Unit
        self.unit_label = Label(
            text="",
            size_hint_y=0.2,
            font_size='14sp',
            color=(1, 1, 1, 0.8),
            halign='center'
        )
        self.add_widget(self.unit_label)
        
        self.bind(value=self._update_value)
        self.bind(unit=self._update_unit)
    
    def _update_bg(self, *args):
        self.bg.pos = self.pos
        self.bg.size = self.size
    
    def _update_value(self, instance, value):
        if self.title == "Temperature":
            self.value_label.text = f"{value:.1f}"
        else:
            self.value_label.text = f"{int(value)}"
    
    def _update_unit(self, instance, value):
        self.unit_label.text = value

class StatusCard(BoxLayout):
    """Patient status card"""
    status = StringProperty("Normal")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = [20, 15]
        self.spacing = 5
        
        with self.canvas.before:
            self.status_color = Color(0.1, 0.7, 0.3, 0.9)
            self.bg = RoundedRectangle(pos=self.pos, size=self.size, radius=[15])
        self.bind(pos=self._update_bg, size=self._update_bg)
        self.bind(status=self._update_status_color)
        
        # Status label
        self.status_label = Label(
            text="Status",
            size_hint_y=0.3,
            font_size='14sp',
            color=(1, 1, 1, 0.9)
        )
        self.add_widget(self.status_label)
        
        # Value
        self.value_label = Label(
            text="Normal",
            size_hint_y=0.5,
            font_size='36sp',
            bold=True,
            color=(1, 1, 1, 1)
        )
        self.add_widget(self.value_label)
        
        # Icon
        self.icon_label = Label(
            text="✓",
            size_hint_y=0.2,
            font_size='24sp',
            color=(1, 1, 1, 1)
        )
        self.add_widget(self.icon_label)
        
        self.bind(status=self._update_status_text)
    
    def _update_bg(self, *args):
        self.bg.pos = self.pos
        self.bg.size = self.size
    
    def _update_status_color(self, instance, value):
        if value == "Critical":
            self.status_color.rgba = (0.8, 0.1, 0.1, 0.9)
            self.icon_label.text = "⚠"
        elif value == "Warning":
            self.status_color.rgba = (0.9, 0.6, 0.1, 0.9)
            self.icon_label.text = "!"
        else:
            self.status_color.rgba = (0.1, 0.7, 0.3, 0.9)
            self.icon_label.text = "✓"
    
    def _update_status_text(self, instance, value):
        self.value_label.text = value

class SinglePatientDashboard(FloatLayout):
    """Responsive single patient dashboard"""
    def __init__(self, app, **kwargs):
        super().__init__(**kwargs)
        self.app = app
        self.patient = app.patient
        
        # Main layout
        main_layout = BoxLayout(orientation='vertical', padding=20, spacing=15)
        
        # Header
        header = self._create_header()
        main_layout.add_widget(header)
        
        # Content area - responsive grid
        content = BoxLayout(orientation='horizontal', spacing=20, size_hint_y=0.85)
        
        # Left side - Camera (60% width)
        camera_container = self._create_camera_section()
        content.add_widget(camera_container)
        
        # Right side - Metrics (40% width)
        metrics_container = self._create_metrics_section()
        content.add_widget(metrics_container)
        
        main_layout.add_widget(content)
        self.add_widget(main_layout)
    
    def _create_header(self):
        """Create header section"""
        header = BoxLayout(size_hint_y=0.12, spacing=20)
        
        # Left - Patient info
        info_box = BoxLayout(orientation='vertical', size_hint_x=0.5, spacing=5)
        
        title = Label(
            text="HealthWatch Pro",
            font_size='32sp',
            bold=True,
            color=(1, 1, 1, 1),
            halign='left',
            size_hint_y=0.6
        )
        title.bind(size=title.setter('text_size'))
        
        subtitle = Label(
            text=f"{self.patient.name} • {self.patient.patient_id} • {self.patient.ward}",
            font_size='18sp',
            color=(0.7, 0.7, 0.7, 1),
            halign='left',
            size_hint_y=0.4
        )
        subtitle.bind(size=subtitle.setter('text_size'))
        
        info_box.add_widget(title)
        info_box.add_widget(subtitle)
        header.add_widget(info_box)
        
        # Right - Time
        self.time_label = Label(
            text=datetime.now().strftime("%I:%M:%S %p"),
            font_size='24sp',
            bold=True,
            color=(0.5, 0.7, 1, 1),
            size_hint_x=0.5,
            halign='right'
        )
        self.time_label.bind(size=self.time_label.setter('text_size'))
        header.add_widget(self.time_label)
        
        return header
    
    def _create_camera_section(self):
        """Create camera section"""
        camera_box = BoxLayout(orientation='vertical', size_hint_x=0.6, spacing=10)
        
        # Camera title
        cam_title = Label(
            text="Live Camera Feed",
            size_hint_y=0.08,
            font_size='20sp',
            bold=True,
            color=(0, 0, 0, 1)
        )
        camera_box.add_widget(cam_title)
        
        # Camera widget with border
        cam_container = BoxLayout(size_hint_y=0.92, padding=5)
        
        # Border
        with cam_container.canvas.before:
            Color(0.3, 0.6, 1, 0.8)
            self.camera_border = RoundedRectangle(
                pos=cam_container.pos,
                size=cam_container.size,
                radius=[15]
            )
            Color(0.05, 0.05, 0.1, 1)
            self.camera_bg = RoundedRectangle(
                pos=(cam_container.x + 5, cam_container.y + 5),
                size=(cam_container.width - 10, cam_container.height - 10),
                radius=[12]
            )
        
        cam_container.bind(pos=self._update_camera_border, size=self._update_camera_border)
        
        # Camera widget
        self.camera = CameraWidget()
        cam_container.add_widget(self.camera)
        
        camera_box.add_widget(cam_container)
        return camera_box
    
    def _update_camera_border(self, instance, value):
        """Update camera border position"""
        self.camera_border.pos = instance.pos
        self.camera_border.size = instance.size
        self.camera_bg.pos = (instance.x + 5, instance.y + 5)
        self.camera_bg.size = (instance.width - 10, instance.height - 10)
    
    def _create_metrics_section(self):
        """Create metrics section"""
        metrics_box = BoxLayout(orientation='vertical', size_hint_x=0.4, spacing=15)
        
        # Metrics title
        metrics_title = Label(
            text="Vital Signs",
            size_hint_y=0.08,
            font_size='20sp',
            bold=True,
            color=(0, 0, 0, 1)
        )
        metrics_box.add_widget(metrics_title)
        
        # Metrics grid
        metrics_grid = GridLayout(cols=1, spacing=15, size_hint_y=0.92)
        
        # Heart Rate
        self.hr_card = MetricCard("Heart Rate", (0.8, 0.2, 0.2))
        self.hr_card.unit = "BPM"
        self.hr_card.value = self.patient.hr
        metrics_grid.add_widget(self.hr_card)
        
        # SpO2
        self.spo2_card = MetricCard("Blood Oxygen", (0.2, 0.5, 0.9))
        self.spo2_card.unit = "%"
        self.spo2_card.value = self.patient.spo2
        metrics_grid.add_widget(self.spo2_card)
        
        # Temperature
        self.temp_card = MetricCard("Temperature", (0.9, 0.5, 0.2))
        self.temp_card.unit = "°C"
        self.temp_card.value = self.patient.temp
        metrics_grid.add_widget(self.temp_card)
        
        # Status
        self.status_card = StatusCard()
        self.status_card.status = self.patient.status
        metrics_grid.add_widget(self.status_card)
        
        metrics_box.add_widget(metrics_grid)
        return metrics_box
    
    def update_display(self):
        """Update all displays"""
        self.hr_card.value = self.patient.hr
        self.spo2_card.value = self.patient.spo2
        self.temp_card.value = self.patient.temp
        self.status_card.status = self.patient.status
        self.time_label.text = datetime.now().strftime("%I:%M:%S %p")

class SensorSimulator:
    """Simulate sensor readings"""
    def __init__(self):
        self.counter = 0
    
    def get_readings(self):
        """Get simulated readings"""
        self.counter += 1
        hr = 72 + np.sin(self.counter * 0.05) * 8 + np.random.randint(-3, 3)
        spo2 = 98 + np.random.randint(-1, 2)
        temp = 36.5 + np.random.randint(-1, 2) * 0.1
        
        # Determine status
        status = "Normal"
        if hr > 110 or spo2 < 93 or temp > 38.5:
            status = "Critical"
        elif hr > 95 or spo2 < 95 or temp > 37.5:
            status = "Warning"
        
        return float(hr), float(spo2), float(temp), status

class SensorThread(threading.Thread):
    """Background sensor reading"""
    def __init__(self, data_queue, simulator):
        super().__init__(daemon=True)
        self.data_queue = data_queue
        self.simulator = simulator
        self.running = True
    
    def run(self):
        """Read sensors in background"""
        while self.running:
            hr, spo2, temp, status = self.simulator.get_readings()
            self.data_queue.put({
                'hr': hr,
                'spo2': spo2,
                'temp': temp,
                'status': status
            })
            threading.Event().wait(1.0)  # Wait 1 second
    
    def stop(self):
        self.running = False

class HealthMonitorApp(App):
    """Main application"""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.patient = PatientData()
        self.simulator = SensorSimulator()
        self.data_queue = queue.Queue()
        self.sensor_thread = None
        self.dashboard = None
    
    def build(self):
        """Build app"""
        self.title = "HealthWatch Pro - Patient Monitor"
        self.dashboard = SinglePatientDashboard(self)
        return self.dashboard
    
    def process_queue(self, dt):
        """Process sensor data queue"""
        try:
            while True:
                data = self.data_queue.get_nowait()
                self.patient.hr = float(data['hr'])
                self.patient.spo2 = float(data['spo2'])
                self.patient.temp = float(data['temp'])
                self.patient.status = data['status']
                self.dashboard.update_display()
        except queue.Empty:
            pass
    
    def on_start(self):
        """Start background thread"""
        self.sensor_thread = SensorThread(self.data_queue, self.simulator)
        self.sensor_thread.start()
        Clock.schedule_interval(self.process_queue, 0.1)
    
    def on_stop(self):
        """Cleanup"""
        if self.sensor_thread:
            self.sensor_thread.stop()
        if self.dashboard and self.dashboard.camera:
            self.dashboard.camera.stop()

if __name__ == '__main__':
    HealthMonitorApp().run()