
from flask import render_template, send_file

from . import main


@main.route('/')
def homepage():
    return render_template('index.html')


@main.route('/manifest.webmanifest')
def webapp_manifest():
    return send_file('static/manifest.webmanifest')