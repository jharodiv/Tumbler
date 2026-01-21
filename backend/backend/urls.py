from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    #JWT
    path('api/token/', TokenObtainPairView.as_view(), name ='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),

    #users
    path('api/user/', include('user.urls')),
    #assets
    path('api/', include('assets.urls')),

    #python manage.py runserver 0.0.0.0:8000
]
