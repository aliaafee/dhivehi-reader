from urllib.parse import urlparse

from requests.models import ReadTimeoutError

from . import default, mihaaru, dhen, gazette


SCRAPERS = {
    'mihaaru.com': mihaaru.scrape,
    'dhen.mv': dhen.scrape,
    'www.gazette.gov.mv': gazette.scrape
}


def get_scraper(url):
    u = urlparse(url)

    if not u.netloc:
        u = urlparse(f"http://{url}")

    if u.netloc not in SCRAPERS:
        return default.scrape
        
    return SCRAPERS[u.netloc]
