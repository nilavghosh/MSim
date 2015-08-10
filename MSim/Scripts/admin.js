//angular.module('ngHandsontableDemo',
//  [
//    'ngHandsontable'
//  ])
//  .controller('DemoCtrl', [
//    '$scope',
//    function ($scope) {

//      var products = [
//        {
//          "description": "Big Mac",
//          "options": [
//            {"description": "Big Mac", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
//            {"description": "Big Mac & Co", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
//            {"description": "McRoyal", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
//            {"description": "Hamburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
//            {"description": "Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
//            {"description": "Double Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
//          ]
//        },
//        {
//          "description": "Fried Potatoes",
//          "options": [
//            {"description": "Fried Potatoes", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null},
//            {"description": "Fried Onions", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null}
//          ]
//        }
//      ];
//      var firstNames = [32, 21, 27, 78, 21, 21, '=SUM(2,3)', '=SUM(2,3)', '=SUM(2,3)', '=SUM(2,3)', '=SUM(2,3)', '=SUM(2,3)'];
//      var lastNames = ["Tired", "Johnson", "Moore", "Rocket", "Goodman", "Farewell", "Manson", "Bentley", "Kowalski", "Schmidt", "Tucker", "Fancy"];
//      var address = ["Turkey", "Japan", "Michigan", "Russia", "Greece", "France", "USA", "Germany", "Sweden", "Denmark", "Poland", "Belgium"];

//      $scope.minSpareRows = 1;
//      $scope.colHeaders = true;
//      $scope.settings = ({
//          formulas: true
//      });
//      $scope.db = {};
//      $scope.db.items = [];

//      for (var i = 0; i < 10; i++) {
//        $scope.db.items.push(
//          {
//            id: i + 1,
//            name: {
//              first: firstNames[Math.floor(Math.random() * firstNames.length)],
//              last: lastNames[Math.floor(Math.random() * lastNames.length)]
//            },
//            address: Math.floor(Math.random() * 100000) + ' ' + address[Math.floor(Math.random() * address.length)],
//            price: Math.floor(Math.random() * 100000) / 100,
//            isActive: Math.floor(Math.random() * products.length) / 2 === 0 ? 'Yes' : 'No',
//            product: angular.extend({}, products[Math.floor(Math.random() * products.length)])
//          }
//        );
//      }

//      $scope.db.dynamicColumns = [
//        {
//          data: 'id',
//          title: 'ID'},
//        {
//          data: 'name.first',
//          title: 'First Name',
//        },
//        {
//          data: 'name.last',
//          title: 'Last Name',
//        },
//        {data: 'address', title: 'Address', width: 150},
//        {data: 'product.description', type: 'autocomplete', title: 'Favorite food', width: 150, optionList: 'description in product.options'},
//        {data: 'price', title:'Price', type: 'numeric', width: 80, format: '$ 0,0.00'},
//        {data: 'isActive', type: 'checkbox', title: 'Is active', checkedTemplate: 'Yes', uncheckedTemplate: 'No', width:65}
//      ];

//      setInterval(function () {
//        if( $scope.db.dynamicColumns[0].title == 'ID') {
//          $scope.db.dynamicColumns[3].readOnly = true;
//          $scope.db.dynamicColumns.shift();
//          $scope.afterChange = function () {};

//        } else {
//          $scope.db.dynamicColumns[2].readOnly = false;
//          $scope.db.dynamicColumns.unshift({data: 'id', title: 'ID'});
//          $scope.afterChange = function () {};
//        }
//        $scope.$apply();
//      }, 3000);
//    }
//  ]
//);



