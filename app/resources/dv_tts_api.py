from pathlib import Path
from flask.wrappers import Request
from flask import json, request, jsonify, current_app, url_for, Response

from .errors import unprocessable

from . import api
from ..web_scrape import scrape_page
from ..dv_tts import get_female_tts_model, tts_soundfile, tts_stream, tts_base64wav
from ..preprocessing import all_numbers_to_words

female_tts = get_female_tts_model()



@api.route("/dv-tts/")
def dv_tts_index():
    return jsonify({
        'from_text': url_for('api.from_text', _external=True),
        'from_url': url_for('api.from_url', _external=True),
        'stream_from_text': url_for('api.stream_from_text', _external=True)
    })


@api.route("/dv-tts/from-url")
def from_url():
    """
        Accepts a url supplied via query string
    """
    str_url = request.args.get('u', "", type=str)

    if not str_url:
        return unprocessable("URL is needed.")

    page_contents = scrape_page(str_url)

    if not page_contents:
        return unprocessable("Could not get text from webpage.")

    def process(text, transcript):
        transcript = all_numbers_to_words(transcript)
        return {
            'text': text,
            'transcript': transcript,
            'audio_url': tts_base64wav(transcript, female_tts, speed=0.95)
        }

    result = {}
    if page_contents['title']:
        result['title'] = process(page_contents['title'], "ސުރުޙީ" + " " + page_contents['title'] + ".")
    if page_contents['time']:
        result['time'] = process(page_contents['time'], "ތާރީޚު" + " " + page_contents['time'] + ".")
    if page_contents['author']:
        result['author'] = process(page_contents['author'], "ލިޔުނީ" + " " + page_contents['author'] + ".")
    if page_contents['content']:
        result['content'] = [process(para, para) for para in page_contents['content']] 

    return jsonify({
        'article': result
    })



@api.route("/dv-tts/from-text", methods=['POST'])
def from_text():
    """
        Accepts text as POST data in json format
        converts text to speech
        returns base64 encoded wav audio
    """
    data =  request.get_json()

    if not data:
        return unprocessable("No POST data sent")

    if not 'text' in data:
        return unprocessable("`text` not found in data")

    transcript = all_numbers_to_words(data['text'])

    return jsonify({
        'audio_url': tts_base64wav(transcript, female_tts, speed=0.95),
        'trascript': transcript
    })


@api.route("/dv-tts/stream-from-text")
def stream_from_text():
    text = request.args.get('text', "", type=str)

    return Response(
        tts_stream(text, female_tts),
        mimetype="audio/wav"
    )
