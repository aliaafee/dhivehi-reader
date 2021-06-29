"""
Little CLI tool to test web scrapers
"""
import sys
from urllib.parse import urlparse
from os.path import isfile

from requests.models import requote_uri
from app.web_scrape import scrape_page
from app.doc_scrape import scrape_doc


def main(argv):
    if not argv:
        print("Noting to scrape")
        return

    url = argv[0]

    u = urlparse(url)

    if u.netloc:
        result = scrape_page(argv[0])
    else:
        if not isfile(url):
            print(f"File {url} not found")
            return
        result = scrape_doc(url)

    if not result:
        print("Scrape Failed.")
        return

    for key in ['title', 'author', 'time']:
        if key in result:
            print(key)
            print("=======")
            print(f"`{result[key]}`")
            print("")

    if 'content' in result:
        print("content")
        print("=======")
        for item in result['content']:
            print(f"`{item}`")
            print("")


if __name__ == '__main__':
    main(sys.argv[1:])