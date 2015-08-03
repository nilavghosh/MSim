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
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Newtonsoft.Json;

namespace MSim.Controllers.Services
{
    [Authorize]
    public class FMCGServiceController : ApiController
    {
        private ApplicationUserManager _userManager;


        public FMCGServiceController()
        {

        }

        public FMCGServiceController(ApplicationUserManager userManager)
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
        [ActionName("SaveFMCGData")]
        public async Task<IHttpActionResult> SaveFMCGData(Object CPData)
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)CPData).ToString());
            document.Add(new BsonElement("userid", user.Id));

            var client = new MongoClient();
            var database = client.GetDatabase("MSim");

            var collection = database.GetCollection<BsonDocument>("fmcgGameData");
            var filter = Builders<BsonDocument>.Filter.Eq("userid", user.Id);
            var userentry = await collection.Find(filter).ToListAsync();
            if (userentry.Count > 0)
            {
                await collection.ReplaceOneAsync(filter, document);
                return Ok();
            }
            else
            {
                await collection.InsertOneAsync(document);
                return Ok();
            }

            //var update = Builders<BsonDocument>.Update.Set("address.street", "East 31st Street");


            //var result = await collection.Find(filter).ToListAsync();


            //var fmcgdata = from e in collection.AsQueryable<Employee>()
            //               where e.FirstName == "John"
            //               select e;




            ////            return database;


            //var user = UserManager.FindById(User.Identity.GetUserId());

            //MSimEntities db = new MSimEntities();
            //var entries = db.ChannelPartnerManagements.Where(cp => cp.UserId == user.Id);
            //if (entries.Count() == 0)
            //{
            //    var cpEntry = db.ChannelPartnerManagements.Create();
            //    cpEntry.UserId = user.Id;
            //    cpEntry.PTD = CPData.PTD;
            //    cpEntry.DistributorMargin = CPData.DistributorMargin;
            //    cpEntry.RetailerMargin = CPData.RetailerMargin;
            //    db.ChannelPartnerManagements.Add(cpEntry);
            //}
            //else
            //{
            //    var cpEntry = entries.First();
            //    cpEntry.PTD = CPData.PTD;
            //    cpEntry.DistributorMargin = CPData.DistributorMargin;
            //    cpEntry.RetailerMargin = CPData.RetailerMargin;
            //}
            //db.SaveChanges();
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