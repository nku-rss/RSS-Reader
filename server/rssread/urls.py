from django.urls import path

from . import views

urlpatterns = [
    path('newPosts', views.get_new_posts),
    path('onePost',views.get_one_post),
    path('testRssSource',views.test_rss_source),
    path('oneRssPosts',views.get_one_rss_posts),
]