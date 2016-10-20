"use strict"; //Using strict mode.


//Search static object:
var Search = function() { return Search; }; //Just in case someone tries to execute the class name or use new keyword.

Search.API_KEY = encodeURLValue(CFG.SEARCH_SERVICE.API_KEY);
Search.ENGINE_ID = encodeURLValue(CFG.SEARCH_SERVICE.ENGINE_ID);
Search.SERVER = CFG.SEARCH_SERVICE.SERVER;
Search.SEARCH_TYPE_PARAMETER = CFG.SEARCH_SERVICE.SEARCH_TYPE_PARAMETER;
Search.RETRIES = 2; //It will try to perform the search the first time and will try again this maximum number of retries if it fails.
Search.LINKS_TARGET = CFG.GENERAL.LINKS_TARGET;
Search.JSONP_FALLBACK = CFG.SEARCH_SERVICE.JSONP_FALLBACK;
Search.JSONP_FALLBACK_PARAMETER = CFG.SEARCH_SERVICE.JSONP_FALLBACK_PARAMETER;
Search.JSONP_FALLBACK_TIMEOUT_MS = CFG.SEARCH_SERVICE.JSONP_FALLBACK_TIMEOUT_MS;

Search._XHR = { "normal" : null, "image" : null }; //It will keep the XHR object to reuse it (this way, only allows one request per time).
Search._startPointer = { "normal" : null, "image" : null }; //It will keep the current "start" parameter.


//Processes the search form:
Search.processAll = function(query, force, avoidChangingHash)
{
	query = isString(query) ? query : trim(getById("search_text").value);
	
	if (!avoidChangingHash) { hashPush("#" + QUERY_PARAMETER + "=" + encodeURLValue(query)); } //NOTE: to make it easier, it does not push language in the hash (but in a deployment it probably should unless it was already present).
	
	Search.process(query, "normal", force);
	Search.process(query, "image", force);
	
	return false; //Returns false to avoid processing the event (in the case the method has been called from one).
}


Search._lastQuery = { "normal" : null, "image" : null };
Search.process = function(query, type, force, start, expectedNextPage, retry)
{
	//Gets the query desired:
	type = trim(type).toLowerCase();
	query = isString(query) ? query : trim(getById("search_text").value);
	if (query === "" || !force && query === Search._lastQuery[type]) { return false; } //Exits if the query is empty or the same as the previous one.
	Search._lastQuery[type] = query; //Stores the current query as the last one.

	window["_SearchProcessCallbackOk_" + type] = function() {}; //Cleans the previous callbackOk for the JSONP fallback (if any).
	
	if (typeof(retry) === "undefined" || retry === null || isNaN(retry) || retry < 0) { retry = 0; }
	if (typeof(start) === "undefined" || start === null || isNaN(start) || start < 1) { start = 1; }
	if (start === 1) { Search._startPointer[type] = 1; }

	//If it is the first search (first page), removes any possible previous results:
	if (start === 1) { getById((type === "image" ? "images" : "webs") + "_container").innerHTML = ""; }

	//Hides the "MORE" button (if showing) and the error message (if any):
	getById((type === "image" ? "images" : "webs") + "_more_button").style.display = "none";
	getById((type === "image" ? "images" : "webs") + "_error").style.display = "none";
	
	//Shows the wait message (it would have been better to use a class named "wait"):
	getById((type === "image" ? "images" : "webs") + "_wait").style.display = "block";

	//Calculates the search URL:
	var url = Search.SERVER.replace("{{key}}", Search.API_KEY).replace("{{cx}}", Search.ENGINE_ID).replace("{{q}}", encodeURLValue(query)).replace("{{hl}}", languageCurrent.toLowerCase()).replace("{{start}}", start);
	if (type === "image") { url += "&" + Search.SEARCH_TYPE_PARAMETER.replace("{{searchType}}", type); }
	else { type = "normal"; }

	//Processes the search call by XHR (AJAX):
	Search._XHR[type] = CB_XHR.call
	(
		"GET", //method.
		url, //url.
		null, //variables.
		null, //headers.
		null, //mimeType.
		"text", //responseType (using "text" instead of "json" for old browsers).
		null, //callbackFunction.
		function(XHR, callbackFunctionError) { Search._show(XHR.responseText, type, start, expectedNextPage, XHR); }, //callbackFunctionOK.
		function(XHR) //callbackFunctionError:
		{
			Search._lastQuery[type] = null; //It will allow performing the same query again.
			if (retry < Search.RETRIES)
			{
				Search.process(query, type, true, start, expectedNextPage, ++retry);
				return;
			}
			
			//If desired, performs a JSON-P call (it will fail after a timeout):
			var failFunctionCalled = false;
			var failFunction = function(withoutFallback)
			{
				if (failFunctionCalled) { return; }
				failFunctionCalled = true;
				var response = parseJSON(XHR.responseText, false, true, false);
				if (response === null) { response = {}; }
				if (!withoutFallback) { response.usingJSONPFallback = true; }
				Search._failed(response, type, start, expectedNextPage, XHR);
			};
			if (Search.JSONP_FALLBACK)
			{
				var failFunctionTimeout = setTimeout(failFunction, Search.JSONP_FALLBACK_TIMEOUT_MS);
				window["_SearchProcessCallbackOk_" + type] = function(response)
				{
					clearTimeout(failFunctionTimeout);
					if (failFunctionCalled) { return; }
					if (typeof(response) === "undefined" || response === null) { response = {}; }
					response.usingJSONPFallback = true;
					Search._show(response, type, start, expectedNextPage, XHR, true);
				};
				var scriptTag = lazyLoad(url + "&" + Search.JSONP_FALLBACK_PARAMETER.replace("{{callback}}", "_SearchProcessCallbackOk_" + type));
				//NOTE: after the timeout or success callbacks (or when Search.process is called again for the same type), it would be nice to remove the script (scriptTag) from the DOM.
				return;
			}
			//...otherwise, just fails:
			else { failFunction(true); }
		},
		true, //asynchronous.
		[200, 206], //allowedSuccessStatuses.
		Search._XHR[type] //XHR.
	);

	return false; //Returns false to avoid processing the event (in the case the method has been called from one).
}


