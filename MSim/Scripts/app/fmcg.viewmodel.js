var fmcgGame = angular.module("fmcgGame", ["ngRoute"]).controller('fmcgCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    $scope.FMCGDataModel = {
        Quarter: 0,
        PTD: 0,
        DistributorMargin: 0,
        RetailerMargin: 0,
        CompanyMargin: 0,
        NoOfSalesmen: 0,
        AvgSalary: 0,
        Training: 0,
        TVAds: 21,
        NewspaperAds: 0,
        HoardingAds: 0,
        Promoters: 0,
        Sampling: 0,
        InShopBranding: 0,
        TotalBTLExpense: 0,
        MustardOilPercentage: 0,
        PalmOilPercentage: 0,
        PackagingMaterial: 0
    };

    $scope.FMCGDataModel.TotalATLExpense = function () {
        return $scope.FMCGDataModel.TVAds +
            $scope.FMCGDataModel.NewspaperAds +
            $scope.FMCGDataModel.HoardingAds
    }
    $scope.FMCGDataModel.TotalBTLExpense = function () {
        return $scope.FMCGDataModel.Promoters +
            $scope.FMCGDataModel.Sampling +
            $scope.FMCGDataModel.InShopBranding
    }

    $scope.FMCGAdminDataModel = {
        Result: ko.observableArray([])
    }

    $scope.getPlayerData = function () {
        $http.post('/api/fmcgservice/GetPlayerData', $rootScope.gameOfChoice).
        then(function (response) {
            $scope.FMCGDataModel = response.data;
        }, function (response) {
            //  pushMessage(response.statusText, 'info');
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
                 templateUrl: 'templates/industries/fmcg/Main.html',
                 controller: 'fmcgCtrl'
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

FMCGAdminDataModel = function () {
    return {
        Result: ko.observableArray([]),
    };
}



function pushMessage(t) {
    var mes = 'Info|Data Saved!';
    $.Notify({
        caption: mes.split("|")[0],
        content: mes.split("|")[1],
        type: t
    });
}