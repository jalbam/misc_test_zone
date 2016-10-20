/* myWeatherForecast challenge by Juan Alba Maldonado */

export default Ember.Route.extend({
	model(params)
	{
		return Ember.RSVP.hash({city_id: params.city_id});
	}
});