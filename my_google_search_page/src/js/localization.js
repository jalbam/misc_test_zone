"use strict"; //Using strict mode.


var LANGUAGES_AVAILABLE = CFG.LOCALIZATION.LANGUAGES_AVAILABLE; //Available languages.
var LANGUAGE_DEFAULT = CFG.LOCALIZATION.LANGUAGE_DEFAULT; //Default language when no other can be chosen.
var LOCALIZABLE_CLASS = CFG.LOCALIZATION.LOCALIZABLE_CLASS; //Class name for localizable elements.
var LOCALIZABLE_ATTRIBUTE_PREFIX = CFG.LOCALIZATION.LOCALIZABLE_ATTRIBUTE_PREFIX;
var allowNavigatorLanguages_DEFAULT = CFG.LOCALIZATION.allowNavigatorLanguages_DEFAULT; //Default value for allowNavigatorLanguages parameter.
var ignoreVariation_DEFAULT = CFG.LOCALIZATION.ignoreVariation_DEFAULT; //Default value for ignoreVariation parameter.

var languageCurrent = null; //It will keep the current language always.

//NOTE: for localization labels, edit config.js.


//Inserts the language selectors in the given element:
function insertAvailableLanguages(el)
{
	if (typeof(el) === "undefined" || el === null) { return; }
	var codeBuffer = "";
	//NOTE: to make it easier, it does not change the hash (but in a deployment it probably should).
	for (var languageCode in LANGUAGES_AVAILABLE)
	{
		codeBuffer += '<a href="#" id="language_' + languageCode + '" onClick="localizeAll(\'' + languageCode + '\'); return false;" class="language">' + LANGUAGES_AVAILABLE[languageCode] + '</a>'; //Faster than using createElement.
	}
	el.innerHTML = codeBuffer;
}


//Localizes all document with the given language:
function localizeAll(languageCode, allowNavigatorLanguages, ignoreVariation)
{
	languageCode = trim(languageCode).toUpperCase();
	if (languageCode === "" || typeof(LANGUAGES_AVAILABLE[languageCode]) === "undefined") { languageCode = getBestLanguage(LANGUAGES_AVAILABLE, allowNavigatorLanguages, ignoreVariation); }
	
	if (languageCode === languageCurrent) { return; }
	languageCurrent = languageCode;
	
	//Localizes whole document:
	//NOTE: to keep the code small I will loop all elements with LOCALIZABLE_CLASS class, although this is not the best method because of performance reasons.
	//NOTE 2: getting whole innerHTML of the document.body as a string and replace it will cause problems with old IE versions so this method will not be used.
	var allElements = getByClass(LOCALIZABLE_CLASS);
	var y, elementLoop, property, propertyReal, propertyValue;
	for (var x = 0, allElementsLength = allElements.length; x < allElementsLength; x++)
	{
		elementLoop = allElements[x];
		if (typeof(elementLoop) === "undefined" || elementLoop === null) { continue; }
		
		if (typeof(elementLoop.attributes) !== "undefined" && elementLoop.attributes !== null && elementLoop.attributes.length)
		{
			for (y = 0; y < elementLoop.attributes.length; y++)
			{
				if (typeof(elementLoop.attributes[y]) === "undefined" || elementLoop.attributes[y] === null) { continue; }
				property = propertyReal = trim(elementLoop.attributes[y].nodeName || elementLoop.attributes[y].name); //Using nodeName for old browsers.
				if (property === "" || typeof(elementLoop.attributes[y].nodeValue) === "undefined" && typeof(elementLoop.attributes[y].value) === "undefined") { continue; } //Using nodeValue for old browsers.
				propertyValue = typeof(elementLoop.attributes[y].nodeValue) !== "undefined" ? elementLoop.attributes[y].nodeValue : elementLoop.attributes[y].value; //With || will mess things in IE6.
				if (!isString(propertyValue) || trim(propertyValue) === "") { continue; }
				if (propertyReal.substring(0, LOCALIZABLE_ATTRIBUTE_PREFIX.length) === LOCALIZABLE_ATTRIBUTE_PREFIX) { propertyReal = property.replace(LOCALIZABLE_ATTRIBUTE_PREFIX, ""); }
				if (propertyReal.toLowerCase() === "innerhtml") { propertyReal = "innerHTML"; }
				try { elementLoop[propertyReal] = localizeString(propertyValue, languageCode); } catch (E) {} //Avoid displaying errors in some browsers where property cannot be modified. Necessary for modern browsers.
				try { elementLoop.setAttribute(propertyReal, localizeString(propertyValue, languageCode)); } catch (E) {} //Avoid displaying errors in some browsers where property cannot be modified. Necessary for IE6.
			}
		}
		
		//Some browsers do not let you access to innerText/textContent if the element is hidden, so tries to use innerHTML:
		//try { if (typeof(elementLoop.innerHTML) !== "undefined") { elementLoop.innerHTML = localizeString(elementLoop.innerHTML, languageCode); } } catch (E) { }
	}

	//Search again with the new language (if there was an active search):
	Search.processAll(undefined, true);
	
	//Unselects all languages except the selected one:
	var languageElement;
	for (var languageCodeLoop in LANGUAGES_AVAILABLE)
	{
		languageElement = getById("language_" + languageCodeLoop);
		if (languageElement !== null) { languageElement.className = "language" + (languageCode === languageCodeLoop ? " selected" : ""); }
	}
}


