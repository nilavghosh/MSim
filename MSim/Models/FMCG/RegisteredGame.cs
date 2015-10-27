using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSim.Models.FMCG
{
    public class RegisteredGame
    {
        public string _id { get; set; }
        public string Game { get; set; }
        public string Industry { get; set; }
        public int Id { get; set; }
        public string Status { get; set; }
        public string GameCode { get; set; }
        public int selectedquarter { get; set; }
    }
}