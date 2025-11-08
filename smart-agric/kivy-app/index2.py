from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.graphics import Color, Rectangle, Ellipse, Line
from kivy.clock import Clock
from random import randint


class AnimatedEmoji(FloatLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        with self.canvas:
            # Fixed white rectangle background (the "face")
            self.face_color = Color(1, 1, 1, 1)
            self.face = Rectangle(pos=self.pos, size=self.size)

            # Eyes
            self.eye_color = Color(0, 0, 0, 1)
            self.left_eye = Ellipse()
            self.right_eye = Ellipse()

            # Mouth
            self.mouth_color = Color(0, 0, 0, 1)
            self.mouth = Line(width=2)

        # Bind for responsiveness
        self.bind(pos=self.update_canvas, size=self.update_canvas)

        # Simulate mood changes (every 2 seconds)
        Clock.schedule_interval(self.randomize_expression, 2)

    def update_canvas(self, *args):
        """Redraw emoji whenever window resizes or updates"""
        self.face.pos = self.pos
        self.face.size = self.size

        center_x = self.x + self.width / 2
        center_y = self.y + self.height / 2

        # Eye size and position (relative to rectangle height)
        eye_size = self.height * 0.1
        eye_y = center_y + self.height * 0.15
        eye_offset_x = self.width * 0.15

        self.left_eye.pos = (center_x - eye_offset_x - eye_size / 2, eye_y)
        self.left_eye.size = (eye_size, eye_size)
        self.right_eye.pos = (center_x + eye_offset_x - eye_size / 2, eye_y)
        self.right_eye.size = (eye_size, eye_size)

        # Mouth
        mouth_width = self.width * 0.3
        mouth_y = center_y - self.height * 0.2
        self.mouth.points = [
            center_x - mouth_width / 2, mouth_y,
            center_x + mouth_width / 2, mouth_y
        ]

    def randomize_expression(self, dt):
        """Change mouth curve to simulate emotion — no color change"""
        center_x = self.x + self.width / 2
        center_y = self.y + self.height / 2
        mouth_width = self.width * 0.3
        mouth_y = center_y - self.height * 0.2

        mood = randint(0, 2)
        if mood == 0:  # happy
            self.mouth.points = [
                center_x - mouth_width / 2, mouth_y,
                center_x, mouth_y + self.height * 0.05,
                center_x + mouth_width / 2, mouth_y
            ]
        elif mood == 1:  # sad
            self.mouth.points = [
                center_x - mouth_width / 2, mouth_y + self.height * 0.05,
                center_x, mouth_y - self.height * 0.05,
                center_x + mouth_width / 2, mouth_y + self.height * 0.05
            ]
        else:  # neutral
            self.mouth.points = [
                center_x - mouth_width / 2, mouth_y,
                center_x + mouth_width / 2, mouth_y
            ]


class SensorBar(BoxLayout):
    """Represents a vertical bar (for Moisture, Temp, etc.)"""
    def __init__(self, title, **kwargs):
        super().__init__(orientation='vertical', **kwargs)
        self.title = Label(text=title, font_size=18)
        self.value_label = Label(text="0%", font_size=24)
        self.add_widget(self.title)
        self.add_widget(self.value_label)

        Clock.schedule_interval(self.update_value, 3)

    def update_value(self, dt):
        new_value = randint(10, 99)
        self.value_label.text = f"{new_value}%"


class SmartAgriApp(App):
    def build(self):
        root = BoxLayout(orientation='horizontal', padding=20, spacing=10)

        # Left: Moisture bar
        moisture_bar = SensorBar("Moisture", size_hint=(0.15, 1))

        # Center: Full-width emoji display
        emoji_container = FloatLayout(size_hint=(0.7, 1))
        emoji = AnimatedEmoji(size_hint=(1, 1))
        emoji_container.add_widget(emoji)

        # Right: Temperature and Humidity bars
        right_panel = BoxLayout(orientation='vertical', size_hint=(0.15, 1), spacing=20)
        temp_bar = SensorBar("Temperature")
        humidity_bar = SensorBar("Humidity")
        right_panel.add_widget(temp_bar)
        right_panel.add_widget(humidity_bar)

        # Add all sections
        root.add_widget(moisture_bar)
        root.add_widget(emoji_container)
        root.add_widget(right_panel)

        return root


if __name__ == '__main__':
    SmartAgriApp().run()
