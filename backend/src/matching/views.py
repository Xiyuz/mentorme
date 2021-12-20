from profiles.models import Profile

from rest_framework.renderers import JSONRenderer

from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.http import (Http404, HttpResponseBadRequest)

from matching import utils
from matching.models import Relationship

import json
# Create your views here.
class MentorList(View):
    def get(self, request, profile_id):
        try:
            match_profiles = utils.match_mentors(profile_id)
            profile_display = [self.profile_view(p) for p in match_profiles]
            return JsonResponse({'suggested_profiles': profile_display})
        except Profile.DoesNotExist:
            raise Http404("Profile not exists.")

    def profile_view(self, profile):
        return {
            "id": profile.id,
            "full_name": profile.first_name + ' ' + profile.last_name,
            "email": profile.email
        }

class CreateRelationship(View):
    def get(self, request, mentor_id, profile_id):
        try:
            utils.add_mentee_mentor_relationship(profile_id, mentor_id)
            return JsonResponse({'relationship': 'created'})
        except Profile.DoesNotExist:
            raise Http404("Profile not exists.")

class Notification(View):
    def post(self, request):
        if not request.body:
            return HttpResponseBadRequest("Request body empty.")
        data = None
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.decoder.JSONDecodeError:
            return HttpResponseBadRequest("Failed to parse request body.")
        profile_id = data['id']
        mentors_id = data['mentors_id']
        if not profile_id or not mentors_id:
            return HttpResponseBadRequest("Profile id and mentor id(s) must be provided.")
        try:
            utils.send_notification_to_mentors(profile_id, mentors_id)
            return JsonResponse({'state' : 'email sent success'})
        except Profile.DoesNotExist:
            raise Http404("Profile not exists.")

