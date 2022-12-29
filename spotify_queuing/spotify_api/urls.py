from .views import SessionView, CreateSessionView, GetSession, JoinSession, UserInSession, LeaveSession, updateSession
from django.urls import path

urlpatterns = [
    #path('', main),
    path('sessions', SessionView.as_view()), #from maine project file, and call main function from views.
    path('create-session', CreateSessionView.as_view()),
    path('get-session', GetSession.as_view()),
    path('join-session', JoinSession.as_view()),
    path('user-in-session', UserInSession.as_view()),
    path('leave-session', LeaveSession.as_view()),
    path('update-session', updateSession.as_view()),
]
