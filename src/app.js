// Require

var express = require('express');
var pug = require('pug');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');

// App

var app = express();

// Use

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Set

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// HTTP get

app.get('/', function(req, res){
	res.render('index');
});

app.get('/users', function(req, res){
fs.readFile('./users.json', 'utf8', function(err, data){
	var content;
	if(err){
		throw "Error!";
	}
var parsedJson = JSON.parse(data);
var listUsers =[];

for(var i = 0; i < parsedJson.length; i++){
	listUsers.push(parsedJson[i].firstname
		)};
res.render('users', {all: listUsers});
});
});

app.get('/searchuser', function(req, res){
	res.render('searchuser')
});

app.get("/newuser", function(req, res){
	res.render('newuser');
});

// HTTP post

app.post('/search_user', function(req, res){
fs.readFile('./users.json', 'utf8', function(err, data){
	if(err){
		throw "Error!";
	}
var parsedJson = JSON.parse(data);
var matching_users = [];
for(var i = 0; i < parsedJson.length; i++){
if(req.body.search_bar.toLowerCase() === parsedJson[i].firstname.toLowerCase() || req.body.search_bar.toLowerCase() === parsedJson[i].lastname.toLowerCase()){
	matching_users.push(parsedJson[i].firstname + " " + parsedJson[i].lastname)};
}
res.render('matchinguser', {a: matching_users});
}); 
});

app.post('/new_user', function(req, res){
fs.readFile('./users.json', 'utf8', function(err, data){
	var listUsers;
	if(err){
		throw "Error!";
	}
var parsedJson = JSON.parse(data);
var listUsers = [];
parsedJson.push(req.body);
console.log(parsedJson);

var newJson = JSON.stringify(parsedJson);
var fileContents = newJson;
fs.writeFile("./users.json", fileContents, function(err) 
	{if(err) 
		{throw err;    }
	});

for(var i = 0; i < parsedJson.length; i++)
{listUsers.push(parsedJson[i].firstname)}
res.render('users', {all: listUsers});
});
});

app.post("/ajax_search", function(req, res){

	fs.readFile('./users.json', 'utf8', function(err, data){
		if(err){
			throw "Error!";
		}
		var parsedJson = JSON.parse(data);
		var matching_users_ajax = [];
			
			for(var i = 0; i < parsedJson.length; i++){
			var partialFirstName = "";
			var partialLastName = "";
				
				for(var j = 0; j < req.body.input.length; j++){
					var partialFirstName = partialFirstName + parsedJson[i].firstname[j];
					var partialLastName = partialLastName + parsedJson[i].lastname[j];
				}

			if(req.body.input === ""){
			matching_users_ajax = "";
			}

			else if (partialFirstName.toLowerCase().indexOf(req.body.input.toLowerCase()) !== -1 || partialLastName.toLowerCase().indexOf(req.body.input.toLowerCase()) !== -1
			){
			matching_users_ajax.push(parsedJson[i].firstname + " " + parsedJson[i].lastname + " ")
				};
			};

	res.send(matching_users_ajax);
	});
});

// Listen

app.listen(3000, function(){
	console.log("server listening on port 3000");
});

