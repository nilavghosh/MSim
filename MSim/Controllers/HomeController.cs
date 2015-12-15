using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MSim.Controllers
{
    public class HomeController : Controller
    {
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Landing()
        {
            return View();
        }

        [Authorize]
        public ActionResult GameDashboard()
        {
            return View();
        }

        [Authorize]
        public ActionResult Home()
        {
            return PartialView("~/Views/Home/_Home.cshtml");
        }

    }
}
