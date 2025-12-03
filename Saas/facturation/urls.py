# facturation/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import InvoiceViewSet, generate_invoice

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', generate_invoice, name='generate_invoice'),
]
