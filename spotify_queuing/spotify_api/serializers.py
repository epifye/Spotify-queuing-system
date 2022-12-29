from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('id', 'host', 'password', 'can_pause', 
                  'votes_to_skip', 'volume', 'requested_at')


class CreateSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('can_pause', 'votes_to_skip')

class UpdateSessionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(validators=[])
    class Meta:
        model = Session
        fields = ('can_pause', 'votes_to_skip','password')
        
