from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import RegisterSerializer 
from rest_framework import status


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response({
        "message": "Hello this is your profile",
        "user": request.user.username
    })

class RegisterView(APIView):
    def post (self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"meessage": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)