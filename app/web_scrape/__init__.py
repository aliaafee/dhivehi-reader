import urllib
import requests
from .scrapers import get_scraper



def scrape_page(url):
    scraper = get_scraper(url)

    if not scraper:
        print("Appropriate page scraper not found")
        return None

    page_response = requests.get(url)

    return scraper(page_response.text)