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
using MongoDB.Driver.Core;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using Newtonsoft.Json;
using MongoDB.Bson.IO;

namespace MSim.Controllers.Services
{
    [Authorize]
    public class FMCGServiceController : ApiController
    {
        private ApplicationUserManager _userManager;

        public IMongoDatabase database { get; set; }
        public FMCGServiceController()
        {
            var client = new MongoClient(@"mongodb://168.61.82.165:27017/MSim");
            database = client.GetDatabase("MSim");
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

        [HttpGet]
        [ActionName("GetPlayerInputs")]
        public async Task<object> GetPlayerInputs()
        {
            //var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)adminStaticData).ToString());
            //var client = new MongoClient();
            //var database = client.GetDatabase("MSim");
            var filter = new BsonDocument();
            var collection = database.GetCollection<BsonDocument>("fmcgGamePlayerData");


            List<BsonDocument> playersData = new List<BsonDocument>();
            using (var cursor = await collection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var document in batch)
                    {
                        // process document
                        playersData.Add(document);
                    }
                }
            }

            
            
            try
            {
                //var playersData = await collection.Find(filter).ToListAsync();
                string playersDatainJson = playersData.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
            }
            catch (Exception mssg)
            {
                int i = 1;
                return mssg.InnerException;
            }
            
        }

        [HttpGet]
        [ActionName("GetFMCGGameDesignerDataSheet")]
        public async Task<object> GetFMCGGameDesignerDataSheet()
        {
            //var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)adminStaticData).ToString());
            //var client = new MongoClient();
            //var database = client.GetDatabase("MSim");
            var filter = new BsonDocument();
            var collection = database.GetCollection<BsonDocument>("fmcgGameDesignerDataSheet");
            var playersData = await collection.Find(filter).ToListAsync();
            string playersDatainJson = playersData.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
            return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
        }



        // POST api/<controller>
        [HttpPost]
        [ActionName("SaveFMCGData")]
        public async Task<IHttpActionResult> SaveFMCGData(Object CPData)
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)CPData).ToString());
            document.Add(new BsonElement("userid", user.Id));

            //var client = new MongoClient();
            //var database = client.GetDatabase("MSim");

            var collection = database.GetCollection<BsonDocument>("fmcgGamePlayerData");
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

        [HttpPost]
        [ActionName("SaveFMCGAdminStaticSheet")]
        public async Task<IHttpActionResult> SaveFMCGAdminStaticSheet(Object adminStaticData)
        {
            var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)adminStaticData).ToString());
            //var client = new MongoClient();
            //var database = client.GetDatabase("MSim");

            var collection = database.GetCollection<BsonDocument>("fmcgGameDesignerDataSheet");
            var filter = new BsonDocument();
            var result = await collection.DeleteManyAsync(filter);

            await collection.InsertOneAsync(document);
            return Ok();
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