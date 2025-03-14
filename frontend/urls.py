from django.urls import path
from .views import index # Review

app_name = 'frontend' # Review

urlpatterns = [
    path('',index, name=''),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index),
]