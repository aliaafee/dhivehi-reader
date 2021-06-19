from urllib.parse import urlparse
import requests
from .scrapers import get_scraper


def sanitize_url(url):
    u = urlparse(url)

    if not u.netloc:
        url = f"http://{url}"
        return url

    return url



def scrape_page(url):
    url = sanitize_url(url)

    scraper = get_scraper(url)

    if not scraper:
        print("Appropriate page scraper not found")
        return None

    try:
        page_response = requests.get(url)
    except ConnectionError:
        print("Connection Error")
        return None

    return scraper(url, page_response.text)