from rest_framework import serializers
from .models import Asset

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["id", "name", "asset_tag", "status", "created_at", "owner"]
        read_only_fields = ["id", "created_at", "owner"] 