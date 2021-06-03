from pathlib import Path
import os.path
from flask.wrappers import Request
from flask import request, jsonify, current_app, url_for
import soundfile

from .errors import unprocessable

from . import api
from ..dv_tts import get_female_tts_model

#female_tts = lambda t : print(t)
female_tts = get_female_tts_model()



@api.route("/dv-tts/from-url")
def from_url():
    """
        Accepts a url supplied via query string,
        converts text in the url to speech,
        returns a url to the speech file as json.
    """
    str_url = request.args.get('u', "", type=str)

    if not str_url:
        return unprocessable("URL is needed.")

    print(str_url)

    return jsonify({
        'audio_url': 'path-audio-url'
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

    output_wav = female_tts(data['text'], speed=0.95)

    output_filename_rel = Path('sound', 'abc.wav') #os.path.join('sound', 'abc.wav')
    output_filename_abs = Path(current_app.static_folder) / output_filename_rel
    
    soundfile.write(
        output_filename_abs,
        output_wav.astype('int16'),
        22050,
        'PCM_16'
    )
    

    return jsonify({
        'audio_url': url_for('static', filename=output_filename_rel.as_posix(), _external=True)
    })
