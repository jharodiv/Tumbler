from django.contrib.auth.models import User
from django.db import models

class Asset(models.Model):
    name = models.CharField(max_length=255)
    asset_tag = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assets"
    )

    def __str__(self):
        return self.name    
