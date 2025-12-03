# facturation/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
from .models import Invoice
from .serializers import InvoiceSerializer
from appointment.models import Appointment

# PDF imports
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from io import BytesIO
from datetime import datetime

class InvoiceViewSet(ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Receptionists can see all invoices
        if user.role == 'receptionist':
            return Invoice.objects.all().order_by('-created_at')
        # Medecins can see their own invoices
        elif user.role == 'medecin':
            return Invoice.objects.filter(medecin=user.medecin_profile).order_by('-created_at')
        # Patients can see their own invoices
        elif user.role == 'patient':
            return Invoice.objects.filter(patient=user.patient_profile).order_by('-created_at')
        return Invoice.objects.none()
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """Download invoice as PDF"""
        invoice = self.get_object()
        
        # Create PDF in memory
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#000000'),
            alignment=TA_CENTER,
            spaceAfter=30,
        )
        elements.append(Paragraph('FACTURE', title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Invoice info
        info_style = styles['Normal']
        elements.append(Paragraph(f'<b>Facture N°:</b> {invoice.id}', info_style))
        elements.append(Paragraph(f'<b>Date:</b> {invoice.created_at.strftime("%d/%m/%Y")}', info_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Patient and Doctor info
        elements.append(Paragraph(f'<b>Patient:</b> {invoice.patient.user.first_name} {invoice.patient.user.last_name}', info_style))
        elements.append(Paragraph(f'<b>Email:</b> {invoice.patient.user.email}', info_style))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(f'<b>Médecin:</b> Dr. {invoice.medecin.first_name} {invoice.medecin.last_name}', info_style))
        elements.append(Paragraph(f'<b>Spécialité:</b> {invoice.medecin.specialty or "N/A"}', info_style))
        elements.append(Spacer(1, 0.4*inch))
        
        # Table with pricing
        data = [
            ['Description', 'Montant'],
            ['Consultation médicale', f'{float(invoice.consultation_price):.2f} €'],
            ['Frais supplémentaires', f'{float(invoice.extra_fees):.2f} €'],
            ['', ''],
            ['TOTAL', f'{float(invoice.total):.2f} €'],
        ]
        
        table = Table(data, colWidths=[4*inch, 2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
            ('GRID', (0, 0), (-1, -2), 1, colors.black),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 14),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.black),
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.5*inch))
        
        # Footer
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER,
        )
        elements.append(Paragraph('Merci pour votre visite', footer_style))
        elements.append(Paragraph('MedFlow - Gestion Clinique Médicale', footer_style))
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF from buffer
        pdf = buffer.getvalue()
        buffer.close()
        
        # Return as downloadable response
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="facture_{invoice.id}.pdf"'
        return response


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_invoice(request):
    """Generate invoice from appointment - accessible only by receptionist"""
    user = request.user
    
    if user.role != "receptionist":
        raise ValidationError({"detail": "Only receptionists can generate invoices."})
    
    appointment_id = request.data.get('appointment_id')
    consultation_price = request.data.get('consultation_price')
    extra_fees = request.data.get('extra_fees', 0.00)
    
    if not appointment_id:
        return Response({"detail": "appointment_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"detail": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if appointment is done
    if appointment.status != 'done':
        return Response(
            {"detail": "Invoice can only be generated for completed appointments"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if invoice already exists for this appointment
    if hasattr(appointment, 'invoice'):
        return Response(
            {"detail": "Invoice already exists for this appointment", "invoice_id": appointment.invoice.id}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # If consultation_price not provided, use doctor's default price
    if not consultation_price:
        consultation_price = appointment.medecin.consultation_price
    
    # Create the invoice
    invoice = Invoice.objects.create(
        appointment=appointment,
        patient=appointment.patient,
        medecin=appointment.medecin,
        consultation_price=consultation_price,
        extra_fees=extra_fees
    )
    
    serializer = InvoiceSerializer(invoice)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
