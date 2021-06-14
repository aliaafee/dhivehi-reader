from urllib.parse import urlparse

from requests.models import ReadTimeoutError

from . import mihaaru


SCRAPERS = {
    'mihaaru.com': mihaaru.scrape,
    'dhen.mv': dhen.scrape
}


def get_scraper(url):
    u = urlparse(url)

    if u.netloc not in SCRAPERS:
        return None
        
    return SCRAPERS[u.netloc]
