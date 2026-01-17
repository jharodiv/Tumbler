from rest_framework.routers import DefaultRouter
from .views import AssetViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'assets', AssetViewSet, basename='assets')

urlpatterns = router.urls
