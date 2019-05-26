from django.urls import path

from . import views

urlpatterns = [
    path('allPosts', views.get_all_posts),
    path('onePost',views.get_one_post),
    path('testRssSource',views.test_rss_source),
]