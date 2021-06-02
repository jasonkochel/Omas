using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_Settings")]
    public class Settings
    {
        [DynamoDBHashKey]
        public string SettingsId { get; set; }

        public decimal TaxRate { get; set; }
        public decimal ShippingRate { get; set; }
        public string WelcomeMessage { get; set; }
        public string WelcomeMessageHtml { get; set; }
        public string LoginMessage { get; set; }
        public string LoginMessageHtml { get; set; }
        public string EmailMessage { get; set; }
        public string EmailMessageHtml { get; set; }
    }
}