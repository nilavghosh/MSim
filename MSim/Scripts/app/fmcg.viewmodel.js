var fmcgGame = angular.module("fmcgGame", ["ui.router", "chart.js", "ui.knob", "n3-pie-chart", "nvd3", "treasure-overlay-spinner"]).controller('fmcgCtrl', ['$scope', '$rootScope', '$http', '$interval', '$timeout', "$state", "PlayerDataService", "TimerService",
    function ($scope, $rootScope, $http, $interval, $timeout, $state, PlayerDataService, TimerService) {

        $scope.$state = $state;
        $scope.animationsEnabled = true;

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.exportFinancials = function () {
            var choice = {
                selectedGameId: 1,
                code: "1234A",
                selectedquarter: $scope.selectedquarter
            }
            //return $http.post("api/fmcgservice/GetFinancialsasExcel", choice).then(function (data) {
            //    return data;
            //});
            $http({
                url: 'api/fmcgservice/GetFinancialsasExcel2',
                data: choice,
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                responseType: 'arraybuffer'
            }).success(function (data, status, headers, config) {
                var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                //headers('Content-Disposition').split("=")[1]
                var objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);
            }).error(function (data, status, headers, config) {
                //upload failed
            });

        }

        $rootScope.spinner = {
            active: false,
            on: function () {
                this.active = true;
            },
            off: function () {
                this.active = false;
            }
        }
        $rootScope.$on('$stateChangeStart', function () {
            $rootScope.spinner.on();
        });
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.spinner.off();
        });

        $scope.gameStarted = false;

        $scope.notStartedAlert = function (qtr) {
            pushMessage("danger", "Quarter " + qtr + " not started yet.");
        }
        $scope.notCompletedAlert = function () {
            pushMessage("danger", "Game not completed yet.");
        }
        $scope.setCompletedandActive = function () {
            $scope.gamecompletedactive = true;
            $state.go('playgame.Results');
            $scope.selectedquarter = 4;
        }

        $scope.startedquarter = 1;

        $scope.calculateFMCGClient = function () {
            $scope.FMCGClient.ExMILL = function () { FMCGDataModel.MustardOilPercentage * 2 };
        }



        //$scope.$watch("x*y", function (result) {
        //    console.log('new result', result);
        //    $scope.r = result;
        //});


        var colorArray = ['#1f77b4', '#d62728', '#ff7f0e', '#2ca02c', '#9467bd', '#FF6666', '#FFE6E6'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }

        $scope.atlbtloptions = {
            chart: {
                type: 'pieChart',
                height: 400,
                x: function (d) { return d.key; },
                y: function (d) { return d.y; },
                color: $scope.colorFunction(),
                showLabels: true,
                transitionDuration: 500,
                pieLabelsOutside: true,
                donutLabelsOutside: true,
                labelThreshold: 0.01,
                donutRatio: 0.4,
                donut: true,
                showLegend: false,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.atldata = [
            {
                key: "TVAds(%)",
                y: 5
            },
            {
                key: "NewsAds(%)",
                y: 2
            },
            {
                key: "HoardAds(%)",
                y: 9
            }
        ];

        $scope.btldata = [
            {
                key: "Promoters(%)",
                y: 5
            },
            {
                key: "Sampling(%)",
                y: 2
            },
            {
                key: "Branding(%)",
                y: 9
            }
        ];

        //$scope.tvPiedata = [
        //{ value: 78, color: "#d62728", suffix: "%" }
        //];
        //$scope.tvPieoptions = { thickness: 15, mode: "gauge", total: 100 };

        $scope.onPromotionsDataChange = function () {
            var atlsum = $scope.FMCGDataModel.TotalATLExpense;
            var btlsum = $scope.FMCGDataModel.TotalBTLExpense;

            $scope.atldata = [
             {
                 key: "TVAds(%)",
                 y: $scope.FMCGDataModel.TVAds * 100 / atlsum
             },
             {
                 key: "NewsAds(%)",
                 y: $scope.FMCGDataModel.NewspaperAds * 100 / atlsum
             },
             {
                 key: "HoardAds(%)",
                 y: $scope.FMCGDataModel.HoardingAds * 100 / atlsum
             }
            ];

            $scope.btldata = [
                {
                    key: "Promoters(%)",
                    y: $scope.FMCGDataModel.Promoters * 100 / btlsum
                },
                {
                    key: "Sampling(%)",
                    y: $scope.FMCGDataModel.Sampling * 100 / btlsum
                },
                {
                    key: "Branding(%)",
                    y: $scope.FMCGDataModel.InShopBranding * 100 / btlsum
                }
            ];
        }


        $scope.max = 1000;

        $scope.data = TimerService.timervalue;

        $scope.$watch(
                   "data",
                   function handleFooChange(newValue, oldValue) {
                       if (newValue == 0 && oldValue != 0) {
                           TimerService["isQuarter" + $scope.selectedquarter + "Over"] = true;
                           $scope["isQuarter" + $scope.selectedquarter + "Over"] = true;
                           $scope.isSelectedQuarterOver = true;
                           pushMessage("danger", "Quarter " + $scope.selectedquarter + " Completed! Proceed to Quarter " + ($scope.selectedquarter + 1) + ".");
                       }
                   }
               );

        $scope.$on(
                       "$destroy",
                       function (event) {
                           $interval.cancel(timer);
                           //$timeout.cancel(timeoutticks);
                           //$timeout.cancel(timeoutticks2);
                       }
                   );


        $scope.knobOptions = {
            'width': 100,
            'displayInput': false
        };

        //02

        $scope.data2 = 0;

        $scope.options2 = {
            'width': 150,
            'cursor': true,
            'thickness': 0.3,
            'fgColor': '#222'
        };

        $scope.options3 = {
            'displayPrevious': true,
            'min': -100
        };

        $scope.options4 = {
            'angleOffset': 90,
            'linecap': 'round'
        };

        $scope.options5 = {
            'fgColor': '#66CC66',
            'angleOffset': '-125',
            'angleArc': 250
        };

        $scope.options7 = {
            'width': 90,
            'height': 90,
            'skin': 'tron',
            'thickness': .3,
            'displayPrevious': true,
            'readOnly': true,
            'max': 300
        };

        $scope.options14 = {
            'readOnly': true
        };

        $scope.options18 = {
            'width': 700
        };


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
            //Result: ko.observableArray([])
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

        (function tick() {
            if ($scope.data > 0) {
                $scope.data = $scope.data - 1;
                TimerService.timervalue = $scope.data;
                timeoutticks = $timeout(tick, 1000);
            }
            else {
                TimerService.timervalue = 0;
                timeoutticks2 = $timeout(tick, 1000);
            }
        })();

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
            $scope.gamecompletedactive = false;
            $scope.selectedquarter = qtr;
            TimerService.selectedquarter = $scope.selectedquarter;
            PlayerDataService.selectedquarter = $scope.selectedquarter;
            $scope.isSelectedQuarterOver = false; //$scope["isQuarter" + $scope.selectedquarter + "Over"];
            $scope.getPlayerData();

        }

        //$scope.$watch('TimerService.isQuarter1Over', function (newval) {
        //     $scope.$apply();
        //});

        $scope.getPlayerData = function () {
            $rootScope.spinner.on();
            PlayerDataService.getPlayerData().then(function (response) {
                $rootScope.spinner.off();
                $scope.FMCGDataModel = response;
                $scope.FMCGClient = {};
                $scope.FMCGClient.PalmOilPercentage = function () {
                    return (100 - $scope.FMCGDataModel.MustardOilPercentage).toFixed(2)
                }
                $scope.FMCGClient.ExMILL = function () {
                    return $scope.FMCGDataModel.MustardOilPercentage * 120 +
                           $scope.FMCGClient.PalmOilPercentage() * 60 + $scope.FMCGDataModel.PackagingMaterial
                };

                $scope.FMCGClient.CST = function () { return $scope.FMCGClient.ExMILL() * .02 };
                $scope.FMCGClient.Freight = 1;
                $scope.FMCGClient.PriceToCompany = function () { return $scope.FMCGClient.ExMILL() + $scope.FMCGClient.Freight + $scope.FMCGClient.CST() };
                $scope.FMCGClient.VAT = function () { return $scope.FMCGClient.PriceToCompany() * (1 + $scope.FMCGDataModel.CompanyMargin) * .05 }
                $scope.FMCGClient.PriceToDistributor = function () { return $scope.FMCGClient.PriceToCompany() * (1 + $scope.FMCGDataModel.CompanyMargin) + $scope.FMCGClient.VAT() }
                $scope.FMCGClient.PriceToRetailer = function () { return $scope.FMCGClient.PriceToDistributor() * (1 + $scope.FMCGDataModel.DistributorMargin) }
                $scope.FMCGClient.PriceToCustomer = function () { return $scope.FMCGClient.PriceToRetailer() * (1 + $scope.FMCGDataModel.RetailerMargin) }

                $scope.FMCGClient.VAT5L = function () { return $scope.FMCGClient.PriceToCompany() * (1 + $scope.FMCGDataModel.CompanyMargin5L) * .05 }
                $scope.FMCGClient.PriceToDistributor5L = function () { return $scope.FMCGClient.PriceToCompany() * (1 + $scope.FMCGDataModel.CompanyMargin5L) + $scope.FMCGClient.VAT() }
                $scope.FMCGClient.PriceToRetailer5L = function () { return $scope.FMCGClient.PriceToDistributor5L() * (1 + $scope.FMCGDataModel.DistributorMargin5L) }
                $scope.FMCGClient.PriceToCustomer5L = function () { return $scope.FMCGClient.PriceToRetailer5L() * (1 + $scope.FMCGDataModel.RetailerMargin5L) }




                var atlsum = $scope.FMCGDataModel.TotalATLExpense;
                var btlsum = $scope.FMCGDataModel.TotalBTLExpense;
                $scope.atldata = [
                            {
                                key: "TVAds(%)",
                                y: $scope.FMCGDataModel.TVAds * 100 / atlsum
                            },
                            {
                                key: "NewsAds(%)",
                                y: $scope.FMCGDataModel.NewspaperAds * 100 / atlsum
                            },
                            {
                                key: "HoardAds(%)",
                                y: $scope.FMCGDataModel.HoardingAds * 100 / atlsum
                            }
                ];

                $scope.btldata = [
                    {
                        key: "Promoters(%)",
                        y: $scope.FMCGDataModel.Promoters * 100 / btlsum
                    },
                    {
                        key: "Sampling(%)",
                        y: $scope.FMCGDataModel.Sampling * 100 / btlsum
                    },
                    {
                        key: "Branding(%)",
                        y: $scope.FMCGDataModel.InShopBranding * 100 / btlsum
                    }
                ];


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
            $scope.FMCGDataModel.PalmOilPercentage = $scope.FMCGClient.PalmOilPercentage();
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
                    selectedquarter: $scope.selectedquarter,
                    startedquarter: $scope.startedquarter
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
                        }
                        else {
                            TimerService["isQuarter" + $scope.selectedquarter + "Over"] = false;
                            $scope["isQuarter" + $scope.selectedquarter + "Over"] = false;
                            $scope.$broadcast('timer-set-countdown', t);
                            $scope.$broadcast('timer-start');
                            TimerService.timervalue = t;
                            $scope.data = t;
                            if (t <= 30 && t > 25) {
                                pushMessage("warning", "You have " + t + " seconds remaining for this Quarter.Save your inputs!");
                            }
                        }
                    }
                    var choice = {
                        selectedGameId: 1,
                        code: "1234A",
                        selectedquarter: $scope.selectedquarter,
                        startedquarter: $scope.startedquarter
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

                        TimerService.isQuarter1Over = startedquarters.data["q1over"];
                        TimerService.isQuarter2Over = startedquarters.data["q2over"];
                        TimerService.isQuarter3Over = startedquarters.data["q3over"];
                        TimerService.isQuarter4Over = startedquarters.data["q4over"];
                        $scope.isQuarter1Over = startedquarters.data["q1over"];
                        $scope.isQuarter2Over = startedquarters.data["q2over"];
                        $scope.isQuarter3Over = startedquarters.data["q3over"];
                        $scope.isQuarter4Over = startedquarters.data["q4over"];

                        TimerService.gameStarted = startedquarters.data["started"];
                        if ($scope.isQuarter1Started == true && $scope.isQuarter1Over == false) {
                            $scope.startedquarter = 1
                        }
                        if ($scope.isQuarter2Started == true && $scope.isQuarter2Over == false) {
                            $scope.startedquarter = 2
                        }
                        if ($scope.isQuarter3Started == true && $scope.isQuarter3Over == false) {
                            $scope.startedquarter = 3
                        }
                        if ($scope.isQuarter4Started == true && $scope.isQuarter4Over == false) {
                            $scope.startedquarter = 4
                        }
                        $scope.gameStarted = startedquarters.data["started"];
                        $scope.isSelectedQuarterOver = $scope["isQuarter" + $scope.selectedquarter + "Over"];
                    });
                });
            }
            poller();
            timer = $interval(poller, 5000);
            //if (TimerService["isQuarter" + $scope.selectedquarter + "Over"] == true) {
            //    choice = {
            //        selectedGameId: 1,
            //        code: "1234A",
            //        selectedquarter: $scope.selectedquarter
            //    }

            //    $http.post("api/fmcgservice/GetMarketReport", choice).then(function (report) {
            //        $scope.doughlabels = report.data["Players"][0];
            //        $scope.doughdata = report.data["SalesReportValues"][0];
            //        $scope.barlabels = report.data["Players"][0];
            //        $scope.bardata = report.data["PATReportValues"];
            //        $scope.revenuebarlabels = report.data["Players"][0];
            //        $scope.revenuebardata = report.data["RevenueReportValues"];
            //        $scope.radarlabels = report.data["Players"][0];
            //        $scope.radardata = report.data["SalesReportValues"];
            //    });
            //}
        }
        $scope.init();
    }]);

