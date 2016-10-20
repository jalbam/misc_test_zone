/* myWeatherForecast challenge by Juan Alba Maldonado */

import Ember from 'ember';

var APPID = "98124d921550ef94c6752238b7a9788b";

var TEMPERATURE_UNITS_DFAULT = "metric";
var TEMPERATURE_UNITS_SYMBOLS =
	{
		"metric" : "ºC",
		"imperial" : "ºF",
		"kelvin" : "K"
	};

	
export default Ember.Controller.extend({
	appID: APPID,
	
	indexController: Ember.inject.controller('index'),
	cityController: Ember.inject.controller('city'),
	
	temperatureUnits: TEMPERATURE_UNITS_DFAULT,
	temperatureUnitsSymbol: TEMPERATURE_UNITS_SYMBOLS[TEMPERATURE_UNITS_DFAULT],
	
	isCelsius: (TEMPERATURE_UNITS_DFAULT === "metric") ? true : false, //There must be a better way to do this using Ember.js!
	isFarenheit: (TEMPERATURE_UNITS_DFAULT === "imperial") ? true : false, //There must be a better way to do this using Ember.js!
	isKelvin: (TEMPERATURE_UNITS_DFAULT !== "metric" && TEMPERATURE_UNITS_DFAULT !== "imperial") ? true : false, //There must be a better way to do this using Ember.js!

	currentPage: "search",

	actions:
	{
		//Change temperature unit:
		changeTemperatureUnit(unit)
		{
			//Sets the given temperature unit (and its symbol):
			unit = (unit + "").trim().toLowerCase();
			if (typeof(TEMPERATURE_UNITS_SYMBOLS[unit]) === "undefined") { unit = TEMPERATURE_UNITS_DFAULT; }
			this.set("temperatureUnits", unit);
			this.set("temperatureUnitsSymbol", TEMPERATURE_UNITS_SYMBOLS[unit]);
			
			this.set("isCelsius", false); //There must be a better way to do this using Ember.js!
			this.set("isFarenheit", false);
			this.set("isKelvin", false);
			if (unit === "metric") { this.set("isCelsius", true); }
			else if (unit === "imperial") { this.set("isFarenheit", true); }
			else { this.set("isKelvin", true); }
			
			//If we are in the search page, updates cities (if any):
			if (this.get("currentPage") === "search")
			{
				this.get("indexController").getCities(this.get("indexController").get("cityName").trim().toLowerCase());
			}
			//...otherwise, updates current city information (if any):
			else
			{
				this.get("cityController").getCityInfo(this.get("cityController").get("cityId"));
			}
		}
	}
});