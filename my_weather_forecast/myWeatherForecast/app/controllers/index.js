/* myWeatherForecast challenge by Juan Alba Maldonado */

import Ember from 'ember';

export default Ember.Controller.extend({
	applicationController: Ember.inject.controller('application'),

	infoMessage: "Enter a city name",
	
	cityName: "",
	cityNameLast: "",
	
	checkCityEnteredTimeout: null,
	updateCityTimeout: null,
	updateCityTimeoutMs: 1000, //Milliseconds to wait after the user has typed something to call for the data through AJAX (to avoid flooding the server).
	
	citiesList: [],
	
	init: function()
	{
		this._super();
		this.get("applicationController").set("currentPage", "search");
	},
	actions:
	{
		//Method called when the city input has detected a key pressed:
		updateCity()
		{
			//It needs a time to get the new inserted name (updateCity method is fired before the input value is updated):
			clearTimeout(this.get("updateCityTimeout")); //Prevents execution the previous timeout call (if any).
			clearTimeout(this.get("checkCityEnteredTimeout")); //Prevents execution the previous timeout call (if any).
			var that = this;
			this.set
			(
				"checkCityEnteredTimeout",
				setTimeout
				(
					function()
					{
						var cityName = that.get("cityName").trim().toLowerCase();
						
						//If the city is empty, not long enough or it is the same as the previous one, just exits:
						if (cityName === "") { that.displayMessage("Enter a city name"); return; }
						else if (cityName.length < 3) { that.displayMessage("Enter more than two characters!"); return; }
						else if (cityName === that.get("cityNameLast")) { that.displayMessage("", true); return; }
						
						that.set("cityNameLast", cityName); //Stores the current city name for the next time(s).
						
						that.displayMessage("Processing...", true);
						
						that.set
						(
							"updateCityTimeout",
							setTimeout
							(
								function()
								{
									that.getCities(cityName);
								},
								that.get("updateCityTimeoutMs")
							)
						);
					},
					100
				)
			);

		}
	},
	//Method that gets the data through AJAX:
	getCities(cityName)
	{
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
				url: "http://api.openweathermap.org/data/2.5/find?q=" + encodeURIComponent(cityName) + "&type=like&units=" + temperatureUnits + "&mode=json&appid=" + this.get("applicationController").appID,
				success:
					function(data)
					{
						//If the user has changed the input text, just exits (another newer XHR call will be processed):
						if (cityName !== that.get("cityNameLast")) { return; }

						if (typeof(data) !== "undefined" && data !== null && typeof(data.list) !== "undefined" && data.list !== null && typeof(data.list.length) !== "undefined" && !isNaN(data.list.length) && data.list.length > 0)
						{
							//Stores the cities we have gotten:
							that.set("citiesList", data.list);
							
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
	displayMessage(messageText, avoidDeletingCities)
	{
		//Shows the given message:
		messageText = messageText.trim();
		this.set("infoMessage", messageText);
		
		if (!avoidDeletingCities) { this.set("citiesList", []); }
	}
});