//Declaration des variables--------------------------------------------------------------------------------------------------
const port=4500;
const fs=require('fs');
var bodyParser=require('body-parser');
var formidable = require('formidable');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var localStorage = require('node-localstorage').LocalStorage;

const express=require('express');
const app=express();

const server = require('http').createServer(app);
//const io = require('socket.io')(server);

const session = require('express-session');
var sha1=require('sha1');
var responseData={};
var user={};
var users=[];
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const pgClient = require('pg');  
//Mongo DB Store Debut

const MongoDBStore = require('connect-mongodb-session')(session); 

app.use(session({
// charge le middleware  express-session dans la pile 
	secret: 'ma phrase secrete',
	saveUninitialized: false, 
	resave: false, 
	store : new MongoDBStore({ 
			uri: 'mongodb://127.0.0.1:27017/db', 
			collection: 'MySession3305', 
			touchAfter: 24 * 3600 
}), 
cookie : {maxAge : 24 * 3600 * 1000} 
})); 

app.get('/',function(req,res){
res.sendFile(__dirname+'/CERIGame/index_a2.html');
});

app.use(express.static(__dirname+'/CERIGame/app'));


//socket------------------------------------------------------------------------------------------------------------------
var io = require('socket.io').listen(server);
io.on('repdefi', function (message) {
        console.log('Un defi a été lancé io : ' + message);
		socket.broadcast.emit('repdefi',message);
});

io.sockets.on('connection', function (socket) 
{
		
		socket.on('userconnect', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
        socket.broadcast.emit('userconnect','- '+message+' connect');
		});
		
		socket.on('userDeconnecter', function (message) {
        console.log('Un client se deconnecte : ' + message);
		socket.broadcast.emit('userDeconnecter','-'+message+' deconnect');
		});

		socket.on('defi', function (message) {
        console.log('Un defi a été lancé : ' + message);
		socket.broadcast.emit('defi',message);
		});

		socket.on('repdefi', function (message) {
        console.log('Reponse de defi ---- : ' + message);
		socket.broadcast.emit('repdefi',message);
		});
		socket.on('tabdefi', function (message) {
        console.log('Table de jeux ----- : ' + message);
		socket.broadcast.emit('tabdefi',message);
		});

		socket.on('terminerjeux', function (message) {
        console.log('terminer jeux ----- : ' + message);
		socket.broadcast.emit('terminerjeux',message);
		});
});
//retourner les infos de lhistorique-------------------------------------------------------------------------------------------

app.get('/displayhistorique', (request, response) => {  
console.log("id",id)
	var id = request.query.id_user; 
	var respData=[];

	sql = "select * from fredouil.historique where id_users='"+id+"' order by id desc limit 5;"; 
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		                
		else
		{
			console.log(result.rows);  
            respData=result.rows;     
		}  
		response.send(respData);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});

});

//retourner les infos de lhistorique defi-------------------------------------------------------------------------------------------

app.get('/displayhistoriquedefi', (request, response) => {  

	var id = request.query.id; 
	var repData={};
	
	console.log("id",id)
	sql = "select * from fredouil.hist_defi where id_users_defiant='"+id+"' or id_users_defie='"+id+"' order by id desc limit 5;"; 
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		                
		else
		{
			console.log(repData);  
            repData=result.rows;     
		}  
		response.send(repData);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});

});

//Connexion de l'utilisateur----------------------------------------------------------------------------------------------

app.get('/login/:p1/:p2', (request, response) => {  

	var username = request.params.p1; 
	var password = request.params.p2;
	var passcrypt=sha1(password);
	var reps={};

	sql = "select * from fredouil.users where identifiant='"+username+"';";  
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		else if((result.rows[0] != null) && (result.rows[0].motpasse == passcrypt))
		{
			request.session.isConnected = true;
			request.session.identifiant = username;
         request.session.prenom = result.rows[0].prenom;
         request.session.id=result.rows[0].id;
         var last_connect=new Date();
         request.session.last_connect=last_connect;
        	
         //Enregistrer les informations dans la variable reponseData
         
			reps.last_connect=last_connect;
         	reps.isConnected=true;
			reps.nom=result.rows[0].identifiant;
			reps.data=result.rows[0].prenom;
			reps.userid=result.rows[0].id;   
			reps.statusMsg='Connexion réussie : bonjour '+result.rows[0].identifiant;
			
			//Affichage dans la console			
			console.log('Connexion réussie : bonjour '+result.rows[0].identifiant);
			console.log(request.session.id);
         console.log(request.session.identifiant);
         console.log(request.session.prenom);
         console.log(reps);
         io.emit('userconnect',reps.nom);
		}                
		else
		{
			console.log('Connexion échouée : informations de connexion incorrecte');   
			reps.statusMsg='Connexion échouée : informations de connexion incorrecte';     
		}  
		response.send(reps);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});


});

