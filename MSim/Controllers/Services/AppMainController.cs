using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MSim.Controllers.Services
{
    public class AppMainController : ApiController
    {
        public IMongoDatabase database { get; set; }
        public AppMainController()
        {
            var client = new MongoClient(@"mongodb://168.61.82.165:27017/MSim");
            database = client.GetDatabase("MSim");
        }

        [HttpGet]
        [ActionName("GetGames")]
        public async Task<object> GetGames()
        {
            var filter = new BsonDocument();
            var collection = database.GetCollection<BsonDocument>("gameProperties");


            List<BsonDocument> games = new List<BsonDocument>();
            using (var cursor = await collection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var document in batch)
                    {
                        // process document
                        games.Add(document);
                    }
                }
            }



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

    }
}
