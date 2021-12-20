from django.db import models


class YearInSchool(models.TextChoices):
    FRESHMAN = 'Freshman'
    SOPHOMORE = 'Sophomore'
    JUNIOR = 'Junior'
    SENIOR = 'Senior'
    GRADUATE = 'Graduate'


class School(models.TextChoices):
    SFU = 'SFU'
    UBC = 'UBC'


class Degree(models.TextChoices):
    ASSOCIATE = 'Associate'
    BACHELOR = 'Bachelor'
    MASTER = 'Master'
    DOCTOR = 'Doctor'


class Department(models.TextChoices):
    APPLIED_SCIENCE = 'AP'
    ARTS_AND_SOCIAL_SCIENCES = 'ASS'
    BUSINESS_ADMINISTRATION = 'BA'
    COMMUNITICATION_ART_AND_TECHNOLOGY = 'CAT'
    EDUCATION = 'ED'
    ENVIRONMENT = 'EN'
    HEALTH_SCIENCE = 'HS'
    SCIENCE = 'SC'


class Major(models.TextChoices):
    COMPUTER_SCIENCE = 'CS'
    ENGINEERING_SCIENCE = 'ES'
    MECHATRONIC_SYSTEMS_ENGINEERING = 'MSE'
