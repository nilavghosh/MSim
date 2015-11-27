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
using MSim.Models.FMCG;

namespace MSim.Controllers.Services
{
    [Authorize]
    public class AppMainController : ApiController
    {
        public IMongoDatabase database { get; set; }
        public AppMainController()
        {
            var client = new MongoClient(@"mongodb://visualstudio-vm.cloudapp.net:27017/");
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
        [ActionName("GetGamesForDate")]
        public object GetGamesForDate(object date)
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            var gameProperties = database.GetCollection<BsonDocument>("gameProperties");

            var selectedDate = new BsonDateTime(DateTime.Parse(date.ToString()));
            List<RegisteredGame> registeredGames = new List<RegisteredGame>();

            collection.AsQueryable().Where(game => game["players.username"] == User.Identity.Name && game["startdate"] < selectedDate).ToList().ForEach(game =>
            {
                var reggame = new RegisteredGame();
                reggame.Id = game["gameid"].AsInt32;
                if (game["started"].AsBoolean == true && game["completed"].AsBoolean == false) reggame.Status = "In Progress";
                if (game["started"].AsBoolean == true && game["completed"].AsBoolean == true) reggame.Status = "Completed";
                if (game["started"].AsBoolean == false && game["completed"].AsBoolean == false) reggame.Status = "Registered";
                reggame._id = game["_id"].AsObjectId.ToString();
                registeredGames.Add(reggame);
            });

            registeredGames.ForEach(regGame =>
            {
                var gprop = gameProperties.AsQueryable().Where(g => g["id"] == regGame.Id).First();
                regGame.Industry = gprop["industry"].AsString;
                regGame.Game = gprop["name"].AsString;
            });

            return registeredGames;
        }

        [HttpPost]
        [ActionName("GetAdminGamesForToday")]
        public object GetAdminGamesForToday()
        {
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            var gameProperties = database.GetCollection<BsonDocument>("gameProperties");

            var selectedDate = new BsonDateTime(DateTime.Today);
            List<RegisteredGame> registeredGames = new List<RegisteredGame>();

            collection.AsQueryable().Where(game => game["players.username"] == User.Identity.Name && game["startdate"] < selectedDate).ToList().ForEach(game =>
            {
                var reggame = new RegisteredGame();
                reggame.Id = game["gameid"].AsInt32;
                if (game["started"].AsBoolean == true && game["completed"].AsBoolean == false) reggame.Status = "In Progress";
                if (game["started"].AsBoolean == true && game["completed"].AsBoolean == true) reggame.Status = "Completed";
                if (game["started"].AsBoolean == false && game["completed"].AsBoolean == false) reggame.Status = "Start Now";
                reggame._id = game["_id"].AsObjectId.ToString();
                registeredGames.Add(reggame);
            });

            registeredGames.ForEach(regGame =>
            {
                var gprop = gameProperties.AsQueryable().Where(g => g["id"] == regGame.Id).First();
                regGame.Industry = gprop["industry"].AsString;
                regGame.Game = gprop["name"].AsString;
            });

            return registeredGames;
        }


        [HttpPost]
        [ActionName("GetPlayerStatusForGame")]
        public object GetPlayerStatusForGame(object selgame)
        {
            RegisteredGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<RegisteredGame>(selgame.ToString());
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            ObjectId gameid = ObjectId.Parse(selectedgame._id);
            var players = collection.AsQueryable().Where(game => game["_id"] == gameid).First()["players"];
            string quarterDatainJson = players.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.Strict });
            return Newtonsoft.Json.JsonConvert.DeserializeObject(quarterDatainJson);
        }

        [HttpPost]
        [ActionName("StartGame")]
        public async Task<object> StartGame(object selgame)
        {
            RegisteredGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<RegisteredGame>(selgame.ToString());
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            ObjectId gameid = ObjectId.Parse(selectedgame._id);

            //var builder = Builders<BsonDocument>.Filter;
            var filter = Builders<BsonDocument>.Filter.Eq("_id", gameid);


            var game = await collection.Find(filter).FirstAsync();
            game["started"] = true;
            game["q1starttime"] = DateTime.UtcNow;
            game["q2starttime"] = DateTime.UtcNow.AddMinutes(game["q1duration"].AsInt32);
            game["q3starttime"] = DateTime.UtcNow.AddMinutes(game["q2duration"].AsInt32 + game["q1duration"].AsInt32); ;
            game["q4starttime"] = DateTime.UtcNow.AddMinutes(game["q1duration"].AsInt32 + game["q1duration"].AsInt32 + game["q3duration"].AsInt32); ;
            game["q1started"] = true;
            game["q2started"] = false;
            game["q3started"] = false;
            game["q4started"] = false;

            await collection.ReplaceOneAsync(filter, game);

            //var filter = Builders<BsonDocument>.Filter.Eq("_id", gameid);
            //var update = Builders<BsonDocument>.Update.Set("started", true);

            //var result = await collection.UpdateOneAsync(filter, update);
            return true;
        }









        [HttpPost]
        [ActionName("CheckRegistration")]
        public async Task<object> CheckRegistration(Object registrationChoice)
        {
            RegisteredGame selectedgame = Newtonsoft.Json.JsonConvert.DeserializeObject<RegisteredGame>(registrationChoice.ToString());
            var collection = database.GetCollection<BsonDocument>("registeredGames");
            var builder = Builders<BsonDocument>.Filter;
            var matchname = Builders<BsonDocument>.Filter.Eq("username", User.Identity.Name);
            var filter = builder.Eq("_id", ObjectId.Parse(selectedgame._id)) & builder.Eq("gamecode", selectedgame.GameCode) & builder.ElemMatch("players", matchname);
            //var games = await collection.Find(filter).ToListAsync();
            var games = new List<BsonDocument>();
            games = await collection.Find(filter).ToListAsync();
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
