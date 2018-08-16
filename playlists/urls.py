from django.urls import path    # , include
from . import views

app_name = 'playlists'

urlpatterns = [
    path('', views.home, name='home'),
    path('authorize/', views._app_Authorization, name='_app_Authorization'),
    path('callback/q/', views.callback, name='callback'),
]