//Changer le statut login de l'utilisateur
app.get('/set_statut', (request, response) => {  

	var statut = request.query.statut; 
	var id=request.query.user; 
	sql = "update fredouil.users set statut='"+statut+"' where id='"+id+"';"; 
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
	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}                
		else
		{
			console.log('Statut la connexion mise à jour');   
			console.log("statut",statut);
			responseData.statusMsg=statut;     
		}  
		response.send(responseData);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});


});
//Obtention de tous les utilisateurs du jeux dans la base fredouil.users-------------------------------------------


app.get('/getallusers', (request, response) => {  
    
	console.log("tous les utilisateurs----------------");
    sql = "select * from fredouil.users where statut=1;"; 
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


    client.query(sql, (err, result) =>  
    {
        if(err)
        {
            console.log('Erreur d’exécution de la requete' + err.stack);
        }   
        else
        {
        	console.log("result.rows--------------------------------------------");
            console.log(result.rows);
            console.log("-------------------------------------------------------");
        }                
        
        response.send(result.rows);  
        //retourner data au controller;     
}); 
    client.release(); // connexion libérée

});

});

//Obtention du nom de l'utilisateur en fonction de son id-------------------------------------------

app.get('/getname', (request, response) => {  
    
	var id=request.query.id;
  	sql = "select * from fredouil.users where id='"+id+"';"; 
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


    client.query(sql, (err, result) =>  
    {
        if(err)
        {
            console.log('Erreur d’exécution de la requete' + err.stack);
        }   
        else
        {
        	console.log("result.rows--------------------------------------------");
            console.log(result.rows[0].identifiant);
            console.log("-------------------------------------------------------");
        }                
        console.log("username",result.rows[0]);
        response.send(result.rows[0].identifiant);  
        //retourner data au controller;     
}); 
    client.release(); // connexion libérée

});

});

//Obtention des informations de l'utilisateur--------------------------------------------------------------------

app.get('/getuserdata', (request, response) => {  

	var id = request.query.id; 
	

	sql = "select * from fredouil.users where id='"+id+"';"; 
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		else
		{
			

         //Enregistrer les informations dans la variable reponseData
			user.identifiant=result.rows[0].identifiant;
			user.nom=result.rows[0].nom;
			user.prenom=result.rows[0].prenom;
			user.date_de_naissance=result.rows[0].date_de_naissance.toLocaleDateString();
			
			//Affichage dans la console			
			console.log('Connexion réussie : bonjour '+result.rows[0].identifiant);
        
         console.log(user);
		}                
		
		response.send(user);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});

});

//Logout-------------------------------------------------------------------------------------------------------------------------------------
app.get('/logout',function (request,response) 
{
	var username1=request.query.username;
	request.session.isConnected=false;
	responseData.isConnected=false;
	responseData.username=username1;
	responseData.data="Deconnection reussie";
	responseData.statusMsg="OK";
	response.send(responseData);
	io.emit('userDeconnecter',username1);
});

//Recuperation des themes dans la base de donnee MongoDB
app.get('/game',function (request,response) 
{
	console.log('je suis dans le server');
	MongoClient.connect(url, function(err, db) 
	{
  		if (err) throw err;
  		var dbo = db.db("db");
  		 dbo.collection("quizz").find({}, { projection: { _id: 0, thème: 1 } }).toArray(function(err, result) 
  		 {
    		if (err) throw err;
    		console.log(result);
    		response.send(result);
    		db.close();
  		});
}); 
});
//Recuperation des Question et reponses dans la base de donnee MongoDB-------------------------------------------------------------------------------
app.get('/question/:th',function (request,response) 
{
	var themSearch=request.params.th;
	console.log('quer',request.params.th);
	var query={thème:themSearch};
	console.log('jaffiche les question et reponse');
	MongoClient.connect(url, function(err, db) 
	{
  		if (err) throw err;
  		var dbo = db.db("db");
  		 dbo.collection("quizz").find(query).toArray(function(err, result) 
  		 {
    		if (err) throw err;
    		//console.log(result[0].quizz);
    		console.log(result);
    		response.send(result);
    		db.close();
  		});
}); 
});

//Recuperation des Quizz Defi dans la base MongoDB-------------------------------------------------------------------------------

app.get('/questiondefi',function (request,response) 
{
	var id1=parseInt(request.query.id1);

	console.log('id du joueur defié',id1);
	var query={id_user_defie:id1};
	console.log('jaffiche les question et reponse');
	MongoClient.connect(url, function(err, db) 
	{
  		if (err) throw err;
  		var dbo = db.db("db");
  		 dbo.collection("defi").find(query).toArray(function(err, result) 
  		 {
    		if (err) throw err;
    		console.log("resultat node",result);
    		response.send(result);
    		db.close();
  		});
}); 
});

