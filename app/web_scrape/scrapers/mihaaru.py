"""
News Article Scaper mihaaru.com
"""
from bs4 import BeautifulSoup

def scrape(html_text):
    print("Scraping Mihaaru...")

    soup = BeautifulSoup(html_text, 'html.parser')

    result = {
        'title': "",
        'author': "",
        'time': "",
        'content': []
    }

    try:
        title_elem = soup.find_all(class_='text-40px sm:text-50px text-waheed text-black-two', limit=1)
        if title_elem:
            result['title'] = title_elem[0].text

        author_elem = soup.find_all(class_="text-18px sm:leading-none text-waheed text-black-two", limit=1)
        if author_elem:
            result['author'] = author_elem[0].text

        time_elem = soup.find_all(class_="mx-3 mt-1 leading-none sm:mx-0 text-faseyha", limit=1)
        if time_elem:
            result['time'] = time_elem[0].text

        content_elem = soup.find_all(class_="max-w-3xl px-4 mb-8 text-19px leading-loose text-black-two text-faseyha sm:px-0")
        if content_elem:
            result['content'] = [item.text for item in content_elem]
    except:
        print("Scraping failed")
        pass

    print("Done")
    return result