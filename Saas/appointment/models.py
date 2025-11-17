# appointments/models.py
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class DoctorAvailability(models.Model):
    medecin = models.ForeignKey('users.Medecin', on_delete=models.CASCADE, related_name='availabilities')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    # optionally: recurring rules, slots count etc.

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return f"{self.medecin} {self.start_datetime} -> {self.end_datetime}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('done', 'Done'),
    ]
    medecin = models.ForeignKey('users.Medecin', on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey('users.Patient', on_delete=models.CASCADE, related_name='appointments')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return f"{self.patient} with {self.medecin} at {self.scheduled_time}"
