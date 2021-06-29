import docx2txt

def scrape(filename):
    result = {
        'content': []
    }

    #TODO: Split based on paragraph breaks.
    result['content'] = [docx2txt.process(filename)]

    return result