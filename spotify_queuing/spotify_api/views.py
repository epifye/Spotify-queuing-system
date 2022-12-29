from django.shortcuts import render
from rest_framework import generics, status
from .serializers import SessionSerializer, CreateSessionSerializer, UpdateSessionSerializer
from .models import Session
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

## TODO ADD in the volume aspect for the session page and give control to the users
# Create your views here.
# Endpoint, location on the web_server to go to: /hello

class SessionView(generics.ListAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    
    
class GetSession(APIView):
    serializer_class = SessionSerializer
    lookup_url_kwarg = 'password'

    def get(self, request, format = None):
        password = request.GET.get(self.lookup_url_kwarg)
        if password != None:
            session = Session.objects.filter(password=password)
            if len(session) > 0:
                data = SessionSerializer(session[0]).data
                data['is_host'] = self.request.session.session_key == session[0].host ## session is the concurent logged instate
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Session Not Found': 'Invalid Session Password.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Password parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class JoinSession(APIView):
    lookup_url_kwarg = 'password'
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        password = request.data.get(self.lookup_url_kwarg) ## will return None if no code data was given
        if password != None:
            session_result = Session.objects.filter(password = password)
            if len(session_result) > 0:
                session = session_result[0]
                self.request.session['session_password'] = password
                return Response({'message' : 'Session Joined!'}, status=status.HTTP_200_OK)
            
            return Response({'Bad Request' : 'Invalid Session Password'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Bad Request' : 'Invalid post data'}, status=status.HTTP_400_BAD_REQUEST)
        
            

class CreateSessionView(APIView):
    serializer_class = CreateSessionSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            can_pause = serializer.data.get('can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Session.objects.filter(host = host)
            if queryset.exists():
                session = queryset[0]
                session.can_pause = can_pause
                session.votes_to_skip = votes_to_skip
                session.save(update_fields=['can_pause', 'votes_to_skip'])
                self.request.session['session_password'] = session.password
                return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
            else:
                session = Session(host = host, can_pause = can_pause, votes_to_skip = votes_to_skip) 
                session.save()
                self.request.session['session_password'] = session.password
                return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST) 

class UserInSession(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'password': self.request.session.get('session_password')
        }
        return JsonResponse(data, status = status.HTTP_200_OK)

class LeaveSession(APIView):
    def post(self, request, format = None): #post means changing info in the database
        if 'session_password' in self.request.session:
            self.request.session.pop('session_password') # remove code from session
            host_id = self.request.session.session_key
            session_results = Session.objects.filter(host = host_id)
            if len(session_results) > 0 :
                session = session_results[0]
                session.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
    

class updateSession(APIView):
    serializer_class = UpdateSessionSerializer
    
    def patch(self, request, format= None): ## patch another name for update
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            can_pause = serializer.data.get('can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            password = serializer.data.get('password')
            
            queryset = Session.objects.filter(password=password)
            if not queryset.exists():
                return Response({'msg':'Session not found'}, status = status.HTTP_404_NOT_FOUND)
            session = queryset[0]
            user_id = self.request.session.session_key
            if session.host != user_id:
                return Response({'msg':'You are not the host of the session' }, status = status.HTTP_403_FORBIDDEN)
            
            session.can_pause = can_pause
            session.votes_to_skip = votes_to_skip
            session.save(update_fields=['can_pause', 'votes_to_skip'])
            return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
            
        return Response({'Bad Request' :'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)