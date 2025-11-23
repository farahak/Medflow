# facturation/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from appointment.models import Appointment
from .models import Invoice

@receiver(post_save, sender=Appointment)
def generate_invoice_when_done(sender, instance, created, **kwargs):
    # Si le rendez-vous EXISTE déjà et passe en DONE
    if not created and instance.status == "done":
        # Empêcher la génération multiple
        if not hasattr(instance, "invoice"):
            Invoice.objects.create(
                appointment=instance,
                patient=instance.patient,
                medecin=instance.medecin,
                consultation_price=instance.medecin.consultation_price,  # si tu l’ajoutes dans Medecin
                extra_fees=0,
            )
