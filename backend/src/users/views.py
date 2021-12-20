from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.validators import ValidationError

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError as rfValidationError

from users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):

        try:
            validate_email(self.request.POST.get("username"))
        except ValidationError:
            raise rfValidationError("Please input a valid email address")

        # if self.check_emtpy_or_none(self.request.POST.get("email")):
        #     raise ValidationError("Your email can not be empty")
        # if self.check_emtpy_or_none(self.request.POST.get("first_name")):
        #     raise ValidationError("Your first name can not be empty")
        # if self.check_emtpy_or_none(self.request.POST.get("last_name")):
        #     raise ValidationError("Your last name can not be empty")

        serializer.save()
    #
    # def check_emtpy_or_none(self, str):
    #     if str is None or str == "":
    #         return True
    #     else:
    #         return False
