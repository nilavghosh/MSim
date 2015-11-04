angular.module("ngHandsontableDemo").config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    $httpProvider.defaults.headers.post = {
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
        'Content-Type': 'application/json'
    }
}]).controller('DemoCtrl', function ($scope, $http, $timeout) {

    $scope.FMCGGameDesignerSheet = {
        Quarter1: [
        ],
        Quarter2: [
        ],
        Quarter3: [
        ],
        Quarter4: [
        ],
        BrandEquity: [
        ],
        Financials: []
    };

    $scope.settings = ({
        minSpareRows: 1,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: true,
        manualColumnResize: false,
        formulas: false
    });

    $scope.getPlayerData = function () {
        var gameOfChoice = {
            selectedGameId: 1,
            code: "1234A",
            username: "nilavghosh@gmail.com"
        };
        $http.post('/api/fmcgservice/GetFMCGGameDesignerDataSheet', gameOfChoice).
        then(function (designerDataSheet) {
            $scope.FMCGGameDesignerSheet = designerDataSheet.data;

        }, function (response) {
            pushMessage(response.statusText, 'info');
        });
    }

    $scope.init = function () {
        $scope.getPlayerData();
    }
    $scope.init();

    function pushMessage(mssg, t) {
        var mes = 'Info|' + mssg;
        console.log(mes);
        //$.Notify({
        //    caption: mes.split("|")[0],
        //    content: mes.split("|")[1],
        //    type: t
        //});
    }
});

