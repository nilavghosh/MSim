//var appmain = angular.module("appMain", ["ngRoute", "fmcgGame", "ui.bootstrap"]);
//appmain.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
//    $httpProvider.defaults.headers.post = {
//        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
//        'Content-Type': 'application/json'
//    }
//    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
//    $httpProvider.defaults.headers.post['Cache-Control'] = 'no-cache';
//}]);

//appmain.controller('appMainCtrl', ['$scope', '$rootScope', '$location', '$http', '$timeout', function ($scope, $rootScope, $location, $http, $timeout) {
//    $scope.go = function (hash) {
//        $location.path(hash + '/' + $rootScope.gameOfChoice.selectedIndustry.industry);
//    }
//    $scope.max = 200;

//    $scope.random = function () {
//        var value = Math.floor((Math.random() * 100) + 1);
//        var type;

//        if (value < 25) {
//            type = 'success';
//        } else if (value < 50) {
//            type = 'info';
//        } else if (value < 75) {
//            type = 'warning';
//        } else {
//            type = 'danger';
//        }

//        $scope.showWarning = (type === 'danger' || type === 'warning');

//        $scope.dynamic = value;
//        $scope.type = type;
//    };
//    $scope.random();

//    $scope.randomStacked = function () {
//        $scope.stacked = [];
//        var types = ['success', 'info', 'warning', 'danger'];

//        //for (var i = 0, n = Math.floor((Math.random() * 4) + 1) ; i < n; i++) {
//        //    var index = Math.floor((Math.random() * 4));
//        //    $scope.stacked.push({
//        //        value: Math.floor((Math.random() * 30) + 1),
//        //        type: types[index]
//        //    });
//        //}
//        $scope.stacked.push({
//            value: 25,
//            type: 'info'
//        });
//        $scope.stacked.push({
//            value: 1,
//            type: 'danger'
//        });
//        $scope.stacked.push({
//            value: 25,
//            type: 'warning'
//        });
//        $scope.stacked.push({
//            value: 25,
//            type: 'danger'
//        });
//        $scope.stacked.push({
//                    value: 25,
//                    type: 'success'
//                });

//    };
//    $scope.randomStacked();





//    $rootScope.gameOfChoice = {
//        selectedIndustry: "",
//        selectedGameId: "",
//        code: "",
//    }


//    $scope.getGames = function () {
//        $http.get('/api/appmain/GetGames').
//        then(function (response) {
//            $scope.gameCollection = response.data;

//        }, function (response) {
//            //  pushMessage(response.statusText, 'info');
//        });
//    }


//    $scope.init = function () {
//        $scope.getGames();
//    }
//    $scope.init();

//}]);


//appmain.config(['$routeProvider',
//function ($routeProvider) {
//    $routeProvider.
//         when('/', {
//             templateUrl: 'templates/Main.html',
//             controller: 'appMainCtrl'
//         }).
//         when('/playGame/:industry', {
//             templateUrl: function (params) {
//                 return 'templates/industries/' + params.industry + '/Main.html'
//             },
//             resolve: {
//                 userRegistration: ['registrationService', function (registrationService) {
//                     return registrationService.CheckRegistration()
//                 }]
//             }
//         })
//}]);


//appmain.factory("registrationService", ["$http", "$rootScope", "$q", "$location", function ($http, $rootScope, $q, $location) {
//    var url = 'api/appmain/CheckRegistration';
//    var service = {};
//    service.CheckRegistration = function () {
//        return $http.post(url, $rootScope.gameOfChoice).then(
//        function (isRegistered) {
//            if (isRegistered.data == true) {
//                return $q.resolve();
//            }
//            else {
//                $location.path("/");
//                //return $q.reject();
//            }
//        },
//        function (error) {
//            alert(error);
//        });
//    }
//    return service;
//}]);


appMain = angular.module("appMain", ["ngRoute", "ui.bootstrap", "ui.router", "ngCookies"]);
"use strict";

angular.module("appMain").config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function (t, e, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    t.state("admin", {
        url: "/logindash",
        templateUrl: "templates/admin/index.html"
    })
    .state("admin.tables", {
        url: "tables",
        templateUrl: "templates/admin/templates/tables.html"
    }),
    e.otherwise("/")
}]);

function rdLoading() {
    var d = {
        restrict: "AE",
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return d
}
angular.module("appMain").directive("rdLoading", rdLoading);

function rdWidgetBody() {
    var d = {
        requires: "^rdWidget",
        scope: {
            loading: "@?",
            classes: "@?"
        },
        transclude: !0,
        template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
        restrict: "E"
    };
    return d
}
angular.module("appMain").directive("rdWidgetBody", rdWidgetBody);

function rdWidgetFooter() {
    var e = {
        requires: "^rdWidget",
        transclude: !0,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: "E"
    };
    return e
}
angular.module("appMain").directive("rdWidgetFooter", rdWidgetFooter);

function rdWidgetTitle() {
    var e = {
        requires: "^rdWidget",
        scope: {
            title: "@",
            icon: "@"
        },
        transclude: !0,
        template: '<div class="widget-header"><i class="fa" ng-class="icon"></i> {{title}} <div class="pull-right" ng-transclude></div></div>',
        restrict: "E"
    };
    return e
}
angular.module("appMain").directive("rdWidgetHeader", rdWidgetTitle);

function rdWidget() {
    var d = {
        transclude: !0,
        template: '<div class="widget" ng-transclude></div>',
        restrict: "EA"
    };
    return d
}
angular.module("appMain").directive("rdWidget", rdWidget);

function AlertsCtrl(e) {
    e.alerts = [{
        type: "success",
        msg: "Thanks for visiting! Feel free to create pull requests to improve the dashboard!"
    }, {
        type: "danger",
        msg: "Found a bug? Create an issue with as many details as you can."
    }], e.addAlert = function () {
        e.alerts.push({
            msg: "Another alert!"
        })
    }, e.closeAlert = function (t) {
        e.alerts.splice(t, 1)
    }
}
angular.module("appMain").controller("AlertsCtrl", ["$scope", AlertsCtrl]);

function MasterCtrl(t, e) {
    var o = 992;
    t.getWidth = function () {
        return window.innerWidth
    },
    t.$watch(t.getWidth, function (g) {
        t.toggle = g >= o ? angular.isDefined(e.get("toggle")) ? e.get("toggle") ? !0 : !1 : !0 : !1
    }),
    t.toggleSidebar = function () {
        t.toggle = !t.toggle, e.put("toggle", t.toggle)
    },
    window.onresize = function () {
        t.$apply()
    }
}
angular.module("appMain").controller("MasterCtrl", ["$scope", "$cookieStore", MasterCtrl]);