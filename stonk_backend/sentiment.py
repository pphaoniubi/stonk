import requests
from transformers import pipeline
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET

sentiment_analysis = pipeline("sentiment-analysis", model="ProsusAI/finbert")

def get_google_news_rss(stock):
    rss_url = f"https://news.google.com/rss/search?q={stock}"


    response = requests.get(rss_url)

    if response.status_code != 200:
        print("Failed to retrieve RSS feed.")
        return []

    root = ET.fromstring(response.content)

    articles = []
    for item in root.findall(".//item"):
        title = item.find("title").text
        link = item.find("link").text
        pub_date = item.find("pubDate").text
        articles.append({'title': title, 'link': link, 'pub_date': pub_date})

    return articles

def analyze_sentiment(title):
    sentiment = sentiment_analysis(title)
    return sentiment[0]

query = "DOGECOIN"
news = get_google_news_rss(query)

pos_count = 0
neg_count = 0
neu_count = 0
for idx, article in enumerate(news, 1):
    title = article['title']

    sentiment = analyze_sentiment(title)
    print(f"{idx}. {article['title']}")
    # print(f"Published on: {article['pub_date']}")
    if sentiment['label'] == 'positive':
        pos_count = pos_count + 1
    elif sentiment['label'] == 'negative':
        neg_count = neg_count + 1
    elif sentiment['label'] == 'neutral':
        neu_count = neu_count + 1
    print(f"Sentiment: {sentiment['label']} (confidence: {sentiment['score']:.2f})")

print(f"positive count: {pos_count}")
print(f"negative count: {neg_count}")
print(f"neutral count: {neu_count}")