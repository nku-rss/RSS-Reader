import feedparser
import re
import time
import calendar
import datetime
from . import models


def get_rss_from_db():
    allRssSources = models.RssSources.objects.filter()
    allUrl = []
    for oneRss in allRssSources:
        allUrl.append(oneRss.rss_url)
    return allUrl


def store_all_posts_to_db(url):
    """根据url数组获得所有的文章"""
    
    feedtext = []
    for i in range(len(url)):
        feedtext.append(feedparser.parse(url[i]))
    posts=[]
    for i in range(len(url)):                    
        postKey = ['summary_detail','summary','content','description']
        for j in range(len(feedtext[i]['entries'])):
            post={}
            entries = feedtext[i]['entries'][j]
            post['rss_url']=url[i]
            if entries.has_key('id'):
                post['post_id']=entries['id']
            else:
                post['post_id']='null'
            if entries.has_key('author'):
                post['post_author']=entries['author']
            else:
                post['post_author']='匿名用户'
            if entries.has_key('title'):
                post['post_title']=entries['title']
            else:
                post['post_title']='null'
            if entries.has_key('published'):
                try:
                    dt=entries['published'][0:10]+' '+entries['published'][11:19]
                    timeArray = time.strptime(dt, "%Y-%m-%d %H:%M:%S")
                    #转换成时间戳
                    timestamp = time.mktime(timeArray)
                    # print(dt)
                    # print(timestamp)
                except:
                    try:
                        # print(entries['published'])
                        mounth=str(list(calendar.month_abbr).index(entries['published'][8:11]))
                        # print(str(list(calendar.month_abbr).index(entries['published'][8:11])))
                        dt=entries['published'][12:16]+"-"+mounth+"-"+entries['published'][5:7]+entries['published'][16:25]
                        # print(dt)
                        timeArray = time.strptime(dt, "%Y-%m-%d %H:%M:%S")
                        # 转换成时间戳
                        timestamp = time.mktime(timeArray)
                        # print(timestamp)
                    except:
                        print ("Error: date change fail")
                    else:
                        post['post_time']=dt
                        post['time_stamp']=timestamp
                else:
                    post['post_time']=dt
                    post['time_stamp']=timestamp
            else:
                post['post_time']='null'

            for key ,value in entries.items():
                if key in postKey:
                    if key in ['summary_detail']:
                        re_value = re.sub('SRC','src',value['value'])
                        post['post_content']=re_value
                        break
                    elif key in ['content']:
                        re_value = re.sub('SRC','src',value[0]['value'])
                        post['post_content']=re_value
                        break
                    elif key in ['summary']:
                        re_value = re.sub('SRC','src',value)
                        post['post_content']=re_value
                        break
                    else:
                        re_value = re.sub('SRC','src',value)
                        post['post_content']=re_value
            posts.append(post)
    for one in posts:
        tempRecord = models.Posts.objects.create(
            rss_url=one['rss_url'],
            post_id=one['post_id'],
            post_author=one['post_author'],
            post_title=one['post_title'],
            post_time=one['post_time'],
            post_content=one['post_content'],
            time_stamp=one['time_stamp'])
        tempRecord.save()


def start_update():
    allUrl = get_rss_from_db()
    store_all_posts_to_db(allUrl)