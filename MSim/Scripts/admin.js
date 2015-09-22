angular.module("ngHandsontableDemo", ['ngHandsontable']).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    $httpProvider.defaults.headers.post = {
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
        'Content-Type': 'application/json'
    }
}]).controller('DemoCtrl', function ($scope, $http, $timeout, hotRegisterer) {

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
        Financials: [
        ]
    };

    $scope.PlayerTemplateSheet = [[1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1]
    ];

    $scope.PlayerData = [];

    $scope.settings = ({
        minSpareRows: 1,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: true,
        manualColumnResize: false,
        formulas: true
    });

    $scope.saveAdminSheet = function () {

        var data = [];
        $("hot-table[hot-id='Quarter2'] .ht_master .htCore tbody tr").each(function (rowIndex, r) {
            var cols = [];
            $(this).find('td').each(function (colIndex, c) {
                cols.push(c.textContent);
            });
            data.push(cols);
        });

        $http.post('/api/fmcgservice/SaveFMCGAdminStaticSheet', angular.toJson($scope.FMCGGameDesignerSheet)).
        then(function (response) {
            alert("Data Saved");
            pushMessage("data saved", 'info');
        }, function (response) {
            alert("Data Not Saved! Try again.")
            pushMessage(response.statusText, 'info');
        });
    };

    $scope.saveStaticData = function () {
        //var staticData = {};
        //var packagingMaterial = {};
        //packagingMaterial["Inferior"] = 1;
        //packagingMaterial["Normal"] = 2;
        //packagingMaterial["Premium"] = 3;
        //packagingMaterial["Royal"] = 4;

        //var trainingType = {};
        //trainingType["No Training"] = 1;
        //trainingType["Sales Training"] = 2;
        //trainingType["Product Training"] = 3;
        //trainingType["S&P Training"] = 4;


        //staticData["packagingMaterial"] = packagingMaterial;
        //staticData["trainingType"] = trainingType;

        //$http.post('/api/fmcgservice/SaveFMCGStaticData', angular.toJson({ data: staticData })).
        //then(function (response) {
        //    pushMessage("data saved", 'info');
        //}, function (response) {
        //    pushMessage(response.statusText, 'info');
        //});
        this.savedata = hotRegisterer.getInstance('Quarter1').getData();
        this.rows = hotRegisterer.getInstance('Quarter1').getColHeader();
        this.values = hotRegisterer.getInstance('Quarter1').getSourceDataAtCol(2);
        alert(this.values);
    }

    $scope.GetValue = function (hotid, column, row) {
        hotinstance = hotRegisterer.getInstance(hotid)
        var data = [];
        $("hot-table[hot-id='" + hotid + "'] .ht_master .htCore tbody tr").each(function (rowIndex, r) {
            var cols = [];
            $(this).find('td').each(function (colIndex, c) {
                cols.push(c.textContent);
            });
            data.push(cols);
        });
        colheaders = hotinstance.getColHeader();
        col = colheaders.indexOf(column);
        return data[row - 1][col];
    };

    $scope.Quarter1 = {
        GetValue: function (column, row) {
            return $scope.GetValue('Quarter1', column, row);
        }
    };

    $scope.Quarter2 = {
        GetValue: function (column, row) {
            return $scope.GetValue('Quarter2', column, row);
        }
        //return hotinstance.plugin.helper.cellValue(column + row.toString());
    };

    $scope.Quarter3 = {
        GetValue: function (column, row) {
            return $scope.GetValue('Quarter3', column, row);
        }
    };

    $scope.Quarter4 = {
        GetValue: function (column, row) {
            return $scope.GetValue('Quarter4', column, row);
        }
    };

    $scope.BrandEquity = {
        GetValue: function (column, row) {
            return $scope.GetValue('BrandEquity', column, row);
        }
    };

    $scope.Financials = {
        GetValue: function (column, row) {
            return $scope.GetValue('Financials', column, row);
        }
    };

    $scope.Dummy = {
        Qtr1: {
            PalmOilPercentage: 34
        },
        Qtr2: {
            PalmOilPercentage: 56
        },
        Qtr3: {
            PalmOilPercentage: 80
        },
        Qtr4: {
        },
    }

    $scope.savePlayerTemplateSheet = function () {

        var data = [];
        $("hot-table[hot-id='Quarter2'] .ht_master .htCore tbody tr").each(function (rowIndex, r) {
            var cols = [];
            $(this).find('td').each(function (colIndex, c) {
                cols.push(c.textContent);
            });
            data.push(cols);
        });

        $http.post('/api/fmcgservice/SaveFMCGAdminStaticSheet', angular.toJson($scope.FMCGGameDesignerSheet)).
        then(function (response) {
            pushMessage("data saved", 'info');
        }, function (response) {
            pushMessage(response.statusText, 'info');
        });
    };

    $scope.getPlayerData = function () {
        var gameOfChoice = {
            selectedGameId: 1,
            code: "1234A",
            username: "nilavghosh@gmail.com"
        };
        $http.post('/api/fmcgservice/GetAllPlayerDataForGame', gameOfChoice).
        then(function (response) {
            $scope.PlayerData = response.data;
            addDummyData();
            $http.get('/api/fmcgservice/GetFMCGGameDesignerDataSheet').
            then(function (designerDataSheet) {
                $scope.FMCGGameDesignerSheet = designerDataSheet.data[0];
            });
        }, function (response) {
            pushMessage(response.statusText, 'info');
        });
    }

    $scope.refreshData = function () {
        var gameOfChoice = {
            selectedGameId: 1,
            code: "1234A",
            username: "nilavghosh@gmail.com"
        };
        $http.post('/api/fmcgservice/GetAllPlayerDataForGame', gameOfChoice).
        then(function (response) {
            $scope.PlayerData = response.data;
            addDummyData();
            hotRegisterer.getInstance('Quarter1').render();
            hotRegisterer.getInstance('Quarter2').render();
            hotRegisterer.getInstance('Quarter3').render();
            hotRegisterer.getInstance('Quarter4').render();
            hotRegisterer.getInstance('BrandEquity').render();
            hotRegisterer.getInstance('Financials').render();
            alert("Data Refreshed");
        }, function (response) {
            alert("Data not refreshed. Try Again")
            //pushMessage(response.statusText, 'info');
        });
    }

    function callAtTimeout() {
        $scope.FMCGGameDesignerSheet[0][0] = "";
        pushMessage("Player Data Refreshed", 'info');
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


    function addDummyData() {
        var dummycount = 10 - $scope.PlayerData.length;
        for (i = 0; i < dummycount; i++) {
            var dummyPlayer = {
                Quarter: 0,
                PTD: 0,
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
            $scope.PlayerData.push(dummyPlayer);
        }
    }
});





function getPlayerData(value) {
    var controllerElement = document.querySelector("#adminsheet");
    var controllerScope = angular.element(controllerElement).scope();
    value = eval("controllerScope." + value.substring(1));
    return value;
}

//$(document).ready(function () {
//    $('#adminsheet').resize(function () {
//        var $c = $('.container'),
//            $w = $('.well'),
//            totalWidth = $('body').outerWidth(),
//            wellWidth = $c.outerWidth(),
//            diff = totalWidth - wellWidth,
//            marg = -Math.floor(diff / 2) + 'px';
//        $w.each(function () {
//            $(this).css({
//                'margin-left': marg,
//                'margin-right': marg
//            });
//        })
//    });
//    $('#adminsheet').resize();
//});


//Handsontable.Dom.addEvent(save, 'click', function () {
//    // save all cell's data
//    ajax('scripts/json/save.json', 'GET', JSON.stringify({ data: hot.getData() }), function (res) {
//        var response = JSON.parse(res.response);

//        if (response.result === 'ok') {
//            exampleConsole.innerText = 'Data saved';
//        }
//        else {
//            exampleConsole.innerText = 'Save error';
//        }
//    });
//});