from django.urls import path    # , include
from . import views

app_name = 'playlists'

urlpatterns = [
    path('', views.home, name='home'),
    path('authorize/', views._app_Authorization, name='_app_Authorization'),
    path('callback/react/', views.frontend_callback, name='callback'),
    path('callback/songbank/', views.backend_callback, name='callback'),

]
