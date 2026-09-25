from rest_framework.permissions import BasePermission
from .models import User

class IsUser(BasePermission):
    message='you must be a user to access this endpoint'

class IsMentor(BasePermission): 
    message='you must be a mentor to access this endpoint'

class IsAdmin(BasePermission):
    message='you must be an admin to access this endpoint'
    def has_permission(self,request,view):
        return (
            request.user and request.user.is_authenticated and request.user.role==User.Role.ADMIN
        )

class IsUserOrMentor(BasePermission):
    message='you must be a user or mentor to access this endpoint'

