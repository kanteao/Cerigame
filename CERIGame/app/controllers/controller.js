var myCtrl=function($scope,$http,auth,theme,socket,$interval) 
{
	var i=1;
	//var socket=io.connect('http://pedago02a.univ-avignon.fr:4500/');
	$scope.testdisplay=function()
	{
		console.log("Test de l'affichage");
	}

	$scope.notification=[];
	
	//Bandeau de Notification-------------------------------------------------------------------------------------------
$scope.bandeauDisplay=function(response)
{
        $scope.message = "Statut de la connexion";
        
        
        $scope.data1=response.data;
        $scope.nom=response.data.nom;
        $scope.data=response.data.data;
        $scope.statusMsg=response.data.statusMsg;
        $scope.last_connect=response.data.last_connect;
        localStorage.setItem('nom',response.data.nom);
        localStorage.setItem('prenom',response.data.prenom);
        localStorage.setItem('statusMsg',response.data.statusMsg);
        localStorage.setItem('last_connect',response.data.last_connect);
        console.log('localstorage',localStorage);
}
//Verification de connexion-------------------------------------------------------------------------------------------
$scope.islogged=function () 
	{
		testconnect = auth.isLoggedIn();
		if(testconnect && $scope.isConnected)
		{
			return true;
		}	
		else
		{
			return false;
		}
	};
	//Login--------------------------------------------------------------------------------------------------------------

	

$scope.login=function()
	{
		auth.logIn($scope.nom, $scope.pass).then(function(response)
		{ 
		console.log("reponse du serveur -----------", response);
		$scope.bandeauDisplay(response);
        console.log("---------------------id",response.data.userid);
         $scope.leveldisplay=false;
         $scope.questiondisplay=false;
         $scope.userprofil = false;
         $scope.showhistorique = false;
         $scope.listusers=false;
         $scope.scoredisplay=false;
		 $scope.themedisplay=false;
		 $scope.defidisplay=false;
		  $scope.scoredisplay=false;
		  $scope.showhistoriquedefi=false;
        $scope.userid=response.data.userid;
        $scope.userName=response.data.nom;
        $scope.isConnected=response.data.isConnected;

        if($scope.isConnected)
        {
        	statut=1
        	auth.setStatut(statut,$scope.userid);
        }
        //Code pour traiter les socket ---------------------------------------------------
        if ($scope.isConnected)
        {
			socket.emit('userconnect',$scope.userName);

			socket.on('userconnect', function(data) 
			{
				console.log("socket=============================================",data );
			//alert(data);
			//$interval(function (){$scope.alertConnectionUser = data;},1000}
				$scope.alertConnectionUser1 = true;
				infoStatutUser = data;
				swapInfoUserConnect = 1;
				var newConnetion = $interval(function ()
				{
					$scope.alertConnectionUser = infoStatutUser; 
					swapInfoUserConnect = swapInfoUserConnect +1;
					if (swapInfoUserConnect == 5)
						{
							$interval.cancel(newConnetion);
							$scope.alertConnectionUser1 = false;
						}														
				},1000)
			console.log("alertConnectionUser=============================================",$scope.alertConnectionUser );
			})

			socket.on('userDeconnecter', function(data) 
			{
				console.log("déconnection socket=============================================",data );
				$scope.alertConnectionUser1 = true;
				//alert(data);
				$scope.alertConnectionUser1 = true;
				infoStatutUser = data;
				swapInfoUserConnect = 1;
				var exitConnetion = $interval(function ()
					{
					$scope.alertConnectionUser = infoStatutUser; 
					swapInfoUserConnect = swapInfoUserConnect +1;
					if (swapInfoUserConnect == 5)
						{
							$interval.cancel(exitConnetion);
							$scope.alertConnectionUser1 = false;
						}														
				},1000)
						//$scope.alertConnectionUser = data;
			})


					
		}
		});
		var idDefie=parseInt($scope.userid);
		$scope.defiantList=theme.questDefi(idDefie);
		setTimeout(function(){
		console.log("defiantList1",$scope.defiantList);
		console.log("defian length1",$scope.defiantList.length);
		if($scope.defiantList.length!=0)
		{
			alert("Vous avez des defis en attente\n cliquer sur mes defis pour les voirs");
		}
		},1000)
		
	};
// Code pour traiter les sockets dans le cadre d'un defi
				socket.on('defi', function(data) 
			{
				console.log("socket=============================================",data );
				//alert("data")
				if ($scope.userid==data)
				{
				$scope.alertConnectionUser1 = true;
				infoStatutUser = "un defi vient de vous etre lancé";
				swapInfoUserConnect = 1;
				alert(infoStatutUser);
				var newConnetion = $interval(function ()
				{
					$scope.alertConnectionUser = infoStatutUser; 
					swapInfoUserConnect = swapInfoUserConnect +1;
					if (swapInfoUserConnect == 5)
						{
							$interval.cancel(newConnetion);
							$scope.alertConnectionUser1 = false;
						}														
				},1000)
			}
			
			})
	//home page---------------------------------------------------------------------------------------------------------
	$scope.home=function()
	{
			auth.accueil().then(function(response)
			{
					console.log(response);
			})
	}
	//Logout------------------------------------------------------------------------------------------------------------
$scope.logout=function () 
	{
		auth.logOut($scope.userName).then(function (response) 
			{
				$scope.clear();
				$scope.listusers=false;
				$scope.scoredisplay=false;
				$scope.message = "Statut de la connexion";
        		$scope.data1=response.data;
        		$scope.data=response.data.data;
        		$scope.statusMsg=response.data.statusMsg;
        		$scope.isConnected=response.data.isConnected;
        		$scope.showhistoriquedefi=false;
        		if(!$scope.isConnected)
        		{
        			statut=0;
        			auth.setStatut(statut,$scope.userid);
       			}
       			socket.emit('userDeconnecter',$scope.userName);
       			
			
			});
	};
	//Affichage du theme---------------------------------------------------------------------------------------------
	$scope.showtheme=function (mode,challengerid) 
	{
		$scope.mode=mode;
		if($scope.mode=='defi')
		{
			$scope.challengerid=challengerid;
		}
		alert('we are good to go');
		
		
		//Enregistrer le theme
		$scope.themeObtenues=theme.getTheme();
		   
            $scope.leveldisplay=false;
            $scope.questiondisplay=false;
            $scope.userprofil = false;
            $scope.showhistorique = false;
            $scope.listusers=false;
            $scope.scoredisplay=false;
		    $scope.themedisplay=true;
		     $scope.defidisplay=false;
		     $scope.showhistoriquedefi=false;
	
		
	};

	$scope.niveau=['facile','intermediaire','Difficile'];
	//Enregistrer le niveau de jeux et le nombre de question---------------------------------------------------------------------
	$scope.showlevel=function (num) 
	{
		//Enregistrer le niveau de jeux et le nombre de question
		//$scope.mode="jeux";
		$scope.themechoisi=$scope.themeObtenues[num];
		$scope.niveau=['facile','intermediaire','Difficile'];
		$scope.quizzbundle=theme.getThemeQuestions(num);
		
		
		//Nombre total de question
		
		console.log('$scope.totalQuestion--------------------',$scope.totalQuestion);
		console.log('----------------quizzbundle-----------------',$scope.quizzbundle);
		$scope.score=0;
		
		$scope.listusers=false;
		$scope.leveldisplay=true;
		$scope.themedisplay=false;
		 $scope.scoredisplay=false;
		 $scope.showhistoriquedefi=false;
		$scope.gameTime=1*20;
		$scope.duree=0;
		//---------------------------------------------------temps
		$scope.stopCountUp=$interval(function () 
		{
			$scope.duree=$scope.duree+1;
			$scope.minute=Math.floor($scope.duree/60);
			$scope.seconde=$scope.duree%60;
		},1000);
	
	//temps restant
	$scope.stopCountDown=$interval(function () 
		{
			$scope.gameTime=$scope.gameTime-1;
			$scope.minuteUp=Math.floor($scope.gameTime/60);
			$scope.secondeUp=$scope.gameTime%60;
			if ($scope.gameTime<1) 
			{
				
				$scope.stopQuestionnaire();
				
			}
		},1000);
	};


//Affichage de la question suivante et enregistrer le nombre questions par niveaux-------------------------------------------	
	$scope.storeQuestion=function (nbrq,selectedQ) 
	{

		$scope.level=$scope.niveau[nbrq];
		$scope.levelNumber=nbrq;
		$scope.numquestion=nbrq+2;
		console.log($scope.level);
		console.log($scope.numquestion);
		

		
		
		//$scope.totalQuestion=$scope.quizzbundle.length;
		$scope.leveldisplay=false;
		$scope.questiondisplay=true;
		 $scope.scoredisplay=false;
		 $scope.defidisplay=false;
		 $scope.showhistoriquedefi=false;
		console.log('SelectedQ--------------------------------------------------------------------------',selectedQ);
		console.log('$scope.gameTime--------------------------------------------------------------------------',$scope.gameTime);
		console.log('$scope.totalQuestion--------------------------------------------------------------------------',$scope.totalQuestion);
		$scope.quests=theme.selectQuestion(selectedQ,$scope.numquestion);
        console.log('total de question',$scope.quests.totalQuestion);
        //if(selectedQ==$scope.quests.totalQuestion-1)
        if(selectedQ==9)
        {
            $scope.stopQuestionnaire();
        }
        
		
		//Arreter le qestionnaire quand la condition est satisfaite-------------------------------------------------------
		
	
		$scope.counter=selectedQ+1;
		$scope.disactivate=false;
		console.log('counter--------------------------------------------------------------------------',$scope.counter);
		console.log('scope-------------------------------------------------------------------------------------');
		console.log($scope.quests);
		console.log('-------------------------------------------------------------------------------------');
	}
	$scope.checkAnswer=function(answer)
	{
		console.log('-------------------answer----------',answer);
		console.log('------------------$scope.quests.reponse----------',$scope.quests.reponse);
		$scope.disactivate=true;
		if (answer==$scope.quests.reponse)
		{
			$scope.score=$scope.score+1;	
		}
		console.log('-------------------$scope.score----------',$scope.score);
	}
	$scope.tempsDeJeux=function()
	{
		$scope.gameTime=1*20;
		$scope.duree=0;
		//---------------------------------------------------temps
		$scope.stopCountUp=$interval(function () 
		{
			$scope.duree=$scope.duree+1;
			$scope.minute=Math.floor($scope.duree/60);
			$scope.seconde=$scope.duree%60;
		},1000);
	
		//temps restant
		$scope.stopCountDown=$interval(function () 
		{
			$scope.gameTime=$scope.gameTime-1;
			$scope.minuteUp=Math.floor($scope.gameTime/60);
			$scope.secondeUp=$scope.gameTime%60;
			if ($scope.gameTime<1) 
			{
				
				$scope.stopQuestionnaire();
				
			}
		},1000);
	}
	
	//Arreter le questionnaire et enregistrer le resultat dans la base de donnee historique-------------------------------------------
	$scope.stopQuestionnaire=function () 
	{
					$scope.usersdisplay=false;
					$scope.questiondisplay=false;
					$scope.scoredisplay=true;
					$scope.dureefinal=$scope.duree;
					$scope.listusers=false;
					 $scope.defidisplay=false;
					 $scope.showhistoriquedefi=false;
					$scope.gameTimefinal=$scope.gameTime;
					$interval.cancel($scope.stopCountUp);
					$interval.cancel($scope.stopCountDown);
					var date = new Date().toLocaleDateString();
					$scope.scorePondere=Math.floor(($scope.score*1398.2)/$scope.dureefinal);
					console.log('scorePondere----------',$scope.scorePondere)
                    console.log("------------$scope.userid",$scope.userid);
                    console.log("------------date",date);
                    console.log("------------$scope.score",$scope.score);
                    console.log("------------$scope.duree",$scope.dureefinal);
                    console.log("------------$scope.scorePondere",$scope.scorePondere);
					if ($scope.mode=='defi')
					{
						
						$scope.defi();
					}
					else if($scope.mode=='normal')
					{
						$scope.historique=theme.getHistorique($scope.userid,date,$scope.score,$scope.duree,$scope.scorePondere);
					}
					else
					{
						$scope.scoreDefie=$scope.score;
						if($scope.scoreDefie>$scope.scoreDefiant)
						{
							$scope.idGagnantDefi=$scope.id_defie;
						}
						else
						{
							$scope.idGagnantDefi=$scope.id_defiant;
						}
						//Enregistrer le gagnant du defi dans la table hist_defi
						theme.store_hist_defi($scope.id_defie,$scope.id_defiant,$scope.idGagnantDefi,$scope.dateDefi)
					}

	}
	//Recuperation des données de l'utilisateur pour la mise a jour---------------------------------------------------------
	$scope.showupdate=function () 
	{
			$scope.leveldisplay=false;
            $scope.questiondisplay=false;
            $scope.userprofil = false;
            $scope.showhistorique = false;
            $scope.listusers=false;
             $scope.defidisplay=false;
              $scope.scoredisplay=false;
              $scope.showhistoriquedefi=false;
            auth.getUserData($scope.userid).then (function(reponse)
            {
            	$scope.profil=reponse.data;
            	$scope.userIdentifiant=$scope.profil.identifiant;
            	$scope.userNom=$scope.profil.nom;
            	$scope.userPrenom=$scope.profil.prenom;
            	var date1='';
            	date1=$scope.profil.date_de_naissance;
            	var udate=[];
            	var date2=''
            	udate=date1.split('/');
            	date2=udate[1]+'/'+udate[0]+'/'+udate[2];
            	console.log(date2);
            	$scope.userDate=date2;
            	console.log('$scope.profil----------------------',$scope.profil);
            });
			$scope.userprofil="true";	
			$scope.usersdisplay=false;
	}
	//Mise a jour des données de l'utilisateur-----------------------------------------------------------------------------
	$scope.updateuser=function () 
	{
		var userDate=$scope.userDate;
			auth.updateUser($scope.userid,$scope.userIdentifiant,$scope.userNom,$scope.userPrenom,$scope.userPass,userDate).then(function (response) 
			{
					$scope.updateStatus=response.data.statusMsg;
                    $scope.userprofil=false;
                    $scope.usersdisplay=false;
                     $scope.defidisplay=false;
                     $scope.showhistoriquedefi=false;
                     $scope.userprofilok=false;
                     alert("Profil de l'utilisateur mis a jour");
			});
	};

		//Mise a jour des données de l'utilisateur-----------------------------------------------------------------------------
	
    //Affichage de lhistorique-------------------------------------------------------------------------------------------
    $scope.displayhistorique = function()
    {  
            $scope.leveldisplay=false;
            $scope.questiondisplay=false;
            $scope.userprofil = false;
            $scope.showhistorique = true;
            $scope.usersdisplay=false;
            $scope.scoredisplay=false;
            $scope.listusers=false;
            $scope.defidisplay=false;
            $scope.showhistoriquedefi = false;
    
            theme.displayhistorique($scope.userid)
                .then (function(reponse){
                    $scope.historiques = reponse;
                    console.log("_________________$scope.historiques",$scope.historiques)
                      })
     };
     //Affichage de tous les utilisateurs inscrits------------------------------------------------------------------------
     $scope.all_users= function()
     {
            $scope.leveldisplay=false;
            $scope.questiondisplay=false;
            $scope.userprofil = false;
            $scope.showhistorique = false;
            $scope.listusers=true;
            $scope.defidisplay=false;
             $scope.scoredisplay=false;
             $scope.showhistoriquedefi=false;
             $scope.themedisplay=false;


        auth.getallusers().then(function(response)
        {
         $scope.users=response.data;
         console.log("$scope.users---------------------",$scope.users);
        });
     }
//Enregistrer un defi---------------------------------------------------------------------------------------------------------
     $scope.defi=function()
     {
     	//console.log("quizzbundle---------------------------------------",$scope.quizzbundle);
     	//$scope.miniQuests=$scope.quizzbundle.slice(0,9);
     	$scope.mode='defi';
     	$scope.listusers=false;
     	$scope.leveldisplay=false;
        $scope.questiondisplay=false;
        $scope.userprofil = false;
        $scope.showhistorique = false;
         $scope.scoredisplay=false;
         $scope.showhistoriquedefi=false;
     	console.log("challengerid---------------------",$scope.challengerid);
     	console.log("userid---------------------",$scope.challengerid);
     	console.log("score---------------------",$scope.scorePondere);
     	console.log("------------------------------------------------------------------");
     	//console.log("miniQuests---------------------",$scope.miniQuests);
   

     	theme.storedefi($scope.challengerid,$scope.userid,$scope.scorePondere,$scope.themechoisi,$scope.nom,$scope.levelNumber).then(function(response)
     	{
     		socket.emit('defi',$scope.challengerid);
     		console.log(response.data);
     	});
     }
     $scope.clear=function(){
		 $scope.listusers=false;
     	$scope.leveldisplay=false;
        $scope.questiondisplay=false;
        $scope.userprofil = false;
        $scope.showhistorique = false;
         $scope.scoredisplay=false;
         $scope.showhistoriquedefi=false;
         $scope.themedisplay=false;
         $scope.defidisplay=false;
		 }
     //Recuperer tous les defis lancé à une personne--------------------------------------------------------------------------------
     $scope.questiondefi=function()
     {
		$scope.clear();
     	$scope.defidisplay=true;
     	var idDefie=parseInt($scope.userid);
     	console.log("idDefie-------------",idDefie);
     	$scope.defiantList=theme.questDefi(idDefie);
     	/*if ($scope.defiantList.length==0)
     	{
			$scope.defidisplay=false;
			alert("Vous n'avez aucun defi!!!");
		}*/
     	console.log("controller->->->defiantList",$scope.defiantList);
     	

     }
     //Accepter le defi--------------------------------------------------------------------------------------------------------------
     $scope.accepterdefi=function(id_defie,id_defiant,niveau,score,index)
	{
		$scope.clear();
		$scope.id_defie=id_defie;
		$scope.id_defiant=id_defiant;
		$scope.scoreDefiant=score;
		$scope.dateDefi=new Date().toLocaleDateString();
		theme.accepterDef(id_defie,id_defiant,niveau,index)
		.then(function(response)
		{
			$scope.mode='defi_reponse';
			console.log(response);
			$scope.tempsDeJeux();
			$scope.score=0;
			$scope.storeQuestion(parseInt(niveau),0);
		});
	};


      //Refuser le defi---------------------------------------------------------------------------------------------------------------
	
	 $scope.refuserdefi=function(id_defie,id_defiant,niveau,index)
	{

		 theme.refuserDef(id_defie,id_defiant,niveau,index).then(function(response)
		 {
		 	$scope.defidisplay=false;
		 	$scope.defidisplayok=false;
		 	$scope.showhistoriquedefi=false;
		 	alert("Defi refusé et effacé ")
		 });
		
	};
	$scope.histdefi=function()
	{
		 $scope.leveldisplay=false;
            $scope.questiondisplay=false;
            $scope.userprofil = false;
            $scope.showhistorique = false;
            $scope.usersdisplay=false;
            $scope.scoredisplay=false;
            $scope.listusers=false;
            $scope.defidisplay=false;
            $scope.showhistoriquedefi = true;
            //$scope.historiquedef = theme.show_hist_defi($scope.userid)
            	theme.show_hist_defi($scope.userid).then(function(response)
            	  {
            	  	 //$scope.historiquedef = response.data;
            	  	
            	  	 histdef=response.data; 
            	  	 for(var i=0;i<histdef.length;i++)
            	  	 {
						 if(histdef[i].id_users_gagnant==$scope.userid) 
						 {
						  histdef[i].trophet='Trophet';
						 }
						 else
						 {
						  histdef[i].trophet='Jeux Perdu';
						 }
						 console.log("histdef",histdef);
					 }
					 $scope.historiquedef=histdef;
					 
              		console.log("historiquedef",$scope.historiquedef);
            	  })
            	  
       
             
            
            
           
               
	}
	
}
myCtrl.$inject=['$scope','$http','auth','theme','socket','$interval'];



