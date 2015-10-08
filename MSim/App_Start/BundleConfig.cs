using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace MSim
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/bower_components/jquery-knob/dist/jquery.knob.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.validation.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/metroui").Include(
                "~/Scripts/metro.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                 "~/Scripts/bower_components/d3/d3.min.js",
                "~/Scripts/bower_components/angular/angular.js",
                "~/Scripts/bower_components/angular-route/angular-route.js",
                "~/Scripts/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
                "~/Scripts/bower_components/Chart.js/chart.min.js",
                 "~/Scripts/bower_components/angular-chart.js/dist/angular-chart.min.js",
                 "~/Scripts/bower_components/angular-knob/src/angular-knob.js",
                 "~/Scripts/bower_components/pie-chart/dist/pie-chart.min.js",
                 "~/Scripts/app/admin/components/angular-ui-router/release/angular-ui-router.min.js",
                 "~/Scripts/app/admin/components/angular-cookies/angular-cookies.min.js"
                ));

            //"~/Scripts/bower_components/momentjs/min/moment.min.js",
            //    "~/Scripts/bower_components/momentjs/min/locales.min.js",
            //    "~/Scripts/bower_components/humanize-duration/humanize-duration.js",
            //    "~/Scripts/bower_components/angular-timer/dist/angular-timer.min.js",


            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/sammy-{version}.js",
                "~/Scripts/app/common.js",
                "~/Scripts/app/app.datamodel.js",
                "~/Scripts/app/app.viewmodel.js",
                "~/Scripts/app/home.viewmodel.js",
                "~/Scripts/app/_run.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularapp").Include("~/Scripts/app/app.main.js"));

            bundles.Add(new ScriptBundle("~/bundles/games").Include(
                "~/Scripts/app/fmcg.viewmodel.js"
                ));




            bundles.Add(new ScriptBundle("~/bundles/admin").Include(
                "~/Scripts/handsontable-extensions/setSheetDimensions.js",
                "~/Scripts/bower_components/handsontable/dist/handsontable.full.js",
                "~/Scripts/handsontable-extensions/angular/ngHandsontable.js",
                "~/Scripts/admin.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bower_components/bootstrap-fileinput/js/fileinput.min.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js",
                "~/Scripts/bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min.js",
                "~/Scripts/linq.js"
                ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                 "~/Scripts/bower_components/bootstrap/dist/css/bootstrap.css",
                 "~/Scripts/bower_components/metro-bootstrap/dist/css/metro-bootstrap.css",
                 "~/Scripts/bower_components/bootstrap-fileinput/css/fileinput.min.css",
                 "~/Content/Site.css",
                 "~/Content/rdash-ui/dist/css/rdash.min.css",
                 "~/Content/handsontable/handsontable.full.css",
                 "~/Scripts/handsontable-extensions/plugins/bootstrap/handsontable.bootstrap.css"));

            BundleTable.EnableOptimizations = false;
        }
    }
}
