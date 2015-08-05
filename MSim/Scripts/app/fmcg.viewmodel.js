//FMCGDataModel = function () {
//    return {
//        PTD: ko.observable(""),
//        DistributorMargin: ko.observable(""),
//        RetailerMargin: ko.observable(""),
//        NoOfSalesmen: ko.observable(""),
//        AvgSalary: ko.observable(""),
//        Training: ko.observable(""),
//        TVAds: ko.observable(0),
//        NewspaperAds: ko.observable(0),
//        HoardingAds: ko.observable(0),
//        TotalATLExpense: ko.computed(function () {
//            return FMCGDataModel.NewspaperAds();
//        }),
//        Promoters: ko.observable(""),
//        Sampling: ko.observable(""),
//        InShopBranding: ko.observable(""),
//        TotalBTLExpense: ko.observable(""),
//        MustardOilPercentage: ko.observable(""),
//        PalmOilPercentage: ko.observable(""),
//        PackagingMaterial: ko.observable("")
//    };
//}

FMCGDataModel = function () {
    this.Quarter = ko.observable(0);
    this.PTD = ko.observable(0);
    this.DistributorMargin = ko.observable(0);
    this.RetailerMargin = ko.observable(0);
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
    this.PalmOilPercentage = ko.observable(0);
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


function FmcgViewModel(app, dataModel) {
    var self = this;

    //self.FMCGData = new ChannelPartnerDataModel();
    //self.SalesTeamData = new SalesTeamDataModel();
    //self.ProductData = new ProductDataModel();
    //self.PromotionsData = new PromotionsDataModel();
    self.FMCGData = new FMCGDataModel();
    //self.FMCGAdmin = new FMCGAdminDataModel();

    Sammy("#container", function () {
        this.get('#/ManagingChannelPartner', function (context) {
            app.templatename("fmcg-ChannelPartnerManagement");
        });

        this.get('#/ManagingSalesTeam', function (context) {
            app.templatename("fmcg-SalesTeamManagement");
        });

        this.get('#/ManagingProduct', function (context) {
            app.templatename("fmcg-ProductManagement");
        });

        this.get('#/ManagingPromotions', function (context) {
            app.templatename("fmcg-PromotionManagement");
        });

        this.post('#/SaveQ1Data', function (context) {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            // Set Quarter
            self.FMCGData.Quarter(1);
            $.ajax({
                method: 'post',
                data: ko.toJSON(self.FMCGData),
                url: app.dataModel.fmcgDataSaveUrl,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    pushMessage('info');
                },
                error: function (data) {
                    alert("ok");
                }
            });
        });

        this.get('#/Admin', function (context) {
            $("#mainbody").html("");
            $("#AdminView").hide();
            //app.templatename("fmcg-Admin");

            //$.ajax({
            //    method: 'get',
            //    url: app.dataModel.fmcgAdminUrl,
            //    contentType: "application/json; charset=utf-8",
            //    headers: {
            //        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            //    },
            //    success: function (data) {
            //        self.FMCGAdmin.Result(data);
            //        //self.myHometown('Your Hometown is : ' + data.hometown);
            //    }
            //});
        });

        //this.get('/', function () { this.app.runRoute('get', '#home') });
    });

    return self;
}

app.addViewModel({
    name: "Fmcg",
    bindingMemberName: "fmcg",
    factory: FmcgViewModel
});

function pushMessage(t) {
    var mes = 'Info|Data Saved!';
    $.Notify({
        caption: mes.split("|")[0],
        content: mes.split("|")[1],
        type: t
    });
}