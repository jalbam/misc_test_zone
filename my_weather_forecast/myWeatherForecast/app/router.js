/* myWeatherForecast challenge by Juan Alba Maldonado */

import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
	this.route('city', { path: '/city/:city_id' });
	this.route('page-not-found', { path: '/*wildcard' });
});

export default Router;
