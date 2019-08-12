app.controller('myCtrl',function($scope,$http)
{

    $scope.login=function ()
    {
    var url='http://pedago02a.univ-avignon.fr:4500/login/'+$scope.nom+'/'+$scope.pass;

    $http.get(url)
    .then(function(response) 
        {
        $scope.message = "Statut de la connexion";
        $scope.data1=response.data;
        $scope.data=response.data.data;
        $scope.statusMsg=response.data.statusMsg;
        $scope.last_connect=response.data.last_connect;
        });

    }
 });