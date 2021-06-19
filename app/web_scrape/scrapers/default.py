"""
Default
"""
from bs4 import BeautifulSoup

def scrape(url, html_text):
    print("Running Default Scraper...")

    soup = BeautifulSoup(html_text, 'html.parser')

    result = {
        'title': "",
        'author': "",
        'time': "",
        'content': []
    }

    try:
        elems = soup.find_all()

        result['content'] = [elem.text.strip() for elem in elems if elem.text]
        
    except:
        print("Scraping failed")
        pass

    print("Done")
    return result