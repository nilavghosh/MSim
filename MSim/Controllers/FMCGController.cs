using MSim.Models.FMCG;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using MSim.Models;
using MSim.DAL;


namespace MSim.Controllers
{
    [Authorize]
    public class FMCGController : ApiController
    {
        private ApplicationUserManager _userManager;


        public FMCGController()
        { 
        
        }

        public FMCGController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        // GET api/<controller>
        public int Get()
        {
            MSimEntities db = new MSimEntities();
            ResultData res = new ResultData();

            var entries = db.ChannelPartnerManagements;
            int totalSum = 0;
            entries.ToList().ForEach(entry => totalSum += (int)entry.PTD);
            res.Player1Name = db.AspNetUsers.Where(user => user.Id == entries.ToList()[0].UserId).First().UserName;
            res.Player2Name = db.AspNetUsers.Where(user => user.Id == entries.ToList()[1].UserId).First().UserName;
            res.Player1Value = (int)entries.ToList()[0].PTD / totalSum * 100;
            res.Player2Value = (int)entries.ToList()[1].PTD / totalSum * 100;
            return 5;
        }

       


        // POST api/<controller>
        [HttpPost]
        [ActionName("SubmitChannelPartner")]
        public void SubmitChannelPartner(ChannelPartnerData CPData)
        {
            var user = UserManager.FindById(User.Identity.GetUserId());

            MSimEntities db = new MSimEntities();
            var entries = db.ChannelPartnerManagements.Where(cp => cp.UserId == user.Id);
            if (entries.Count() == 0)
            {
                var cpEntry = db.ChannelPartnerManagements.Create();
                cpEntry.UserId = user.Id;
                cpEntry.PTD = CPData.PTD;
                db.ChannelPartnerManagements.Add(cpEntry);
            }
            else
            {
                var cpEntry = entries.First();
                cpEntry.PTD = CPData.PTD;
            }
            db.SaveChanges();
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}