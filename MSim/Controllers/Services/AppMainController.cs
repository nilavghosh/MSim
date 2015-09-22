using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MSim.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;

namespace MSim.Controllers.Services
{
    [Authorize]
    public class AppMainController : ApiController
    {
        public IMongoDatabase database { get; set; }
        public AppMainController()
        {
            var client = new MongoClient(@"mongodb://168.61.82.165:27017/");
            database = client.GetDatabase("MSim");
        }

        [HttpGet]
        [ActionName("GetGames")]
        public async Task<object> GetGames()
        {
            var filter = new BsonDocument();
            var collection = database.GetCollection<BsonDocument>("gameProperties");


            List<BsonDocument> games = new List<BsonDocument>();
            games = await collection.Find(filter).ToListAsync();
            //using (var cursor = await collection.FindAsync(filter))
            //{
            //    while (await cursor.MoveNextAsync())
            //    {
            //        var batch = cursor.Current;
            //        foreach (var document in batch)
            //        {
            //            // process document
            //            games.Add(document);
            //        }
            //    }
            //}



            try
            {
                string playersDatainJson = games.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                return Newtonsoft.Json.JsonConvert.DeserializeObject(playersDatainJson);
            }
            catch (Exception mssg)
            {
                int i = 1;
                return mssg.InnerException;
            }
        }

        [HttpPost]
        [ActionName("CheckRegistration")]
        public async Task<object> CheckRegistration(Object registrationChoice)
        {
            SelectedGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<SelectedGame>(registrationChoice.ToString());
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            var builder = Builders<BsonDocument>.Filter;
            var matchname = Builders<BsonDocument>.Filter.Eq("username", User.Identity.Name);
            var filter = builder.Eq("gameid", selectedgame.selectedGameId) & builder.Eq("gamecode", selectedgame.code) & builder.ElemMatch("players", matchname);
            //var games = await collection.Find(filter).ToListAsync();
            var games = new List<BsonDocument>();
            games = await collection.Find(filter).ToListAsync();
            //using (var cursor = await collection.FindAsync(filter))
            //{
            //    while (await cursor.MoveNextAsync())
            //    {
            //        var batch = cursor.Current;
            //        foreach (var document in batch)
            //        {
            //            // process document
            //            games.Add(document);
            //        }
            //    }
            //}
            //await Task.Delay(1000);



            try
            {
                //string playersDatainJson = games.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
                if (games.Count == 1)
                {
                    return true;
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

    }
}
