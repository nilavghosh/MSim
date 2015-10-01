var fmcgGame = angular.module("fmcgGame", ["ngRoute", "timer", "chart.js"]).controller('fmcgCtrl', ['$scope', '$rootScope', '$http', '$interval', "PlayerDataService", "TimerService",
    function ($scope, $rootScope, $http, $interval, PlayerDataService, TimerService) {

        $scope.startQtr = function () {
            var choice = {
                "selectedGameId": 1,
                "code": "1234A",
                "username": "nilavghosh@gmail.com",
                "selectedquarter": 1
            }
            $http.post("api/fmcgservice/StartQuarter", choice).then(function (report) {
                alert("started");
            });
        }

        $scope.FMCGAdminDataModel = {
            Result: ko.observableArray([])
        }

        $scope.doughlabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.doughdata = [300, 500, 100];

        $scope.revenuebarlabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        //$scope.barseries = ['Series A', 'Series B'];
        $scope.revenuebardata = [
          [65, 59, 80, 81, 56, 55, 40],
          [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.barlabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        //$scope.barseries = ['Series A', 'Series B'];
        $scope.bardata = [
          [65, 59, 80, 81, 56, 55, 40],
          [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.radarlabels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

        $scope.radardata = [
          [65, 59, 90, 81, 56, 55, 40],
          [28, 48, 40, 19, 96, 27, 100]
        ];


        //$scope.timer = TimerService;
        $scope.q1time = 1800;
        $scope.selectedquarter = TimerService.selectedquarter;
        $scope.items = [];
        $scope.isQuarter1Started = TimerService.isQuarter1Started;
        $scope.isQuarter2Started = TimerService.isQuarter2Started;
        $scope.isQuarter3Started = TimerService.isQuarter3Started;
        $scope.isQuarter4Started = TimerService.isQuarter4Started;
        $scope.isQuarter1Over = TimerService.isQuarter1Over;
        $scope.isQuarter2Over = TimerService.isQuarter2Over;
        $scope.isQuarter3Over = TimerService.isQuarter3Over;
        $scope.isQuarter4Over = TimerService.isQuarter4Over;
        $scope.isSelectedQuarterOver = false; //$scope["isQuarter" + $scope.selectedquarter + "Over"];
        $scope.PackagingMaterial = [];
        $scope.TrainingType = [];

        $scope.Q1finished = function () {
            $scope.$apply(function () {
                TimerService["isQuarter" + $scope.selectedquarter + "Over"] = true;
                $scope["isQuarter" + $scope.selectedquarter + "Over"] = true;
                $scope.isSelectedQuarterOver = true;
            });
            pushMessage("danger", "Quarter " + $scope.selectedquarter + " Completed! Proceed to Quarter " + ($scope.selectedquarter + 1) + ".");
        }
        $scope.setServiceSelectedQuarter = function (qtr) {
            $scope.selectedquarter = qtr;
            TimerService.selectedquarter = $scope.selectedquarter;
            $scope.isSelectedQuarterOver = false; //$scope["isQuarter" + $scope.selectedquarter + "Over"];
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
                    selectedquarter: $scope.selectedquarter
                }
                $http.post("api/fmcgservice/GetTimeLeft", choice).then(function (game) {
                    if (game.data["qstarted"] == false) {
                        $scope.$broadcast('timer-set-countdown', 1800);
                        $scope.$broadcast('timer-stop');
                    }
                    else {
                        TimerService["isQuarter" + $scope.selectedquarter + "Started"] = true;
                        $scope["isQuarter" + $scope.selectedquarter + "Started"] = true;
                        var t = game.data["qtimeleft"];
                        if (t < 1) {
                            TimerService["isQuarter" + $scope.selectedquarter + "Over"] = true;
                            $scope["isQuarter" + $scope.selectedquarter + "Over"] = true;
                            $scope.$broadcast('timer-stop');
                            $scope.isSelectedQuarterOver = $scope["isQuarter" + $scope.selectedquarter + "Over"];
                        }
                        else {
                            TimerService["isQuarter" + $scope.selectedquarter + "Over"] = false;
                            $scope["isQuarter" + $scope.selectedquarter + "Over"] = false;
                            $scope.isSelectedQuarterOver = $scope["isQuarter" + $scope.selectedquarter + "Over"];
                            $scope.$broadcast('timer-set-countdown', t);
                            $scope.$broadcast('timer-start');
                            if (t <= 15 && t >= 10)
                            {
                                pushMessage("warning", "Quarter " + $scope.selectedquarter + " will finish shortly. Save your data!");
                            }
                        }
                    }
                    var choice = {
                        selectedGameId: 1,
                        code: "1234A",
                        selectedquarter: $scope.selectedquarter
                    }
                    $http.post("api/fmcgservice/GetStartedQuarters", choice).then(function (startedquarters) {
                        $scope.isQuarter1Started = startedquarters.data["q1started"];
                        $scope.isQuarter2Started = startedquarters.data["q2started"];
                        $scope.isQuarter3Started = startedquarters.data["q3started"];
                        $scope.isQuarter4Started = startedquarters.data["q4started"];
                        TimerService.isQuarter1Started = startedquarters.data["q1started"];
                        TimerService.isQuarter2Started = startedquarters.data["q2started"];
                        TimerService.isQuarter3Started = startedquarters.data["q3started"];
                        TimerService.isQuarter4Started = startedquarters.data["q4started"];
                    });
                });
            }
            poller();
            $interval(poller, 5000);
            if (TimerService["isQuarter" + $scope.selectedquarter + "Over"] == true) {
                choice = {
                    selectedGameId: 1,
                    code: "1234A",
                    selectedquarter: $scope.selectedquarter
                }
                $http.post("api/fmcgservice/GetFinancialReport", choice).then(function (report) {
                    $scope.items = report.data["Financials"];
                });

                $http.post("api/fmcgservice/GetMarketReport", choice).then(function (report) {
                    $scope.doughlabels = report.data["Players"][0];
                    $scope.doughdata = report.data["SalesReportValues"][0];
                    $scope.barlabels = report.data["Players"][0];
                    $scope.bardata = report.data["PATReportValues"];
                    $scope.revenuebarlabels = report.data["Players"][0];
                    $scope.revenuebardata = report.data["RevenueReportValues"];
                    $scope.radarlabels = report.data["Players"][0];
                    $scope.radardata = report.data["SalesReportValues"];
                });
            }
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
                controller: 'fmcgCtrl'

            }).
            when('/MarketReports', {
                templateUrl: 'templates/industries/fmcg/MarketReports/MarketReports.html',
                controller: 'fmcgCtrl'
            }).
            when('/StartQuarter', {
                templateUrl: 'templates/industries/fmcg/Admin/StartQuarter.html',
                controller: 'fmcgCtrl'
            })
    }]);

//http://stackoverflow.com/questions/18274976/make-bootstrap-well-semi-transparent


fmcgGame.factory("TimerService", ['$http', '$q', "$rootScope", function TimerService($http, $q, $rootScope) {
    var service = {
        q1timeleft: 0,
        q2timeleft: 0,
        q3timeleft: 0,
        q4timeleft: 0,
        selectedquarter: 1,
        isQuarter1Over: true,
        isQuarter2Over: true,
        isQuarter3Over: true,
        isQuarter4Over: true,
        isQuarter1Started: false,
        isQuarter2Started: false,
        isQuarter3Started: false,
        isQuarter4Started: false,
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
            if (game.data["qstarted"] == false) {
                return 1800;
            }
            else {
                return game.data["qtimeleft"];
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
            selectedquarter: 1,
            getPlayerData: getPlayerData,
            savePlayerData: saveplayerData,
            getStaticData: getStaticData
        };
        return service;

        // implementation
        function getPlayerData() {
            var def = $q.defer();
            if (service.iscached == false) {
                var gameinfo = $rootScope.gameOfChoice;
                gameinfo["selectedquarter"] = service.selectedquarter;
                $http.post('/api/fmcgservice/GetPlayerData', gameinfo).
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