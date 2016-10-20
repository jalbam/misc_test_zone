"use strict"; //Using strict mode.


//Alias for document.getElementById:
function getById(id)
{
	return document.getElementById(id);
}


//Trims a string:
function trim(str)
{
	if (!str) { str = ""; }
	else { str += ""; } //Using casting to assure str will be a string.
	return str.replace(/^\s+|\s+$/g, "");
}


//Returns whether a variable is an array or not (polyfill of isArray method):
function isArray(variable, extendedDOM)
{
	if (typeof(variable) === "undefined" || variable === null) { return false; }
	
	var isArr = false;
	if (Array)
	{
		if (Array.isArray && !extendedDOM)
		{
			isArr = Array.isArray(variable);
		}
		else
		{
			isArr = variable instanceof Array;
			if (!isArr) //It could still be an Array from another frame.
			{
				isArr = (Object.prototype.toString.call(variable) === '[object Array]');
			}
		}
	}

	return isArr;
}


//Returns whether a variable is a string or not:
function isString(str)
{
	return (typeof(str) === "string" || str instanceof String);
}


//Implementation of indexOf method for arrays in browsers that doesn't support it natively:
//* Polyfill source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
function indexOf(that, searchElement, fromIndex, extendedDOM)
{
	if (Array.prototype.indexOf && !extendedDOM) { return Array.prototype.indexOf.call(that, searchElement, fromIndex); }

	if (typeof(that) === "undefined" || that === null)
	{
		throw new TypeError( '"that" is null or not defined' );
	}

	var length = that.length >>> 0; // Hack to convert object.length to a UInt32

	fromIndex = +fromIndex || 0;

	if (Math.abs(fromIndex) === Infinity) { fromIndex = 0; }

	if (fromIndex < 0)
	{
		fromIndex += length;
		if (fromIndex < 0) { fromIndex = 0; }
	}

	for (;fromIndex < length; fromIndex++)
	{
		if (that[fromIndex] === searchElement)
		{
			return fromIndex;
		}
	}

	return -1;
}


//Polyfill for browsers that do not support getElementsByClassName:
function getByClass(className, baseElement)
{
	if (typeof(baseElement) === "undefined" || baseElement === null) { baseElement = document; }
	
	//If no class name is sent, returns am empty array:
	className = trim(className);
	if (className === "") { return []; }
	
	if (typeof(baseElement.getElementsByClassName) !== "undefined" && baseElement.getElementsByClassName !== null)
	{
		return baseElement.getElementsByClassName(className);
	}
	else if (baseElement.querySelectorAll)
	{
		return baseElement.querySelectorAll("." + className.replace(/ /g, "."));
	}
	else if (document.querySelectorAll)
	{
		return document.querySelectorAll("." + className.replace(/ /g, "."));
	}
	else
	{
		//Obtains all elements:
		var allElements = getByTag("*", baseElement);

		//If any elements were obtained, we select just the ones with the desired class name:
		var allElementsLength = allElements.length;
		if (allElementsLength > 0)
		{
			var elementsFound = [];

			//TODO: make it compatible with regular expressions (be careful with browsers not compatible with RegExp!).
			var classesDesired = className.split(" ");
			var classesDesiredLength = classesDesired.length;
			for (var x = 0; x < classesDesiredLength; x++)
			{
				classesDesired[x] = trim(classesDesired[x]);
			}
			
			var elementCurrent;
			var elementCurrentClass;
			var classes;
			var classesLength;
			var y, z;
			var allClassesFound;
			for (x = 0; x < allElementsLength; x++)
			{
				elementCurrent = allElements[x];
				if (elementCurrent !== null)
				{
					elementCurrentClass = trim(elementCurrent.className);
					if (elementCurrentClass === "") { continue; }
					classes = elementCurrentClass.split(" ");
					classesLength = classes.length;
					for (y = 0; y < classesLength; y++)
					{
						classes[y] = trim(classes[y]);
					}

					allClassesFound = true;
					for (z = 0; z < classesDesiredLength; z++)
					{
						if (indexOf(classes, classesDesired[z]) === -1)
						{
							allClassesFound = false;
							break;
						}
					}
					
					if (allClassesFound)
					{
						elementsFound[elementsFound.length] = elementCurrent;
					}
				}
			}
			
			return elementsFound;
		}
	}

	return [];
}


//Polyfill for browsers that do not support getElementsByTagName:
function getByTag(tagName, baseElement)
{
	if (typeof(baseElement) === "undefined" || baseElement === null) { baseElement = document; } //Uses document as default base element.
	
	//If no tag name is sent, uses "*" (all) by default:
	tagName = trim(tagName).toLowerCase();
	if (tagName === "") { tagName = "*"; }
	
	if (typeof(baseElement.getElementsByTagName) !== "undefined" && baseElement.getElementsByTagName !== null)
	{
		var elementsFound = baseElement.getElementsByTagName(tagName);
		if (tagName === "*" && elementsFound.length === 0 && typeof(document.all) !== "undefined" && document.all !== null)
		{
			elementsFound = document.all;
		}
		return elementsFound;
	}
	else if (baseElement.querySelectorAll)
	{
		return baseElement.querySelectorAll(tagName);
	}
	else if (document.querySelectorAll)
	{
		return document.querySelectorAll(tagName);
	}
	else if (typeof(baseElement.all) !== "undefined" && baseElement.all !== null)
	{
		if (tagName === "*") { return baseElement.all; }
		else { return baseElement.all.tags(tagName); }
	}
	else if (typeof(document.all) !== "undefined" && document.all !== null)
	{
		if (tagName === "*") { return document.all; }
		else { return document.all.tags(tagName); }
	}
	else if (baseElement.layers || document.layers)
	{
		var elementsFound = [];

		var allElements = baseElement.layers || document.layers;
		
		//If we want all elements, then we get all of them:
		if (tagName === "*") { elementsFound = allElements; }
		//...otherwise, obtains all elements with the given tag name:
		else
		{
			//If any elements were obtained, we select just the ones with the desired tag name:
			var allElementsLength = allElements.length;
		
			var elementCurrent;
			for (var x = 0; x < allElementsLength; x++)
			{
				elementCurrent = allElements[x];
				if (elementCurrent !== null && typeof(elementCurrent.tagName) !== "undefined")
				{
					if (trim(elementCurrent.tagName).toLowerCase() === tagName)
					{
						elementsFound.push(elementCurrent);
					}
				}
			}
		}
		return elementsFound;
	}

	return [];
}


