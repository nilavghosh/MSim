var fmcgGame = angular.module("fmcgGame", ["ngRoute", "timer"]).controller('fmcgCtrl', ['$scope', '$rootScope', '$http', '$timeout', "PlayerDataService",
    function ($scope, $rootScope, $http, $timeout, PlayerDataService) {

        $scope.FMCGAdminDataModel = {
            Result: ko.observableArray([])
        }

        $scope.PackagingMaterial = [];
        $scope.TrainingType = [];

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
                consol.log("cant fetch static data");
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
            })
    }]);

//http://stackoverflow.com/questions/18274976/make-bootstrap-well-semi-transparent


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



fmcgGame.service('PlayerDataService2', ["$rootScope", "$http", function ($rootScope, $http) {
    this.playerData = {
        Quarter: 0,
        PTD: 43,
        DistributorMargin: 0,
        RetailerMargin: 0,
        CompanyMargin: 0,
        NoOfSalesmen: 0,
        AvgSalary: 0,
        Training: 0,
        TVAds: 21,
        NewspaperAds: 0,
        HoardingAds: 0,
        TotalATLExpense: 0,
        Promoters: 0,
        Sampling: 0,
        InShopBranding: 0,
        TotalBTLExpense: 0,
        MustardOilPercentage: 0,
        PalmOilPercentage: 0,
        PackagingMaterial: 0
    };

    //$http.post('/api/fmcgservice/GetPlayerData', $rootScope.gameOfChoice).
    //    then(function (response) {
    //        playerData = response.data;
    //    }, function (response) {
    //        //  pushMessage(response.statusText, 'info');
    //    });

    this.cached = false;
    this.getPlayerData = function () {
        if (this.cached == true) {
            return this.playerData;
        }
        else {
            $http.post('/api/fmcgservice/GetPlayerData', $rootScope.gameOfChoice).
                then(function (response) {

                    return response.data;

                }, function (response) {
                    //  pushMessage(response.statusText, 'info');
                });
        }
    }

    this.savePlayerData = function (pdata) {
        this.playerData = pdata;
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