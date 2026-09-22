from django.contrib.auth.models import BaseUserManager

class MentorManager(BaseUserManager):
    def create_mentor(self,email,username,password=None,**extra_fields):
        if not email:
            raise ValueError('email is required')
        if not username:
            raise ValueError('username is required')
        email=self.normalize_email(email)
        mentor=self.model(
            email=email,
            username=username,
            **extra_fields
        )
        mentor.set_password(password)
        mentor.save(using=self._db)
        return mentor