//Enregistrer les informations relatives a un defi-----------------------------------------------------------------------------------

app.post('/storedefi',jsonParser,function (request,response) 
{
	var defiObject=request.body;
	console.log("request.body-----------------------",request.body);
	console.log("defiObject-------------------------------",defiObject);

MongoClient.connect(url, function(err, db) 
{
  if (err) throw err;
  var dbo = db.db("db");
  var myobj = defiObject;
  dbo.collection("defi").insertOne(myobj, function(err, res) 
  {
    if (err) throw err;
    console.log("1 document inserted");
    var rep="Defi envoyé avec succes ---- ok";
	response.send(rep);
    db.close();
  });
});



});
//Effacer la collection du defi concerné quant accepté ou refusé-------------------------------------------------------------------------
app.get('/effacerdefi',function (request,response) 
{
	var id1=parseInt(request.query.id1);
	var id2=parseInt(request.query.id2);
	console.log('id du joueur defié',id1);
	console.log('id du joueur defiant',id2);
	var query={
				id_user_defie:id1,
				id_user_defiant:id2
			  };
	console.log('jaffiche les question et reponse');
	MongoClient.connect(url, function(err, db) 
	{
  		if (err) throw err;
  		var dbo = db.db("db");
  		 dbo.collection("defi").deleteOne(query, function(err, obj)
  		 {
    		if (err) throw err;
   			console.log("1 document deleted");
   			
    		db.close();
  		});
	}); 

	var result="1 document deleted";
    response.send(result);
});

//Mise a jour de lhistorique de jeux---------------------------------------------------------------------------------------------

app.get('/historique', (request, response) => {  
	var userid = request.query.userid; 
	var date = request.query.date;
	var nbreponse = request.query.nbreponse; 
	var temps = request.query.temps;
	var score = request.query.score;
	
	
	console.log('userid',userid);  
	console.log(" date : " + date);
	console.log("nbreponse : " + nbreponse);	
	console.log("temps : " + temps);
	console.log("score : " + score);

	var sql = "INSERT INTO fredouil.historique (id_users, date, nbreponse, temps, score) VALUES ('"+userid+"','"+date+"','"+nbreponse+"', '"+temps+"', '"+score+"');"
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		else
		{
			
        	
         //Enregistrer les informations dans la variable reponseData
         responseData.resultat='Ok';     
			responseData.statusMsg='Données enregistrer dans le base de donnée';
			
			//Affichage dans la console			
			
         console.log(responseData);
		}                
 
		response.send(responseData);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});

});

//Mise à jour de l'historique de defi------------------------------------------------------------------------------

app.get('/hist_defi', (request, response) => {  
	var id_defie = request.query.id_defie; 
	var id_defiant = request.query.id_defiant;
	var id_gagnant = request.query.id_gagnant; 
	var date = request.query.date;
	
	
	console.log('id_defie',id_defie);  
	console.log(" id_defiant : " + id_defiant);
	console.log("id_gagnant : " + id_gagnant);	
	console.log("date : " + date);

	var sql = "INSERT INTO fredouil.hist_defi (id_users_defiant, id_users_defie, id_users_gagnant,date) VALUES ('"+id_defiant+"','"+id_defie+"','"+id_gagnant+"', '"+date+"');"
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		else
		{
			
        	
         //Enregistrer les informations dans la variable reponseData
         responseData.resultat='Ok';     
			responseData.statusMsg='Données enregistrer dans le base de donnée';
			
			//Affichage dans la console			
			
         console.log(responseData);
		}                
 
		response.send(responseData);  
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});

});

//Mise a jour de du compte de l'utilisateur-----------------------------------------------------------------------------------------------

app.get('/updateuser', (request, response) => {  
	var id = request.query.id; 
	var userid = request.query.userid; 
	var nom = request.query.nom;
	var prenom = request.query.prenom; 
	var date = request.query.date;

	
	console.log('id',id); 
	console.log('userid',userid);  
	console.log(" date : " + date);
	console.log("nom : " + nom);	
	console.log("prenom : " + prenom);
	

	sql = "update fredouil.users set identifiant='"+userid+"',nom='"+nom+"',prenom='"+prenom+"',date_de_naissance='"+date+"' where id='"+id+"';"; 
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


	client.query(sql, (err, result) =>  
	{
		if(err)
		{
			console.log('Erreur d’exécution de la requete' + err.stack);
		}   
		else
		{
			
        	
         //Enregistrer les informations dans la variable reponseData
         responseData.resultat='Ok';     
			responseData.statusMsg='Données enregistrer dans le base de donnée';
			
			//Affichage dans la console			
			
         console.log(responseData);
		}                
 
		response.send(responseData);  
		console.log(responseData);
		//retourner data au controller;     
}); 
	client.release(); // connexion libérée

});

});
server.listen(port,()=>{console.log('listening on port 4500')})
