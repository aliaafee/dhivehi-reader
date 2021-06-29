import magic

from . import text_plain, docx


SCRAPERS = {
    "text/plain": text_plain.scrape,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": docx.scrape
}


def get_scraper(filename):
    mime = magic.Magic(mime=True)
    mime_type = mime.from_file(filename)

    if mime_type not in SCRAPERS:
        print(mime_type)
        return None

    return SCRAPERS[mime_type]

