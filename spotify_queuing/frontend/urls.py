from django.urls import path
from .views import index

urlpatterns = [
   path('', index),
   path('join', index),
   path('create', index),
   path('session/<str:password>', index), ## make this the homepage so its just rickradio with a password
]