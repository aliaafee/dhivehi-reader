from flask import Blueprint, jsonify, url_for

api = Blueprint('api', __name__, url_prefix="/api")

from . import dv_tts_api


@api.route("/")
def api_index():
    return jsonify({
        'dv_tts': url_for('api.dv_tts_index', _external=True)
    })
