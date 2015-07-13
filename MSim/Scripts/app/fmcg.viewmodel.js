function FmcgViewModel(app, dataModel) {
	var self = this;

	self.PTD = ko.observable("");

	Sammy(function () {
		this.get('#/ManagingChannelPartner', function () {
			$(".view").hide();
			$("#fmcg-channelpartnermanagement").show();
			// Make a call to the protected Web API by passing in a Bearer Authorization Header
			//$.ajax({
			//	method: 'get',
			//	url: app.dataModel.userInfoUrl,
			//	contentType: "application/json; charset=utf-8",
			//	headers: {
			//		'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
			//	},
			//	success: function (data) {
			//		self.myHometown('Your Hometown is : ' + data.hometown);
			//	}
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
