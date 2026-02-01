from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Asset
from .serializers import AssetSerializer
from .permissions import isAdmin

class AssetViewSet(viewsets.ModelViewSet):
    #queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [isAdmin]


    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Asset.objects.all()
        return Asset.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [isAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated] 
        return [p() for p in permission_classes]