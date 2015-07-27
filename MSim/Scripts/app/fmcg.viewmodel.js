
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
    this.NewspaperAds= ko.observable(0);
    this.HoardingAds= ko.observable(0);
    this.TotalATLExpense= ko.computed(function () {
        return  this.NewspaperAds() + this.TVAds() + this.HoardingAds ;
    }, this);
    Promoters= ko.observable("");
    Sampling= ko.observable("");
    InShopBranding= ko.observable("");
    TotalBTLExpense= ko.observable("");
    
}

ProductDataModel = function () {
    return {
        MustardOilPercentage: ko.observable(""),
        PalmOilPercentage: ko.observable(""),
        PakagingMaterial: ko.observable(""),
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

    self.FMCGData = new ChannelPartnerDataModel();
    self.SalesTeamData = new SalesTeamDataModel();
    self.ProductData = new ProductDataModel();
    self.PromotionsData = new PromotionsDataModel();
    self.FMCGAdmin = new FMCGAdminDataModel();

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

        this.post('#/Save', function (context) {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.ajax({
                method: 'post',
                data: ko.toJSON(self.FMCGData),
                url: app.dataModel.fmcgApiUrl,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    pushMessage('info');
                }
            });
        })

        this.get('#/Admin', function (context) {
            app.templatename("fmcg-Admin");
            //$("#mainbody").html($("#admin").html());

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