from flask import render_template
from . import main


@main.app_errorhandler(404)
def page_not_found(e):
    return "Page Not Found", 404


@main.app_errorhandler(403)
def forbidden(e):
    return "Access Denied", 403


@main.app_errorhandler(500)
def internal_server_error(e):
    return "Internal Server Error", 500