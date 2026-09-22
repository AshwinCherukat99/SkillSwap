from rest_framework.permissions import BasePermission

class IsUser(BasePermission):
    message='you must be a user to access this endpoint'

class IsMentor(BasePermission): 
    message='you must be a mentor to access this endpoint'

class IsAdmin(BasePermission):
    message='you must be an admin to access this endpoint'

class IsUserOrMentor(BasePermission):
    message='you must be a user or mentor to access this endpoint'

