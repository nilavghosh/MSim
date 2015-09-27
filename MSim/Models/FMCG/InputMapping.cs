using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSim.Models.FMCG.Input
{

    public class Quarter
    {
        public string SheetName { get; set; }
        public IList<PlayerData> PlayerData { get; set; }
    }

    public class CellInfo
    {
        public string Name { get; set; }
        public string Cell { get; set; }
    }

    public class PlayerData
    {
        public int Player { get; set; }
        public IList<CellInfo> CellInfo { get; set; }
    }

    public class InputMapping 
    {
        public Quarter Quarter1 { get; set; }
        public Quarter Quarter2 { get; set; }
        public Quarter Quarter3 { get; set; }
        public Quarter Quarter4 { get; set; }
    }
}

