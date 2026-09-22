from .models import UserBadge

def award_badge(user,badge):
    user_badge,created=UserBadge.objects.get_or_create(
        user=user,
        badge=badge
    )
    return user_badge,created