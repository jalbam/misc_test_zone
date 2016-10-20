"use strict"; //Using strict mode.


//Static class to manage XHR (AJAX):
var CB_XHR = function() { return CB_XHR; }; //Just in case someone tries to execute the class name or use new keyword.
{
	//Returns an AJAX object:
	//var CB_XHR._getXmlHttpVersionsIE = ["Msxml2.XMLHTTP.7.0", "MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
	CB_XHR._getXmlHttpVersionsIE = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //XmlHttpVersions in order of preference for old IE versions.
	CB_XHR._getXmlHttpVersionsIELastIndexWorked = null; //Defines the last index of CB_XmlHttpVersion that worked (for optimization).
	CB_XHR.get = function()
	{
		if (typeof XMLHttpRequest !== "undefined") //if (window.XMLHttpRequest).
		{
			return new XMLHttpRequest();
		}
		else if (typeof(ActiveXObject) !== "undefined")
		{
			if (CB_XHR._getXmlHttpVersionsIELastIndexWorked !== null)
			{
				return new ActiveXObject(CB_XHR._getXmlHttpVersionsIE[CB_XHR._getXmlHttpVersionsIELastIndexWorked]);
			}
			else
			{
				var XHR = null;
				for (var x = 0, getXmlHttpVersionsIELength = CB_XHR._getXmlHttpVersionsIE.length; x < getXmlHttpVersionsIELength; x++)
				{
					try
					{
						XHR = new ActiveXObject(CB_XHR._getXmlHttpVersionsIE[x]);
						CB_XHR._getXmlHttpVersionsIELastIndexWorked = x; //Defines this index as the last working one (for optimization).
						return XHR;
					}
					catch (e) {}
				}
				return null;
			}
		}
		return null;
	}


	//Gets an AJAX connection:
	CB_XHR.call = function(method, url, variables, headers, mimeType, responseType, callbackFunction, callbackFunctionOK, callbackFunctionError, asynchronous, allowedSuccessStatuses, XHR)
	{
		var failFunction = function(XHR)
		{
			if (typeof(callbackFunction) === "function") { callbackFunction(XHR); }
			else if (typeof(callbackFunctionError) === "function") { callbackFunctionError(XHR); }
		};
		
		//If the URL is empty, exits the function:
		url = trim(url);
		if (url === "")
		{
			failFunction({ readyState: 4, status: 500, errorMessage: "URL is empty", originalXHR: XHR });
			return null;
		}

		//If not given, sets the default parameters:
		method = trim(method).toUpperCase();
		if (method === "")
		{
			method = "POST"; //Request method by default.
		}

		if (typeof(headers) !== "object" || headers === null) //Sets headers by default:
		{
			headers = {};
		}
		mimeType = trim(mimeType); //If it was unset or null, it will be an empty string.
		responseType = trim(responseType).toLowerCase(); //If it was unset or null, it will be an empty string.
		if (typeof(asynchronous) === "undefined" || asynchronous === null) { asynchronous = true; } //Async by default.

		//By default, allows 200 success status only:
		if (!isArray(allowedSuccessStatuses)) { allowedSuccessStatuses = [200]; }
		
		//Creates the AJAX object:
		if (typeof(XHR) === "undefined" || XHR === null || !XHR) { XHR = CB_XHR.get(); }
		
		//If the XHR object is null, exits the function:
		if (XHR === null)
		{
			failFunction({ readyState: 4, status: 500, errorMessage: "XHR is null", originalXHR: XHR });
			return null;
		}

		//Processes the variables (if any):
		if (typeof(variables) !== "undefined" && variables !== null && !isString(variables)) //If variables is not a string, we assume it is JSON data.
		{
			variables = JSON.stringify(variables);
		}
		else
		{
			variables = trim(variables);
			
			//If there are variables and the method is GET, it adds them to the URL:
			if (variables !== "" && method === "GET")
			{
				if (indexOf(url, "?") === -1) { url += "?" + variables; } //There was not ? symbol in the URL, so we add it.
				else { url += "&" + variables; } //There was ? symbol in the URL, so we add the & symbol.
			}
		}
		
		//Opens the connection:
		try //Using try-catch to avoid problems with IE5.5:
		{
			XHR.open(method, url, asynchronous);
		}
		catch (E)
		{
			var originalXHR = XHR;
			try
			{
				XHR.readyState = 4;
				XHR.status = 500;
				XHR.errorMessage = "Failed when using open method";
			} catch (E) { XHR = { readyState: 4, status: 500, errorMessage: "Failed when using open method", originalXHR: XHR }; }
			failFunction(XHR);
			return originalXHR;
		}

		//Applies the given headers (if any):
		for (var headerName in headers)
		{
			XHR.setRequestHeader(headerName, headers[headerName]);
		}

		//Applies the given mime type (if any):
		if (XHR.overrideMimeType && mimeType !== "")
		{
			XHR.overrideMimeType(mimeType);
		}
		
		//Applies the given response type (if any):
		if (typeof(XHR.responseType) !== "undefined" && responseType !== "")
		{
			XHR.responseType = responseType;
		}

		//If set, defines the callback function:
		if (typeof(callbackFunction) === "function")
		{
			XHR.onreadystatechange = function() { callbackFunction(XHR); };
		}
		//...otherwise, defines the callback functions for OK and error status:
		else
		{
			XHR.onreadystatechange = function()
			{
				if (XHR.readyState === 4)
				{
					if (indexOf(allowedSuccessStatuses, parseInt(XHR.status)) !== -1)
					{
						if (typeof(callbackFunctionOK) === "function") { callbackFunctionOK(XHR, callbackFunctionError); }
					}
					else if (typeof(callbackFunctionError) === "function") { callbackFunctionError(XHR); }
				}
			}
		}

		//Sends the XHR request:
		XHR.send(variables);
		
		//Returns the XHR object:
		return XHR;
	}
}