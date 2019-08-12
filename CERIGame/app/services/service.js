function auth ($http,session)
    {
    	//authentification----------------------------------------------------------------------------------------------------
    	this.logIn=function(nom,pass)
        {
        var url='http://pedago02a.univ-avignon.fr:4500/login/'+nom+'/'+pass;
		  session.setUser(nom);
        return $http.get(url)
        };
        this.isLoggedIn = function ()
        {
        console.log("session.getUser() = ", session.getUser());
        return session.getUser() !== null;
    	  };
    	  this.logOut=function(username)
    	  {
				 var url='http://pedago02a.univ-avignon.fr:4500/logout/?username='+username+'';
		  		 session.setUser(null);
             return $http.get(url)   	  
    	  }
    	  this.updateUser=function (id,identifiant,nom,prenom,pass,date) 
    	  {
    	  		var url='http://pedago02a.univ-avignon.fr:4500/updateuser/?id='+id+'&userid='+identifiant+'&nom='+nom+'&prenom='+prenom+'&pass='+pass+'&date='+date+'';

    	  		return $http.get(url);
    	  }
    	  this.getUserData=function(userid)
    	  {
    	  	id=userid;
    		var url='http://pedago02a.univ-avignon.fr:4500/getuserdata/?id='+id;
    		return $http.get(url);
    	  }
          this.getallusers=function()
          {
            var url='http://pedago02a.univ-avignon.fr:4500/getallusers/';
            return $http.get(url);
          }
          this.setStatut=function(statut,user)
          {
          	var url='http://pedago02a.univ-avignon.fr:4500/set_statut/?statut='+statut+'&user='+user+'';
          	return $http.get(url);
          }
          this.accueil=function()
          {
			 var url='http://pedago02a.univ-avignon.fr:4500/';
          	return $http.get(url); 
		  }
    }
    //Session---------------------------------------------------------------------------------------------------------------------------
function sessionService($log)
{
   
    // Instantiate data when service is loaded
    this._user = JSON.parse(localStorage.getItem('session_user'));

        this.getUser = function()
        {
            console.log("this._user = ", this._user);
            return this._user;
        };
   
    this.setUser = function(user)
        {
        		this._user = user;
        		localStorage.setItem('session_user', JSON.stringify(user));
        		console.log("localStorage = ", localStorage.session_user);
        		return this;
        };
  }
//Service pour traiter les sockets-------------------------------------------------------------------------------------------
  function treatSocket() {
	
		var socket = io.connect('http://pedago02a.univ-avignon.fr:4500'); 

		function callback(data) { 
		console.log("socket service =============================================",data );
			return data;
		}
		
		return {
			on: function(message, callback){ 
				socket.on(message, callback);
				},  
				
			emit: function(message, data) {
				socket.emit(message, data); 
				//console.log("socket111=============================================",data)				
			}   
		}; 
	}
  