//Loads next page (if any):
Search._processNextPage = function(type)
{
	return Search.process(undefined, type, true, Search._startPointer[type], true);
}


//Shows the results:
Search._show = function(response, type, start, expectedNextPage, XHR, avoidParsing)
{
	if (!avoidParsing) { response = parseJSON(response, false, true, false); }
	if (response === null || typeof(response.items) === "undefined" || response.items === null || !isArray(response.items)) { return Search._failed(response || null, type, start, expectedNextPage, XHR); }

	//Hides the wait message:
	getById((type === "image" ? "images" : "webs") + "_wait").style.display = "none";
	
	var container = getById((type === "image" ? "images" : "webs") + "_container");
	
	if (response.items.length === 0)
	{
		if (start === 1) { container.innerHTML = localizeWithSpan("SEARCH_NOTHING_FOUND"); }
		else { container.innerHTML += localizeWithSpan("SEARCH_NO_MORE_RESULTS"); }
		return;
	}

	var buffer = "";
	var processFunction = type === "image" ? Search._showImage : Search._showWeb;
	for (var x = 0; x < response.items.length; x++)
	{
		buffer += processFunction(response.items[x]); //NOTE: using strings in a string buffer because it is faster than document.createElement.
	}
	
	//If there are no more pages, shows the "MORE" button:
	if (response.queries && response.queries.nextPage)
	{
		getById((type === "image" ? "images" : "webs") + "_more_button").style.display = "block";
	}
	//...otherwise, hides it:
	else
	{
		getById((type === "image" ? "images" : "webs") + "_more_button").style.display = "none";
	}
	
	var newResultsContainer = document.createElement("div");
	newResultsContainer.innerHTML = buffer;
	container.appendChild(newResultsContainer);
	
	Search._startPointer[type] += response.items.length;
}


//Show an image item:
Search._showImage = function(imageObject)
{
	/*
		imageObject:
		{
			htmlTitle: string/HTML,
			link: string,
			displayLink: string,
			htmlSnippet: string/HTML,
			image:
			{
				contextLink: string,
				height: int,
				width: int,
				byteSize: int,
				thumbnailLink: string,
				thumbnailWidth: int,
				thumbnailHeight: int
			}
		}
	*/
	
	var code = ""; //NOTE: if the performance was too important, we could use just one string the optimize it.
	code += '<div class="image_container">';
		code += '<a href="' + imageObject.link + '" class="link" target="' + Search.LINKS_TARGET + '">';
			//NOTE: first tries using imageObject.image.thumbnailLink (GSTATIC over HTTPS), if it fails (IE8 does not support images through HTTPS by default) then it tries imageObject.link. If it fails again, class is "error".
			code += '<img src="' + imageObject.image.thumbnailLink + '" style="width:' + imageObject.image.thumbnailWidth + 'px; height:' + imageObject.image.thumbnailHeight + 'px;" class="image loading" onLoad="this.className=\'image\';" onError="this.src=\'' + imageObject.link + '\'; this.onerror=function() { this.className=\'image error\'; }" />';
		code += '</a>';
	code += '</div>';
	return code;
}


//Show a website item:
Search._showWeb = function(webObject)
{
	//webObject: { htmlTitle: string/HTML, link: string, displayLink: string, htmlSnippet: string/HTML }
	var code = ""; //NOTE: if the performance was too important, we could use just one string the optimize it.
	code += '<div class="web_container">';
		code += '<a href="' + webObject.link + '" class="title" target="' + Search.LINKS_TARGET + '">';
			code += webObject.htmlTitle;
			code += '<div class="link">' + webObject.displayLink + '</div>';
		code += '</a>';
		code += '<div class="snippet">' + webObject.htmlSnippet + '</div>';
	code += '</div>';
	return code;
}



//Executed when the search has failed:
Search._failed = function(response, type, start, expectedNextPage, XHR)
{
	//If desired, shows the error window:
	if (CFG.SHOW_ERROR_WINDOW_ON_SEARCH_FAIL) { errorWindowShow(localize("SEARCH_ERROR")); }
	
	//Shows the error (appened to the end if there are any previous results):
	getById((type === "image" ? "images" : "webs") + "_error").style.display = "block";
	getById((type === "image" ? "images" : "webs") + "_wait").style.display = "none"; //Hides the wait message.

	//If the user wanted to load the next page, shows the "MORE" button to let it try again:
	if (expectedNextPage) { getById((type === "image" ? "images" : "webs") + "_more_button").style.display = "block"; }
	
	//Calls the error handler (executed at the end because the handler will call alert in browsers without console support and in many of them alert is blocking and would stop the previous instructions otherwise):
	errorHandler("SEARCH_ERROR_" + type.toUpperCase(), { response: response, type: type, start: start, expectedNextPage: expectedNextPage, XHR: XHR });
}