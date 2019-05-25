from django.urls import path

from . import views

urlpatterns = [
    path('rssread1', views.index),
    path('onePost',views.get_one_post),
]