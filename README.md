# Dhivehi Reader

Web app to read dhivehi text. Based on tts machine learning models available at https://github.com/DhivehiAI/TTS-Demos. Hope the model gets furthure improvements.

![Demo Animation](../assets/screenshot-02.png?raw=true)

TODO: Add more supported websites, add support for reading docx, pdf. See [How To Add New Scraper](app/web_scrape/scrapers/README.md)

## Setup
* Install required dependencies `pip install -r requirements.txt`
* Download pre-trained models see https://github.com/DhivehiAI/TTS-Demos for instructions
* Extract the model files to ./app/dv_tts/models/


## Run the server
Run a test server

    python wsgi.py

Run with gunicorn

    gunicorn wsgi:app

## Deploy to Docker
* TODO

## Deploy to Heroku
Cant deploy to Heroku because the slug size is too big

    heroku login
    heroku create dhivehi-reader
    git push heroku master
    
