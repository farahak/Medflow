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
    patient_name = serializers.SerializerMethodField()
    medecin_name = serializers.SerializerMethodField()
    has_invoice = serializers.SerializerMethodField()
    invoice_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ('id','medecin','patient','patient_name','medecin_name','start_datetime','end_datetime','status','created_at','has_invoice','invoice_id')
        read_only_fields = ('created_at', 'patient_name', 'medecin_name', 'has_invoice', 'invoice_id')

    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
        return ""
    
    def get_medecin_name(self, obj):
        if obj.medecin:
            return f"Dr. {obj.medecin.first_name} {obj.medecin.last_name}"
        return ""
    
    def get_has_invoice(self, obj):
        return hasattr(obj, 'invoice')
    
    def get_invoice_id(self, obj):
        if hasattr(obj, 'invoice'):
            return obj.invoice.id
        return None