//theme----------------------------------------------------------------------------------------------------------------------------------
function theme($http) 
{
	var themes=[];
	this.getTheme=function () 
	{
		var url='http://pedago02a.univ-avignon.fr:4500/game';
		
		$http.get(url).then(function (response) 
		{
				for (i=0;i<response.data.length;i++)
		 		{
					console.log(response.data[i].thème);
					themes.push(response.data[i].thème);
				}
		});
		return themes;
	};
	var quizzbundle=[];
	var questions=[];
	var propositions=[];
	var anecdotes=[];
	var reponses=[];
	var defiList=[];

	var tempo=[];
	//var currentQuestion={};
	var testreussi="test reussi-------------------------------------------------------------";
	
	
	this.getThemeQuestions=function (numt) 
	{
		
		var url1='http://pedago02a.univ-avignon.fr:4500/question/'+themes[numt];
		$http.get(url1).then(function (response) 
		{
			console.log('numt----------------------------------------------',numt);
			console.log('quizzbundle----------------------------------------------');
			quizzbundle=response.data[0].quizz;
			
			console.log(quizzbundle);
		});
		//theme.getQuestionsList();
		return quizzbundle;
	};
	this.getTotalQuestion=function () 
	{
		var total=quizzbundle.length;
		return total;
	};
	

	this.selectQuestion=function (selectedQ,nbrQuestion)
	{
		console.log('---------------------selectedQ---------------',selectedQ);
		console.log('---------------------nbrQuestion---------------',nbrQuestion);
		var currentQuestion={};
       
		currentQuestion.question=quizzbundle[selectedQ].question;;
		currentQuestion.reponse=quizzbundle[selectedQ].réponse;
		console.log('---------------------quizzbundle[selectedQ].reponse---------------',quizzbundle[selectedQ].réponse);		
		
		var props=quizzbundle[selectedQ].propositions;
		var repPos=props.indexOf(currentQuestion.reponse);
		if(props.length>nbrQuestion)
		{
		if (nbrQuestion==3)
		 {
		 	if (repPos<3) 
		 	{
		 		props.pop();
		 	}
		 	else 
		 	{
		 		props.shift();
		 	}
		 }	
		 if (nbrQuestion==2)
		 {
		 	if (repPos<2) 
		 	{
		 		props.pop();
		 		props.pop();
		 	}
		 	else if (repPos==2) 
		 	{
				props.pop();		 		
		 		props.shift();
		 		
		 	}
		 	else 
		 	{
		 		props.shift();
		 		props.shift();
		 	}
		 }
		 }		
		currentQuestion.propositions=props;
		currentQuestion.anecdote=quizzbundle[selectedQ].anecdote;
        
            var totalQuestion=quizzbundle.length;
            currentQuestion.totalQuestion=totalQuestion;
            console.log('totalQuestion-------------------------',totalQuestion);
    
		console.log('selectedQ',selectedQ);
		console.log('currentQuestion',currentQuestion);
		return currentQuestion;
	};
	
	//Obtenir l'historique de jeux-----------------------------------------------------------------------------------------------
	this.getHistorique=function (userid,date,score,temps,scorePondere) 
	{
		var url2='http://pedago02a.univ-avignon.fr:4500/historique/?userid='+userid+'&date='+date+'&nbreponse='+score+'&temps='+temps+'&score='+scorePondere+'';
	
		return $http.get(url2);
	}
	//Affichage de lhistorique---------------------------------------------------------------------------------------------------
   this.displayhistorique = function (userid) 
   {  

            id_user = userid;      

            return $http
                .get('http://pedago02a.univ-avignon.fr:4500/displayhistorique/?id_user='+id_user+'')
                    .then(function(resultat)
                    {
                        return resultat.data;
                        
    				});
    };
    
    //Enregistrer le defi dans la base de donnée----------------------------------------------------
    this.storedefi=function(challengerid,userid,score,theme,nom,niveau)
    {
    	var defiObject={};
    	defiObject.theme=theme;
    	defiObject.nom_user_defiant=nom;
    	defiObject.id_user_defie=challengerid;
    	defiObject.id_user_defiant=userid;
    	defiObject.niveau=niveau;
    	defiObject.score_user_defiant=score;

    	defiObject.quizz=quizzbundle.slice(0,10);
    	console.log("defiObject*****************************************",defiObject);
    	
		var url='http://pedago02a.univ-avignon.fr:4500/storedefi';
		return $http.post(url, defiObject, {headers: {'Content-Type': 'application/json'} });
    	
    }
    var defiantList=[];
    this.questDefi=function(userid)
    {
    	//var url='http://pedago02a.univ-avignon.fr:4500/questiondefi/?id1='+userid+'&id2='+defiantid;
    	defiantList=[];
    	var url='http://pedago02a.univ-avignon.fr:4500/questiondefi/?id1='+userid;
    	$http.get(url).then(function (response) 
		{
			//recupere les questions de defi
			defiList=response.data;
			
			console.log(defiList);
			for (var i = 0; i < defiList.length; i++) 
			{
				var temp=[];
				temp.push(defiList[i].id_user_defie);
				temp.push(defiList[i].theme);
				temp.push(defiList[i].id_user_defiant);
				temp.push(defiList[i].nom_user_defiant);
				temp.push(defiList[i].niveau);
				temp.push(defiList[i].score_user_defiant);
				defiantList.push(temp);
			}
			
		});
		console.log("defiantList----------",defiantList);
		//return defiList;
		return defiantList;
    }
    //Refuser un defi------------------------------------------------------------------------------------------------------
    this.refuserDef=function(id_defie,id_defiant,num_defi)
    {
    	//quizzbundle=defiList[num_defi];
    	var url='http://pedago02a.univ-avignon.fr:4500/effacerdefi/?id1='+id_defie+'&id2='+id_defiant+'';
    	//return url;
    	return $http.get(url);
    }

    //Accepter un defi-------------------------------------------------------------------------------------------------------
    this.accepterDef=function(id_defie,id_defiant,niveau,num_defi)
    {
    	//recuperation des questions et reponses de defi
    	quizzbundle=defiList[num_defi].quizz;
    	var url='http://pedago02a.univ-avignon.fr:4500/effacerdefi/?id1='+id_defie+'&id2='+id_defiant+'';
    	//return url;
    	return $http.get(url);
    }
    this.store_hist_defi=function(id_defie,id_defiant,id_gagnant,date)
    {
    	var url='http://pedago02a.univ-avignon.fr:4500/hist_defi/?id_defie='+id_defie+'&id_defiant='+id_defiant+'&id_gagnant='+id_gagnant+'&date='+date+'';
    	return $http.get(url);
    }
    this.show_hist_defi=function(id)
    {
    	var url='http://pedago02a.univ-avignon.fr:4500/displayhistoriquedefi/?id='+id+'';
    	return $http.get(url);
    }
	
}
