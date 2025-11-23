from django.apps import AppConfig


class FacturationConfig(AppConfig):
    name = 'facturation'

    def ready(self):
        import facturation.signals
