from rest_framework import viewsets, permissions, generics
from .models import Todo
from django.contrib.auth.models import User
from .serializers import TodoSerializer, RegisterSerializer



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]  # only logged in users

    def get_queryset(self):
        # Only return todos for the logged-in user
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user automatically when creating a todo
        serializer.save(user=self.request.user)


