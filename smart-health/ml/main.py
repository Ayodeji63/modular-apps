from kivy.app import App
from kivy.uix.screenmanager import ScreenManager
from register import RegistrationScreen
from dashboard import MedicareApp
from single import HealthApp


class MedicareApp(App):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self):
        self.sm = ScreenManager()
        # self.sm.add_widget(DashboardScreen(name='dashboard'))
        # self.sm.add_widget(ElectionScreen(name='election'))
        self.sm.add_widget(MedicareApp(name='dashboard'))
        self.sm.add_widget(HealthApp(name="healthApp"))

        return self.sm

if __name__ == '__main__':
    MedicareApp().run()