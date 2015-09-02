var appmain = angular.module("appMain", ["ngRoute", "fmcgGame", "ui.bootstrap"]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    $httpProvider.defaults.headers.post = {
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
        'Content-Type': 'application/json'
    }
}]);

appmain.controller('appMainCtrl', ['$scope', '$location', '$http', '$timeout', function ($scope, $location, $http, $timeout) {
    $scope.go = function (hash) {
        $location.path(hash);
    }
}]);


appmain.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
             when('/', {
                 templateUrl: 'templates/Main.html',
                 controller: 'appMainCtrl'
             }).
             when('/fmcgGame', {
                 templateUrl: 'templates/industries/fmcg/Main.html',
                 controller: 'fmcgCtrl'
             })
    }]);