from django.urls import path
from .views import index

app_name = 'frontend' # telling django that this file belongs to the front end

urlpatterns = [
   path('', index, name = ''),
   path('join', index),
   path('create', index),
   path('session/<str:password>', index), ## make this the homepage so its just rickradio with a password
]