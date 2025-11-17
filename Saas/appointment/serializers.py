# appointments/serializers.py
from rest_framework import serializers
from .models import DoctorAvailability, Appointment
from users.serializers import MedecinProfileSerializer, PatientProfileSerializer
from users.models import Medecin, Patient

class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    medecin = serializers.PrimaryKeyRelatedField(read_only=True)  # <--- read-only
    class Meta:
        model = DoctorAvailability
        fields = ('id','medecin','start_datetime','end_datetime')

class AppointmentSerializer(serializers.ModelSerializer):
   patient = serializers.PrimaryKeyRelatedField(read_only=True)  # sera assigné automatiquement
   class Meta:
        model = Appointment
        fields = ('id','medecin','patient','scheduled_time','duration_minutes','reason','status','created_at')
        read_only_fields = ('created_at',)
