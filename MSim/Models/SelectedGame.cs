using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSim.Models
{
    public class SelectedGame
    {
        public int selectedGameId { get; set; }
        public string code { get; set; }
        public string username { get; set; }
        public int selectedquarter { get; set; }
    }
}