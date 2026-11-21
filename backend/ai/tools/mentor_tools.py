from django.db.models import Q
from langchain.tools import tool

from apps.mentors.models import Mentor

@tool
def search_mentors(topic:str,limit:int=5)->list:
    if not topic or not topic.strip():
        return []
    limit=max(1,min(limit,10))
    mentors=(
        Mentor.objects.filter(
            status=Mentor.Status.ACTIVE,
            is_active=True,
            is_verified=True,
            courses__status='PUBLISHED',
            courses__isactive=True
        )
        .filter(
            Q(courses__title__icontains=topic)
            |Q(courses__description__icontains=topic)
            |Q(courses__category__name__icontains=topic)
        )
        .distinct()
        .order_by('-rating','-total_reviews')[:limit]
    )  
    results=[]
    for mentor in mentors:
        results.append({
            'username':mentor.username,
            'full_name':mentor.full_name,
            'rating':float(mentor.rating),
            'total_reviews':mentor.total_reviews,
            'courses':[
                {
                    'title':course.title,
                    'category':course.category.name,
                    'level':course.level,
                    'price':str(course.price),
                }
                for course in mentor.courses.filter(
                    status='PUBLISHED',
                    is_active=True,
                    title__icontains=topic
                )[:3]
            ]
        }) 
    return results

@tool
def search_courses(topic:str,level:str='',limit:int=5)->list:
    if not topic or not topic.strip():
        return []
    limit=max(1,min(limit,10))
    mentors=(
        Mentor.objects.filter(
            status=Mentor.Status.ACTIVE,
            is_active=True,
            is_verified=True,
            courses__status='PUBLISHED',
            courses__is_active=True
        )
        .filter(
            Q(courses__title__icontains=topic)
            |Q(courses__description__icontains=topic)
            |Q(courses__category__name__icontains=topic)
        )
    )
    if level:
        mentors=mentors.filter(
            courses__level=level.upper()
        )
    mentors=mentors.distinct()
    results=[]
    for mentor in mentors:
        courses=mentor.courses.filter(
            status='PUBLISHED',
            is_active=True
        ).filter(
            Q(title__icontains=topic)
            |Q(description__icontains=topic)
            |Q(category__name__icontains=topic)
        )
    if level:
        courses=courses.filter(level=level.upper())
    for course in courses.select_related('category')[:limit]:
        results.append({
            'title':course.title,
            'category':course.category.name,
            'level':course.level,
            'description':course.description[:300],
            'price':str(course.price),
            'mentor':mentor.full_name or mentor.username,
            'mentor_rating':float(mentor.rating)
        })
        if len(results)>=limit:
            return results
    return results