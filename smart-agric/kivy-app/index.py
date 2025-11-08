from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from kivy.animation import Animation
from kivy.graphics import Color, Rectangle, Ellipse, Line
from kivy.properties import NumericProperty, StringProperty
from kivy.clock import Clock


class AnimatedEmoji(Widget):
    moisture_level = NumericProperty(50)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Graphics references
        self.face_color = None
        self.face = None
        self.left_eye = None
        self.right_eye = None
        self.left_eye_color = None
        self.right_eye_color = None
        
        # Eyebrows
        self.left_brow = None
        self.right_brow = None
        self.left_brow_color = None
        self.right_brow_color = None
        
        # Eyelashes
        self.left_lashes = []
        self.right_lashes = []
        
        # Cheeks
        self.left_cheek = None
        self.right_cheek = None
        self.left_cheek_color = None
        self.right_cheek_color = None
        
        self.mouth_color = None
        self.mouth = None
        self.tear = None
        self.tear_color = None
        
        self.is_blinking = False
        self.original_eye_size = 0
        
        self.draw_emoji()
        
        self.bind(moisture_level=self.update_expression)
        self.bind(pos=self.redraw, size=self.redraw)
        
        Clock.schedule_interval(self.blink, 3)
    
    def get_circle_size(self):
        return min(self.width, self.height)
    
    def get_circle_pos(self):
        size = self.get_circle_size()
        x = self.x + (self.width - size) / 2
        y = self.y + (self.height - size) / 2
        return (x, y)
    
    def draw_emoji(self):
        self.canvas.clear()
        
        with self.canvas:
            circle_size = self.get_circle_size()
            circle_pos = self.get_circle_pos()
            
            # Face
            self.face_color = Color(1, 0.9, 0.2, 1)
            self.face = Rectangle(
                pos=circle_pos,
                size=(circle_size, circle_size)
            )
            
            center_x = circle_pos[0] + circle_size / 2
            center_y = circle_pos[1] + circle_size / 2
            self.original_eye_size = circle_size * 0.12
            eye_size = self.original_eye_size
            
            # Eyebrows
            self.left_brow_color = Color(0.3, 0.2, 0.1, 1)
            self.left_brow = Line(points=[], width=4)
            
            self.right_brow_color = Color(0.3, 0.2, 0.1, 1)
            self.right_brow = Line(points=[], width=4)
            
            # Eyes
            self.left_eye_color = Color(0, 0, 0, 1)
            self.left_eye = Ellipse(
                pos=(center_x - circle_size * 0.2 - eye_size/2, 
                     center_y + circle_size * 0.12 - eye_size/2),
                size=(eye_size, eye_size)
            )
            
            self.right_eye_color = Color(0, 0, 0, 1)
            self.right_eye = Ellipse(
                pos=(center_x + circle_size * 0.2 - eye_size/2, 
                     center_y + circle_size * 0.12 - eye_size/2),
                size=(eye_size, eye_size)
            )
            
            # Eyelashes
            self.draw_eyelashes(center_x, center_y, circle_size, eye_size)
            
            # Cheeks (will be shown/hidden based on emotion)
            self.left_cheek_color = Color(1, 0.6, 0.7, 0)
            self.left_cheek = Ellipse(
                pos=(center_x - circle_size * 0.35, center_y - circle_size * 0.05),
                size=(circle_size * 0.15, circle_size * 0.1)
            )
            
            self.right_cheek_color = Color(1, 0.6, 0.7, 0)
            self.right_cheek = Ellipse(
                pos=(center_x + circle_size * 0.2, center_y - circle_size * 0.05),
                size=(circle_size * 0.15, circle_size * 0.1)
            )
            
            # Mouth
            self.mouth_color = Color(0, 0, 0, 1)
            self.mouth = Line(points=[], width=3)
            
            # Tear
            self.tear_color = Color(0.3, 0.6, 1, 0)
            self.tear = Ellipse(
                pos=(center_x + circle_size * 0.2, center_y),
                size=(circle_size * 0.08, circle_size * 0.12)
            )
        
        self.update_expression()
    
    def draw_eyelashes(self, center_x, center_y, circle_size, eye_size):
        """Draw cute eyelashes on top of eyes"""
        lash_length = circle_size * 0.08
        
        # Left eye lashes
        left_eye_x = center_x - circle_size * 0.2
        left_eye_y = center_y + circle_size * 0.12 + eye_size/2
        
        Color(0, 0, 0, 1)
        for i in range(3):
            offset_x = (i - 1) * eye_size * 0.3
            lash = Line(
                points=[
                    left_eye_x + offset_x, left_eye_y,
                    left_eye_x + offset_x - lash_length * 0.3, left_eye_y + lash_length
                ],
                width=2
            )
            self.left_lashes.append(lash)
        
        # Right eye lashes
        right_eye_x = center_x + circle_size * 0.2
        right_eye_y = center_y + circle_size * 0.12 + eye_size/2
        
        Color(0, 0, 0, 1)
        for i in range(3):
            offset_x = (i - 1) * eye_size * 0.3
            lash = Line(
                points=[
                    right_eye_x + offset_x, right_eye_y,
                    right_eye_x + offset_x + lash_length * 0.3, right_eye_y + lash_length
                ],
                width=2
            )
            self.right_lashes.append(lash)
    
    def redraw(self, *args):
        self.draw_emoji()
    
    def blink(self, dt):
        if self.is_blinking:
            return
        
        self.is_blinking = True
        
        left_eye_x, left_eye_y = self.left_eye.pos
        right_eye_x, right_eye_y = self.right_eye.pos
        
        close_anim = Animation(
            size=(self.original_eye_size, 2),
            pos=(left_eye_x, left_eye_y + self.original_eye_size/2),
            duration=0.1
        )
        close_anim2 = Animation(
            size=(self.original_eye_size, 2),
            pos=(right_eye_x, right_eye_y + self.original_eye_size/2),
            duration=0.1
        )
        
        open_anim = Animation(
            size=(self.original_eye_size, self.original_eye_size),
            pos=(left_eye_x, left_eye_y),
            duration=0.1
        )
        open_anim2 = Animation(
            size=(self.original_eye_size, self.original_eye_size),
            pos=(right_eye_x, right_eye_y),
            duration=0.1
        )
        
        sequence = close_anim + open_anim
        sequence2 = close_anim2 + open_anim2
        
        def reset_blink(*args):
            self.is_blinking = False
        sequence.bind(on_complete=reset_blink)
        
        sequence.start(self.left_eye)
        sequence2.start(self.right_eye)
    
    def update_expression(self, *args):
        circle_size = self.get_circle_size()
        circle_pos = self.get_circle_pos()
        center_x = circle_pos[0] + circle_size / 2
        center_y = circle_pos[1] + circle_size / 2
        mouth_width = circle_size * 0.4
        
        if self.moisture_level > 60:
            # Happy
            self.draw_happy_mouth(center_x, center_y, mouth_width, circle_size)
            self.draw_happy_eyebrows(center_x, center_y, circle_size)
            self.animate_face_color((1, 0.9, 0.2, 1))
            self.show_cheeks()
            self.hide_tear()
            
        elif self.moisture_level > 30:
            # Worried
            self.draw_worried_mouth(center_x, center_y, mouth_width, circle_size)
            self.draw_worried_eyebrows(center_x, center_y, circle_size)
            self.animate_face_color((1, 0.8, 0.1, 1))
            self.hide_cheeks()
            self.hide_tear()
            
        else:
            # Sad
            self.draw_sad_mouth(center_x, center_y, mouth_width, circle_size)
            self.draw_sad_eyebrows(center_x, center_y, circle_size)
            self.animate_face_color((0.9, 0.7, 0.1, 1))
            self.hide_cheeks()
            self.show_tear(center_x, center_y, circle_size)
    
    def draw_happy_eyebrows(self, center_x, center_y, circle_size):
        """Raised, curved eyebrows"""
        brow_y = center_y + circle_size * 0.25
        brow_width = circle_size * 0.12
        
        # Left brow (curved up)
        left_points = []
        for i in range(10):
            x = center_x - circle_size * 0.25 + (brow_width * i / 9)
            progress = i / 9
            y = brow_y + circle_size * 0.03 * (1 - 4 * (progress - 0.5) ** 2)
            left_points.extend([x, y])
        self.left_brow.points = left_points
        
        # Right brow (curved up)
        right_points = []
        for i in range(10):
            x = center_x + circle_size * 0.13 + (brow_width * i / 9)
            progress = i / 9
            y = brow_y + circle_size * 0.03 * (1 - 4 * (progress - 0.5) ** 2)
            right_points.extend([x, y])
        self.right_brow.points = right_points
    
    def draw_worried_eyebrows(self, center_x, center_y, circle_size):
        """Concerned, asymmetric eyebrows"""
        brow_y = center_y + circle_size * 0.25
        brow_width = circle_size * 0.12
        
        # Left brow (slightly raised)
        left_points = [
            center_x - circle_size * 0.25, brow_y,
            center_x - circle_size * 0.13, brow_y + circle_size * 0.02
        ]
        self.left_brow.points = left_points
        
        # Right brow (slightly lowered inner)
        right_points = [
            center_x + circle_size * 0.13, brow_y + circle_size * 0.02,
            center_x + circle_size * 0.25, brow_y
        ]
        self.right_brow.points = right_points
    
    def draw_sad_eyebrows(self, center_x, center_y, circle_size):
        """Droopy, sad eyebrows"""
        brow_y = center_y + circle_size * 0.25
        
        # Left brow (droops down inward)
        left_points = [
            center_x - circle_size * 0.25, brow_y,
            center_x - circle_size * 0.13, brow_y - circle_size * 0.03
        ]
        self.left_brow.points = left_points
        
        # Right brow (droops down inward)
        right_points = [
            center_x + circle_size * 0.13, brow_y - circle_size * 0.03,
            center_x + circle_size * 0.25, brow_y
        ]
        self.right_brow.points = right_points
    
    def draw_happy_mouth(self, center_x, center_y, width, circle_size):
        mouth_y = center_y - circle_size * 0.15
        num_points = 20
        points = []
        for i in range(num_points):
            x = center_x - width/2 + (width * i / (num_points - 1))
            progress = (i / (num_points - 1)) - 0.5
            y = mouth_y - (width/3) * (1 - 4 * progress * progress)
            points.extend([x, y])
        self.mouth.points = points
    
    def draw_worried_mouth(self, center_x, center_y, width, circle_size):
        mouth_y = center_y - circle_size * 0.2
        points = [
            center_x - width/2, mouth_y,
            center_x + width/2, mouth_y
        ]
        self.mouth.points = points
    
    def draw_sad_mouth(self, center_x, center_y, width, circle_size):
        mouth_y = center_y - circle_size * 0.15
        num_points = 20
        points = []
        for i in range(num_points):
            x = center_x - width/2 + (width * i / (num_points - 1))
            progress = (i / (num_points - 1)) - 0.5
            y = mouth_y + (width/3) * (1 - 4 * progress * progress)
            points.extend([x, y])
        self.mouth.points = points
    
    def animate_face_color(self, target_color):
        anim = Animation(rgba=target_color, duration=0.8)
        anim.start(self.face_color)
    
    def show_cheeks(self):
        """Animate rosy cheeks appearing"""
        anim = Animation(a=0.4, duration=0.5)
        anim.start(self.left_cheek_color)
        anim.start(self.right_cheek_color)
    
    def hide_cheeks(self):
        """Hide cheeks"""
        anim = Animation(a=0, duration=0.3)
        anim.start(self.left_cheek_color)
        anim.start(self.right_cheek_color)
    
    def show_tear(self, center_x, center_y, circle_size):
        self.tear.pos = (center_x + circle_size * 0.2, center_y)
        self.tear.size = (circle_size * 0.08, circle_size * 0.12)
        
        anim = Animation(a=1, duration=0.5)
        anim.start(self.tear_color)
        
        tear_drop = Animation(
            pos=(self.tear.pos[0], self.tear.pos[1] - circle_size * 0.3),
            duration=1.5,
            t='in_quad'
        )
        tear_drop.start(self.tear)
    
    def hide_tear(self):
        anim = Animation(a=0, duration=0.3)
        anim.start(self.tear_color)
    
    def animate_to_level(self, new_level):
        circle_size = self.get_circle_size()
        
        bounce = (
            Animation(size=(circle_size * 1.15, circle_size * 1.15), duration=0.2) +
            Animation(size=(circle_size * 0.95, circle_size * 0.95), duration=0.2) +
            Animation(size=(circle_size, circle_size), duration=0.2)
        )
        bounce.start(self.face)
        
        anim = Animation(moisture_level=new_level, duration=1, t='in_out_quad')
        anim.start(self)


