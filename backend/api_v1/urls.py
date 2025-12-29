from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('profile/', views.profile, name = 'profile'),
    path('register/', views.RegisterView.as_view(), name = 'register'),
]