from django.urls import path

from . import views

urlpatterns = [
    path('rssread1', views.index),
]