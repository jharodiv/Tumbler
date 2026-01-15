from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only = True,
        required = True,
        validators = [validate_password]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create (self,validate_data):
        user = User.objects.create_user(
            username = validate_data['username'],
            email = validate_data['email'],
            password = validate_data['password']
        )

        return user
    

    #Model Serializer -> Auto maps django users field
    #validate_password -> enforces Django's password rules
    #create_user -> hashes the password 