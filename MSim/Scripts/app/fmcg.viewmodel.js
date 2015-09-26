﻿var fmcgGame = angular.module("fmcgGame", ["ngRoute", "timer"]).controller('fmcgCtrl', ['$scope', '$rootScope', '$http', '$timeout', "PlayerDataService", "TimerService",
    function ($scope, $rootScope, $http, $timeout, PlayerDataService, TimerService) {

        $scope.FMCGAdminDataModel = {
            Result: ko.observableArray([])
        }

        //$scope.timer = TimerService;
        $scope.q1time = 1800;
        $scope.items = [];
        $scope.isQuarter1Over = TimerService.isQuarter1Over;
        $scope.isQuarter2Over = false;
        $scope.isQuarter3Over = false;
        $scope.isQuarter4Over = false;

        $scope.PackagingMaterial = [];
        $scope.TrainingType = [];

        $scope.Q1finished = function () {
            TimerService.setQuarter1State(true);
            $scope.isQuarter1Over = TimerService.isQuarter1Over
            $scope.$apply();
            pushMessage("danger", "Quarter 1 Completed! Proceed to Quarter 2.")

            //$scope.isQuarter1Over = true;
        }

        //$scope.$watch('TimerService.isQuarter1Over', function (newval) {
        //     $scope.$apply();
        //});

        $scope.getPlayerData = function () {
            PlayerDataService.getPlayerData().then(function (response) {
                $scope.FMCGDataModel = response;
                $scope.FMCGDataModel.TotalATLExpenseCalculated = function () {
                    return $scope.FMCGDataModel.TVAds +
                        $scope.FMCGDataModel.NewspaperAds +
                        $scope.FMCGDataModel.HoardingAds
                }
                $scope.FMCGDataModel.TotalBTLExpenseCalculated = function () {
                    return $scope.FMCGDataModel.Promoters +
                        $scope.FMCGDataModel.Sampling +
                        $scope.FMCGDataModel.InShopBranding
                }
            }, function (response) {
                console.log("Error")
            })

            PlayerDataService.getStaticData().success(function (data) {
                $scope.PackagingMaterial = data[0].data["packagingMaterial"];
                $scope.TrainingType = data[0].data["trainingType"];

                console.log("static data returned");
            }).error(function () {
                console.log("cant fetch static data");
            })

        };
        $scope.savePlayerData = function () {
            $scope.FMCGDataModel.TotalATLExpense = $scope.FMCGDataModel.TotalATLExpenseCalculated();
            $scope.FMCGDataModel.TotalBTLExpense = $scope.FMCGDataModel.TotalBTLExpenseCalculated();
            PlayerDataService.savePlayerData($scope.FMCGDataModel).then(function (response) {
                console.log("player data saved to server")
            }, function (response) {
                console.log("Failed to save data");
            });
        }


        $scope.init = function () {
            $scope.getPlayerData();
            var poller = function () {
                choice = {
                    selectedGameId: 1,
                    code: "1234A",
                }
                $http.post("api/fmcgservice/GetTimeLeft", choice).then(function (game) {
                    if (game.data["q1started"] == false) {
                        $scope.$broadcast('timer-set-countdown', 1800);
                        $scope.$broadcast('timer-stop');
                    }
                    else {
                        var t = game.data["q1timeleft"];
                        if (t < 1) {
                            TimerService.setQuarter1State(true);
                            $scope.isQuarter1Over = TimerService.isQuarter1Over;
                            choice = {
                                selectedGameId: 1,
                                code: "1234A",
                            }
                            $http.post("api/fmcgservice/GetFinancialReport", choice).then(function (report) {
                                $scope.items = report.data["Financials"];

                            });
                            $scope.$broadcast('timer-stop');
                        }
                        else {
                            TimerService.setQuarter1State(false);
                            $scope.isQuarter1Over = TimerService.isQuarter1Over;
                            $scope.$broadcast('timer-set-countdown', t);
                            $scope.$broadcast('timer-start');
                        }
                    }
                });
            }
            poller();
            setInterval(poller, 5000);
        }
        $scope.init();
    }]);

