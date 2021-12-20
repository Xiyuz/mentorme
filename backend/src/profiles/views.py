from profiles.models import Profile
from profiles.permissions import IsOwnerOrReadOnly
from profiles.serializers import ProfileSerializer

from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError

from django_filters.rest_framework import DjangoFilterBackend


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Profile.objects.all().order_by('first_name')
    serializer_class = ProfileSerializer

    # add customized authentication IsOwnerOrReadOnly
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]

    # filter fields
    filter_backends = [DjangoFilterBackend]
    filter_fields = (*[f.name for f in Profile._meta.get_fields()], "id")

    def perform_create(self, serializer):
        p = Profile.objects.filter(owner=self.request.user.id)
        if len(p) > 0:
            raise ValidationError("You already have a profile. Please delete it first.")
        else:
            serializer.save(owner=self.request.user)

