# facturation/serializers.py
from rest_framework import serializers
from .models import Invoice
from appointment.serializers import AppointmentSerializer

class InvoiceSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)
    patient_name = serializers.SerializerMethodField()
    medecin_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ('total', 'created_at')
    
    def get_patient_name(self, obj):
        return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
    
    def get_medecin_name(self, obj):
        return f"Dr. {obj.medecin.first_name} {obj.medecin.last_name}"
