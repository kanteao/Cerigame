var app=angular.module("myApp", []);
app.service('auth',auth);
app.service('session',sessionService);
app.service('theme',theme);
app.service('socket',treatSocket);
app.controller('myCtrl',myCtrl);
