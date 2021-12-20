from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.HyperlinkedModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.id')

    class Meta:
        model = Profile
        fields = (*[f.name for f in Profile._meta.get_fields()], "id")
