using System.Security.Policy;

namespace OmasApi
{
    public class AppSettings
    {
        public JwksWrapper Jwks { get; set; }
        public Site[] Sites { get; set; }
        public EmailSettings EmailSettings { get; set; }
        public DynamoDb DynamoDb { get; set; }
    }

    #pragma warning disable IDE1006 // Naming Styles
    // ReSharper disable InconsistentNaming

    public class JwksWrapper
    {
        public Jwks[] keys { get; set; }
    }

    public class Jwks
    {
        public string alg { get; set; }
        public string e { get; set; }
        public string kid { get; set; }
        public string kty { get; set; }
        public string n { get; set; }
        public string use { get; set; }
    }

    #pragma warning restore IDE1006 // Naming Styles
    // ReSharper restore InconsistentNaming

    public class Site
    {
        public string HostHeader { get; set; }
        public string TablePrefix { get; set; }
    }

    public class EmailSettings
    {
        public string MailFrom { get; set; }
        public string Subject { get; set; }
    }

    public class DynamoDb
    {
        public bool LocalMode { get; set; }
        public string LocalServiceUrl { get; set; }
    }
}

