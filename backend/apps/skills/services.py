from django.contrib.auth import get_user_model
from django.utils.text import slugify
from .models import Skill,UserSkill,SuggestedSkill
from django.utils import timezone

User=get_user_model()

def add_user_skill(user,skill_id,skill_type):
    skill=Skill.objects.get(
        id=skill_id,
        is_active=True,
    )
    user_skill,created=UserSkill.objects.get_or_create(
        user=user,
        skill=skill,
        skill_type=skill_type,
    )  
    return user_skill,created 

def remove_user_skill(user,skill_id,skill_type):
    deleted,_=UserSkill.objects.filter(
        user=user,
        skill_id=skill_id,
        skill_type=skill_type,
    ).delete() 
    return deleted>0

def create_skill_suggestion(
        user,
        name,
        description,
        suggested_for,
): 
    name=name.strip()
    if Skill.objects.filter(
        name__iexact=name,
        is_active=True,
    ).exists():
        raise ValueError(
            'this skill already exists in master list'
        )
    existing=SuggestedSkill.objects.filter(
        suggested_by=user,
        name__iexact=name,
        suggested_for=suggested_for,
        status=SuggestedSkill.status.PENDING,
    ).exists()
    if existing:
        raise ValueError(
            'you already have a pending suggestion for this skill'
        )
    return SuggestedSkill.objects.create(
        suggested_by=user,
        name=name,
        description=description,
        suggested_for=suggested_for,
    )  

def approve_skill_suggestion(suggestion):
    if suggestion.status!=SuggestedSkill.status.PENDING:
        raise ValueError(
            'this skill suggestion has already been reviewed'
        )
    skill=skill.objects.filter(
        name__iexact=suggestion.name
    ).first()
    if not skill:
        base_slug=slugify(suggestion.name)
        slug=base_slug
        counter=1
        while Skill.objects.filter(slug=slug).exists(): 
            slug=f'{base_slug}-{counter}'
            counter+=1
        skill=Skill.objects.create(
            name=suggestion.name,
            slug=slug,
        )
    UserSkill.objects.get_or_create(
        user=suggestion.suggested_by,
        skill=skill,
        skill_type=suggestion.suggested_for,
    ) 
    suggestion.status=SuggestedSkill.Status.APPROVED
    suggestion.approved_skill=skill
    suggestion.reviewed_at=timezone.now()
    suggestion.save(
        update_fields=[
            'status',
            'approved_skill',
            'reviewed_at',
        ]
    )
    return skill