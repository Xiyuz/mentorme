# Generated by Django 3.0.3 on 2020-02-09 01:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_auto_20200208_2256'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='degree',
            field=models.CharField(choices=[('Associate', 'Associate'), ('Bachelor', 'Bachelor'), ('Master', 'Master'), ('Doctor', 'Doctor')], default='Bachelor', max_length=40),
        ),
        migrations.AlterField(
            model_name='profile',
            name='department',
            field=models.CharField(choices=[('AP', 'Applied Science'), ('ASS', 'Arts And Social Sciences'), ('BA', 'Business Administration'), ('CAT', 'Communitication Art And Technology'), ('ED', 'Education'), ('EN', 'Environment'), ('HS', 'Health Science'), ('SC', 'Science')], default='AP', max_length=10),
        ),
        migrations.AlterField(
            model_name='profile',
            name='major',
            field=models.CharField(choices=[('CS', 'Computer Science'), ('ES', 'Engineering Science'), ('MSE', 'Mechatronic Systems Engineering')], default='CS', max_length=10),
        ),
        migrations.DeleteModel(
            name='Department',
        ),
        migrations.DeleteModel(
            name='Major',
        ),
    ]
