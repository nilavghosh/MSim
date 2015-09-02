var appmain = angular.module("appMain", ["ngRoute","fmcgGame","ui.bootstrap"]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    $httpProvider.defaults.headers.post = {
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
        'Content-Type': 'application/json'
    }
}]);

appmain.controller('appMainCtrl', function ($scope, $http, $timeout) {

});


appmain.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
             when('/', {
                 templateUrl: 'templates/Main.html',
                 controller: 'appMainCtrl'
             })
    }]);