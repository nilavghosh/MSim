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
using MSim.Models.FMCG.Input;
using MSim.Models.FMCG.Report;

namespace MSim.Controllers.Services
{
    [Authorize]
    public class FMCGServiceController : ApiController
    {
        private ApplicationUserManager _userManager;

        public IMongoDatabase database { get; set; }
        public FMCGServiceController()
        {
            var client = new MongoClient(@"mongodb://127.0.0.1:27017/");
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
                         builder.Eq("qtrname", selectedgame.selectedquarter);
            var quarterdata = new List<BsonDocument>();
            quarterdata = await collection.Find(filter).ToListAsync();

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

        [HttpPost]
        [ActionName("GetStartedQuarters")]
        public async Task<object> GetStartedQuarters(Object registrationChoice)
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);

            var game = await collection.Find(filter).FirstAsync();
            Dictionary<String, object> gameInfo = new Dictionary<string, object>();
            gameInfo["q1started"] = game["q1started"];
            gameInfo["q2started"] = game["q2started"];
            gameInfo["q3started"] = game["q3started"];
            gameInfo["q4started"] = game["q4started"];
            return gameInfo;
        }

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

            var playerdata = await collection.Find(filter).ToListAsync();

            return playerdata;
        }

        public InputMapping GetMapping()
        {
            using (StreamReader r = new StreamReader(HostingEnvironment.MapPath(@"~/App_Data/GameModel/FMCGInputMapping.json")))
            {
                string json = r.ReadToEnd();
                InputMapping mapping = Newtonsoft.Json.JsonConvert.DeserializeObject<InputMapping>(json);
                //using (StreamReader reg = new StreamReader(HostingEnvironment.MapPath(@"~/App_Data/GameModel/FMCGReportMapping.json")))
                //{
                //    string jkon = reg.ReadToEnd();
                //    ReportMapping mapping2 = Newtonsoft.Json.JsonConvert.DeserializeObject<ReportMapping>(jkon);
                //    int i = 1;
                //}
                return mapping;
            }
        }

        public MarketReportMapping GetMarketReportMapping()
        {
            using (StreamReader r = new StreamReader(HostingEnvironment.MapPath(@"~/App_Data/GameModel/FMCGMarketReportMapping.json")))
            {
                string json = r.ReadToEnd();
                MarketReportMapping mapping = Newtonsoft.Json.JsonConvert.DeserializeObject<MarketReportMapping>(json);
                return mapping;
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("GetMarketReport")]
        public async Task<object> GetMarketReport(Object registrationChoice)
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);

            var game = await collection.Find(filter).FirstAsync();
            var players = game["players"].AsBsonArray.Select(g => g["username"]);

            int playerindex = players.ToList().IndexOf(User.Identity.Name) + 1;


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

                        List<List<string>> RevenueReportValues = GetSheetValues(FinancialsSheet, GetMarketReportMapping()["Quarter" + selectedgame.selectedquarter.ToString()].RevenueReport);
                        List<List<string>> SalesReportValues = GetSheetValues(FinancialsSheet, GetMarketReportMapping()["Quarter" + selectedgame.selectedquarter.ToString()].SalesReport);
                        List<List<string>> PATReportValues = GetSheetValues(FinancialsSheet, GetMarketReportMapping()["Quarter" + selectedgame.selectedquarter.ToString()].PATReport);
                        List<List<string>> PlayerNames = new List<List<string>>();
                        List<string> Players = new List<string>();

                        int pcount = 0;
                        SalesReportValues[0].ForEach(sv =>
                        {
                            Players.Add("Player" + (pcount + 1).ToString());
                            pcount++;
                        });
                        PlayerNames.Add(Players);
                        book["RevenueReportValues"] = RevenueReportValues;
                        book["SalesReportValues"] = SalesReportValues;
                        book["PATReportValues"] = PATReportValues;
                        book["Players"] = PlayerNames;


                        string playersDatainJson = book.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                        return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
                    }
                }
            }
            return 1;
        }


        public String GetReportDataRange(int quarter, int player)
        {
            using (StreamReader r = new StreamReader(HostingEnvironment.MapPath(@"~/App_Data/GameModel/FMCGReportMapping.json")))
            {
                string json = r.ReadToEnd();
                ReportMapping mapping = Newtonsoft.Json.JsonConvert.DeserializeObject<ReportMapping>(json);
                return mapping["Quarter" + quarter.ToString()].PlayerReport.Where(pr => pr.Player == player).First().CellInfo;
            }
        }


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
                                Quarter2Sheet.Cells[cellinfo.Cell].Value = pgroups[playercount].Qtr[1].Contains(cellinfo.Name) == true ? pgroups[playercount].Qtr[1][cellinfo.Name].RawValue : 0;
                            });
                            playercount++;
                        });
                        playercount = 0;
                        mapping.Quarter3.PlayerData.ToList().ForEach(player =>
                        {
                            player.CellInfo.ToList().ForEach(cellinfo =>
                            {
                                Quarter3Sheet.Cells[cellinfo.Cell].Value = pgroups[playercount].Qtr[2].Contains(cellinfo.Name) == true ? pgroups[playercount].Qtr[2][cellinfo.Name].RawValue : 0;
                            });
                            playercount++;
                        });
                        playercount = 0;
                        mapping.Quarter4.PlayerData.ToList().ForEach(player =>
                        {
                            player.CellInfo.ToList().ForEach(cellinfo =>
                            {
                                Quarter4Sheet.Cells[cellinfo.Cell].Value = pgroups[playercount].Qtr[3].Contains(cellinfo.Name) == true ? pgroups[playercount].Qtr[3][cellinfo.Name].RawValue : 0;
                            });
                            playercount++;
                        });
                        playercount = 0;
                        #endregion

                        FMCGworkBook.Calculate();

                        Dictionary<String, List<List<string>>> book = new Dictionary<string, List<List<string>>>();
                        List<List<string>> Q1Values = GetSheetValues(Quarter1Sheet);
                        List<List<string>> Q2Values = GetSheetValues(Quarter2Sheet);
                        List<List<string>> Q3Values = GetSheetValues(Quarter3Sheet);
                        List<List<string>> Q4Values = GetSheetValues(Quarter4Sheet);
                        List<List<string>> FinancialValues = GetSheetValues(FinancialsSheet);
                        List<List<string>> BEValues = GetSheetValues(BESheet);

                        book["Quarter1"] = Q1Values;
                        book["Quarter2"] = Q2Values;
                        book["Quarter3"] = Q3Values;
                        book["Quarter4"] = Q4Values;
                        book["BrandEquity"] = BEValues;
                        book["Financials"] = FinancialValues;

                        string playersDatainJson = book.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                        return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
                    }
                }
            }
            return 1;
        }

        [HttpPost]
        [ActionName("GetFinancialReport")]
        public async Task<object> GetFinancialReport(Object registrationChoice)
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);

            var game = await collection.Find(filter).FirstAsync();
            var players = game["players"].AsBsonArray.Select(g => g["username"]);

            int playerindex = players.ToList().IndexOf(User.Identity.Name) + 1;


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

                        List<List<string>> FinancialValues = GetSheetValues(FinancialsSheet, GetReportDataRange(selectedgame.selectedquarter, playerindex));
                        book["Financials"] = FinancialValues;

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

        public List<List<string>> GetSheetValues(ExcelWorksheet Sheet, String range = null)
        {
            if (range == null)
            {
                List<List<string>> Values = new List<List<string>>();
                int nrows = Sheet.Dimension.Rows;
                int ncolums = Sheet.Dimension.Columns;
                for (int i = 1; i <= nrows + 2; i++)
                {
                    List<string> arow = new List<string>();
                    for (int j = 1; j <= ncolums + 1; j++)
                    {
                        arow.Add(Sheet.Cells[i, j].Text);
                    }
                    Values.Add(arow);
                }
                return Values;
            }
            else
            {
                ExcelRange reportRange = Sheet.Cells[range];
                var rangevalues = reportRange.ToList();
                List<List<string>> Values = new List<List<string>>();
                int nrows = reportRange.Rows;
                int ncolums = rangevalues.Count() / nrows; //reportRange.Columns;
                for (int i = 0; i < nrows; i++)
                {
                    List<string> arow = new List<string>();
                    for (int j = 0; j < ncolums; j++)
                    {
                        // arow.Add(rangevalues[ncolums * i + j].Text);
                        arow.Add(rangevalues[i + nrows * j].Text);
                    }
                    Values.Add(arow);
                }
                return Values;
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("StartQuarter")]
        public async Task<object> StartQuarter(object registrationChoice)
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);


            var game = await collection.Find(filter).FirstAsync();

            string qstarttime = "q" + selectedgame.selectedquarter.ToString() + "starttime";
            string qstarted = "q" + selectedgame.selectedquarter.ToString() + "started";

            game[qstarttime] = DateTime.UtcNow;
            game[qstarted] = true;
            await collection.ReplaceOneAsync(filter, game);
            return game;
        }

        [HttpPost]
        [ActionName("GetTimeLeft")]
        public async Task<object> GetTimeLeft(Object registrationChoice)
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) &
                         builder.Eq("gamecode", selectedgame.code);

            var game = await collection.Find(filter).FirstAsync();
            Dictionary<String, object> gameInfo = new Dictionary<string, object>();

            string qstarted = "q" + selectedgame.selectedquarter.ToString() + "started";
            string qstarttime = "q" + selectedgame.selectedquarter.ToString() + "starttime";
            string qduration = "q" + selectedgame.selectedquarter.ToString() + "duration";

            gameInfo["qstarted"] = game[qstarted];
            int qtimeleft = (Int32)game[qstarttime].ToUniversalTime().AddMinutes(game[qduration].AsInt32).Subtract(DateTime.UtcNow).TotalSeconds;
            if (qtimeleft < 0)
            {
                gameInfo["qtimeleft"] = 0;
            }
            else
            {
                gameInfo["qtimeleft"] = qtimeleft;
            }
            return gameInfo;
        }


        // POST api/<controller>
        [HttpPost]
        [ActionName("SaveFMCGData")]
        public async Task<IHttpActionResult> SaveFMCGData(Object CPData)
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            var document = BsonDocument.Parse(((Newtonsoft.Json.Linq.JObject)CPData).ToString());
            document.Add(new BsonElement("userid", user.Id));

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
    }
}