from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Todo
from django.contrib.auth.models import User
from .serializers import TodoSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return non-deleted todos for the logged-in user
        return Todo.objects.filter(user=self.request.user, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, pk=None):
        """Soft delete - move to bin instead of deleting"""
        todo = self.get_object()
        if todo.is_deleted:
            return Response(
                {"message": "Task is already in the bin."},
                status=status.HTTP_400_BAD_REQUEST
            )
        todo.soft_delete()
        return Response({"message": "Task moved to bin"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def bin(self, request):
        """Get all deleted tasks for the logged-in user"""
        deleted_tasks = Todo.objects.filter(user=request.user, is_deleted=True)
        serializer = self.get_serializer(deleted_tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        """Restore a deleted task"""
        todo = self.get_object()
        if not todo.is_deleted:
            return Response(
                {"message": "Task is not deleted, cannot restore."},
                status=status.HTTP_400_BAD_REQUEST
            )
        todo.restore()
        return Response({"message": "Task restored successfully"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["delete"])
    def permanent_delete(self, request, pk=None):
        """Permanently delete a task from bin"""
        todo = self.get_object()
        if not todo.is_deleted:
            return Response(
                {"message": "You can only permanently delete tasks from the bin."},
                status=status.HTTP_400_BAD_REQUEST
            )
        todo.delete()
        return Response({"message": "Task permanently deleted"}, status=status.HTTP_204_NO_CONTENT)