angular.module("ngHandsontableDemo", ['ngHandsontable']).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get = { 'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken") }
    $httpProvider.defaults.headers.post = {
        'Authorization': 'Bearer ' + sessionStorage.getItem("accessToken"),
        'Content-Type': 'application/json'
    }
}]).controller('DemoCtrl', function ($scope, $http, $timeout) {

    $scope.data1 = [['Year', "Maserati", "Mazda", "Mercedes", "Mini", "=A$1", 0, 0],
                    [2009, 0, 2941, 4303, 354, 5814],
                    [2010, 5, 2905, 32, '=SUM(A4,2,3)', 32, '', '', '', '', '', '', '', ''],
                    [2011, 4, 2517, 4822, 552, 6127, '', '', '', '', '', '', '', ''],
                    [2012, 42, 21, 81, 12, 4151, '', '', '', '', '', '', '', '', ]
    ];

    $scope.FMCGGameDesignerSheet = [
    ];

    $scope.PlayerTemplateSheet = [[1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1]
    ];

    $scope.PlayerData = {
        "_id": '55bce5a97947cd2130dcee4c',
        "PTD": 45,
        "DistributorMargin": "54",
        "RetailerMargin": "67",
        "NoOfSalesmen": "",
        "AvgSalary": "",
        "Training": "",
        "TVAds": 0,
        "NewspaperAds": 0,
        "HoardingAds": 0,
        "TotalATLExpense": 0,
        "Promoters": 0,
        "Sampling": 0,
        "InShopBranding": 0,
        "TotalBTLExpense": 0,
        "MustardOilPercentage": "",
        "PalmOilPercentage": "",
        "PackagingMaterial": "",
        "userid": "75443be9-9590-4e22-a07c-9b5c79a45397"
    };

    $scope.settings = ({
        minSpareRows: 1,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: true,
        manualColumnResize: true,
        formulas: true
    });

    $scope.saveAdminSheet = function () {

        var data = [];
        $('.ht_master .htCore tbody tr').each(function (rowIndex, r) {
            var cols = [];
            $(this).find('td').each(function (colIndex, c) {
                cols.push(c.textContent);
            });
            data.push(cols);
        });

        $http.post('/api/fmcgservice/SaveFMCGAdminStaticSheet', angular.toJson({ data: $scope.FMCGGameDesignerSheet })).
        then(function (response) {
            pushMessage("data saved", 'info');
        }, function (response) {
            pushMessage(response.statusText, 'info');
        });
    };


    $scope.savePlayerTemplateSheet = function () {

        var data = [];
        $('.ht_master .htCore tbody tr').each(function (rowIndex, r) {
            var cols = [];
            $(this).find('td').each(function (colIndex, c) {
                cols.push(c.textContent);
            });
            data.push(cols);
        });

        $http.post('/api/fmcgservice/SaveFMCGAdminStaticSheet', angular.toJson({ data: $scope.FMCGGameDesignerSheet })).
        then(function (response) {
            pushMessage("data saved", 'info');
        }, function (response) {
            pushMessage(response.statusText, 'info');
        });
    };

    $scope.getPlayerData = function () {
        $http.get('/api/fmcgservice/GetPlayerInputs').
        then(function (response) {
            $scope.PlayerData = response.data;
            addDummyData();
            $http.get('/api/fmcgservice/GetFMCGGameDesignerDataSheet').
            then(function (designerDataSheet) {
                $scope.FMCGGameDesignerSheet = designerDataSheet.data[0].data;
            });
        }, function (response) {
            pushMessage(response.statusText, 'info');
        });
    }

    $scope.refreshData = function () {
        $http.get('/api/fmcgservice/GetPlayerInputs').
        then(function (response) {
            $scope.PlayerData = response.data;
            addDummyData();
            $http.get('/api/fmcgservice/GetFMCGGameDesignerDataSheet').
            then(function (designerDataSheet) {
                $scope.FMCGGameDesignerSheet[0][0] = "!PlayerData[0]['PTD']";
                $timeout(callAtTimeout, 10);

            });
            //$scope.FMCGGameDesignerSheet[0][2] =eval("$scope.PlayerData[0]['PTD']");
            //pushMessage("data recieved", 'info');
        }, function (response) {
            pushMessage(response.statusText, 'info');
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
        $.Notify({
            caption: mes.split("|")[0],
            content: mes.split("|")[1],
            type: t
        });
    }


    function addDummyData() {
        var dummycount = 10 - $scope.PlayerData.length;
        for (i = 0; i < dummycount; i++) {
            var dymmyPlayer = {
                Quarter: 0,
                PTD: 0,
                DistributorMargin: 0,
                RetailerMargin: 0,
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
            $scope.PlayerData.push(dymmyPlayer);
        }
    }
});



function getPlayerData(value) {
    var controllerElement = document.querySelector("#staticsheet");
    var controllerScope = angular.element(controllerElement).scope();
    value = eval("controllerScope." + value.substring(1));
    return value;
}

//$(document).ready(function () {
//    $(window).resize(function () {
//        var $c = $('.container'),
//            $w = $('.well'),
//            totalWidth = $('.navbar').outerWidth(),
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
//    $(window).resize();
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