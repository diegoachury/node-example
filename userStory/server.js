var express = 		require('express');
var bodyParser = 	require('body-parser');
var morgan = 		require('morgan');
var config =		require('./config');
var mongoose = 		require('mongoose');

var app = express();

//db
mongoose.connect(config.database, function(err) {
	if(err){
		console.log(err);
	} else {
		console.log("conectado a la base de datos");
	}
});

//bodyparse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// esto no renderiza todo lo que existe en la carpeta public view 
app.use(express.static(__dirname + '/public'));

//configurando api
var api = require('./app/routes/api')(app, express);
app.use('/api', api);

//rutas
app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/views/index.html');
})


app.listen(config.port, function(err){
	if(err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});