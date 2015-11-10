var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

//funcion para crear token 
function createToken(user){
	var token = jsonwebtoken.sign({
		_id: user.id,
		name: user.name,
		username: user.username
		}, secretKey, {
			expirtesInMinute: 1440
			});
					
		return token;	
}



module.exports = function(app, express) {

	var api = express.Router();
	
	// save register users 
	api.post('/signup', function(req, res) {

		var user = new User ({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}
			res.json({ message: 'User has been created' });
		});

	});
	//call all users 
	api.get('/users', function(req, res){
		
		User.find({}, function(err, users){
			if(err){
				res.send(err);
				return;
			}
			res.json(users);
		});
	});
	
	// post login user por token
	api.post('/login', function(req, res){
		User.findOne({
			username: req.body.username
		}).select('password').exec(function(err, user){
			if(err) throw err;
			if(!user){
				res.send({message:"user doenst exit"});
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);
				
				if(!validPassword) {
					res.send({message: "invalid password"});
				}else{
					//token install npm install jsonwebtoken --save	
					var token = createToken(user);
					res.json({
						success: true,
						message: "Sucess login",
						token: token
					})
				}
			}
		})
	});
	
	//middleware para el login
	api.use(function(req, res, next){
		console.log("Somebody just came to our app!");
		var token = req.body.token || req.param('token')||req.headers['x-access-token'];
		// si existe un token
		if(token){
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err) {
					res.status(403).send({ success: false, message:"Failed to authenticate user"});
				} else {
					req.decoded = decoded;
					next();
				}				
			});
			
		} else {
			res.status(403).send({success: false, message: "No token provide"});
		}		
	});
	
	// destination B // provide a legitimate token para restringir el acesso a solo los logeado
	
	/*api.route('/', function(req, res){
		res.json("hello world");
	});*/
	api.route('/')
		.post(function(req, res){
			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content
			});
			story.save(function(err){
				if(err){
					res.send(err);
					return
				}
				res.json({message: "New Story Create!"});
			});
		})
		
		.get(function(req, res){
			Story.find({creator: req.decoded.id}, function(err, stories){
				if(err){
					res.send(err);
					return;					
				}
				res.json(stories);				
			});
		});
		
	api.get('/me', function(req, res){
		res.json(req.decoded);
	})
		
	return api
}