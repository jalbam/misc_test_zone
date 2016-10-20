/* myWeatherForecast challenge by Juan Alba Maldonado */

import Ember from 'ember';

export default Ember.Controller.extend({
	
	applicationController: Ember.inject.controller('application'),

	cityId: null,
	
	cityInfo: {},
	
	infoMessage: "Loading...",
	
	init: function()
	{
		this._super();
		
		//As soon as the city id is available, uses it to get the weather information of the desired city:
		var that = this;
		var checkCityIdInterval =
			setInterval
			(
				function()
				{
					if (typeof(that.model) !== "undefined" && typeof(that.model.city_id) !== "undefined")
					{
						that.getCityInfo(that.model.city_id);
						clearInterval(checkCityIdInterval);
					}
				},
				10
			);
		
		this.get("applicationController").set("currentPage", "cityInfo");
	},
	//Method that gets the information of a city (through its ID):
	getCityInfo(cityId) 
	{
		if (typeof(cityId) === "undefined" || cityId === null || isNaN(cityId)) { return; }
		
		this.set("cityId", cityId);
		
		this.displayMessage("Loading...");		
		var temperatureUnits = this.get("applicationController").temperatureUnits;
		
		
		//Gets the data for the current city name (there can be more than one city with the same name):
		//Format:
			//One city: http://api.openweathermap.org/data/2.5/forecast/daily?id={CITY_ID}&mode=json[&units=metric/imperial]&cnt=16[&lang={LANGUAGE}]&appid=98124d921550ef94c6752238b7a9788b
			//List cities containing a string in its name: http://api.openweathermap.org/data/2.5/find?q={CITY_NAME}&type=like&mode=json&appid=98124d921550ef94c6752238b7a9788b
		//var temperatureUnits = this.get("temperatureUnits").trim().toLowerCase();
		var that = this;
		$.ajax
		(
			{
				type: "GET",
				url: "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + cityId + "&mode=json&units=" + temperatureUnits + "&cnt=16&appid=" + this.get("applicationController").appID,
				success:
					function(data)
					{
						if (typeof(data) !== "undefined" && data !== null && typeof(data.list) !== "undefined" && data.list !== null && typeof(data.list.length) !== "undefined" && !isNaN(data.list.length) && data.list.length > 0)
						{
							//Transforms (formats) timestamps into human-readable date strings:
							var timestampCurrent;
							var dateCurrent;
							var dataListLength = data.list.length;
							for (var x = 0; x < dataListLength; x++)
							{
								timestampCurrent = data.list[x].dt;
								dateCurrent = new Date(timestampCurrent * 1000);

								var month = dateCurrent.getMonth() + 1;
								var day = dateCurrent.getDate();

								month = (month < 10 ? "0" : "") + month;
								day = (day < 10 ? "0" : "") + day;
								data.list[x].dt = day + "-" + month + "-" + dateCurrent.getFullYear();
							}
							
							//Stores the cities we have gotten:
							that.set("cityInfo", data);
							
							that.displayMessage("", true);
						}
						else
						{
							that.displayMessage("No cities found!");
						}
					},
				error:
					function(request, textStatus, errorThrown)
					{
						displayMessage("Error connecting to the server: " + errorThrown);
					}
			}
		);
	},
	//Method to show an information message:
	displayMessage(messageText, avoidDeletingCityInfo)
	{
		//Shows the given message:
		messageText = messageText.trim();
		this.set("infoMessage", messageText);
		
		if (!avoidDeletingCityInfo) { this.set("cityInfo", {}); }
	}
});