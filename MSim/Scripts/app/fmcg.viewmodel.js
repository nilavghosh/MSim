var fmcgGame = angular.module("fmcgGame", ["ngRoute"]).controller('fmcgCtrl', function ($scope, $http, $timeout) {
    $scope.FMCGDataModel = {
        Quarter: 0,
        PTD: 43,
        DistributorMargin: 0,
        RetailerMargin: 0,
        CompanyMargin: 0,
        NoOfSalesmen: 0,
        AvgSalary: 0,
        Training: 0,
        TVAds: 0,
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

    $scope.ChannelPartnerDataModel = {
        PTD: 0,
        DistributorMargin: 0,
        RetailerMargin: 0
    };

    $scope.SalesTeamDataModel = {
        NoOfSalesmen: 0,
        AvgSalary: 0,
        Training: 0
    };

    $scope.PromotionsDataModel = {
        TVAds: 0,
        NewspaperAds: 0,
        HoardingAds: 0,
        TotalATLExpense: 0,
        Promoters: 0,
        Sampling: 0,
        InShopBranding: 0,
        TotalBTLExpense: 0
    };


    $scope.ProductDataModel = {
        MustardOilPercentage: 0,
        PalmOilPercentage: 0,
        PackagingMaterial: 0
    };


    $scope.FMCGAdminDataModel = {
        Result: ko.observableArray([])
    };

});

fmcgGame.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
             when('/', {
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


FMCGDataModel = function () {
    this.Quarter = ko.observable(0);
    this.PTD = ko.observable(0);
    this.DistributorMargin = ko.observable(0);
    this.RetailerMargin = ko.observable(0);
    this.CompanyMargin = ko.observable(0);
    this.NoOfSalesmen = ko.observable(0);
    this.AvgSalary = ko.observable(0);
    this.Training = ko.observable(0);
    this.TVAds = ko.observable(0);
    this.NewspaperAds = ko.observable(0);
    this.HoardingAds = ko.observable(0);
    this.TotalATLExpense = ko.computed(function () {
        return parseInt(this.NewspaperAds()) + parseInt(this.TVAds()) + parseInt(this.HoardingAds());
    }, this);
    this.Promoters = ko.observable(0);
    this.Sampling = ko.observable(0);
    this.InShopBranding = ko.observable(0);
    this.TotalBTLExpense = ko.computed(function () {
        return parseInt(this.Promoters()) + parseInt(this.Sampling()) + parseInt(this.InShopBranding());
    }, this);
    this.MustardOilPercentage = ko.observable(0);
    this.PalmOilPercentage = ko.computed(function () {
        return 100 - parseInt(this.MustardOilPercentage());
    }, this);
    this.PackagingMaterial = ko.observable(0)
}



ChannelPartnerDataModel = function () {
    return {
        PTD: ko.observable(""),
        DistributorMargin: ko.observable(""),
        RetailerMargin: ko.observable(""),
    };
}


SalesTeamDataModel = function () {
    return {
        NoOfSalesmen: ko.observable(""),
        AvgSalary: ko.observable(""),
        Training: ko.observable(""),
    };
}

PromotionsDataModel = function () {
    this.TVAds = ko.observable(0);
    this.NewspaperAds = ko.observable(0);
    this.HoardingAds = ko.observable(0);
    this.TotalATLExpense = ko.computed(function () {
        return this.NewspaperAds() + this.TVAds() + this.HoardingAds;
    }, this);
    Promoters = ko.observable("");
    Sampling = ko.observable("");
    InShopBranding = ko.observable("");
    TotalBTLExpense = ko.observable("");
}

ProductDataModel = function () {
    return {
        MustardOilPercentage: ko.observable(""),
        PalmOilPercentage: ko.observable(""),
        PackagingMaterial: ko.observable(""),
    };
}


//http://stackoverflow.com/questions/18274976/make-bootstrap-well-semi-transparent

FMCGAdminDataModel = function () {
    return {
        Result: ko.observableArray([]),
    };
}


//function FmcgViewModel(app, dataModel) {
//    var self = this;
//    self.FMCGData = new FMCGDataModel();

//    Sammy("#container", function () {
//        //this.get('#/ManagingChannelPartner', function (context) {
//        //    app.templatename("fmcg-ChannelPartnerManagement");
//        //});

//        this.get('#/ManagingSalesTeam', function (context) {
//            app.templatename("fmcg-SalesTeamManagement");
//        });

//        this.get('#/ManagingProduct', function (context) {
//            app.templatename("fmcg-ProductManagement");
//        });

//        this.get('#/ManagingPromotions', function (context) {
//            app.templatename("fmcg-PromotionManagement");
//        });

//        this.get('#/Q1-Reports', function (context) {
//            app.templatename("fmcg-Q1-Reports");
//        });

//        this.post('#/SaveQ1Data', function (context) {
//            // Make a call to the protected Web API by passing in a Bearer Authorization Header
//            // Set Quarter
//            self.FMCGData.Quarter(1);
//            $.ajax({
//                method: 'post',
//                data: ko.toJSON(self.FMCGData),
//                url: app.dataModel.fmcgDataSaveUrl,
//                contentType: "application/json; charset=utf-8",
//                headers: {
//                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
//                },
//                success: function (data) {
//                    pushMessage('info');
//                },
//                error: function (data) {
//                    alert("ok");
//                }
//            });
//        });
//        this.get('#/Admin', function (context) {
//            $("#mainbody").html("");
//            $("#AdminView").hide();
//        });
//    });
//    return self;
//}


//app.addViewModel({
//    name: "Fmcg",
//    bindingMemberName: "fmcg",
//    factory: FmcgViewModel
//});

function pushMessage(t) {
    var mes = 'Info|Data Saved!';
    $.Notify({
        caption: mes.split("|")[0],
        content: mes.split("|")[1],
        type: t
    });
}