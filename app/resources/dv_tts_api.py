from pathlib import Path
from flask.wrappers import Request
from flask import json, request, jsonify, current_app, url_for

from .errors import unprocessable

from . import api
from ..web_scrape import scrape_page
from ..dv_tts import get_female_tts_model, tts_soundfile
from ..preprocessing import all_numbers_to_words

female_tts = get_female_tts_model()



@api.route("/dv-tts/")
def dv_tts_index():
    return jsonify({
        'from_text': url_for('api.from_text', _external=True),
        'from_url': url_for('api.from_url', _external=True)
    })


@api.route("/dv-tts/from-url")
def from_url():
    """
        Accepts a url supplied via query string,
        converts text in the url to speech,
        returns a url to the speech file
        and also the text scraped from the website that will be spoken
        as json
    """
    str_url = request.args.get('u', "", type=str)

    if not str_url:
        return unprocessable("URL is needed.")

    page_contents = scrape_page(str_url)

    if not page_contents:
        return unprocessable("Could not get text from webpage.")

    speech_text = ""
    if page_contents['title']:
        speech_text += "ސުރުޙީ" + " " + all_numbers_to_words(page_contents['title']) + ". "
    if page_contents['time']:
        speech_text += "ތާރީޚު" + " " + all_numbers_to_words(page_contents['time']) + ". "
    if page_contents['author']:
        speech_text += "ލިޔުނީ" + " " + all_numbers_to_words(page_contents['author']) + ". "
    if page_contents['content']:
        speech_text += all_numbers_to_words(" ".join(page_contents['content']))

    output_filename_rel = Path('sound', 'websound.wav')
    output_filename_abs = Path(current_app.static_folder) / output_filename_rel

    tts_result = tts_soundfile(speech_text, female_tts, output_filename_abs, speed=0.95)

    if not tts_result:
        return jsonify({
            'error': "TTS failed",
            'article': page_contents,
            'transcript': speech_text
        })

    return jsonify({
        'audio_url': url_for('static', filename=output_filename_rel.as_posix(), _external=True),
        'article': page_contents
    })



@api.route("/dv-tts/from-text", methods=['POST'])
def from_text():
    """
        Accepts text as POST data in json format
        converts text to speech
        returns a url to the speech file.
    """
    data =  request.get_json()

    if not data:
        return unprocessable("No POST data sent")

    if not 'text' in data:
        return unprocessable("`text` not found in data")

    speech_text = all_numbers_to_words(data['text'])


    output_filename_rel = Path('sound', 'abc.wav') #os.path.join('sound', 'abc.wav')
    output_filename_abs = Path(current_app.static_folder) / output_filename_rel

    tts_result = tts_soundfile(speech_text, female_tts, output_filename_abs, speed=0.95)

    if not tts_result:
        return jsonify({
            'error': "TTS failed",
            'transcript': speech_text
        })

    return jsonify({
        'audio_url': url_for('static', filename=output_filename_rel.as_posix(), _external=True)
    })
