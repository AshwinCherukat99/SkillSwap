from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import UserBadge,Badge,BadgeRule
from apps.sessions_mgmt.models import SkillExchangeSession,CourseSession
from apps.courses.models import CourseEnrollment,AssessmentResult
from apps.accounts.models import Friendship
from apps.posts.models import Post,PostComment,PostLike

class BadgeService:
    @classmethod
    @transaction.atomic
    def evaluate_user(cls,user):
        user=type(user).objects.select_for_update().get(pk=user.pk)
        cls.update_streak(user)
        badges=(Badge.objects.filter(is_active=True).prefetch_related('rules'))
        newly_earned=[]
        for badge in badges:
            if UserBadge.objects.filter(
                user=user,
                badge=badge
            ).exists():
                continue
            rules=list(badge.rules.all())
            if not rules:
                continue
            if all(cls.check_rule(user,rule) for rule in rules):
                user_badge=UserBadge.objects.create(
                    user=user,
                    badge=badge
                )
                if badge.xp_reward>0:
                    user.xp+=badge.xp_reward
                    user.save(
                        update_fields=['xp']
                    )
                newly_earned.append(user_badge)
        return newly_earned
    @classmethod
    def check_rule(cls,user,rule):
        if rule.rule_type==BadgeRule.RuleType.SESSIONS_COMPLETED:
            return (cls.sessions_completed(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.COURSES_COMPLETED:
            return (cls.courses_completed(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.COURSES_PASSED:
            return (cls.courses_passed(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.FRIENDS_ADDED:
            return (cls.friends_added(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.POSTS_CREATED:
            return (cls.posts_created(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.POSTS_LIKED:
            return (cls.posts_liked(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.COMMENTS_CREATED:
            return (cls.comments_created(user)>=rule.target_value)
        if rule.rule_type==BadgeRule.RuleType.STREAK_DAYS:
            return (cls.streak_days(user)>=rule.target_value)
        return False
    @classmethod
    def sessions_completed(cls,user):
        skill_exchange_count=(
            SkillExchangeSession.objects.filter(status=SkillExchangeSession.Status.COMPLETED).filter(requester=user).count()
        )
        skill_exchange_count+=(
            SkillExchangeSession.objects.filter(status=SkillExchangeSession.Status.COMPLETED).filter(recipient=user).count()
        )
        course_session_count=(
            CourseSession.objects.filter(enrollment__user=user,status=CourseSession.Status.COMPLETED).count()
        )
        return (skill_exchange_count+course_session_count)
    @classmethod
    def courses_completed(cls,user):
        return (
            CourseEnrollment.objects.filter(
                user=user,
                completed_at__isnull=False
            ).count()
        )
    @classmethod
    def courses_passed(cls,user):
        return (
            AssessmentResult.objects.filter(
                assessment__enrollment__user=user,
                passed=True,
            ).count()
        )
    @classmethod
    def friends_added(cls,user):
        return (
            Friendship.objects.filter(status=Friendship.Status.ACCEPTED).filter(sender=user).count()+
            Friendship.objects.filter(status=Friendship.Status.ACCEPTED).filter(receiver=user).count()
        )
    @classmethod
    def posts_created(cls,user):
        return (
            Post.objects.filter(user_author=user).count()
        )
    @classmethod
    def posts_liked(cls,user):
        return (
            PostLike.objects.filter(user=user).count()
        )
    @classmethod
    def comments_created(cls,user):
        return (
            PostComment.objects.filter(user=user).count()
        )
    @classmethod
    def get_session_dates(cls,user):
        skill_dates=(
            SkillExchangeSession.objects.filter(
                status=SkillExchangeSession.Status.COMPLETED
            ).filter(requester=user).values_list('scheduled_start',flat=True)
        )
        recipient_dates=(
            SkillExchangeSession.objects.filter(
                status=SkillExchangeSession.Status.COMPLETED
            ).filter(recipient=user).values_list('scheduled_start',flat=True)
        )
        course_dates=(
            CourseSession.objects.filter(
                status=CourseSession.Status.COMPLETED
            ).filter(enrollment__user=user).values_list('scheduled_start',flat=True)
        )
        dates=set()
        for session_date in (list(skill_dates)+list(recipient_dates)+list(course_dates)):
            local_date=timezone.localtime(session_date).date()
            dates.add(local_date)
        return dates
    @classmethod
    def current_streak(cls,user):
        dates=cls.get_session_dates(user)
        if not dates:
            return 0
        today=timezone.localdate()
        if max(dates)<today-timedelta(days=1):
            return 0
        streak=0
        current_date=max(dates)
        while current_date in dates:
            streak+=1
            current_date=current_date-timedelta(days=1)
        return streak
    @classmethod
    def update_streak(cls,user):
        dates=cls.get_session_dates(user)
        if not dates:
            user.current_streak=0
            user.last_session_date=None
            user.save(
                update_fields=[
                    'current_streak',
                    'last_session_date',
                ]
            )
            return 0
        today=timezone.localdate()
        latest_date=max(dates)
        if latest_date<today-timedelta(days=1):
            streak=0
        else:
            streak=0
            current_date=latest_date
            while current_date in dates:
                streak+=1
                current_date-=timedelta(days=1)
        user.current_streak=streak
        user.last_session_date=latest_date
        user.save(
            update_fields=[
                'current_streak',
                'last_session_date',
            ]
        )
        return streak