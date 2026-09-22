from django.db import models
from django.conf import settings

class CourseCategory(models.Model):
    name=models.CharField(
        max_length=100,
        unique=True
    )
    def __str__(self):
        return self.name

class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER='BEGINNER','Beginner'
        INTERMEDIATE='INTERMEDIATE','Intermediate'
        ADVANCED='ADVANCED','Advanced'
    class Status(models.TextChoices):
        DRAFT='DRAFT','Draft'
        PUBLISHED='PUBLISHED','Published'
        ARCHIVED='ARCHIVED','Archived'
    mentor=models.ForeignKey(
        "mentors.Mentor",
        on_delete=models.CASCADE,
        related_name='courses'
    )
    title=models.CharField(
        max_length=200
    )
    slug=models.SlugField(
        unique=True
    )
    description=models.TextField()
    thumbnail=models.ImageField(
        upload_to='course_thumbnails/',
        blank=True,
        null=True
    )
    category = models.ForeignKey(
    CourseCategory,
    on_delete=models.PROTECT,
    related_name='courses'
)
    level=models.CharField(
        max_length=20,
        choices=Level.choices,
        default=Level.BEGINNER
    )
    price=models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    estimated_duration=models.PositiveIntegerField(
        help_text='duration in minutes'
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    is_active=models.BooleanField(
        default=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
    published_at=models.DateTimeField(
        blank=True,
        null=True
    )
    def __str__(self):
        return self.title

class CourseModule(models.Model):
    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='modules'
    )
    title=models.CharField(max_length=200)
    description=models.TextField(blank=True)
    order=models.PositiveIntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        ordering=['order']
        constraints=[models.UniqueConstraint(
            fields=['course','order'],
            name='unique_course_module_order'
        )]
    def __str__(self):
        return f'{self.course.title}-{self.title}'

class CourseLesson(models.Model):
    module=models.ForeignKey(
        CourseModule,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    title=models.CharField(max_length=200)
    content=models.TextField()
    order=models.PositiveIntegerField(default=0)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        ordering=['order']
        constraints=[models.UniqueConstraint(
            fields=['module','order'],
            name='unique_module_lesson_order'
        )]
    def __str__(self):
        return f'{self.module.title}-{self.title}'

class CourseEnrollment(models.Model):
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_enrollments'
    )
    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_at=models.DateTimeField(auto_now_add=True)
    completed_at=models.DateTimeField(null=True,blank=True)
    progress=models.PositiveIntegerField(default=0)
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['user','course'],
                name='unique_user_course_enrollment'
            )
        ]
    def __str__(self):
        return f'{self.user.username}-{self.course.title}'

class LessonProgress(models.Model):
    enrollment=models.ForeignKey(
        CourseEnrollment,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson=models.ForeignKey(
        CourseLesson,
        on_delete=models.CASCADE,
        related_name='progress_records'
    )
    completed=models.BooleanField(default=False)
    completed_at=models.DateTimeField(null=True,blank=True)
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['enrollment','lesson'],
                name='unique_enrollment_lesson'
            )
        ]
    def __str__(self):
        return f'{self.enrollment.user.username}-{self.lesson.title}'       

class Assessment(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS='IN_PROGRESS','In Progress'
        COMPLETED='COMPLETED','Completed'
    attempt_number=models.PositiveIntegerField(
        default=1
    )
    enrollment=models.ForeignKey(
        CourseEnrollment,
        on_delete=models.CASCADE,
        related_name='assessments'
    )
    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='assessments'
    )
    total_questions=models.PositiveIntegerField(default=0)
    score=models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS
    )
    started_at=models.DateTimeField(auto_now_add=True)
    completed_at=models.DateTimeField(null=True,blank=True)
    def __str__(self):
        return f'{self.enrollment.user.username}-{self.course.title}'

class AssessmentQuestion(models.Model): 
    class QuestionType(models.TextChoices):
        MCQ='MCQ','Multiple Choice'
        TRUE_FALSE='TRUE_FALSE','True/False'
        SHORT_ANSWER='SHORT_ANSWER','Short Answer'
        CODE='CODE','Coding'
    assessment=models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    lesson=models.ForeignKey(
        CourseLesson,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assessment_questions'
    )
    question_text=models.TextField()
    question_type=models.CharField(
        max_length=20,
        choices=QuestionType.choices
    )
    options=models.JSONField(
        null=True,
        blank=True
    )
    correct_answer=models.TextField(
        null=True,
        blank=True
    )
    points=models.PositiveIntegerField(default=1)
    order=models.PositiveIntegerField()
    def __str__(self):
        return f'{self.assessment.id}-{self.order}'

class AssessmentAnswer(models.Model):
    question=models.ForeignKey(
        AssessmentQuestion,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assessment_answers'
    )
    answer=models.TextField()
    is_correct=models.BooleanField(
        null=True,
        blank=True
    )         
    score=models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    feedback=models.TextField(blank=True)
    evaluated_at=models.DateTimeField(
        null=True,
        blank=True
    )

class AssessmentResult(models.Model):
    assessment=models.OneToOneField(
        Assessment,
        on_delete=models.CASCADE,
        related_name='result'
    )
    score=models.DecimalField(
        max_digits=5,
        decimal_places=2
    )
    passed=models.BooleanField(
        default=False
    )
    proficiency_level=models.CharField(
        max_length=50
    )
    strengths=models.JSONField(
        default=list
    )
    weaknesses=models.JSONField(
        default=list
    )
    recommendations=models.JSONField(
        default=list
    )
    ai_summary=models.TextField(
        blank=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )