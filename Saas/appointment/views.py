from django.shortcuts import render

# Create your views here.
# appointments/views.py
from rest_framework import viewsets, permissions , generics

from users import serializers
from .models import DoctorAvailability, Appointment
from .serializers import DoctorAvailabilitySerializer, AppointmentSerializer
from users.permissions import IsMedecin, IsPatient, IsReceptionist

class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer
    # medecins can create/modify their availabilities; receptionists/admins maybe too
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsMedecin()]
        return [permissions.AllowAny()]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]  # patients create appointment
        if self.action in ['update','partial_update','destroy']:
            # only receptionist or doctor for changing status/time
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]
class AddAvailabilityView(generics.CreateAPIView):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "medecin":
            raise PermissionError("Only medecins can add availability")
        serializer.save(medecin=user.medecin_profile)


class AddAppointmentView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "patient":
            raise PermissionError("Only patients can book appointments")

        # vérifie que la disponibilité existe pour ce médecin
        medecin = serializer.validated_data.get("medecin")
        start = serializer.validated_data.get("start_datetime")
        end = serializer.validated_data.get("end_datetime")

        if not DoctorAvailability.objects.filter(
            medecin=medecin,
            start_datetime__lte=start,
            end_datetime__gte=end
        ).exists():
            raise serializers.ValidationError("Selected time is not available for this doctor")

        serializer.save(patient=user.patient_profile)