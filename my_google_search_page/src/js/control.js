"use strict"; //Using strict mode.


//Define key codes:
var KEYS = //NOTE: this could be in config.js
{
	"UP" :
	[
		38, //Standard for keyboards, Smart TV Alliance standard, Samsung Tizen TV, Amazon Fire TV, many other remote controllers, some video game consoles (gamepads), etc.
		175, //Nintendo Wii (Wiimote) - D-PAD: UP (also scrolls up). Note: same code as "VOL_UP" key.
		29460 //Old Samsung TV.
	], 
	"DOWN" :
	[
		40, //Standard for keyboards, Smart TV Alliance standard, Samsung Tizen TV, Amazon Fire TV, many other remote controllers, some video game consoles (gamepads), etc.
		176, //Nintendo Wii (Wiimote) - D-PAD: DOWN (also scrolls down). Note: same code as "VOL_UP" key.
		29461 //Old Samsung TV.
	], 
	"LEFT" :
	[
		37, //Standard for keyboards, Smart TV Alliance standard, Samsung Tizen TV, Amazon Fire TV, many other remote controllers, some video game consoles (gamepads), etc.
		178, //D-PAD LEFT (also scrolls left). Note: same code as "MEDIA_STOP" key.
		4 //Old Samsung TV.
	], 
	"RIGHT" :
	[
		39, //Standard for keyboards, Smart TV Alliance standard, Samsung Tizen TV, Amazon Fire TV, many other remote controllers, some video game consoles (gamepads), etc.
		177, //D-PAD RIGHT (also scrolls right). Note: same code as "MEDIA_BACK" key.
		5 //Old Samsung TV.
	], 
	"OK" :
	[
		13, //Standard for keyboards ("ENTER" key), Smart TV Alliance standard, Samsung Tizen TV, Amazon Fire TV, many other remote controllers, some video game consoles (gamepads), etc.
		//10, //Safari Mobile (probaby old). Source: http://mscerts.programming4.us/programming/coding%20javascript%20for%20mobile%20browsers%20%28part%2011%29.aspx
		29443 //Old Samsung TV.
	]
}


//Called when a key/button (from a keyboard, remote controller, some gamepads...) is pressed:
function keyPressed(e)
{
	//Gets the key code (having in mind old and special clients):
	var keyCode = null;
	if (e.keyCode) { keyCode = e.keyCode; }
	else if (e.key && typeof(e.key) === "number") { keyCode = e.key; } //For SLCanvas.
	else if (window.Event && e.which) { keyCode = e.which; }
	else if (typeof(e.charCode) === "number") { keyCode = e.charCode; }
	
	//If the key pressed is "UP":
	if (indexOf(KEYS.UP, keyCode) !== -1)
	{
		//TODO.
	}
	//...otherwise, if the key pressed is "DOWN":
	else if (indexOf(KEYS.DOWN, keyCode) !== -1)
	{
		//TODO.
	}
	//...otherwise, if the key pressed is "LEFT":
	else if (indexOf(KEYS.LEFT, keyCode) !== -1)
	{
		//TODO.
	}
	//...otherwise, if the key pressed is "RIGHT":
	else if (indexOf(KEYS.RIGHT, keyCode) !== -1)
	{
		//TODO.
	}
	//...otherwise, if the key pressed is "OK":
	else if (indexOf(KEYS.OK, keyCode) !== -1)
	{
		//TODO.
	}
}