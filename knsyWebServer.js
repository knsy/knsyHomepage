var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
//var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//setup handlebars for templated rendering
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 5000));
//app.set('port', 3000);

//setup POST body processing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//for locating addl data for templates
app.use(express.static(__dirname + '/public'));

//setting up sessions. minimum is just the secret that should be random and secret.
app.use(session({secret:'TheSecretThatShouldBeSecret',
				resave: true,
    saveUninitialized: true}));

//processing the GET requests
app.get('/', function(req,res){
	var getContext = {};
	res.render('knsyWebHome', getContext);
});

app.post('/', function(req,res){
	var getContext = {};
	res.render('knsyWebHome', getContext);
})

// weatherPage request
app.get('/weather', function(req,res){
	var getContext = {};
	res.render('weatherMap', getContext);
});



//--------------------------------POST LOGIN-------------------------------------------
//login server test	
/*
app.post('/login',function(req,res,next){
	var getContext = {};
	if(req.body){
		console.log(req.body);
	}
	//delete value
	//var parsedQuery = JSON.parse(req.body);
	//console.log(parsedQuery);
	var result = {login: false};
	
	if(req.body.username == '123'){
		result.login = true;
	}
	
	getContext = JSON.stringify(result);
	res.send(getContext);	
});
*/


//404 page if no page found
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

//500 page if everything broked on the server
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

