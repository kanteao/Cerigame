const fs=require('fs');
const express=require('express');
const app=express();
//const bodyParser= require('body-parser'); 
const session = require('express-session');
const pgClient = require('pg');  

//app.use(bodyParser.urlencoded({extended: true})); 
//app.use(bodyParser.json({limit: '10mb'}));

app.get('/',function(req,res){
	fs.readFile('index.html',function(err,data)

	{
		if (err) 

		{
		console.log(err);	
		}
			else 
		{
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(data);
		}	
	});
});
app.get('/login', (request, response) => {  
var username = request.query.nom; 
var password = request.query.pass;
console.log(request.query);
sql = "select * from fredouil.users where identifiant='"+request.query.nom+"';"; 
var pool = new pgClient.Pool({user: 'uapv1900605', host: 'pedago02a.univ-avignon.fr', database: 'etd', password: '3UHBQt', port: 5432 }); 

pool.connect(function(err, client, done) { 
if(err) 
	{
	console.log('Error connecting to pg server' + err.stack);
	}
	else 
	{
	console.log('connection established with the server');	
	}  

//request.session.isConnected = true;
//request.session.username = username;

//console.log(request.session.id)
//console.log('expire dans ');
//:i+req.session.cookie.maxAge);
console.log(JSON.stringify(request.body));  
});
});
app.listen(3305,()=>{console.log('listening on port 3305')});
