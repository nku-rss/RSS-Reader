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
    if not rssSources:
        return JsonResponse({'posts':''})
    rssSources = json.loads(rssSources)
    rssUrls = [x['rssUrl'] for x in rssSources]
    # xmlSources：list of all rsspackages-xmlsource(each item is a xml with many posts)
    htmlSources = []
    for oneRssUrl in rssUrls:
        if not oneRssUrl:
            continue
        print(oneRssUrl)
        oneHtmlSource = feedparser.parse(oneRssUrl)
        htmlSources.append(oneHtmlSource)
    posts = []
    for i in range(len(htmlSources)):
        if i>3:
            break
        for j in range(len(htmlSources[i]['entries'])):
            if j>3:
                break
            onePost = htmlSources[i]['entries'][j]
            posts.append(onePost)
    return JsonResponse({'posts':posts})


@require_http_methods(["GET"])
def will_change_index(request):
    rssSources = request.GET.get('rssSources','')
    # rssSources: list of rsspackages
    if not rssSources:
        return JsonResponse({'posts':''})
    rssSources = json.loads(rssSources)
    rssUrls = [x['rssUrl'] for x in rssSources]
    # xmlSources：list of all rsspackages-xmlsource(each item is a xml with many posts)
    htmlSources = []
    for oneRssUrl in rssUrls:
        if not oneRssUrl:
            continue
        print(oneRssUrl)
        oneHtmlSource = feedparser.parse(oneRssUrl)
        htmlSources.append({'rssUrl':oneRssUrl, 'oneHtmlSource':oneHtmlSource})
    posts = []
    for i in range(len(htmlSources)):
        if i>5:
            break
        onePost = htmlSources[i]['oneHtmlSource']['entries'][0]
        posts.append({'rssUrl':htmlSources[i]['rssUrl'],'postId':htmlSources[i]['entries']['id'],'post':onePost})
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

# rssUrl and postId
@require_http_methods(["GET"])
def get_one_post(request):
    rssUrl = request.GET.get('rssUrl','')
    postId = request.GET.get('postId','')
    if not rssUrl or not postId:
        return JsonResponse({'onePost','error_request'})
    htmlSource = feedparser.parse(rssUrl)
    posts = htmlSource['entries']
    onePost = {}
    for i in range(len(posts)):
        if posts[i]['id'] == postId:
            onePost = posts[i]
            break;
    return JsonResponse({'onePost':onePost})
