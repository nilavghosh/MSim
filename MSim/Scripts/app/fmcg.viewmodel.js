
IssuesFlaggedData = function () {
    return {
        PTD: ko.observable(""),
        FlaggedInMPI: ko.observable(),
        FlaggedInRCSA: ko.observable(),
    };
}

FMCGAdminDataModel = function () {
    return {
        Result: ko.observableArray([]),
    };
}


function FmcgViewModel(app, dataModel) {
    var self = this;

    self.FMCGData = new IssuesFlaggedData();
    self.FMCGAdmin = new FMCGAdminDataModel();

    Sammy(function () {
        this.get('#/ManagingChannelPartner', function () {
            //$(".view").hide();
            //$("#fmcg-channelpartnermanagement").show();
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