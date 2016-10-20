var
	fs = require("fs"),
	path = require("path"),
	EventEmitter = require("events").EventEmitter;


exports.DEBUG = true;
	

//Reads a given directory and calls the callback with the object that contains filenames and dirnames:
exports.read = function (directory, callback, returnObject) //NOTE: I wanted to support very old Node.js versions (v0.6.19) in Raspberry Pi, otherwise we could use arrows: (directory, callback, returnObject) =>
{
	returnObject = returnObject || { filenames: [], dirnames: [] };
	
	//Reads the given directory (if able) asynchronously to avoid blocking:
	//NOTE: we could use a temporary cache but it is better to let the OS manage and decide this.
	fs.readdir
	(
		directory,
		function(error, files)
		{
			if (error)
			{
				showError("Error happenend when using fs.readdir: ", error);
				if (typeof(callback) === "function") { callback(error, returnObject); }
				else { throw new Error(error); }
			}
			
			var pending = files.length; 
			
			//Method called (just once) when all files and directories have been read:
			var ee = new EventEmitter();
			ee.once
			(
				"finishEvent",
				function ()
				{
					showError("! finishEvent called.");
					if (typeof(callback) === "function") { showError("@ Calling callback..."); callback(null, returnObject); } //NOTE: we could use sort method or any other way to sort the array if we wanted to.
				}
			);

			showError("* Pushing dir: " + path.normalize(directory));
			returnObject.dirnames.push(path.normalize(directory));
			
			files.forEach
			(
				function (fileName)
				{
					var filePath = path.join(directory, fileName); //Normalized full path (cross-platform).
					fs.stat
					(
						filePath,
						function(error, stat)
						{
							if (!error && stat) //Avoid throwing errors (this can be changed if this kind of error is considered important).
							{
								if (stat.isDirectory())
								{
									//Calls recursively:
									exports.read
									(
										filePath,
										function(error, returnObject)
										{
											pending--;
											if (pending <= 0) { ee.emit("finishEvent"); }
										},
										returnObject
									);
								}
								else //if (stat.isFile())
								{
									showError("* Pushing file: " + filePath);
									returnObject.filenames.push(filePath);
									pending--;
								}
							} else { showError("Possible error happenend when using fs.stat: ", error); }
						}
					);
				}
			);
			
			if (pending <= 0) { ee.emit("finishEvent"); }
		}
	);
};


function showError()
{
	if (!exports.DEBUG) { return; }
	console.log.apply(console, arguments);
}