//Tries to parse a string to convert it to a JSON object (returns the original or an empty object if it fails):
function parseJSON(string, originalOnFail, nullOnFail, allowUndefinedOrNull, onError)
{
	if (typeof(string) === "undefined" || string === null)
	{
		if (allowUndefinedOrNull) { string = '{}'; }
	}
	
	string = string + "";
	try
	{
		if (typeof(JSON) !== "undefined" && JSON !== null && typeof(JSON.parse) === "function") { return JSON.parse(string); }
		else { return eval("(" + string + ")"); }
	}
	catch (e)
	{
		if (typeof(onError) === "function") { onError(string); }
		if (originalOnFail) { return string; }
		else if (nullOnFail) { return null; }
		else { return {}; }
	}
}


//Encodes a URL value:
function encodeURLValue(value)
{
	if (typeof(encodeURIComponent) !== "undefined") { return encodeURIComponent(value); }
	else { return escape(value); }
}


//Decodes a URL value:
function decodeURLValue(value)
{
	if (typeof(decodeURIComponent) !== "undefined") { return decodeURIComponent(value); }
	else { return unescape(value); }
}


//Returns an object as a string (for those browsers without JSON.stringify support or when we want to have a limit of levels):
function getObjectAsString(desiredObject, avoidRecursive, levelMax, levelCurrent)
{
	var info = "{ ";
	if (typeof(levelMax) === "undefined" || levelMax === null || isNaN(levelMax)) { levelMax = 10; }
	if (typeof(levelCurrent) === "undefined" || levelCurrent === null || isNaN(levelCurrent)) { levelCurrent = 0; }
	for (var property in desiredObject)
	{
		if (sizeOf(desiredObject[property]) === 0 || isString(desiredObject[property]))
		{
			info += property + ": " + desiredObject[property] + ", ";
		}
		else if (!avoidRecursive && levelCurrent < levelMax)
		{
			info += property + ": " + getObjectAsString(desiredObject[property], avoidRecursive, levelMax, ++levelCurrent) + ", ";
		}
	}
	
	if (info.substring(info.length - 2) === ", ") { info = info.substring(0, info.length - 2); }
	
	info += " }";
	return info;
}


//Returns the size of an object or array:
function sizeOf(object, onlyOwn)
{
    var size = 0;
    if (isArray(object) && typeof(object.length) !== "undefined" && object.length !== null && !isNaN(object.length)) { return object.length; }
	for (var key in object)
	{
        if (!onlyOwn) { size++; }
		else if (object.hasOwnProperty(key)) { size++; }
    }
    return size;
}


//Lazy loads a script given:
function lazyLoad(filepath, callbackOk, callbackTimeout, timeoutMs)
{
	var parentElement = document.getElementsByTagName('head') || document.head || document.getElementsByTagName('body') || document.body || document.documentElement;
	if (parentElement && typeof(parentElement[0]) === "undefined") { parentElement = [parentElement]; }
	if (typeof(parentElement) === "undefined" || parentElement === null || typeof(parentElement[0]) === "undefined" || parentElement[0] === null)
	{
		if (typeof(callbackTimeout) === "function") { callbackTimeout(filepath, callbackOk, callbackTimeout, timeoutMs); }
		return null;
	}
	parentElement = parentElement[0];

    var scriptTag = document.createElement('script');
    scriptTag.src = filepath;
    scriptTag.language = "javascript";
	scriptTag.type = "text/javascript";
	parentElement.appendChild(scriptTag);

	var onLoadFunctionExecuted = false;
	var onLoadFunction =
		function()
		{
			this.onreadystatechange = this.onload = null;
			setTimeout
			(
				function()
				{
					if (timeoutExecuted) { return; } //Exists if the timeout has already been executed.
					onLoadFunctionExecuted = true;

					//If defined, calls the OK function:
					if (typeof(callbackOk) === "function") { callbackOk(filepath, callbackOk, callbackTimeout, timeoutMs); }
				},
				10
			);
		};
		
	if (scriptTag.readyState)
	{
		scriptTag.onreadystatechange =
			function()
			{
				var rs = this.readyState;
				if (rs === "loaded" || rs === "complete") { onLoadFunction(); }
			};
	}
	else { scriptTag.onload = onLoadFunction; }
	
	//Starts counting for the timeout:
	var timeoutExecuted = false;
	var callbackTimeoutTimeout = setTimeout
	(
		function()
		{
			if (onLoadFunctionExecuted) { return; } //Exists if the onLoadFunction has been already executed.
			timeoutExecuted = true;
			if (typeof(callbackTimeout) === "function") { callbackTimeout(filepath, callbackOk, callbackTimeout, timeoutMs); }
		},
		timeoutMs
	);
	
	return { scriptElement: scriptTag, timeoutFailure: callbackTimeoutTimeout };
}