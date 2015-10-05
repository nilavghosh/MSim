var appmain = angular.module("appMain", ["ngRoute", "fmcgGame", "ui.bootstrap"]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    $httpProvider.defaults.headers.post = {
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
        'Content-Type': 'application/json'
    }
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.post['Cache-Control'] = 'no-cache';
}]);

appmain.controller('appMainCtrl', ['$scope', '$rootScope', '$location', '$http', '$timeout', function ($scope, $rootScope, $location, $http, $timeout) {
    $scope.go = function (hash) {
        $location.path(hash + '/' + $rootScope.gameOfChoice.selectedIndustry.industry);
    }


    $rootScope.gameOfChoice = {
        selectedIndustry: "",
        selectedGameId: "",
        code: "",
    }

    $scope.getGames = function () {
        $http.get('/api/appmain/GetGames').
        then(function (response) {
            $scope.gameCollection = response.data;

        }, function (response) {
            //  pushMessage(response.statusText, 'info');
        });
    }


    $scope.init = function () {
        $scope.getGames();
    }
    $scope.init();

}]);


appmain.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
         when('/', {
             templateUrl: 'templates/admin/Index.html',
             controller: 'appMainCtrl'
         }).
         when('/playGame/:industry', {
             templateUrl: function (params) {
                 return 'templates/industries/' + params.industry + '/Main.html'
             },
             resolve: {
                 userRegistration: ['registrationService', function (registrationService) {
                     return registrationService.CheckRegistration()
                 }]
             }
         })
}]);


appmain.factory("registrationService", ["$http", "$rootScope", "$q", "$location", function ($http, $rootScope, $q, $location) {
    var url = 'api/appmain/CheckRegistration';
    var service = {};
    service.CheckRegistration = function () {
        return $http.post(url, $rootScope.gameOfChoice).then(
        function (isRegistered) {
            if (isRegistered.data == true) {
                return $q.resolve();
            }
            else {
                $location.path("/");
                //return $q.reject();
            }
        },
        function (error) {
            alert(error);
        });
    }
    return service;
}]);