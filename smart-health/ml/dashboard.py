import sys
import os
import subprocess
import cv2
from kivy.app import App
from kivy.clock import Clock
from kivy.graphics.texture import Texture
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.uix.behaviors import ButtonBehavior
from kivy.graphics import Color, RoundedRectangle, Line
from kivy.core.window import Window
from kivy.uix.screenmanager import Screen

# --- CONFIGURATION ---
Window.clearcolor = (0.95, 0.95, 0.95, 1)  # Light grey background like sketch
Window.size = (1024, 600)  # Typical Raspberry Pi Screen size

from kivy.animation import Animation
from kivy.graphics import Color, Line, RoundedRectangle

class CameraCard(ButtonBehavior, BoxLayout):
    def __init__(self, ward_name, status="Normal", capture=None, **kwargs):
        super().__init__(**kwargs)
        # ... (Existing init code) ...
        
        # STATE FOR ANIMATION
        self.is_pulsing = False
        self.pulse_color = [0, 1, 0, 1] # Default Green
        self.border_width = 1.5

        # TRIGGER ANIMATION BASED ON STATUS
        if status == "Critical":
            self.pulse_color = [1, 0, 0, 1] # Red
            self.start_pulsing(bpm=120) # Fast pulse
        else:
            self.start_pulsing(bpm=60)  # Slow pulse

    def update_canvas(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            Color(1, 1, 1, 1)
            RoundedRectangle(pos=self.pos, size=self.size, radius=[20])
            
            # DYNAMIC BORDER COLOR
            Color(*self.pulse_color) 
            # DYNAMIC WIDTH
            Line(rounded_rectangle=(self.pos[0], self.pos[1], self.size[0], self.size[1], 20), 
                 width=self.border_width)

    def start_pulsing(self, bpm):
        """Creates a breathing animation based on Heart Rate"""
        self.is_pulsing = True
        duration = 60.0 / bpm # Seconds per beat
        
        # Animation: Thicken border -> Thin border
        anim = Animation(border_width=4, duration=duration/2, t='out_quad') + \
               Animation(border_width=1.5, duration=duration/2, t='in_quad')
        
        anim.repeat = True
        anim.start(self)

    # Make sure to update the property so Kivy redraws
    def on_border_width(self, instance, value):
        self.update_canvas()
        
class MedicareDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 20
        self.spacing = 20

        # --- HEADER ---
        self.add_widget(Label(
            text="Medicare", 
            font_size='32sp', 
            color=(0.8, 0, 0, 1), # Red like sketch
            bold=True,
            size_hint_y=0.1,
            font_name='Roboto' 
        ))

        # --- GRID OF CARDS ---
        grid = GridLayout(cols=3, spacing=20, padding=10)
        
        # Initialize Camera (0 is usually the Pi Camera or Webcam)
        try:
            self.cap = cv2.VideoCapture(0)
        except:
            print("No Camera Found, using placeholder")
            self.cap = None

        # --- DUPLICATING THE CARDS ---
        # Based on your sketch: 2 Rows, 3 Cols = 6 Cards
        
        # Ward 1 (Critical)
        grid.add_widget(CameraCard("From Ward 1", "Critical", self.cap))
        
        # Ward 2 (Normal)
        grid.add_widget(CameraCard("From Ward 2", "Normal", self.cap))
        
        # Ward 3 (Normal)
        grid.add_widget(CameraCard("From Ward 3", "Normal", self.cap))
        
        # Ward 4 (Normal)
        grid.add_widget(CameraCard("From Ward 4", "Normal", self.cap))
        
        # Ward 5 (Normal - Typo in sketch says Ward 4 twice, I added 5)
        grid.add_widget(CameraCard("From Ward 5", "Normal", self.cap))
        
        # Ward 6 (Critical)
        grid.add_widget(CameraCard("From Ward 6", "Critical", self.cap))

        self.add_widget(grid)

    def on_stop(self):
        if self.cap:
            self.cap.release()

class MedicareApp(Screen):
    def build(self):
        return MedicareDashboard()

# if __name__ == '__main__':
#     MedicareApp().run()