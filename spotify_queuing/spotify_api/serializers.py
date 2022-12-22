from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('id', 'password', 'can_pause', 
                  'votes_to_skip', 'volume', 'requested_at')
        
        