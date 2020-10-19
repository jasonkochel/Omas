using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Microsoft.Extensions.Logging;
using OmasApi.Data;
using OmasApi.Data.Entities;
using Xunit;

// ReSharper disable StringLiteralTypo

namespace OmasApi.Tests
{
    public class DatabaseFixture : IDisposable
    {
        public IAmazonDynamoDB Client;
        public Dictionary<string, object> SeedData = new Dictionary<string, object>();

        private readonly Migration _migrator;

        public DatabaseFixture()
        {
            var clientConfig = new AmazonDynamoDBConfig
            {
                ServiceURL = "http://localhost:8000",
                LogMetrics = true,
                LogResponse = true,
                DisableLogging = false,
            };

            Client = new AmazonDynamoDBClient(clientConfig);

            var nullLogger = new Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory();

            _migrator = new Migration(Client, new Logger<Migration>(nullLogger));
            if (!_migrator.Migrate().Result)
            {
                throw new Exception("Database migration failed");
            }

            var db = new DynamoDBContext(Client, new DynamoDBContextConfig
            {
                Conversion = DynamoDBEntryConversion.V2
            });

            SeedDatabase(db);
        }

        private void SeedDatabase(IDynamoDBContext db)
        {
            var categories = new List<Category>
            {
                new Category
                {
                    CategoryId = Guid.NewGuid().ToString(), Name = "Category 1", Description = "Cat 1 Description",
                    Sequence = 1
                },
                new Category
                {
                    CategoryId = Guid.NewGuid().ToString(), Name = "Category 2", Description = "Cat 2 Description",
                    Sequence = 2
                },
                new Category
                {
                    CategoryId = Guid.NewGuid().ToString(), Name = "Category 3", Description = "Cat 3 Description",
                    Sequence = 3
                },
            };

            foreach (var category in categories)
            {
                db.SaveAsync(category);
                SeedData.Add(category.Name, category);
            }
        }

        public void Dispose()
        {
            // ReSharper disable once AssignmentIsFullyDiscarded
            _ = _migrator.Teardown();
        }
    }

    [CollectionDefinition("OmasApi.Tests")]
    public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
    {
        // See https://xunit.net/docs/shared-context#collection-fixture
    }
}