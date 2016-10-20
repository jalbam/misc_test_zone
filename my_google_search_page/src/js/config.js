"use strict"; //Using strict mode.


//Configuration:
var CFG =
{
	GENERAL:
	{
		DEBUG: true, //In debug mode it will print some errors in the console (or alert if the browser does not support console).
		QUERY_PARAMETER: "q", //Name of the parameter that we can receive by URL (GET) with the search query.
		LANGUAGE_PARAMETER: "l", //Name of the parameter that we can receive by URL (GET) with the language code desired.
		SHOW_ERROR_WINDOW_ON_SEARCH_FAIL: false, //Determines whether to show the error window when the search fails for some reason or not.
		LINKS_TARGET: "_self" //The TARGET parameter of the A link for each search result item (as for example "_blank" for a new window).
	},
	LOCALIZATION:
	{
		LANGUAGES_AVAILABLE: { "EN" : "English", "ES" : "Spanish" }, //Available languages.
		LANGUAGE_DEFAULT: "EN", //Default language when no other can be chosen.
		LOCALIZABLE_CLASS: "LOCALIZABLE", //Class name for localizable elements.
		LOCALIZABLE_ATTRIBUTE_PREFIX: "tr-", //Prefix for localizable attributes.
		allowNavigatorLanguages_DEFAULT: true, //Default value for allowNavigatorLanguages parameter.
		ignoreVariation_DEFAULT: true //Default value for ignoreVariation parameter.
	},
	SEARCH_SERVICE: //Change this to a premium account if you want to have more than 100 search requests per day (in fact it will be 50 because every search performs two searches: images and web sites).
	{
		API_KEY: "AIzaSyABMRAeAG2_MHw7gDhvg7S6PpRS2U2RcRM", //API key for the Google's CSE.
		ENGINE_ID: "000983074032552429376:lyjlizcpoca", //Engine id for Google's CSE.
		SERVER: "https://www.googleapis.com/customsearch/v1?alt=json&prettyPrint=false&key={{key}}&cx={{cx}}&q={{q}}&hl={{hl}}&start={{start}}&fields=" + encodeURLValue("queries(nextPage),items(htmlTitle,link,displayLink,htmlSnippet,image/*)"), //Server for Google's CSE with desired parameters.
		SEARCH_TYPE_PARAMETER: "searchType={{searchType}}", //Parameter used by Google's CSE for JSONP callback.
		JSONP_FALLBACK: true, //Defines whether to use JSONP fallback (after AJAX/XHR fails) or not.
		JSONP_FALLBACK_PARAMETER: "callback={{callback}}", //Parameter used by Google's CSE for JSONP callback.
		JSONP_FALLBACK_TIMEOUT_MS: 20000, //Milliseconds to count to declare the JSONP fallback failed (timeout).
	}
};


//Localization labels:
var LANG =
{
	WAIT_MESSAGE: { EN: "Wait, please...", ES: "Espera, por favor..." },
	SEARCH_BUTTON_TEXT: { EN: "Search", ES: "Buscar" },
	SEARCH_ERROR:
	{
		EN: "Search failed. Please, try again later.",
		ES: "La búsqueda ha fallado. Por favor, inténtalo más tarde."
	},
	SEARCH_NO_MORE_RESULTS: { EN: "No more results.", ES: "No más resultados." },
	SEARCH_NOTHING_FOUND: { EN: "Nothing found.", ES: "No se encontró nada." },
	ERROR_BUTTON_TEXT: { EN: "OK", ES: "ACEPTAR" },
	SEARCH_MORE_BUTTON_TEXT: { EN: "More", ES: "Más" },
	SEARCH_LOAD_WAIT: { EN: "Loading...", ES: "Cargando..." }
};
LANG.WAIT_SEARCH_MESSAGE = LANG.WAIT_MESSAGE;