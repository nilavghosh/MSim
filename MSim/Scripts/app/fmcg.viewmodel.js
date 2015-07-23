
ChannelPartnerDataModel = function () {
    return {
        PTD: ko.observable(""),
        DistributorMargin: ko.observable(""),
        RetailerMargin: ko.observable(""),
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
            $(".view").hide();
            $("#fmcg-admin").show();
            $.ajax({
                method: 'get',
                url: app.dataModel.fmcgAdminUrl,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    self.FMCGAdmin.Result(data);
                    //self.myHometown('Your Hometown is : ' + data.hometown);
                }
            });
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