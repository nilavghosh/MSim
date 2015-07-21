using System;
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
        public ActionResult ChannelPartnerManagement()
        {
            return PartialView("~/views/Industries/fmcg/channelpartners/ChannelPartnerManagement.cshtml");
        }
    }
}