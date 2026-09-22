from django.contrib import admin
from .models import CourseCategory, Course
# Register your models here.
@admin.register(CourseCategory)
class CourseCatgeoryAdmin(admin.ModelAdmin):
    list_display=('id','name',)
    search_fields=('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display=(
        'id',
        'title',
        'mentor',
        'category',
        'level',
        'price',
        'status',
        'is_active',
    )
    list_filter=(
        'category',
        'level',
        'is_active',
        'status',
    )
    search_fields=(
        'title',
        'description',
        'mentor__username',
        'mentor__email',
    )
    populated_fields={
        'slug':('title',)
    }