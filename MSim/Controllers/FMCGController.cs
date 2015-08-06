﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MSim.Controllers
{
    [Authorize]
    public class FMCGController : Controller
    {
        // GET: FMCG
        public ActionResult Manage()
        {
            return View("~/views/Industries/fmcg/Admin/Manage.cshtml");
        }
    }
}