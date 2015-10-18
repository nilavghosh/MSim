using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSim.Models.FMCG
{



    public class GamePlayerData
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public int gameid { get; set; }
        public string gamecode { get; set; }
        public string username { get; set; }
        public int qtrname { get; set; }
        public int PTD { get; set; }
        public int DistributorMargin { get; set; }
        public int RetailerMargin { get; set; }
        public int CompanyMargin { get; set; }
        public int DistributorMargin5L { get; set; }
        public int RetailerMargin5L { get; set; }
        public int CompanyMargin5L { get; set; }
        public int NoOfSalesmen { get; set; }
        public int AvgSalary { get; set; }
        public int Training { get; set; }
        public int TVAds { get; set; }
        public int NewspaperAds { get; set; }
        public int HoardingAds { get; set; }
        public int TotalATLExpense { get; set; }
        public int Promoters { get; set; }
        public int Sampling { get; set; }
        public int InShopBranding { get; set; }
        public int TotalBTLExpense { get; set; }
        public int MustardOilPercentage { get; set; }
        public int PalmOilPercentage { get; set; }
        public int PackagingMaterial { get; set; }
        public float PlaceanOrder { get; set; }
        public float PlaceanOrder5L { get; set; }
    }

}