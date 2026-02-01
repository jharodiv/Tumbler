from rest_framework.permissions import BasePermission, SAFE_METHODS

class isAdmin(BasePermission):
    def has_permission(self, request, view):
        #For List/create endpoints, only requre authentication
        return request.user and request.user.is_authenticated and request.user.is_staff
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        #Write/delete request only for owner or admin
        return obj.owner == request.user or request.user.is_staff