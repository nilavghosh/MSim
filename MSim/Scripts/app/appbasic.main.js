angular.module("app.controllers", []);
angular.module("ngHandsontableDemo", ['ngHandsontable'])
appmain = angular.module("appMain", ["fmcgGame", "ui.bootstrap", "ui.router", "ngCookies", 'ui.grid', 'ui.grid.selection', "app.controllers","ngHandsontableDemo"]);
"use strict";