//Detects and returns the best language for the user (having in mind the available ones):
function getBestLanguage(languagesAllowed, allowNavigatorLanguages, ignoreVariation)
{
	if (typeof(languagesAllowed) === "undefined" || languagesAllowed === null) { languagesAllowed = LANGUAGES_AVAILABLE; }
	if (typeof(ignoreVariation) === "undefined" || ignoreVariation === null) { ignoreVariation = ignoreVariation_DEFAULT; }
	
	var clientLanguages = getClientLanguages(allowNavigatorLanguages);
	
	var languageLoop;
	for (var x = 0; x < clientLanguages.length; x++)
	{
		languageLoop = clientLanguages[x].toUpperCase();
		if (ignoreVariation) { languageLoop = languageLoop.split("-")[0]; }
		if (typeof(LANGUAGES_AVAILABLE[languageLoop]) !== "undefined") { return languageLoop; }
	}
	
	return LANGUAGE_DEFAULT;
}


//Returns languages supported by the client:
function getClientLanguages(allowNavigatorLanguages) //NOTE: server side can be better for this.
{
	if (allowNavigatorLanguages !== true && allowNavigatorLanguages !== false) { allowNavigatorLanguages = allowNavigatorLanguages_DEFAULT; }
	if (allowNavigatorLanguages && window.navigator.languages) { return window.navigator.languages; }
	var languages = [];
	if (window.navigator.language && indexOf(languages, window.navigator.language) === -1) { languages[languages.length] = window.navigator.language; }
	if (window.navigator.userLanguage && indexOf(languages, window.navigator.userLanguage) === -1) { languages[languages.length] = window.navigator.userLanguage; }
	if (window.navigator.browserLanguage && indexOf(languages, window.navigator.browserLanguage) === -1) { languages[languages.length] = window.navigator.browserLanguage; }
	if (window.navigator.systemLanguage && indexOf(languages, window.navigator.systemLanguage) === -1) { languages[languages.length] = window.navigator.systemLanguage; }
	if (languages.length > 0) { return languages; }
	else { return [LANGUAGE_DEFAULT]; }
}


//Localizes and returns a string given:
function localizeString(str, languageCode, avoidOtherLanguages)
{
	if (!isString(str)) { return ""; }
	for (var langLabelLoop in LANG)
	{
		str = str.replace(new RegExp("{{" + langLabelLoop + "}}", "gi"), localize(langLabelLoop, languageCode));
	}
	return str;
}


//Gets a localized string given its label:
function localize(index, languageCode, avoidOtherLanguages)
{
	index = trim(index).toUpperCase();
	languageCode = trim(languageCode).toUpperCase();
	if (languageCode === "" || typeof(LANGUAGES_AVAILABLE[languageCode]) === "undefined") { languageCode = languageCurrent; }
	
	if (typeof(LANG[index]) !== "undefined")
	{
		if (typeof(LANG[index][languageCode]) !== "undefined")
		{
			return LANG[index][languageCode];
		}
		else
		{
			var languageCodeBase = languageCode.split("-")[0];
			if (typeof(LANG[index][languageCodeBase]) !== "undefined")
			{
				return LANG[index][languageCodeBase];
			}
			else if (!avoidOtherLanguages && typeof(LANG[index][LANGUAGE_DEFAULT]) !== "undefined")
			{
				return LANG[index][LANGUAGE_DEFAULT];
			}
		}
	}

	return "";
}


//Returns a a string with a localized SPAN element given a label:
function localizeWithSpan(index, languageCode, avoidOtherLanguages)
{
	return '<span class="' + LOCALIZABLE_CLASS + '" ' + LOCALIZABLE_ATTRIBUTE_PREFIX + 'innerhtml="{{' + trim(index).toUpperCase() + '}}">' + localize(index, languageCode, avoidOtherLanguages) + '</span>';
}