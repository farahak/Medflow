# facturation/models.py
from django.db import models
from appointment.models import Appointment

class Invoice(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name="invoice")

    patient = models.ForeignKey("users.Patient", on_delete=models.CASCADE)
    medecin = models.ForeignKey("users.Medecin", on_delete=models.CASCADE)

    consultation_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    extra_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total = self.consultation_price + self.extra_fees
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice #{self.id} — {self.appointment}"
