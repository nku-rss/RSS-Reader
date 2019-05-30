from django.urls import path

from . import views
from . import refactor

urlpatterns = [
    # path('newPosts', views.get_new_posts),
    # path('onePost',views.get_one_post),
    # path('testRssSource',views.test_rss_source),
    # path('oneRssPosts',views.get_one_rss_posts),
    # path('allPosts',views.get_all_posts),
    path('unreadPosts', refactor.get_unread_posts),
    path('onePost',refactor.get_one_post),
    path('testRssSource',refactor.test_rss_source),
    path('oneRssPosts',refactor.get_one_rss_posts),
    path('allPosts',refactor.get_all_posts),
    path('deleteRssSource',refactor.delete_rss_source),
]