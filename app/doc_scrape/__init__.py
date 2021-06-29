
from .scrapers import get_scraper


def scrape_doc(filename):
    scraper = get_scraper(filename)

    if not scraper:
        print("Appropriate document scraper not found")
        return None

    return scraper(filename)