using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSim.Models.FMCG
{

    public class MarketReport
    {
        public string SheetName { get; set; }
        public string RevenueReport { get; set; }
        public string SalesReport { get; set; }
        public string PATReport { get; set; }
    }

    public class MarketReportMapping : Dictionary<String, MarketReport>
    {
    }
}