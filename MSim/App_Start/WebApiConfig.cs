using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Net.Http.Headers;

namespace MSim
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Use camel case for JSON data.
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            //// Controller Only
            //// To handle routes like `/api/VTRouting`
            //config.Routes.MapHttpRoute(
            //    name: "ControllerOnly",
            //    routeTemplate: "api/{controller}"
            //);

            //// Controller with ID
            //// To handle routes like `/api/VTRouting/1`
            //config.Routes.MapHttpRoute(
            //    name: "ControllerAndId",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: null,
            //    constraints: new { id = @"^\d+$" } // Only integers 
            //);

            //// Controllers with Actions
            //// To handle routes like `/api/VTRouting/route`
            //config.Routes.MapHttpRoute(
            //    name: "ControllerAndAction",
            //    routeTemplate: "api/{controller}/{action}"
            //);
        }
    }
}
