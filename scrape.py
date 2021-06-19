"""
Little CLI tool to test web scrapers
"""
import sys
from app.web_scrape import scrape_page


def main(argv):
    if not argv:
        print("Noting to scrape")
        return
    
    result = scrape_page(argv[0])

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