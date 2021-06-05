# Adding a New Scraper

New scraper should have a function `scrape(html_text)` which accepts raw html text.

Should return a dictionary with following keys. Keys may have empty values.

    result = {
        'title': "",
        'author': "",
        'time': "",
        'content': []
    }
  
Import the module in `__init__.py`

Add a new entry to `SCRAPERS` dict, with netloc as key and value as a reference to the scrape function.

See the provided example for details.
