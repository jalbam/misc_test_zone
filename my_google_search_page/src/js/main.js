"use strict"; //Using strict mode.


//Function called when there is an important error:
function errorHandler(errorId, errorData)
{
	if (!CFG.GENERAL.DEBUG) { return; }
	//TODO: here we could call a server to register the error or do any other thing we wanted. This is just an example.
	if (typeof(console) !== "undefined" && typeof(console.log) === "function") { console.log("ERROR: " + errorId + ". Data:", errorData); }
	else { alert("ERROR: " + errorId + "\n\nData:\n" + getObjectAsString(errorData, false, 10)); }
}


//Shows the wait window:
function waitWindowShow()
{
	getById("wait_window").className = "";
}


//Hides the wait window:
function waitWindowHide()
{
	getById("wait_window").className = "hidden";
}


//Shows the error window (including a desired message, if any):
function errorWindowShow(message)
{
	message = trim(message);
	if (message !== "") { getById("error_message").innerHTML = message; }
	getById("error_window").className = "";
}


//Hides the error window:
function errorWindowHide()
{
	getById("error_window").className = "hidden";
}


//Main function to load at the beginning:
function init()
{
	//Sets the event handlers:
	getById("search_form").onsubmit = Search.processAll; //I use onSubmit instead of onClick event because some old browsers will not fire the latter when a mouse is not being used (e.g., when RETURN key is pressed).
	getById("error_button").onclick = errorWindowHide;
	getById("images_more_button").onclick = function() { Search._processNextPage("image"); };
	getById("webs_more_button").onclick = function() { Search._processNextPage("normal"); };
	window.onkeydown = keyPressed;
	window.onlanguagechange = localizeAll;
	if (typeof(history.pushState) !== "undefined") { window.onpopstate = onHashChangeFunction; }
	else if (typeof(window.onhashchange) !== "undefined") { window.onhashchange = onHashChangeFunction; }
	
	//Fills the language selector with the available languages:
	insertAvailableLanguages(getById("languages"));
	
	//If any query parameter has been received (NOTE: does not need to perform a search because localizeAll will call Search.processAll method already):
	var searchInput = getById("search_text");
	if (queryParameterReceived !== "")
	{
		//Places the desired query text in the input text:
		searchInput.value = queryParameterReceived;
	}
	
	//Localizes all the document with the desired/best language:
	localizeAll(languageParameterReceived); //Tries to use the language sent by parameter (if any) or it will calculate the best one otherwise.

	getById("wait_message").style.display = "block"; //Shows the wait message (before localizing it, it was a language label).
	
	//Focus the input text to make it easier for the user:
	searchInput.focus();
	
	//Hides the "wait" element and sets the body visible (to prevent users from sending the form when CSS and/or JS is not ready yet):
	waitWindowHide();
}


//Calls the main function when the page loads:
window.onload = init;