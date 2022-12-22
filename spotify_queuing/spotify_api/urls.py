from .views import SessionView
from django.urls import path

urlpatterns = [
    #path('', main),
    path('home', SessionView.as_view()) #from maine project file, and call main function from views.
]
