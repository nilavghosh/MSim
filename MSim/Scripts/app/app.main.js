appmain.factory("registrationService", ["$http", "$rootScope", "$q", "$location", function ($http, $rootScope, $q, $location) {
    var url = '/api/appmain/CheckRegistration';
    var service = {};
    service.CheckRegistration = function () {
        return $http.post(url, $rootScope.selectedgame).then(
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



appmain.config(['$httpProvider', function ($httpProvider) {
    //$httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    //$httpProvider.defaults.headers.post = {
    //    'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
    //    'Content-Type': 'application/json'
    //}
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.post['Cache-Control'] = 'no-cache';
    $httpProvider.interceptors.push('httpResponseErrorInterceptor');
}]);



angular.module("appMain").config(["$stateProvider", function (t) {
    t.state("landing", {
        templateUrl: "/templates/landing.html"
    })
    .state("index", {
        templateUrl: "/templates/admin/index.html"
    })
    .state("index.admin", {
        url: "/admin",
        templateUrl: "/templates/admin/templates/admin.html",
        controller: "adminCtrl"
    })
    .state("index.playgames", {
        url: "/playgames",
        templateUrl: "/templates/admin/templates/playgames.html",
        params: {
            seldate: null,
        },
        resolve: {
            games: function ($http, $stateParams) {
                return $http.post('/api/appmain/GetGamesForDate', $stateParams.seldate).then(function (response) {
                    return response.data;
                });
            }
        },
        controller: function ($scope, games) {
            $scope.gridOptions.data = games;
            //$scope.items = financials;
        }
    })
    .state("index.editprofile", {
        url: "editprofile",
        templateUrl: "/templates/admin/templates/editprofile.html"
    })
    .state('playgame', {
        url: "/playGame/:industry",
        templateUrl: function (stateParams) {
            return '/templates/industries/' + stateParams.industry + '/Main2.html'
        },
        resolve: {
            userRegistration: ['registrationService', function (registrationService) {
                return registrationService.CheckRegistration()
            }]
        }
    })
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

function MasterCtrl($scope, e, $http, $location, $rootScope, $auth, $state) {
    var o = 992;
    $scope.getWidth = function () {
        return window.innerWidth
    },
    $scope.$watch($scope.getWidth, function (g) {
        $scope.toggle = g >= o ? angular.isDefined(e.get("toggle")) ? e.get("toggle") ? !0 : !1 : !0 : !1
    }),
    $scope.toggleSidebar = function () {
        $scope.toggle = !$scope.toggle, e.put("toggle", $scope.toggle)
    },
    window.onresize = function () {
        $scope.$apply()
    }
    $scope.dt = new Date();
    $scope.gridOptions = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: false,
        rowHeight: 35,
        showGridFooter: true,
        onRegisterApi: function (gridApi) {
            $scope.myGridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, $scope.gameSelected);
        }
    };


    $scope.gridOptions.columnDefs = [
      { name: 'Industry', field: 'industry' },
      { name: 'Game', field: 'game' },
      { name: 'Status', field: 'status' }
    ];

    $scope.go = function (hash) {
        $location.path(hash + '/' + $scope.selectedgame.industry);
    }

    $scope.gameSelected = function (row) {
        $rootScope.selectedgame = $scope.myGridApi.selection.getSelectedRows()[0];
    }

    $scope.getGames = function () {

        $http.post('/api/appmain/GetGamesForDate', $scope.dt).
       then(function (response) {
           $scope.gridOptions.data = response.data;

       }, function (response) {
           //  pushMessage(response.statusText, 'info');
       });
    }

    $scope.submitLogin = function () {

        var loginData = {
            grant_type: 'password',
            username: $scope.loginForm.email,
            password: $scope.loginForm.password
        };

        $auth.submitLogin($.param(loginData))
          .then(function (resp) {
              $('#loginModal').modal('hide');
              //alert("Login Success"); // handle success response
          })
          .catch(function (resp) {
              alert("Login Failed");  // handle error response
          });

        //$.ajax({
        //    type: 'POST',
        //    url: '/api/auth/sign_in',
        //    data: loginData
        //}).done(function (data) {
        //    //self.user(data.userName);
        //    //// Cache the access token in session storage.
        //    //sessionStorage.setItem(tokenKey, data.access_token);
        //    alert("Login Success");
        //}).fail(function () {
        //    alert("Login Failed");
        //});
    };


    $scope.submitRegistration = function () {

        var registrationData = {
            Email: $scope.registrationForm.email,
            Password: $scope.registrationForm.password,
            ConfirmPassword: $scope.registrationForm.password
        };

        var loginData = {
            grant_type: 'password',
            username: $scope.registrationForm.email,
            password: $scope.registrationForm.password
        };




        $auth.submitRegistration(registrationData)
          .then(function (resp) {
              alert("Registration Success"); // handle success response
              $auth.submitLogin($.param(loginData))
              .then(function (resp) {
                  $('#loginModal').modal('hide');
                  //alert("Login Success"); // handle success response
              })
          .catch(function (resp) {
              alert("Login Failed");  // handle error response
          });
          })
          .catch(function (resp) {
              alert("Registration Failed - " + resp.data.modelState[""][0]);  // handle error response
          });
    };


    $scope.logIn = function () {
        openLoginModal();
    }

    $scope.logOutfromHome = function () {
        $auth.signOut()
         .then(function (resp) {
         })
         .catch(function (resp) {
         });
    }

    $rootScope.logOut = function () {
        $auth.signOut()
         .then(function (resp) {
         })
         .catch(function (resp) {
         });
        window.location.href = window.location.origin;
    }
    $rootScope.simgames = function () {
        $state.go("index.admin");
    }
}
angular.module("appMain").controller("MasterCtrl", ["$scope", "$cookieStore", "$http", "$location", "$rootScope", "$auth", "$state", MasterCtrl]);



angular.module("app.controllers").controller("adminCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.admingridOptions = {
        enableRowSelection: true,
        enableSelectAll: false,
        multiSelect: false,
        rowHeight: 35,
        showGridFooter: true,
        onRegisterApi: function (gridApi) {
            $scope.adminGridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, $scope.admingameSelected);
        }
    };
    $scope.admingridOptions.columnDefs = [
     { name: 'Industry', field: 'industry' },
     { name: 'Game', field: 'game' },
     { name: 'Status', field: 'status' }
    ];

    $scope.admingameSelected = function (row) {
        $scope.selectedgame = $scope.adminGridApi.selection.getSelectedRows()[0];
        $http.post('/api/appmain/GetPlayerStatusForGame', $scope.selectedgame).
        then(function (response) {
            $scope.players = response.data;

        }, function (response) {
            //  pushMessage(response.statusText, 'info');
        });
    }


    $scope.startGame = function () {
        $http.post('/api/appmain/StartGame', $scope.selectedgame).
        then(function (response) {
            pushMessage("success", "Game Started!");
        }, function (response) {
            //  pushMessage(response.statusText, 'info');
        });
    }

    $scope.init = function () {
        $http.post('/api/appmain/GetAdminGamesForToday').
       then(function (response) {
           $scope.admingridOptions.data = response.data;

       }, function (response) {
           //  pushMessage(response.statusText, 'info');
       });
    };

    $scope.init();
}]);



appmain.factory('httpResponseErrorInterceptor', function ($q, $injector) {
    var failureCount = 0;
    var failureUrl = "";
    return {
        'responseError': function (response) {
            if (response.status == 400 || (response.status >= 404 && response.status <= 599) || response.status == -1) {
                if (failureCount == 0 || failureUrl != response.config.url) {
                    failureCount = 1;
                    failureUrl = response.config.url;
                }
                else if (failureUrl == response.config.url) {
                    failureCount++;
                }

                if (failureCount <= 3) {
                    // should retry
                    var $http = $injector.get('$http');
                    return $http(response.config);
                }
                else {
                    pushMessage("danger", "Check your network connection!");
                }
            }
            else {
                failureCount = 0;
                failureUrl = "";
            }
            // give up
            return $q.reject(response);
        }
    };
});