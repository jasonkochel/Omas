using Amazon.DynamoDBv2;
using Microsoft.Extensions.Options;
using OmasApi.Data.Entities;
using OmasApi.Models;

namespace OmasApi.Data.Repositories
{
    public class SettingsRepository : DynamoDBRepository<Settings>
    {
        public SettingsRepository(IAmazonDynamoDB client, RequestContext requestContext,
            IOptions<AppSettings> appSettings) : base(client, requestContext, appSettings)
        {
        }

        public string SettingsId => "1";

        public Settings DefaultSettings => new Settings
        {
            TaxRate = 0.00M,
            ShippingRate = 0.00M,
            WelcomeMessage = "{\"blocks\":[{\"key\":\"1u95g\",\"text\":\"Welcome to the site\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
            LoginMessage = "{\"blocks\":[{\"key\":\"1u95g\",\"text\":\"Welcome to the site\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
            EmailMessage = "{\"blocks\":[{\"key\":\"1u95g\",\"text\":\"Thank you for your order\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
        };
    }
}