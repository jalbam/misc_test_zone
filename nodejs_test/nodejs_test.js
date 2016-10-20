console.log("Listening on port 8080");
require("http").createServer(function(request, response){
      for (var x = 0; x < 100; x++) {}
	  response.writeHeader(200, {"Content-Type": "text/plain"});  
        response.write("Hello World!");  
          response.end();
}).listen(8080);