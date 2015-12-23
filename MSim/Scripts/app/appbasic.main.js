angular.module("app.controllers", []);
angular.module("ngHandsontableDemo", ['ngHandsontable'])
appmain = angular.module("appMain", ["fmcgGame", "ui.bootstrap", "ui.router", "ngCookies", 'ui.grid', 'ui.grid.selection', "app.controllers", "ngHandsontableDemo", "ng-token-auth"])
 .config(function ($authProvider) {

     // the following shows the default values. values passed to this method
     // will extend the defaults using angular.extend
     //Getting ng-token-auth to work with WebApi https://github.com/lynndylanhurley/ng-token-auth/issues/56
     $authProvider.configure({
         storage: 'localStorage',
         emailRegistrationPath: '/Account/Register',
         handleLoginResponse: function (resp, $auth) {
             // the persistData method will store the token for subsequent requests.
             // this will be stored using cookies or localStorage depending on your config. 
             $auth.persistData('auth_headers', {

                 // save the token
                 'Authorization': 'Bearer ' + resp['access_token'],

                 // convert the expiry value into a date that this module understands
                 'expiry': new Date().getTime() + resp['expires_in']
             });

             // the object returned by this method will be attached to the $rootScope as
             // the "user" object. The object needs a "uid" value at minimum
             return {
                 'uid': resp['userName']
             };
         },

         // now that the token expiration date is stored, let the module know
         // where to find it
         parseExpiry: function (headers) {
             return headers['expiry'];
         },

         // this will let the module know what properties to add to subsequent requests
         // to the API
         tokenFormat: function () {
             return {
                 'Authorization': 'Bearer {{ token }}'
             };
         }
     });
 });
"use strict";