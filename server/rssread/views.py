from django.http import HttpResponse
from django.http import JsonResponse
import feedparser
import json
from django.views.decorators.http import require_http_methods
# Create your views here.

# @require_http_methods(["GET"])
# def index(request):
#     rssSources = request.GET.get('rssSources','')
#     # rssSources: list of rsspackages
#     if not rssSources:
#         return JsonResponse({'posts':''})
#     rssSources = json.loads(rssSources)
#     rssUrls = [x['rssUrl'] for x in rssSources]
#     # xmlSources：list of all rsspackages-xmlsource(each item is a xml with many posts)
#     htmlSources = []
#     for oneRssUrl in rssUrls:
#         if not oneRssUrl:
#             continue
#         print(oneRssUrl)
#         oneHtmlSource = feedparser.parse(oneRssUrl)
#         if len(oneHtmlSource['entries'])!=0:
#             htmlSources.append(oneHtmlSource)
#     posts = []
#     for i in range(len(htmlSources)):
#         if i>3:
#             break
#         for j in range(len(htmlSources[i]['entries'])):
#             if j>3:
#                 break
#             onePost = htmlSources[i]['entries'][j]
#             posts.append(onePost)
#     return JsonResponse({'posts':posts})


@require_http_methods(["GET"])
def get_new_posts(request):
    rssNumber = 4
    postsNumber = 4
    rssSources = request.GET.get('rssSources','')
    # rssSources: list of rsspackages
    if not rssSources:
        return JsonResponse({'posts':''})
    rssSources = json.loads(rssSources)
    rssUrls = [x['rssUrl'] for x in rssSources]
    # htmlSources : many htmlSource
    # htmlSource : { 'rssUrl':oneRssUrl, 'oneHtmlSource':oneHtmlSource }
    # oneHtmlSource : { 'feed':feed , 'entries':entries, ...}  
    # entries : [posts]
    # posts : { 'id':id, 'title':title, ... } not follow posts
    htmlSources = []
    for oneRssUrl in rssUrls:
        if not oneRssUrl:
            continue
        print(oneRssUrl)
        oneHtmlSource = feedparser.parse(oneRssUrl)
        if len(oneHtmlSource['entries'])!=0:
            htmlSource = {'rssUrl':oneRssUrl, 'oneHtmlSource':oneHtmlSource}
            htmlSources.append(htmlSource)
    posts = []
    for i in range(len(htmlSources)):
        if i>=rssNumber:
            break
        for j in range(len(htmlSources[i]['oneHtmlSource']['entries'])):
            if j>=postsNumber:
                break
            onePost = htmlSources[i]['oneHtmlSource']['entries'][j]
            post = {'rssUrl':htmlSources[i]['rssUrl'],'postId':onePost['id'],'isStared':'no','post':onePost}
            posts.append(post)
    return JsonResponse({'newPosts':posts})


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


@require_http_methods(["GET"])
def get_one_rss_posts(request):
    postsNum = 5
    rssUrl = request.GET.get('rssUrl','')
    if not rssUrl:
        return JsonResponse({'onePost','error_request'})
    htmlSource = feedparser.parse(rssUrl)
    posts = htmlSource['entries']
    ansPosts = []
    for i in range(len(posts)):
        if i>=postsNum:
            break
        onePost = posts[i]
        post = {'rssUrl':rssUrl,'postId':onePost['id'],'isStared':'no','post':onePost}
        ansPosts.append(post)
    return JsonResponse({'oneRssPosts':ansPosts})


# rssUrl and postId
@require_http_methods(["GET"])
def test_rss_source(request):
    rssUrl = request.GET.get('rssUrl','')
    htmlSource = feedparser.parse(rssUrl)
    if len(htmlSource['entries'])!=0:
        return JsonResponse({'test':'ok'})
    else:
        return JsonResponse({'test':'error'})



