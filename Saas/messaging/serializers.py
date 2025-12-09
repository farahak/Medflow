from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    recipient_email = serializers.EmailField(source='recipient.email', read_only=True)
    sender_name = serializers.SerializerMethodField()
    recipient_name = serializers.SerializerMethodField()
    
    # We allow creating by passing recipient_id
    recipient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='recipient', write_only=True
    )

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_email', 'sender_name', 
            'recipient', 'recipient_email', 'recipient_name', 'recipient_id',
            'subject', 'body', 'is_read', 'created_at'
        ]
        read_only_fields = ['sender', 'recipient', 'is_read', 'created_at']

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip() or obj.sender.email

    def get_recipient_name(self, obj):
        return f"{obj.recipient.first_name} {obj.recipient.last_name}".strip() or obj.recipient.email

    def create(self, validated_data):
        user = self.context['request'].user
        # recipient is already set by source='recipient' in recipient_id field? 
        # Actually ModelSerializer handles source='recipient' automatically if matched.
        # But we need to ensure sender is current user.
        validated_data['sender'] = user
        return super().create(validated_data)