class MoistureIndicator(Widget):
    moisture_level = NumericProperty(0)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        with self.canvas:
            Color(0.9, 0.9, 0.9, 1)
            self.bg_rect = Rectangle(pos=self.pos, size=self.size)
            
            Color(0.2, 0.6, 0.9, 1)
            self.water_rect = Rectangle(pos=self.pos, size=(self.width, 0))
            
            Color(0.7, 0.7, 0.7, 1)
            self.border = Line(rectangle=(self.x, self.y, self.width, self.height), width=2)
        
        self.bind(pos=self.update_graphics, size=self.update_graphics)
        self.bind(moisture_level=self.update_water_level)
    
    def update_graphics(self, *args):
        self.bg_rect.pos = self.pos
        self.bg_rect.size = self.size
        self.border.rectangle = (self.x, self.y, self.width, self.height)
        self.update_water_level()
    
    def update_water_level(self, *args):
        water_height = (self.moisture_level / 100) * self.height
        self.water_rect.pos = self.pos
        self.water_rect.size = (self.width, water_height)
    
    def animate_to_level(self, new_level):
        anim = Animation(moisture_level=new_level, duration=1.5, t='in_out_quad')
        anim.start(self)


class AlertLabel(Label):
    def show_alert(self, message, alert_type="warning"):
        self.text = message
        self.opacity = 0
        
        if alert_type == "critical":
            self.color = (1, 0, 0, 1)
        elif alert_type == "warning":
            self.color = (1, 0.8, 0, 1)
        else:
            self.color = (0.2, 0.7, 0.3, 1)
        
        fade_in = Animation(opacity=1, duration=0.5)
        
        if alert_type == "critical":
            original_x = self.x
            shake = (Animation(x=self.x + 10, duration=0.1) +
                    Animation(x=self.x - 10, duration=0.1) +
                    Animation(x=original_x, duration=0.1))
            shake.repeat = 2
            fade_in.start(self)
            shake.start(self)
        else:
            fade_in.start(self)


class SmartAgricDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation='vertical', **kwargs)
        
        # White background
        with self.canvas.before:
            Color(1, 1, 1, 1)
            self.bg = Rectangle(pos=self.pos, size=self.size)
        self.bind(pos=self.update_bg, size=self.update_bg)
        
        self.plant_name = "Tommy"
        
        # Alert label
        self.alert_label = AlertLabel(
            text="Monitoring " + self.plant_name,
            size_hint=(1, None),
            height=60,
            font_size='20sp',
            bold=True,
            color=(0.2, 0.2, 0.2, 1)
        )
        self.add_widget(self.alert_label)
        
        # Main content
        content = BoxLayout(orientation='horizontal', size_hint=(1, 1), spacing=20, padding=20)
        
        # Left - Moisture bar (narrower)
        moisture_container = BoxLayout(
            orientation='vertical',
            size_hint=(0.15, 1),
            spacing=10
        )
        
        moisture_label = Label(
            text='Moisture',
            size_hint=(1, None),
            height=30,
            font_size='14sp',
            color=(0.3, 0.3, 0.3, 1)
        )
        moisture_container.add_widget(moisture_label)
        
        self.moisture = MoistureIndicator(size_hint=(1, 1))
        moisture_container.add_widget(self.moisture)
        
        self.moisture_text = Label(
            text='50%',
            size_hint=(1, None),
            height=40,
            font_size='20sp',
            bold=True,
            color=(0.2, 0.2, 0.2, 1)
        )
        moisture_container.add_widget(self.moisture_text)
        
        content.add_widget(moisture_container)
        
        # Center - Emoji
        emoji_container = FloatLayout(size_hint=(0.5, 1))
        
        self.emoji = AnimatedEmoji(
            size_hint=(None, None),
            size=(300, 300),
            pos_hint={'center_x': 0.5, 'center_y': 0.5}
        )
        emoji_container.add_widget(self.emoji)
        
        content.add_widget(emoji_container)
        
        # Right - Temperature & Humidity
        sensors_container = BoxLayout(
            orientation='vertical',
            size_hint=(0.35, 1),
            spacing=20,
            padding=[10, 40, 10, 40]
        )
        
        # Temperature card
        temp_box = BoxLayout(orientation='vertical', spacing=5)
        temp_icon = Label(
            text='TEMP',
            font_size='16sp',
            bold=True,
            color=(0.9, 0.3, 0.2, 1),
            size_hint=(1, None),
            height=30
        )
        temp_label = Label(
            text='Temperature',
            font_size='14sp',
            color=(0.4, 0.4, 0.4, 1),
            size_hint=(1, None),
            height=20
        )
        self.temp_value = Label(
            text='24 C',
            font_size='32sp',
            bold=True,
            color=(0.2, 0.2, 0.2, 1),
            size_hint=(1, None),
            height=50
        )
        temp_box.add_widget(temp_icon)
        temp_box.add_widget(temp_label)
        temp_box.add_widget(self.temp_value)
        
        # Humidity card
        humidity_box = BoxLayout(orientation='vertical', spacing=5)
        humidity_icon = Label(
            text='HUMID',
            font_size='16sp',
            bold=True,
            color=(0.2, 0.5, 0.9, 1),
            size_hint=(1, None),
            height=30
        )
        humidity_label = Label(
            text='Humidity',
            font_size='14sp',
            color=(0.4, 0.4, 0.4, 1),
            size_hint=(1, None),
            height=20
        )
        self.humidity_value = Label(
            text='65%',
            font_size='32sp',
            bold=True,
            color=(0.2, 0.2, 0.2, 1),
            size_hint=(1, None),
            height=50
        )
        humidity_box.add_widget(humidity_icon)
        humidity_box.add_widget(humidity_label)
        humidity_box.add_widget(self.humidity_value)
        
        sensors_container.add_widget(temp_box)
        sensors_container.add_widget(humidity_box)
        
        content.add_widget(sensors_container)
        
        self.add_widget(content)
        
        # Footer
        info_bar = BoxLayout(
            orientation='horizontal',
            size_hint=(1, None),
            height=50,
            padding=10
        )
        
        self.status_label = Label(
            text='Status: Monitoring...',
            size_hint=(1, 1),
            font_size='16sp',
            color=(0.3, 0.3, 0.3, 1)
        )
        info_bar.add_widget(self.status_label)
        
        self.add_widget(info_bar)
        
        self.bind(size=self.adjust_emoji_size)
        
        Clock.schedule_interval(self.simulate_sensor_update, 5)
    
    def update_bg(self, *args):
        self.bg.pos = self.pos
        self.bg.size = self.size
    
    def adjust_emoji_size(self, *args):
        available_height = self.height - 110
        available_width = self.width * 0.5 * 0.9
        
        size = min(available_height, available_width)
        size = max(size, 100)
        
        self.emoji.size = (size, size)
    
    def simulate_sensor_update(self, dt):
        import random
        
        moisture = random.randint(20, 95)
        temp = random.randint(18, 30)
        humidity = random.randint(40, 80)
        
        self.moisture.animate_to_level(moisture)
        self.emoji.animate_to_level(moisture)
        
        self.moisture_text.text = str(moisture) + '%'
        self.temp_value.text = str(temp) + ' C'
        self.humidity_value.text = str(humidity) + '%'
        
        if moisture < 30:
            self.alert_label.show_alert(
                self.plant_name + " needs water now!",
                alert_type="critical"
            )
            self.status_label.text = 'Status: CRITICAL - Water immediately!'
            self.status_label.color = (1, 0, 0, 1)
        elif moisture < 60:
            self.alert_label.show_alert(
                self.plant_name + " needs attention",
                alert_type="warning"
            )
            self.status_label.text = 'Status: Warning - Water soon'
            self.status_label.color = (1, 0.7, 0, 1)
        else:
            self.alert_label.show_alert(
                self.plant_name + " is happy!",
                alert_type="info"
            )
            self.status_label.text = 'Status: Healthy - All good!'
            self.status_label.color = (0.2, 0.7, 0.3, 1)


class SmartAgricApp(App):
    def build(self):
        return SmartAgricDashboard()


if __name__ == '__main__':
    SmartAgricApp().run()