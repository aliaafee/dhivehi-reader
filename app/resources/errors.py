from flask import jsonify
from . import api


def resource_not_found(message=''):
    response = jsonify({'error': 'resource not found', 'message': message})
    response.status_code = 404
    return response

def unauthorized(message=''):
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    response.headers['WWW-Authenticate'] = 'CustomBasic'
    return response

def forbidden(message=''):
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response

def unprocessable(message=''):
    response = jsonify({'error': 'unprocessable', 'message': message})
    response.status_code = 422
    return response

def invalid_fields(invalid_fields=[]):
    response = jsonify({'error': 'unprocessable', 'invalid_fields': invalid_fields})
    response.status_code = 422
    return response


@api.app_errorhandler(405)
def app_method_not_allowed(e):
    response = jsonify({'error': 'method not allowed', 'message': 'The method is not allowed for requested URL.'})
    response.status_code = 405
    return response


@api.app_errorhandler(404)
def app_page_not_found(e):
    return resource_not_found()


@api.app_errorhandler(403)
def app_forbidden(e):
    return unauthorized()


@api.app_errorhandler(500)
def app_internal_server_error(e):
    return "Internal Server Error", 500