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
using System.Xml.Linq;
using MongoDB.Bson.Serialization;
using System.Text.RegularExpressions;
using System.IO;
using OfficeOpenXml;
using System.Web.Hosting;

namespace MSim.Controllers.Services
{
    [Authorize]
    public class FMCGServiceController : ApiController
    {
        private ApplicationUserManager _userManager;

        public IMongoDatabase database { get; set; }
        public FMCGServiceController()
        {
            var client = new MongoClient(@"mongodb://168.61.82.165:27017/");
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

        [HttpPost]
        [ActionName("GetPlayerData")]
        public async Task<object> GetPlayerData(Object registrationChoice)
        {
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());
            var collection = database.GetCollection<BsonDocument>("fmcgGamePlayerData3");


            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code) &
                         builder.Eq("username", User.Identity.Name) &
                         builder.Eq("qtrname", 1);
            //var games = await collection.Find(filter).ToListAsync();

            var quarterdata = new List<BsonDocument>();
            quarterdata = await collection.Find(filter).ToListAsync();
            //using (var cursor = await collection.FindAsync(filter))
            //{
            //    while (await cursor.MoveNextAsync())
            //    {
            //        var batch = cursor.Current;
            //        foreach (var document in batch)
            //        {
            //            // process document
            //            quarterdata.Add(document);
            //        }
            //    }
            //}
            try
            {
                if (quarterdata.Count == 1)
                {
                    string quarterDatainJson = quarterdata[0].ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                    return Newtonsoft.Json.JsonConvert.DeserializeObject(quarterDatainJson);
                }
                else
                {
                    return false;
                }
            }
            catch (Exception mssg)
            {
                int i = 1;
                return mssg.InnerException;
            }
        }

