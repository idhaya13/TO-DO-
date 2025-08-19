from rest_framework import serializers
from .models import Todo
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'description', 'completed',
            'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True},
            'completed': {'required': False},
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'email': {'required': False},
        }

    def validate(self, attrs):
        # Run Django’s built-in password validators
        try:
            validate_password(attrs['password'])
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'current_password', 'new_password']
        extra_kwargs = {
            'email': {'read_only': True}
        }
    
    def validate(self, attrs):
        user = self.instance
        current_password = attrs.get('current_password')
        new_password = attrs.get('new_password')
        
        # If user wants to change password, validate current password
        if new_password:
            if not current_password:
                raise serializers.ValidationError({
                    'current_password': 'Current password is required to set a new password.'
                })
            
            if not user.check_password(current_password):
                raise serializers.ValidationError({
                    'current_password': 'Current password is incorrect.'
                })
            
            # Validate new password
            try:
                validate_password(new_password, user=user)
            except exceptions.ValidationError as e:
                raise serializers.ValidationError({'new_password': list(e.messages)})
        
        return attrs
    
    def update(self, instance, validated_data):
        # Remove password fields from validated_data before updating other fields
        validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update password if provided
        if new_password:
            instance.set_password(new_password)
        
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
