from profiles.models import Profile
from django.core.mail import send_mass_mail
from django.core.exceptions import ObjectDoesNotExist
from matching.models import Relationship

def match_mentors(profile_id):
    profile = Profile.objects.get(id=profile_id)
    school_name = profile.school
    match_profile_by_school = Profile.objects.filter(school = school_name).exclude(id=profile_id)
    all_match_profile = []
    if len(profile.available_date) > 0: 
        profile_available_date = profile.available_date.split(",")
        for p in match_profile_by_school:
            p_available_date = p.available_date.split(",")
            if len(set(p_available_date) & set(profile_available_date)) > 0:
                all_match_profile.append(p)
    return all_match_profile

def add_mentee_mentor_relationship (profile_id, mentor_id):
    mentee_profile = Profile.objects.get(id=profile_id)
    mentor_profile = Profile.objects.get(id=mentor_id)
    mentorship_rel = Relationship(mentee=mentee_profile, mentor=mentor_profile)
    mentorship_rel.save()

def send_notification_to_mentors(profile_id, mentors_id_list):
    profile = Profile.objects.get(id=profile_id)
    first_name = profile.first_name
    last_name = profile.last_name
    mentor_profiles = Profile.objects.filter(id__in = mentors_id_list)
    email_list = [p.email for p in mentor_profiles]
    subject = 'MentorMe Notification: ' +  first_name + ' ' + last_name + ' would like to contact you'
    body = 'You have been matched with a mentee.'
    from_email = 'DO-NOT-REPLY@mentorme.com'
    messages = [(subject, body, from_email, [email]) for email in email_list]
    send_mass_mail(tuple(messages))
