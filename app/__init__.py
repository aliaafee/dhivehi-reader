from flask import Flask


def create_app(config_object):
	app = Flask(__name__)

	app.config.from_object(config_object)
	config_object.init_app(app)

	from .blueprints import main_blueprint
	app.register_blueprint(main_blueprint)

	from .resources import api
	app.register_blueprint(api)

	return app