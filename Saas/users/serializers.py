# users/serializers.py
from rest_framework import serializers
from .models import User, Medecin, Patient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
UserModel = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=True)

    class Meta:
        model = UserModel
        fields = ('id','email','first_name','last_name','password','role')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = UserModel.objects.create_user(password=password, **validated_data)
        return user

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Patient
        fields = ('id','user','phone','date_of_birth')

class MedecinProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Medecin
        fields = ('id', 'user' ,'first_name', 'last_name', 'specialty', 'phone')
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            "id": self.user.id,
            "email": self.user.email,
            "role": self.user.role
        }
        return data