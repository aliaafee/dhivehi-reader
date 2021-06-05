"""
News Article Scaper mihaaru.com
"""
from bs4 import BeautifulSoup

def scrape(html_text):
    print("Scraping Mihaaru...")

    soup = BeautifulSoup(html_text, 'html.parser')

    title = soup.find_all(class_='text-40px sm:text-50px text-waheed text-black-two', limit=1)[0]

    author = soup.find_all(class_="text-18px sm:leading-none text-waheed text-black-two", limit=1)[0]

    time = soup.find_all(class_="mx-3 mt-1 leading-none sm:mx-0 text-faseyha", limit=1)[0]

    content = soup.find_all(class_="max-w-3xl px-4 mb-8 text-19px leading-loose text-black-two text-faseyha sm:px-0")

    print("Done")
    return {
        'title': title.text,
        'author': author.text,
        'time': time.text,
        'content': [item.text for item in content]
    }