//http://stackoverflow.com/questions/27696612/how-do-i-share-scope-data-between-states-in-angularjs-ui-router
fmcgGame.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.
            state('fmcgAdmin', {
                templateUrl: 'templates/industries/fmcg/Main2.html'
            }).
            state('playgame.Dashboard', {
                url: "/Dashboard",
                templateUrl: 'templates/industries/fmcg/Dashboard.html'
            }).
            state('playgame.ManagingChannelPartner', {
                url: '/ManagingChannelPartner',
                templateUrl: '/templates/industries/fmcg/channelpartners/ChannelPartnerManagement.html',
                controller: function ($scope, $uibModal) {
                    $scope.open = function (size) {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'myModalContent.html',
                            size: size,
                        });
                    };
                    $scope.open("lg");
                }
            }).
            state('playgame.ManagingSalesTeam', {
                url: '/ManagingSalesTeam',
                templateUrl: 'templates/industries/fmcg/sales/SalesTeamManagement.html',
                controller: function ($scope, $uibModal) {
                    $scope.open = function (size) {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'salesMgmt.html',
                            size: size,
                        });
                    };
                    $scope.open("lg");
                }
            }).
            state('playgame.ManagingPromotions', {
                url: '/ManagingPromotions',
                templateUrl: 'templates/industries/fmcg/Promotions/PromotionManagement.html',
                controller: function ($scope, $uibModal) {
                    $scope.open = function (size) {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'promMgmt.html',
                            size: size,
                        });
                    };
                    $scope.open("lg");
                }
            }).
            state('playgame.ManagingProduct', {
                url: '/ManagingProduct',
                templateUrl: 'templates/industries/fmcg/Products/ProductManagement.html',
                controller: function ($scope, $uibModal) {
                    $scope.open = function (size) {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'prodMgmt.html',
                            size: size,
                        });
                    };
                    $scope.open("lg");
                }
            }).
            state('playgame.Results', {
                url: '/Results',
                templateUrl: 'templates/industries/fmcg/Results.html'
            }).
            state('playgame.Q1-Reports', {
                url: '/Q1-Reports',
                templateUrl: 'templates/industries/fmcg/FinancialReports/Q1-Reports.html',
                params: {
                    selectedquarter: null,
                },
                resolve: {
                    financials: function ($http, $stateParams) {
                        var choice = {
                            selectedGameId: 1,
                            code: "1234A",
                            selectedquarter: $stateParams.selectedquarter
                        }
                        return $http.post("api/fmcgservice/GetFinancialReport", choice).then(function (report) {
                            return report.data["Financials"];
                        });
                    }
                },
                controller: function ($scope, financials) {
                    $scope.items = financials;
                }
            }).
            state('playgame.MarketReports', {
                url: '/MarketReports',
                templateUrl: 'templates/industries/fmcg/MarketReports/MarketReports.html',
                params: {
                    selectedquarter: null,
                },
                resolve: {
                    mreports: function ($http, $stateParams) {
                        var choice = {
                            selectedGameId: 1,
                            code: "1234A",
                            selectedquarter: $stateParams.selectedquarter
                        }
                        return $http.post("api/fmcgservice/GetMarketReport", choice).then(function (report) {
                            return report.data;
                        });
                    }
                },
                controller: function ($scope, mreports) {
                    $scope.doughlabels = mreports["Players"][0];
                    $scope.doughdata = mreports["SalesReportValues"][0];
                    $scope.barlabels = mreports["Players"][0];
                    $scope.bardata = mreports["PATReportValues"];
                    $scope.revenuebarlabels = mreports["Players"][0];
                    $scope.revenuebardata = mreports["RevenueReportValues"];
                    $scope.radarlabels = mreports["Players"][0];
                    $scope.radardata = mreports["SalesReportValues"];
                }
            }).
            state('playgame.Rankings', {
                url: '/Rankings',
                templateUrl: 'templates/industries/fmcg/Rankings/Ranking.html',
                params: {
                    selectedquarter: null,
                },
                resolve: {
                    rankings: function ($http, $stateParams) {
                        var choice = {
                            selectedGameId: 1,
                            code: "1234A",
                            selectedquarter: $stateParams.selectedquarter
                        }
                        return $http.post("api/fmcgservice/GetPlayerRankings", choice).then(function (data) {
                            return data;
                        });
                    }
                },
                controller: function ($scope, rankings) {
                    $scope.Rankings = rankings.data.Financials;
                }
            }).
            state('/StartQuarter', {
                url: '/StartQuarter',
                templateUrl: 'templates/industries/fmcg/Admin/StartQuarter.html'
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
        isQuarter1Over: false,
        isQuarter2Over: false,
        isQuarter3Over: false,
        isQuarter4Over: false,
        isQuarter1Started: false,
        isQuarter2Started: false,
        isQuarter3Started: false,
        isQuarter4Started: false,
        gameStarted: false,
        timervalue: 0,
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
            service.iscached = false;
            if (service.iscached == false) {
                var gameinfo = $rootScope.selectedgame;
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
