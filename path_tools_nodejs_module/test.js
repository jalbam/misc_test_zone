const pathTools = require("./path_tools.js");

/*
	TESTED ON (all working fine!):
		* Microsoft Windows 10 Pro x64 with Node.js v4.4.7
		* "Raspberry Pi Model B Revision 2.0 Mounting holes" with 512MB RAM (revision 000e) using Raspbian GNU/Linux 7 "wheezy" (Linux raspberrypi 4.1.19+ #858 armv6l GNU/Linux) with Node.js v0.6.19 (yes, very old!)
		* Oracle Solaris 11.3 X86 ("SunOS Solaris 5.11 11.3 i86pc i386 i86pc") with Node.js v5.12.0 [using VirtualBox 5.1.6 r110634 (Qt5.5.1) on Windows 10 Pro x64 as host]
		* Ubuntu Desktop 16.04.01 LTS "xenial" ("4.4.0-34-generic #53-Ubuntu x86_64 GNU/Linux") with Node.js v4.2.6 [using VirtualBox 5.1.6 r110634 (Qt5.5.1) on Windows 10 Pro x64 as host]
		* PC-BSD 10.3 (based on FreeBSD) with Node.js v0.12.14 (yes, very old!) [using VirtualBox 5.1.6 r110634 (Qt5.5.1) on Windows 10 Pro x64 as host]
		
	NOTES:
		* Using asynchronous way to prevent blocking, gain performance and take advantage of Node.js (since I/O operations are blocking).
		* The reason we see "\\" in dirnames on Windows platforms is because "\" is being escaped inside the string.
		* Order of filenames and dirnames is not considered important. Otherwise, we could change the read method to return the object with already sorted arrays if we wanted to.
		* This module will be case sensitive (even when testing on Windows platforms) to make it real cross-platform and provide always the same behaviour when used with same file/dir names.
*/

pathTools.DEBUG = false; //Set to true to see more annoying debug messages.

console.log("Calling pathTools.read...");

pathTools.read
(
	"./foo", //Directory to read.
	function(error, pathObject) //Callback:
	{
		console.log("\nInside the pathTools.read's callback");
		
		if (error) { throw new Error(error); }
		
		console.log("\nThis is the object returned:\n", pathObject);
		
		//Tests the object returned (order is not important since we will use sort method):
		var path = require("path");
		
		var filenamesExpected =
		[
			path.normalize("./foo/f1.txt"),
			path.normalize("./foo/f2.txt"),
			path.normalize("./foo/bar/bar1.txt"),
			path.normalize("./foo/bar/bar2.txt")
		];
		
		var dirnamesExpected =
		[
			path.normalize("./foo"),
			path.normalize("./foo/bar"),
			path.normalize("./foo/bar/baz")
		];
		
		//Sorts the arrays:
		pathObject.filenames = pathObject.filenames.sort();
		filenamesExpected = filenamesExpected.sort();
		pathObject.dirnames = pathObject.dirnames.sort();
		dirnamesExpected = dirnamesExpected.sort();
		
		
		//Check the arrays:
		var errors = false;
		
		console.log("\nFilenames expected: ", filenamesExpected);
		console.log("Filenames returned (sorted): ", pathObject.filenames);
		if (pathObject.filenames.length === filenamesExpected.length && pathObject.filenames.every(function(val, x) { return (val === filenamesExpected[x]); })) { console.log("* Filenames returned fine! ;)"); }
		else { console.log("* Filenames are wrong! :("); errors = true; }
		
		console.log("\nDirnames expected: ", dirnamesExpected);
		console.log("Dirnames returned (sorted): ", pathObject.dirnames);
		if (pathObject.dirnames.length === dirnamesExpected.length && pathObject.dirnames.every(function(val, x) { return (val === dirnamesExpected[x]); })) { console.log("* Dirnames returned fine! ;)"); }
		else { console.log("* Dirnames are wrong! :("); errors = true; }
		
		if (!errors) { console.log("\n[OK] ALL TESTS PASSED FINE! Congratulations ;)"); }
		else { console.log("\n[ERROR] Some tests were not successful. What a pity :P"); }
	}
);