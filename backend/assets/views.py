from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Asset
from .serializers import AssetSerializer

class AssetViewSet(viewsets.ModelViewSet):
    #queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return Asset.objects.filter(owner = self.request.user)
    

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)