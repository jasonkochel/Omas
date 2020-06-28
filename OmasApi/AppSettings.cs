using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OmasApi
{
    public class AppSettings
    {
        public ConnectionStrings ConnectionStrings { get; set; }
        public string Jwks { get; set; }
    }

    public class ConnectionStrings
    {
        public string Default { get; set; }
    }
}

