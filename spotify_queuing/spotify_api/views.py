from django.shortcuts import render
from rest_framework import generics
from .serializers import SessionSerializer
from .models import Session

# Create your views here.
# Endpoint, location on the web_server to go to: /hello

class SessionView(generics.ListAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    