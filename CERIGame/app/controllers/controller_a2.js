var myCtrl=function($scope,$http,auth,theme,socket,$interval,$compile) 
{
	var i=1;

var socket1 = io.connect('http://pedago02a.univ-avignon.fr:4500'); 


//Debut Code pour le jeux du morpion--------------------------------------------------------------------------------------------------------------------
$scope.pion=["X","O"];
$scope.startgame=function()
{
	$scope.tab=[];
	$scope.tabdisable=[];
	$scope.win=[[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[2,5,8],
			[0,4,8],
			[2,4,6],
			[1,4,7]];
	$scope.emptytab=[0,1,2,3,4,5,6,7,8];
	$scope.wintest=false;
	$scope.displaychoixpion=true;
};
socket1.on('tabdefi',function(data)
{
	//alert("tabdefi data reçu -----"+data);
	$scope.filltab(data);
});

socket1.on('terminerjeux',function(data)
{
	$scope.$apply(function(){
	alert("gagnant -----"+data);
	$scope.stopTime=true;
	$scope.notif=data;
	if($scope.mode=='defi')
	{
		if((data=="null")||($scope.userid==data))
		{
			$scope.score=0;
		}
	}
	$scope.boarddisplay=false;
	$scope.scoredisplay=true;
	})
	
});
//$scope.displayjeux=false;
/*
$scope.tab=[];
$scope.tabdisable=[];
$scope.win=[[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[2,4,8],
			[0,4,8],
			[2,4,6]];
$scope.emptytab=[0,1,2,3,4,5,6,7,8];
$scope.wintest=false;

$scope.endgame=function()
{
	var j=0;
	var tabused=1;
	for(j=0;j<9;j++)
	{
		if($scope.tab[j]!=undefined)
		{
			tabused=tabused+1;
		}
	}
	if(tabused==10 || $scope.wintest)
	{
		return true;
	}
	else
	{
		return false;
	}
}
*/

$scope.choixpion=function(choix)
{
	$scope.pionchoisi=$scope.pion[choix];
	$scope.usercombo=$scope.pionchoisi+','+$scope.pionchoisi+','+$scope.pionchoisi;
	$scope.boarddisplay=true;
	if(choix==0)
	{
		$scope.pionchoisicomp=$scope.pion[1];
		$scope.compcombo=$scope.pionchoisicomp+','+$scope.pionchoisicomp+','+$scope.pionchoisicomp;
		$scope.displaychoixpion=false;
	}
	else
	{
		$scope.pionchoisicomp=$scope.pion[0];
		$scope.displaychoixpion=false;
	}
	$scope.tempsDeJeux();
}
$scope.choocell=function(cell,mark)
{
	$scope.tab[cell]=mark;
	$scope.tabdisable[cell]=true;
	delete $scope.emptytab[cell];
	console.log("$scope.emptytab = ",$scope.emptytab);
	if($scope.mode=='defi')
	{
		socket.emit('tabdefi',$scope.tab);
		console.log('tabdefi--------',$scope.tab);
	}
	else
	{
		if(mark==$scope.pionchoisi)
		{
			$scope.compturn();
		}
	}
	$scope.checkwin();
}
//Mise a jour de la table de jeux----------------------------------------------------------------------------------------------
$scope.filltab=function(tab)
{
	$scope.$apply(function(){
		$scope.tab=tab;
	})
	
}
$scope.checkwin=function()
{
	var i=0;
	for(i=0;i<$scope.win.length;i++)
	{
		
		var j=0;
			
			
			$scope.combinaison=$scope.tab[$scope.win[i][j+0]]+","+$scope.tab[$scope.win[i][j+1]]+','+$scope.tab[$scope.win[i][j+2]]
			console.log($scope.usercombo+"-----"+$scope.combinaison);
			console.log($scope.compcombo+"-----"+$scope.combinaison);
			//var test=$scope.endgame();
			//console.log("test",test);
			//$scope.boarddisplay=test
			console.log("boarddisplay=====",$scope.boarddisplay);
			if($scope.usercombo==$scope.combinaison)
			{
				$scope.wintest=true;
				$scope.score=Math.floor((1392*30)/$scope.duree);
				$scope.boarddisplay=false;
				$scope.scoredisplay=true;
				$scope.stopTime=true;
				$scope.notif= $scope.data +" gagne le jeux";
				if($scope.userid==$scope.defiant)
				{
					$scope.perdant=$scope.defier;
				}
				else
				{
					$scope.perdant=$scope.defiant;
				}
				socket.emit('terminerjeux',$scope.perdant);
				break;
			}
			if($scope.compcombo==$scope.combinaison)
			{
				$scope.wintest=true;
				$scope.score=0;
				$scope.boarddisplay=false;
				$scope.scoredisplay=true;
				$scope.stopTime=true;
				$scope.notif="Vous avez perdu. l'ordinateur gagne le jeux";
				break;	
			}
			/*if(test)
			{
				$scope.notif="Match null personne ne gagne";
			}*/
	}
	var testfull=$scope.checkfull($scope.tab);
	if($scope.wintest==false)
	{
	if(testfull)
	{
		//$scope.score=0;
		$scope.boarddisplay=false;
		$scope.scoredisplay=true;
		$scope.stopTime=true;
		$scope.notif="Le jeux se termine par un match Nul";
		$scope.notif1="null";
		socket.emit('terminerjeux',$scope.notif1);
		alert($scope.notif);

	}
	}
}
//verifier si la table est pleine ----------------------------------------------------------------------------
$scope.checkfull=function(tab)
{
	var i=0;
	var j=0;
	for(i=0;i<9;i++)
	{
		if((tab[i]=="X") || (tab[i]=="O"))
		{
			j=j+1;
		}
	}
	if(j==9)
	{
		return true;
	}
	else
	{
		return false;
	}
}

//Ordinateur joue et choisi une case -------------------------------------------------------------------------------------
$scope.compturn=function()
{
	$scope.compmove=[];
	var i=0;
	for(i=0;i<9;i++)
	{
		var vide=!isNaN($scope.emptytab[i]);
	if(vide)
		{
			$scope.compmove.push($scope.emptytab[i]);
			console.log("emptytab======",$scope.emptytab);
			console.log("compmove",$scope.compmove);
		}
	}
	$scope.compchoice=Math.floor(Math.random()*$scope.compmove.length);
	console.log("$scope.compchoice=======",$scope.compchoice);
	$scope.choocell($scope.compmove[$scope.compchoice],$scope.pionchoisicomp);
}
//Lancer un defi-------------------------------------------------------------------------------------------------------
$scope.lancerdefi=function(id)
{
	var defdata=[$scope.userid,id];
	$scope.listusers=false;
	$scope.mode='defi';
	$scope.pionchoisi='X';
	$scope.usercombo=$scope.pionchoisi+','+$scope.pionchoisi+','+$scope.pionchoisi;
	socket.emit('defi',defdata);     	
}

//Fin code pour le jeux du morpion------------------------------------------------------------------------------


//Chronometre -------------------------------------------------------------------------------------------------
$scope.tempsDeJeux=function()
	{
		$scope.duree=0;
		//---------------------------------------------------temps
		$scope.stopCountUp=$interval(function () 
		{
			$scope.duree=$scope.duree+1;
			$scope.minute=Math.floor($scope.duree/60);
			$scope.seconde=$scope.duree%60;
			if ($scope.stopTime) 
			{
				
				$interval.cancel($scope.stopCountUp);
				
			}
		},1000);
	
		//temps restant
	}



	
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
//Code pour traiter les socket -------------------------------------------------------------------------------------------------
//Socket de connection ---------------------------------------------------------------------------------------------------------        
        if ($scope.isConnected)
        {
			//socket.emit('userconnect',$scope.userName);

			socket1.on('userconnect', function(data) 
			{
				console.log("socket=============================================",data );
			//alert(data);
			//$interval(function (){$scope.alertConnectionUser = data;},1000}
				$scope.alertConnectionUser1 = true;
				infoStatutUser = data + ' est connecté';
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
//Socket de deconnection ----------------------------------------------------------------------------------------------------------------------
			socket1.on('userDeconnecter', function(data) 
			{
				console.log("déconnection socket=============================================",data );
				$scope.alertConnectionUser1 = true;
				//alert(data);
				$scope.alertConnectionUser1 = true;
				infoStatutUser = data + ' est deconnecté';
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
						
			})		
		}
	});
		
};
// Code pour traiter les sockets dans le cadre d'un defi----------------------------------------------------------------------------------
	socket1.on('defi', function(data) 
		{
			console.log("socket=============================================",data );
			$scope.defiant=data[0];
			$scope.defier=data[1];
				//alert("data")
			if ($scope.userid==data[1])
			{
				$scope.alertConnectionUser1 = true;
				infoStatutUser = "un defi vient d'etre lancé a " + data[1];
				swapInfoUserConnect = 1;
				alert(infoStatutUser);
				$scope.defiantList=[data[0],data[1],$scope.nom];
				console.log("$scope.defiantList-------",$scope.defiantList)
				$scope.listusers=false;
				$scope.mode='defi';
				$scope.pionchoisi='O';
				$scope.usercombo=$scope.pionchoisi+','+$scope.pionchoisi+','+$scope.pionchoisi;
				alert("Mon Pion ---------- "+$scope.pionchoisi);
				$scope.$apply(function(){
				$scope.defidisplay=true;
				});
				
				/*var newConnetion = $interval(function ()
				{
					$scope.alertConnectionUser = infoStatutUser; 
					swapInfoUserConnect = swapInfoUserConnect +1;
					if (swapInfoUserConnect == 3)
						{
							$interval.cancel(newConnetion);
							$scope.alertConnectionUser1 = false;
						}														
				},1000);
				var r = confirm('voulez vous accepter ce defi?');
				if(r==true)
				{
					socket1.emit('repdefi','accepter')
					
				}
				else
				{
					socket1.emit('repdefi','refuser')
					
				}*/
			}
			
		})

//socket on pour recevoir la reponse d'un defi ------------------------------------------------------------------------------------------
	socket1.on('repdefi',function(data)
	{
		//alert("repdefi data",data);
		
		if(data=='accepter')
		{

			alert("Defi accepté");
			//$scope.displaychoixpion=true;
			$scope.$apply(function(){
				$scope.boarddisplay=true;
			});
			$scope.tab=[];
			$scope.tabdisable=[];
			$scope.win=[[0,1,2],
						[3,4,5],
						[6,7,8],
						[0,3,6],
						[2,5,8],
						[0,4,8],
						[2,4,6],
						[1,4,7]];
			$scope.emptytab=[0,1,2,3,4,5,6,7,8];
			$scope.wintest=false;
			$scope.usercombo=$scope.pionchoisi+','+$scope.pionchoisi+','+$scope.pionchoisi;
			console.log("usercombo----------",$scope.usercombo);
			$scope.tempsDeJeux();

		}
		else
		{
			alert("Defi refusé");
			if($scope.userid==$scope.defiant)
			{
				$scope.score=1000;
			}
			$scope.duree=0;

			
			$scope.$apply(function(){
				$scope.boarddisplay=false;
				$scope.scoredisplay=true;
			});
		}
	
	})

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
       			//socket.emit('userDeconnecter',$scope.userName);
       			
			
			});
	};
	
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
     $scope.questiondefi=function()
     {
     	$scope.defidisplay=true;
     	console.log("defiantList-----------",$scope.defiantList);
     }

//Enregistrer un defi---------------------------------------------------------------------------------------------------------
     $scope.defi=function()
     {

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
     		socket1.emit('defi',$scope.challengerid);
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
         $scope.boarddisplay=false;
		 }
  
     //Accepter le defi--------------------------------------------------------------------------------------------------------------
     $scope.accepterdefi=function(id_defie,id_defiant)
	{
		$scope.clear();
		$scope.id_defie=id_defie;
		$scope.id_defiant=id_defiant;
		$scope.reponsedefi="accepter";
		socket.emit('repdefi',$scope.reponsedefi);
	};


      //Refuser le defi---------------------------------------------------------------------------------------------------------------
	
	 $scope.refuserdefi=function(id_defie,id_defiant)
	{

		 $scope.clear();
		$scope.id_defie=id_defie;
		$scope.id_defiant=id_defiant;
		$scope.reponsedefi="refuser";
		$scope.score=0;
		socket.emit('repdefi',$scope.reponsedefi);
		
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
myCtrl.$inject=['$scope','$http','auth','theme','socket','$interval','$compile'];



