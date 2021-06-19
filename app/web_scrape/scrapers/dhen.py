"""
News Article Scaper dhen.mv
"""
from bs4 import BeautifulSoup

months = {"January":"ޖެނުއަރީ",
          "February":"ފެބުރުއަރީ",
          "March":"މާޗް",
          "April":"އޭޕްރީލް",
          "May":"މޭ",
          "June":"ޖޫން",
          "July":"ޖުލާއި",
          "August":"އޯގަސްޓް",
          "September":"ސެޕްޓެމްބާ",
          "October":"އޮކްޓޯބާ",
          "November":"ނޮވެމްބާ",
          "December":"ޑިސެމްބާ"}

def scrape(url, html_text):
    print("Scraping Dhen...")

    soup = BeautifulSoup(html_text, 'html.parser')

    result = {
        'title': "",
        'author': "",
        'time': "",
        'content': []
    }

    try:
        title_elem = soup.find_all(class_='block rtl text-right font-thaana-bold text-alhi-800 text-3xl mb-4', limit=1)
        if title_elem:
            result['title'] = title_elem[0].text.replace("\n","")

        content_elem = soup.find(class_="article--details p-5 md:p-8")
        content_parts = content_elem.findChildren("p",recursive=True)
        
        if content_elem:
            result['content'] = [item.text for item in content_parts]
            if (result['content'][-1] == '\xa0'):
                result['content'] = result['content'][:-1]

        author_elem = soup.find_all(class_="font-thaana-title text-base text-fehi-600 rtl", limit=1)
        if author_elem:
            result['author'] = author_elem[0].text.replace("\n","")

        time_elem = soup.find_all(class_="text-alhi-400", limit=1)
        if time_elem:
            result['time'] = cleanTime(time_elem[0].text)
    except:
        print("Scraping failed")
        pass

    print("Done")
    return result

def cleanTime(x):
    x = x.replace("\n","")
    for month in months.keys():
        if x.find(month) != -1:
            x = x.replace(month, months[month])
    return x[:-4]

