import feedparser
 
url = 'https://gujiaxi.com/feed.xml'
feedtext = feedparser.parse(url)
a = feedtext['feed']
 
title = feedtext['feed']['title']
print (title)
 
print ('\n the sum numbers of entries  ',len(feedtext.entries),'\n')
entries = feedtext['entries'][0]
print(entries['title'])
print('\n')
print(entries['summary'])
print('\n')
print(entries['summary_detail'])
print('\n')
print(entries['published'])
print('\n')
print(entries['published_parsed'])
print('\n')
print(entries['links'])
print('\n')
print(entries['link'])
print('\n')
print(entries['id'])
print('\n')
print(entries['guidislink'])


 
 
# autor = feedtext.entries[0].author
# print (autor)
 
#com = feedtext.entries[0].comments
#print (com)
 
# summ = feedtext.entries[0].summary  #就是内容
# print (summ)