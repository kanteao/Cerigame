const fs=require('fs');
const express=require('express');
const app=express();
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
app.get('/login',function(req,res){
	var q=req.query;
	console.log(q);
	res.write(`ton idenifiant est :${q.nom}\n`);
	res.write(`ton mot de passe est :${q.pass}`);
	res.end();
})
app.listen(3305,()=>{console.log('listening on port 3305')});
