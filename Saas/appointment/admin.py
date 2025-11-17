from django.contrib import admin

from appointment.models import Appointment, DoctorAvailability

# Register your models here.
admin.register(DoctorAvailability)
admin.register(Appointment)