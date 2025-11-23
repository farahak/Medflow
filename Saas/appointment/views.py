from django.shortcuts import render
from datetime import timedelta
from rest_framework.exceptions import ValidationError
# Create your views here.
# appointments/views.py
from rest_framework import viewsets, permissions , generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from users import serializers
from users.models import Medecin
from .models import DoctorAvailability, Appointment
from .serializers import DoctorAvailabilitySerializer, AppointmentSerializer
from users.permissions import IsMedecin, IsPatient, IsReceptionist
from rest_framework.exceptions import ValidationError
from django.utils import timezone

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
            raise ValidationError({"detail": "Only medecins can add availability"})

        # Vérification simple : start < end
        start = self.request.data.get("start_datetime")
        end = self.request.data.get("end_datetime")

        if not start or not end:
            raise ValidationError({"detail": "Start and End datetime are required."})

        try:
            serializer.save(medecin=user.medecin_profile)
        except Exception as e:
            print("🔥 ERROR ADD AVAILABILITY:", str(e))
            raise ValidationError({"detail": str(e)})


class AddAppointmentView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "patient":
            raise ValidationError("Only patients can book appointments")

        medecin = serializer.validated_data.get("medecin")
        start = serializer.validated_data.get("start_datetime")
        end = serializer.validated_data.get("end_datetime")

        # 1) Vérifier que l'heure demandée est comprise dans une disponibilité
        availability = DoctorAvailability.objects.filter(
            medecin=medecin,
            start_datetime__lte=start,
            end_datetime__gte=end
        ).first()

        if not availability:
            raise ValidationError("Selected time is not inside doctor's availability range")

        # 2) Calculer la durée d’un slot (30 min + 15 min pause)
        SLOT_DURATION = timedelta(minutes=45)

        # 3) Calculer tous les slots possibles dans la disponibilité
        slots = []
        current = availability.start_datetime
        while current + timedelta(minutes=30) <= availability.end_datetime:
            slot_start = current
            slot_end = current + timedelta(minutes=30)  # consultation = 30 min

            slots.append((slot_start, slot_end))
            current += SLOT_DURATION  # +15 min break automatically included

        # 4) Vérifier si le slot demandé existe
        requested_slot = (start, end)
        if requested_slot not in slots:
            raise ValidationError("Requested time does not match any available 30-min slot")

        # 5) Vérifier si le slot est déjà pris
        if Appointment.objects.filter(
            medecin=medecin,
            start_datetime=start,
            end_datetime=end
        ).exists():
            raise ValidationError("This slot is already booked")

        # 6) Tout est OK, on enregistre
        serializer.save(patient=user.patient_profile)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_doctor_availabilities(request, doctor_id):
    availabilities = DoctorAvailability.objects.filter(medecin_id=doctor_id)
    serializer = DoctorAvailabilitySerializer(availabilities, many=True)
    return Response(serializer.data)