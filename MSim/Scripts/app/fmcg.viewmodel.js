
IssuesFlaggedData = function () {
    return {
        PTD: ko.observable(""),
        FlaggedInMPI: ko.observable(),
        FlaggedInRCSA: ko.observable(),
    };
}

function FmcgViewModel(app, dataModel) {
    var self = this;

    self.FMCGData = new IssuesFlaggedData();

    Sammy(function () {
        this.get('#/ManagingChannelPartner', function () {
            $(".view").hide();
            $("#fmcg-channelpartnermanagement").show();
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
                    self.myHometown('Your Hometown is : ' + data.hometown);
                }
            });
        })
        //this.get('/', function () { this.app.runRoute('get', '#home') });
    });

    return self;
}

app.addViewModel({
    name: "Fmcg",
    bindingMemberName: "fmcg",
    factory: FmcgViewModel
});
