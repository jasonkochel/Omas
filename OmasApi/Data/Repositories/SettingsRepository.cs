using Amazon.DynamoDBv2;
using OmasApi.Data.Entities;

namespace OmasApi.Data.Repositories
{
    public class SettingsRepository : DynamoDBRepository<Settings>
    {
        public SettingsRepository(IAmazonDynamoDB client) : base(client) { }

        public string SettingsId => "1";

        public Settings DefaultSettings => new Settings
        {
            TaxRate = 0.00M,
            ShippingRate = 0.00M,
            WelcomeMessage = "{\"blocks\":[{\"key\":\"1u95g\",\"text\":\"Welcome to the site\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
            LoginMessage = "{\"blocks\":[{\"key\":\"1u95g\",\"text\":\"Welcome to the site\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
        };
    }
}