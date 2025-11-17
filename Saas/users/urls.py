# users/urls.py
from django.urls import path
from .views import LoginView, SignupView, CurrentPatientProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('login/', LoginView.as_view(), name='login'),
    path('me/patient-profile/', CurrentPatientProfileView.as_view(), name='current_patient_profile'),
]
