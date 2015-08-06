﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MSim.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Home()
        {
            return PartialView("~/Views/Home/_Home.cshtml");
        }

    }
}
