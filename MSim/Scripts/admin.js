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

angular.module("ngHandsontableDemo", ['ngHandsontable']).controller('DemoCtrl', function ($scope, $http, $timeout) {
    $scope.data1 = [['Year', "Maserati", "Mazda", "Mercedes", "Mini", "=A$1", 0, 0],
                    [2009, 0, 2941, 4303, 354, 5814],
                    [2010, 5, 2905, 2867, '=SUM(A4,2,3)', 32, '', '', '', '', '', '', '', ''],
                    [2011, 4, 2517, 4822, 552, 6127, '', '', '', '', '', '', '', ''],
                    [2012, 42, 21, 81, 12, 4151, '', '', '', '', '', '', '', '', ]
    ];


    $scope.settings = ({
        minSpareRows: 1,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: true,
        manualColumnResize: true,
        formulas: true
    });

    $scope.saveAdminSheet = function () {
        //$('.htCore tr').each(function () {
        //    $(this, 'tr').each(function (index, tr) {
        //        var lines = $('td', tr).map(function (index, td) {
        //            return $(td).text();
        //        });
        //        //This assumes that you have a table with an id of tblPurchaseOrders and that you have two cells of data
        //        alert(lines[0] + ' ' + lines[1]);
        //    })
        //});
        var data = [];
        $('.ht_master .htCore tbody tr').each(function (rowIndex, r) {
            var cols = [];
            $(this).find('td').each(function (colIndex, c) {
                cols.push(c.textContent);
            });
            data.push(cols);
        });
        alert(data);
    };

    //$http.get('/someUrl').
    //success(function (data, status, headers, config) {
    //    // this callback will be called asynchronously
    //    // when the response is available
    //}).
    //error(function (data, status, headers, config) {
    //    // called asynchronously if an error occurs
    //    // or server returns response with an error status.
    //});

});



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