import urllib
import requests
from .scrapers import get_scraper



def scrape_page(url):
    scraper = get_scraper(url)

    if not scraper:
        print("Appropriate page scraper not found")
        return None

    try:
        page_response = requests.get(url)
    except ConnectionError:
        print("Connection Error")
        return None

    return scraper(page_response.text)