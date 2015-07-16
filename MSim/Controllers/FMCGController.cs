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
        public List<UserMarketShare> Get()
        {
            MSimEntities db = new MSimEntities();
            ResultData res = new ResultData();
            List<UserMarketShare> marketShares = new List<UserMarketShare>();
            var entries = db.ChannelPartnerManagements;
            double totalSum = 0.0;
            entries.ToList().ForEach(entry => totalSum += (double)entry.PTD);
            entries.ToList().ForEach(cpData =>
            {
                UserMarketShare mshare = new UserMarketShare();
                mshare.UserName = cpData.AspNetUser.UserName;
                mshare.MarketShare = ((int)cpData.PTD / totalSum) * 100.0;
                marketShares.Add(mshare);
            });
            return marketShares;
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