fmcgGame.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
             when('/Dashboard', {
                 templateUrl: 'templates/industries/fmcg/Main.html'
             }).
            when('/ManagingChannelPartner', {
                templateUrl: 'templates/industries/fmcg/channelpartners/ChannelPartnerManagement.html',
                controller: 'fmcgCtrl'
            }).
            when('/ManagingSalesTeam', {
                templateUrl: 'templates/industries/fmcg/sales/SalesTeamManagement.html',
                controller: 'fmcgCtrl'
            }).
            when('/ManagingPromotions', {
                templateUrl: 'templates/industries/fmcg/Promotions/PromotionManagement.html',
                controller: 'fmcgCtrl'
            }).
            when('/ManagingProduct', {
                templateUrl: 'templates/industries/fmcg/Products/ProductManagement.html',
                controller: 'fmcgCtrl'
            }).
            when('/Q1-Reports', {
                templateUrl: 'templates/industries/fmcg/FinancialReports/Q1-Reports.html',
                controller: 'fmcgCtrl',

            })
    }]);

//http://stackoverflow.com/questions/18274976/make-bootstrap-well-semi-transparent


fmcgGame.factory("TimerService", ['$http', '$q', "$rootScope", function TimerService($http, $q, $rootScope) {
    var service = {
        isQuarter1Over: false,
        q1timeleft: 0,
        isQuarter2Over: false,
        isQuarter3Over: false,
        isQuarter4Over: false,
        getQuarter1State: getQuarter1State,
        setQuarter1State: setQuarter1State,
        startPolling: startPolling,
        getQ1TimeLeft: getQ1TimeLeft,

    };
    return service;

    function getQuarter1State() {
        return service.isQuarter1Over;
    }

    function setQuarter1State(state) {
        service.isQuarter1Over = state;
    }

    function startPolling() {
        // Check to make sure poller doesn't already exist

        var poller = function () {
            choice = {
                selectedGameId: 1,
                code: "1234A",
            }
            $http.post("api/fmcgservice/GetTimeLeft", choice).then(function (game) {
                service.q1timeleft = 50;// game.data["q1timeleft"];
            });
        }
        setInterval(poller, 5000);
    }

    function getQ1TimeLeft() {
        choice = {
            selectedGameId: 1,
            code: "1234A",
        }
        $http.post("api/fmcgservice/GetTimeLeft", choice).then(function (game) {
            if (game.data["q1started"] == false) {
                return 1800;
            }
            else {
                return game.data["q1timeleft"];
            }
        });
    }

}]);

fmcgGame.factory('PlayerDataService', ['$http', '$q', '$rootScope',
    function PlayerDataService($http, $q, $rootScope) {
        // interface
        var service = {
            playerData: [],
            staticData: [],
            iscached: false,
            isstaticdatacached: false,
            getPlayerData: getPlayerData,
            savePlayerData: saveplayerData,
            getStaticData: getStaticData
        };
        return service;

        // implementation
        function getPlayerData() {
            var def = $q.defer();
            if (service.iscached == false) {
                $http.post('/api/fmcgservice/GetPlayerData', $rootScope.gameOfChoice).
                  success(function (response) {
                      service.playerData = response;
                      service.iscached = true;
                      console.log("player data fetched from server")
                      def.resolve(response);

                  }).error(function (response) {
                      def.reject("Failed to get playerdata");
                  });
            }
            else {
                console.log("player data fetched from cache")
                def.resolve(service.playerData);
            }
            return def.promise;
        }

        function saveplayerData(playerData) {
            var def = $q.defer();
            $http.post('/api/fmcgservice/SavePlayerData', playerData).
              success(function (response) {
                  pushMessage("success", "Data saved.")
                  service.playerData = playerData;
                  def.resolve(response);

              }).error(function (response) {
                  pushMessage("danger", "Data not saved. Try again.")
                  def.reject(response);
              });
            return def.promise;
        }

        function getStaticData() {
            return $http.get("api/fmcgservice/GetStaticData")
            .success(function (data) {
                service.staticData = data;
            });
        }

    }]);






function pushMessage(t, mess) {
    $.notify({
        // options
        message: mess
    }, {
        // settings
        type: t
    });
}