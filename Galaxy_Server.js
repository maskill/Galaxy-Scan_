var fs = require('fs');
//var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var nodeRSA = require('node-rsa');
//var keyTool = new nodeRSA({b: 512});


function keyPrep(){
	if(fs.existsSync('keys/key.rsa')){
	
		console.log("Key exist: decrypting for use");
		keyTool.importKey(fs.readFileSync('keys/key.rsa'), 'pkcs1-private');
	}
	else if(fs.existsSync('keys/key.rsa') == false){
		console.log("Generating and storing a new key");
		fs.writeFileSync('keys/key.rsa', keyTool.exportKey('pkcs1-private'));
	}
}


function encrypt(data){
	var lockedData = keyTool.encrypt(data, 'base64');
	return lockedData;
}


function decrypt(lockedData){
	var unlockedData = keyTool.decrypt(lockedData, 'utf8');
	return unlockedData;
}

function packageData(type, hashSet){
	var userVals = {name:"", key:"", tokens:"", msg:"", w1:"", w2:""};
	
	switch(type){
		case 'L':
			for(v in hashSet){
				userVals[v] = encrypt(hashSet[v]);
			}
			break;
	
		case 'U':
			for(v in hashSet){
				userVals[v] = decrypt(hashSet[v]);
			}
			break;
	}
					
	console.log(userVals);
	return userVals;
}

keyPrep();


//this sections will be replaced with the url that hosts the database
var serverIp = 'localhost';		
var dbURL = 'mongodb://' + serverIp + ':27017/ROS';	

//sets the path that express will read files from
app.use(express.static(__dirname + '/public'));

//setup parser for use in express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/', function(req, res){//default path
  res.sendFile(__dirname + '/index.html');
  //res.sendStatus(res.statusCode);
});

app.get('/lockData', function(req, res){//default path
  res.send(encrypt("test"));
  //res.sendStatus(res.statusCode);
});

app.get('/unlockData', function(req, res){//default path
  res.send(decrypt("test"));
  //res.sendStatus(res.statusCode);
});

app.listen(3000, function(){
		console.log('Listening on port 3000!');
});




MongoClient.connect(dbURL, function(err, db) {
	if(err){throw err; console.log(err);}
	
	app.get('/getUser', function(req, res){
		var doc = db.collection('users');
  		
  	doc.find({_id : req.query.id}).toArray(function(e, l){
			if(l.length != 0){
		  	console.log("User found:");
		  	console.log(l);
				
		  	res.send(packageData('U', l[0].Data));
			}
			else if(l.length == 0){
				console.log("No User by that id exist in the DB");
				res.send("No user found");
			}
		});
	});

	
	app.post('/newUser', function(req, res, doc){
	//Incoming data firsts need to be examined for security treats before it's stored in the server
  	console.log( "\n" + "POST received:" + res.statusCode);
	 	var doc = db.collection('users');
  		
  	//search db for items with _id that match the username that was entered
  	doc.find({_id : req.body.name}).toArray(function(e, l){
			if(l.length != 0){
		  	console.log("User already exist: no new entry added");
			}
			else if(l.length == 0){
				console.log("New Entry:" + req.body.name);
				
				doc.insert({ _id : req.body.name, 'Data': packageData('L', req.body) });
			}
			
		});
		
		//remove ALL documents from the db
		//doc.remove({});
		
		 //show all documets in the db
		//doc.find().toArray(function(err, items){console.log(items);});
	});

});