        [HttpPost]
        [ActionName("SavePlayerData")]
        public async Task<object> SavePlayerData(Object playerdata)
        {
            var playerdatadocument = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)playerdata).ToString());
            //GamePlayerData gameplayerdata = Newtonsoft.Json.JsonConvert.DeserializeObject<GamePlayerData>(playerdata.ToString());
            var collection = database.GetCollection<BsonDocument>("fmcgGamePlayerData3");
            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", playerdatadocument["gameid"]) &
                         builder.Eq("gamecode", playerdatadocument["gamecode"]) &
                         builder.Eq("username", playerdatadocument["username"]) &
                         builder.Eq("qtrname", playerdatadocument["qtrname"]);

            try
            {
                await collection.FindOneAndReplaceAsync(filter, playerdatadocument);
                return playerdatadocument;
            }
            catch (Exception mssg)
            {
                int i = 1;
                return mssg.InnerException;
            }
        }

        [HttpGet]
        [ActionName("GetStaticData")]
        public async Task<object> GetStaticData()
        {
            var filter = new BsonDocument();
            var collection = database.GetCollection<BsonDocument>("fmcgStaticData");
            var staticData = await collection.Find(filter).ToListAsync();
            string staticDataInJson = staticData.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
            return Newtonsoft.Json.JsonConvert.DeserializeObject(staticDataInJson);
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

        [AllowAnonymous]
        [HttpPost]
        [ActionName("GetAllPlayerDataForGame")]
        public async Task<object> GetAllPlayerDataForGame(Object registrationChoice)
        {
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());
            var collection = database.GetCollection<BsonDocument>("fmcgGamePlayerData3");


            var builder = Builders<BsonDocument>.Filter;

            //Get Data for all players for all quarters
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);


            List<GamePlayerData> playerdata = new List<GamePlayerData>();
            var tempdata = await collection.Find(filter).ToListAsync();
            tempdata.ForEach(document => playerdata.Add(BsonSerializer.Deserialize<GamePlayerData>(document)));
            //using (var cursor = await collection.FindAsync(filter))
            //{
            //    while (await cursor.MoveNextAsync())
            //    {
            //        var batch = cursor.Current;
            //        foreach (var document in batch)
            //        {
            //            // process document
            //            playerdata.Add(BsonSerializer.Deserialize<GamePlayerData>(document));
            //        }
            //    }
            //}
            try
            {
                var pgroups = playerdata.GroupBy(pdata => pdata.username).Select(p => new
                {
                    username = p.Key,
                    Qtr = p.ToList()
                }); ;

                if (pgroups.Count() > 0)
                {
                    string pquarterDatainJson = pgroups.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                    return Newtonsoft.Json.JsonConvert.DeserializeObject(pquarterDatainJson);

                    //return pgroups;
                }
                else
                {
                    return false;
                }
                // Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
            }
            catch (Exception mssg)
            {
                int i = 1;
                return mssg.InnerException;
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("Upload")]
        public async Task<object> Upload()
        {
            var file = HttpContext.Current.Request.Files.Count > 0 ?
            HttpContext.Current.Request.Files[0] : null;

            if (file != null && file.ContentLength > 0)
            {
                var fileName = Path.GetFileName(file.FileName);

                var path = Path.Combine(
                    HttpContext.Current.Server.MapPath("~/App_Data/GameModel"),
                    fileName
                );

                file.SaveAs(path);
            }

            return file != null ? "/uploads/kokito" + file.FileName : null;
        }


        public async Task<List<BsonDocument>> GetAllPlayerDataFromDB(Object registrationChoice)
        {
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());
            var collection = database.GetCollection<BsonDocument>("fmcgGamePlayerData3");


            var builder = Builders<BsonDocument>.Filter;

            //Get Data for all players for all quarters
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);


            //List<GamePlayerData> playerdata = new List<GamePlayerData>();
            var playerdata = await collection.Find(filter).ToListAsync();
            //tempdata.ForEach(document => playerdata.Add(BsonSerializer.Deserialize<GamePlayerData>(document)));

            return playerdata;
        }

        public InputMapping GetMapping()
        {
            using (StreamReader r = new StreamReader(HostingEnvironment.MapPath(@"~/App_Data/GameModel/FMCGInputMapping.json")))
            {
                string json = r.ReadToEnd();
                InputMapping mapping = Newtonsoft.Json.JsonConvert.DeserializeObject<InputMapping>(json);
                return mapping;
            }
        }


        [AllowAnonymous]
        [HttpPost]
        [ActionName("GetFMCGGameDesignerDataSheet")]
        public async Task<object> GetFMCGGameDesignerDataSheet(Object registrationChoice)
        {
            var filepath = HostingEnvironment.MapPath(@"~/App_Data/GameModel/FMCG.xlsx");
            var FMCGModelFile = new FileInfo(filepath);
            using (var FMCGModel = new ExcelPackage(FMCGModelFile))
            {
                // Get the work book in the file
                ExcelWorkbook FMCGworkBook = FMCGModel.Workbook;
                if (FMCGworkBook != null)
                {
                    if (FMCGworkBook.Worksheets.Count > 0)
                    {
                        var Quarter1Sheet = FMCGworkBook.Worksheets["Quarter 1"];
                        var Quarter2Sheet = FMCGworkBook.Worksheets["Quarter 2"];
                        var Quarter3Sheet = FMCGworkBook.Worksheets["Quarter 3"];
                        var Quarter4Sheet = FMCGworkBook.Worksheets["Quarter 4"];
                        var BESheet = FMCGworkBook.Worksheets["Brand Equity"];
                        var FinancialsSheet = FMCGworkBook.Worksheets["Financials"];

                        InputMapping mapping = GetMapping();

                        List<BsonDocument> playerdata = await GetAllPlayerDataFromDB(registrationChoice);
                        var pgroups = playerdata.GroupBy(tdata => tdata["username"]).Select(p => new
                        {
                            username = p.Key,
                            Qtr = p.ToList()
                        }).ToList();

                        int playercount = 0;
                        #region Update quarter data


                        mapping.Quarter1.PlayerData.ToList().ForEach(player =>
                            {
                                player.CellInfo.ToList().ForEach(cellinfo =>
                                 {
                                     Quarter1Sheet.Cells[cellinfo.Cell].Value = pgroups[playercount].Qtr[0].Contains(cellinfo.Name) == true ? pgroups[playercount].Qtr[0][cellinfo.Name].RawValue : 0;
                                 });
                                playercount++;
                            });
                        playercount = 0;
                        mapping.Quarter2.PlayerData.ToList().ForEach(player =>
                        {
                            player.CellInfo.ToList().ForEach(cellinfo =>
                            {
                                Quarter1Sheet.Cells[cellinfo.Cell].Value = pgroups[playercount].Qtr[1].Contains(cellinfo.Name) == true ? pgroups[playercount].Qtr[0][cellinfo.Name].RawValue : 0;
                            });
                            playercount++;
                        });
                        playercount = 0;
                        #endregion


                        Quarter1Sheet.Calculate();
                        FinancialsSheet.Calculate();
                        BESheet.Calculate();
                        Quarter2Sheet.Calculate();

                        Dictionary<String, List<List<string>>> book = new Dictionary<string, List<List<string>>>();
                        List<List<string>> Q1Values = GetSheetValues(Quarter1Sheet);
                        List<List<string>> Q2Values = GetSheetValues(Quarter1Sheet);
                        List<List<string>> FinancialValues = GetSheetValues(FinancialsSheet);
                        List<List<string>> BEValues = GetSheetValues(BESheet);

                        book["Quarter1"] = Q1Values;
                        book["Quarter2"] = Q2Values;
                        book["BrandEquity"] = FinancialValues;
                        book["Financials"] = BEValues;

                        string playersDatainJson = book.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                        return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
                    }
                }
            }
            //var filter = new BsonDocument();
            //var collection = database.GetCollection<BsonDocument>("fmcgGameDesignerDataSheet");
            //var playersData = await collection.Find(filter).ToListAsync();
            //string playersDatainJson = playersData.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
            //return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
            return 1;
        }

        public List<List<string>> GetSheetValues(ExcelWorksheet Sheet)
        {
            List<List<string>> Values = new List<List<string>>();
            int nrows = Sheet.Dimension.Rows;
            int ncolums = Sheet.Dimension.Columns;
            for (int i = 1; i <= nrows+2; i++)
            {
                List<string> arow = new List<string>();
                for (int j = 1; j <= ncolums+1; j++)
                {
                    arow.Add(Sheet.Cells[i, j].Text);
                }
                Values.Add(arow);
            }
            return Values;
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

            var collection = database.GetCollection<BsonDocument>("fmcgGameDesignerDataSheet");
            var filter = new BsonDocument();
            var result = await collection.DeleteManyAsync(filter);

            await collection.InsertOneAsync(document);
            return Ok();
        }


        [HttpPost]
        [ActionName("SaveFMCGStaticData")]
        public async Task<IHttpActionResult> SaveFMCGStaticData(Object staticData)
        {
            var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)staticData).ToString());

            var collection = database.GetCollection<BsonDocument>("fmcgStaticData");
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