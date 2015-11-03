using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSim.Models.FMCG.Report
{
   

    public class PlayerReport
    {
        public int Player { get; set; }
        public string CellInfo { get; set; }
    }

    public class Quarter
    {
        public string SheetName { get; set; }
        public IList<PlayerReport> PlayerReport { get; set; }
        public string PATRanking { get; set; }
    }

    public class ReportMapping : Dictionary<String, Quarter>
    {
    }
}