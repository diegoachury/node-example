var http = require('http');
var fs = require ('fs');

http.createServer(function(request, response){
	request.pipe(response);
}).listen(8080);