from django.http import HttpResponse
from django.http import JsonResponse
import feedparser
import json
from django.views.decorators.http import require_http_methods
from . import models
from . import dboperate

SEGMENT_SIZE = 6

# 接受已经标为已读的文章的hasReadPostsId，段号segment，rssUrls
# 错误处理：如果rssUrls是空，返回error
@require_http_methods(["GET"])
def get_unread_posts(request):
    rssUrls = request.GET.get('rssUrls',[])
    segment = int(request.GET.get('segment',0))
    hasReadPostsId = request.GET.get('hasReadPostsId',[])
    if not rssUrls or not segment or not hasReadPostsId:
        return JsonResponse({'res':'error'})
    rssUrls = json.loads(rssUrls)
    hasReadPostsId = json.loads(hasReadPostsId)
    allPosts = models.Posts.objects.filter(rss_url__in=rssUrls).order_by('time_stamp')
    resPosts = []
    index = SEGMENT_SIZE*(segment-1)
    count = 0
    while count<SEGMENT_SIZE:
        if index >= len(allPosts):
            break
        if allPosts[index].post_id in hasReadPostsId:
            index += 1
            continue
        onePost = {
            'rssUrl':allPosts[index].rss_url,
            'postId':allPosts[index].post_id,
            'author':allPosts[index].post_author,
            'title':allPosts[index].post_title,
            'time':allPosts[index].post_time
            # 'content':allPosts[index].post_content        
        }
        resPosts.append(onePost)
        count += 1
        index += 1
    if not resPosts:
        return JsonResponse({'res':'error'})
    return JsonResponse({'res':resPosts})


@require_http_methods(["GET"])
def get_all_posts(request):
    rssUrls = request.GET.get('rssUrls',[])
    segment = int(request.GET.get('segment',0))
    if not rssUrls or not segment:
        return JsonResponse({'res':'error'})
    rssUrls = json.loads(rssUrls)
    allPosts = models.Posts.objects.filter(rss_url__in=rssUrls).order_by('time_stamp')
    resPosts = []
    index = SEGMENT_SIZE*(segment-1)
    count = 0
    while count<SEGMENT_SIZE:
        if index >= len(allPosts):
            break
        onePost = {
            'rssUrl':allPosts[index].rss_url,
            'postId':allPosts[index].post_id,
            'author':allPosts[index].post_author,
            'title':allPosts[index].post_title,
            'time':allPosts[index].post_time
            # 'content':allPosts[index].post_content        
        }
        resPosts.append(onePost)
        count += 1
        index += 1
    if not resPosts:
        return JsonResponse({'res':'error'})
    return JsonResponse({'res':resPosts})


@require_http_methods(["GET"])
def get_one_post(request):
    postId = request.GET.get('postId','')
    if not postId:
        return JsonResponse({'res','error'})
    post = models.Posts.objects.filter(post_id=postId).order_by('time_stamp')
    if not post:
        return JsonResponse({'res':'error'})
    onePost = {
        'rssUrl':post[0].rss_url,
        'postId':post[0].post_id,
        'author':post[0].post_author,
        'title':post[0].post_title,
        'time':post[0].post_time,
        'content':post[0].post_content        
    }
    return JsonResponse({'res':onePost})


@require_http_methods(["GET"])
def get_one_rss_posts(request):
    rssUrl = request.GET.get('rssUrl','')
    segment = int(request.GET.get('segment',0))
    if not rssUrl or not segment:
        return JsonResponse({'res':'error'})
    allPosts = models.Posts.objects.filter(rss_url=rssUrl).order_by('time_stamp')
    resPosts = []
    index = SEGMENT_SIZE*(segment-1)
    count = 0
    while count<SEGMENT_SIZE:
        if index >= len(allPosts):
            break
        onePost = {
            'rssUrl':allPosts[index].rss_url,
            'postId':allPosts[index].post_id,
            'author':allPosts[index].post_author,
            'title':allPosts[index].post_title,
            'time':allPosts[index].post_time
            # 'content':allPosts[index].post_content        
        }
        resPosts.append(onePost)
        count += 1
        index += 1
    if not resPosts:
        return JsonResponse({'res':'error'})
    return JsonResponse({'res':resPosts})


@require_http_methods(["GET"])
def test_rss_source(request):
    rssUrl = request.GET.get('rssUrl','')
    if not rssUrl:
        return JsonResponse({'res':'error'})
    hasSaved = models.RssSources.objects.filter(rss_url=rssUrl)
    if not hasSaved:
        htmlSource = feedparser.parse(rssUrl)
        if len(htmlSource['entries'])!=0:
            newRssSource = models.RssSources.objects.create(rss_url=rssUrl,user_number=1)
            newRssSource.save()
            dboperate.store_all_posts_to_db([rssUrl])
            return JsonResponse({'res':'ok'})
        else:
            return JsonResponse({'res':'error'})
    else:
        hasSaved[0].user_number +=1
        hasSaved[0].save()
        return JsonResponse({'res':'ok'})


@require_http_methods(["GET"])  
def delete_rss_source(request):
    rssUrls = request.GET.get('rssUrls','')
    if not rssUrls:
        return JsonResponse({'res':'error'})
    hasSaved = models.RssSources.objects.filter(rss_url__in=rssUrls)
    if not hasSaved:
        return JsonResponse({'res':'error'})
    for i in range(len(hasSaved)):
        if hasSaved[i].user_number==1:
            deleteRssUrl = hasSaved[i].rss_url
            hasSaved[i].delete()
            models.Posts.objects.filter(rss_url=deleteRssUrl).delete()
        else:
            hasSaved[i].user_number -=1
            hasSaved[i].save()
    return JsonResponse({'res':'ok'})

