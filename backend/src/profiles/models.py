from django.db import models
from django.contrib.auth.models import User
from rest_framework import serializers
from profiles.enums import YearInSchool, School, Degree, Department, Major


class Profile(models.Model):

    first_name = models.CharField(
        max_length=50
    )

    last_name = models.CharField(
        max_length=50
    )

    email = models.EmailField()

    school = models.CharField(
        max_length=50,
        choices=School.choices,
        default=School.SFU
    )

    degree = models.CharField(
        max_length=40,
        choices=Degree.choices,
        default=Degree.BACHELOR
    )

    year_in_school = models.CharField(
        max_length=10,
        choices=YearInSchool.choices,
        default=YearInSchool.FRESHMAN
    )

    department = models.CharField(
        max_length=10,
        choices=Department.choices,
        default=Department.APPLIED_SCIENCE,
    )

    major = models.CharField(
        max_length=10,
        choices=Major.choices,
        default=Major.COMPUTER_SCIENCE,
    )

    about_me = models.TextField(
        max_length=200,
        default="",
    )

    available_date = models.TextField(
        blank=True, 
        max_length=100,
        default="",
    )

    # owner = models.ForeignKey(
    #     User,
    #     related_name='profiles',
    #     on_delete=models.CASCADE,
    #     null=True,
    #     unique=True
    # )

    owner = models.OneToOneField(
        User,
        related_name='users',
        on_delete=models.CASCADE,
        null=True
    )


