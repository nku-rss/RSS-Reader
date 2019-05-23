from django.http import HttpResponse
from django.http import JsonResponse
import feedparser
import json
from django.views.decorators.http import require_http_methods
# Create your views here.

@require_http_methods(["GET"])
def index(request):
    rssSources = request.GET.get('rssSources','')
    # rssSources: list of rsspackages
    rssSources = json.loads(rssSources)
    rssUrls = [x['rssUrl'] for x in rssSources]
    # xmlSources：list of all rsspackages-xmlsource(each item is a xml with many posts)
    xmlSources = []
    for oneRssUrl in rssUrls:
        print(oneRssUrl)
        oneXmlSource = feedparser.parse(oneRssUrl)
        xmlSources.append(oneXmlSource)
    posts = []
    for i in range(len(xmlSources)):
        if i>5:
            break
        onePost = xmlSources[i]['entries'][0]
        posts.append(onePost)
    return JsonResponse({'posts':posts})


@require_http_methods(["GET"])
def pre_index(request):
    rssSources = request.GET.get('rssSources','')    
    print(rssSources)
    url = 'https://zhihu.com/rss'
    feedtext = feedparser.parse(url)
    entries = feedtext['entries'][2]
    response = JsonResponse(entries)
    return response
