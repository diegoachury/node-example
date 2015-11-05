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

//configurando api
var api = require('./app/routes/api')(app, express);
app.use('/api', api);

//rutas
app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/view/index.html');
})


app.listen(config.port, function(err){
	if(err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});