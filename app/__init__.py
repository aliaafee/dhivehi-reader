from flask import Flask

#app = Flask(__name__)


#@app.route("/")
#def home_view():
#	return "<h1>Hello Dude</h1><p>Welcome</p>"


def create_app(config_object):
	app = Flask(__name__)

	app.config.from_object(config_object)
	config_object.init_app(app)

	from .blueprints import main_blueprint
	app.register_blueprint(main_blueprint)

	return app