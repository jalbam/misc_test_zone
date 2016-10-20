"use strict"; //Using strict mode.


var QUERY_PARAMETER = CFG.GENERAL.QUERY_PARAMETER.toLowerCase();
var LANGUAGE_PARAMETER = CFG.GENERAL.LANGUAGE_PARAMETER.toLowerCase();
var PARAMETERS_RECEIVED = null;
var queryParameterReceived = getParameter(QUERY_PARAMETER, "#") || getParameter(QUERY_PARAMETER); //Gets the query parameter from the URL (hash or GET).
var languageParameterReceived = getParameter(LANGUAGE_PARAMETER, "#") || getParameter(LANGUAGE_PARAMETER); //Gets the language code parameter from the URL (hash or GET).


//Returns the value of the desired URL (GET) parameter:
function getParameter(parameterName, firstSeparator, updateCache)
{
	if (PARAMETERS_RECEIVED === null || updateCache) { PARAMETERS_RECEIVED = window.location.href; PARAMETERS_RECEIVED = PARAMETERS_RECEIVED.substring(PARAMETERS_RECEIVED.indexOf("?")); }
	var parameters = PARAMETERS_RECEIVED.toLowerCase();
	if (!firstSeparator) { firstSeparator = "?"; }
	var indexSeparator = parameters.indexOf(firstSeparator);
	parameters = parameters.substring(indexSeparator + 1);
	var indexFound = parameters.indexOf(parameterName + "=");
	if (indexFound === -1) { return ""; }
	parameters = PARAMETERS_RECEIVED.substring(indexSeparator + 1).substring(indexFound + parameterName.length + 1); //Using PARAMETERS_RECEIVED because maybe we do not want it lower case.
	if (parameters.indexOf("&") !== -1) { parameters = parameters.substring(0, parameters.indexOf("&")); }
	if (parameters.indexOf("#") !== -1) { parameters = parameters.substring(0, parameters.indexOf("#")); }
	return decodeURLValue(parameters);
}


//Pushes a new hash:
var hashPrevious = "";
var hashIdCounter = 0;
var hashIdCurrent = 0;
function hashPush(hashNew, force, useHashId, hashId)
{
	if (hashPrevious === hashNew && !force) { return; }
	
	ignoreHashChange = true;
	
	hashNew = trim(hashNew);
	if (hashNew === "") { hashNew = "#"; }
	
	if (useHashId)
	{
		hashId = trim(hashId);
		if (hashId === "") { hashId = hashIdCurrent = hashIdCounter++; }
		//else { return; }
	}
	
	if (typeof(history) !== "undefined" && history.pushState) { history.pushState(null, null, hashNew); }
	else { location.href = hashNew; }
	
	hashPrevious = hashNew;
	
	setTimeout(function() { ignoreHashChange = false; }, 100);
}


//Executed when hash changes:
var ignoreHashChange = false;
function onHashChangeFunction()
{
	if (ignoreHashChange) { return; }
	
	var hashCurrent = location.hash;

	ignoreHashChange = true;

	var	actionProcessed = false;
	if (hashCurrent !== hashPrevious)
	{
		var searchInput = getById("search_text");
		if (searchInput !== null)
		{
			//NOTE: to make it easier, it does not care about language in the hash (but in a deployment it probably should)..
			searchInput.value = getParameter(QUERY_PARAMETER, "#", true);
			Search.processAll();
		}
	}

	setTimeout(function() { ignoreHashChange = false; }, 100);
}