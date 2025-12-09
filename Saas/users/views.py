# users/views.py
from rest_framework import status, generics, permissions
from .permissions import IsReceptionist
from rest_framework.response import Response
from .serializers import UserSerializer, PatientProfileSerializer, MedecinProfileSerializer , CustomTokenObtainPairSerializer, ChangePasswordSerializer
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
            # Get photo from FILES if available
            photo = request.FILES.get('photo', None)
            Medecin.objects.create(
                user=user,
                first_name=user.first_name,   # récupère les infos du User
                last_name=user.last_name,
                specialty=request.data.get('specialty', ''),
                photo=photo
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

# Liste de tous les patients (accessible uniquement par receptionist)
class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsReceptionist]

# Inscription d'un patient par le receptionist
class ReceptionistSignupPatientView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsReceptionist]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Force le rôle à 'patient'
        data = request.data.copy()
        data['role'] = 'patient'
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Créer le profil patient
        Patient.objects.create(user=user)

        # Créer les tokens JWT
        refresh = RefreshToken.for_user(user)
        response_data = {
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(response_data, status=status.HTTP_201_CREATED)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # customized update for non-model serializer usage if customized, 
        # but here we use UpdateAPIView with get_object returning user.
        # But UpdateAPIView expects a model serializer usually or we handle it manually.
        # Actually simplest is to override update or use instance from get_object
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        # Pass instance to update
        self.perform_update(serializer) 
        
        return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.update(self.request.user, serializer.validated_data)
