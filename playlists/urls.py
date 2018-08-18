from django.urls import path    # , include
from . import views

app_name = 'playlists'

urlpatterns = [
    path('', views.home, name='home'),
    path('react/', views.react, name='react'),
    path('react_auth/', views.react_auth, name='react_auth'),
    path('react/callback/', views.react_callback, name='react_callback'),
    path('songbank_auth/', views.songbank_auth, name='songbank_auth'),
    path('songbank/callback/', views.songbank_callback, name='songbank_callback'),
]
