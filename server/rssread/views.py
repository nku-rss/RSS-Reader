from django.http import HttpResponse
from django.http import JsonResponse
import feedparser
import json
from django.views.decorators.http import require_http_methods
# Create your views here.

@require_http_methods(["GET"])
def index(request):
    url = 'https://gujiaxi.com/feed.xml'
    feedtext = feedparser.parse(url)
    entries = feedtext['entries'][0]
    response = JsonResponse(entries)
    return response