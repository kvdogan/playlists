from django.urls import include, path
from . import views

app_name = 'reactApp'

urlpatterns = [
    path('', views.home, name='home'),
    path('view1/', views.view1, name='view1'),
    path('view2/', views.view2, name='view2'),
]
