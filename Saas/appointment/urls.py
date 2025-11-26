# appointments/urls.py
from rest_framework.routers import DefaultRouter
from .views import AddAppointmentView, AddAvailabilityView, DoctorAvailabilityViewSet, AppointmentViewSet, get_doctor_availabilities, get_my_appointments
from django.urls import path, include

router = DefaultRouter()
router.register(r'availabilities', DoctorAvailabilityViewSet, basename='availabilities')
router.register(r'appointments', AppointmentViewSet, basename='appointments')


urlpatterns = [
    path('', include(router.urls)),
    path("availability/add/", AddAvailabilityView.as_view(), name="add_availability"),
    path("appointment/add/", AddAppointmentView.as_view(), name="add_appointment"),
    path("doctor/<int:doctor_id>/availabilities/", get_doctor_availabilities),
     path("my-appointments/", get_my_appointments, name="my_appointments"),
   
]
