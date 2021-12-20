from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

class RelationshipStatus (models.TextChoices):
    REQUESTED = 'Requested'
    ACCEPTED = 'Accepted'
    CANCELED = 'Canceled'

class Relationship(models.Model):
    class Meta:
        unique_together=['mentee', 'mentor']
    
    mentee = models.ForeignKey(
        Profile,
        related_name='mentee_rel',
        on_delete=models.CASCADE
    )

    mentor = models.ForeignKey(
        Profile,
        related_name= 'mentor_rel',
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=10,
        choices=RelationshipStatus.choices,
        null=True
    )


