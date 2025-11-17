# users/permissions.py
from rest_framework.permissions import BasePermission

class IsMedecin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'medecin'

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'patient'

class IsReceptionist(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'receptionist'
