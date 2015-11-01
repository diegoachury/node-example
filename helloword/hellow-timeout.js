var http = require('http');

http.createServer(function( request, response){
	response.writeHead(200);
	response.write("Dog is running.");

	setTimeout(function(){
		response.write("Dog is done");
		response.end();
	}, 15000);

}).listen(8080);


 /* setTimeout
	es un metodo que es utilizado para ejecutar una funcion en un tiempo determinado. en este caso se ecuentra 5000
	milisegundos que equivalen a 5 segundos.
 */