"""
Iulaan Scaper www.gazette.gov.mv
"""
from bs4 import BeautifulSoup

def scrape(url, html_text):
    print("Scraping Gazette...")

    soup = BeautifulSoup(html_text, 'html.parser')

    result = {
        'title': "",
        'author': "",
        'time': "",
        'content': []
    }

    try:
        type_elem = soup.findAll(class_='iulaan-type', limit=1)
        if type_elem:
            result['type'] = type_elem[0].text.strip()

        title_elem = soup.find_all(class_='iulaan-title', limit=1)
        if title_elem:
            result['title'] = title_elem[0].text.strip()

        author_elem = soup.find_all(class_="office-name", limit=1)
        if author_elem:
            result['author'] = author_elem[0].text.strip()

        time_elem = soup.find_all(class_="col-md-12 center", limit=1)
        if time_elem:
            result['time'] = time_elem[0].text.strip()


        content_elem = soup.find_all(class_="details")
        if content_elem:
            result['content'] = [item.text.strip() for item in content_elem if item.text.strip()]
    except:
        print("Scraping failed")
        pass

    print("Done")
    return result