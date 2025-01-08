from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer


class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            # serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
