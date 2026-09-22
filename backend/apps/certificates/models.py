from django.db import models
from django.conf import settings
import uuid
# Create your models here.

class Certificate(models.Model):
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='certificates'
    )
    course=models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='certificates'
    )
    enrollment=models.OneToOneField(
        'courses.CourseEnrollment',
        on_delete=models.CASCADE,
        related_name='certificate'
    )
    assessment=models.OneToOneField(
        'courses.Assessment',
        on_delete=models.PROTECT,
        related_name='certificate'
    )
    certificate_id=models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    certificate_number=models.CharField(
        max_length=50,
        unique=True
    )
    score=models.DecimalField(
        max_digits=5,
        decimal_places=2
    )
    is_valid=models.BooleanField(
        default=True
    )
    issued_at=models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return (
            f'{self.user.username}-{self.course.title}'
        )