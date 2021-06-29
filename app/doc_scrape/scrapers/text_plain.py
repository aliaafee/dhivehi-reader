

def scrape(filename):
    result = {
        'content': []
    }

    with open(filename) as text_file:
        result['content'] = [line.strip() for line in text_file.readlines() if line.strip()]

    return result
