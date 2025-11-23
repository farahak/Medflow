# users/views.py
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer, PatientProfileSerializer, MedecinProfileSerializer , CustomTokenObtainPairSerializer
from .models import Patient, Medecin, User
from django.db import transaction
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# au début du fichier
from rest_framework_simplejwt.tokens import RefreshToken


class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.validated_data.get('role', 'patient')
        user = serializer.save()

        # create profile according to role
        if role == 'patient':
            Patient.objects.create(user=user)
        elif role == 'medecin':
            Medecin.objects.create(
        user=user,
        first_name=user.first_name,   # récupère les infos du User
        last_name=user.last_name,
        specialty=request.data.get('specialty', '')
    )
        # receptionists or admin: no profile created here, or create if needed

        # create JWT tokens to return right after signup
        refresh = RefreshToken.for_user(user)
        data = {
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return Response(data, status=status.HTTP_201_CREATED)
    
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# endpoint pour que l'app patient récupère le profil patient courant
class CurrentPatientProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientProfileSerializer

    def get_object(self):
        # ensures only patients get their profile
        user = self.request.user
        if user.role != 'patient':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Not a patient")
        return user.patient_profile
    

class MedecinListView(generics.ListAPIView):
        queryset = Medecin.objects.all()
        serializer_class = MedecinProfileSerializer
        permission_classes = [permissions.AllowAny]
