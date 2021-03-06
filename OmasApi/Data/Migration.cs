﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OmasApi.Data.Entities;

namespace OmasApi.Data
{
    public class Migration
    {
        private readonly IAmazonDynamoDB _client;
        private readonly ILogger<Migration> _logger;
        private readonly IOptions<AppSettings> _appSettings;

        private readonly List<CreateTableDefinition> _tables = new List<CreateTableDefinition>
        {
            new CreateTableDefinition
            {
                TableName = "Omas_Categories",
                EntityType = typeof(Category),
                Keys = new KeyDefinition
                {
                    HashKeyName = "CategoryId",
                    HashKeyType = ScalarAttributeType.S
                },
                Indexes = new List<CreateIndexDefinition>
                {
                    new CreateIndexDefinition
                    {
                        IndexName = "Omas_Categories_Idx_Sequence",
                        Keys = new KeyDefinition
                        {
                            HashKeyName = "Sequence",
                            HashKeyType = ScalarAttributeType.N
                        }
                    }
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_CatalogItems",
                EntityType = typeof(CatalogItem),
                Keys = new KeyDefinition
                {
                    HashKeyName = "CatalogId",
                    HashKeyType = ScalarAttributeType.S
                },
                Indexes = new List<CreateIndexDefinition>
                {
                    new CreateIndexDefinition
                    {
                        IndexName = "Omas_CatalogItems_Idx_Sequence",
                        Keys = new KeyDefinition
                        {
                            HashKeyName = "Sequence",
                            HashKeyType = ScalarAttributeType.N
                        }
                    },
                    new CreateIndexDefinition
                    {
                        IndexName = "Omas_CatalogItems_Idx_Category",
                        Keys = new KeyDefinition
                        {
                            HashKeyName = "CategoryId",
                            HashKeyType = ScalarAttributeType.S
                        }
                    },
                    new CreateIndexDefinition
                    {
                        IndexName = "Omas_CatalogItems_Idx_Sku",
                        Keys = new KeyDefinition
                        {
                            HashKeyName = "Sku",
                            HashKeyType = ScalarAttributeType.S
                        }
                    }
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_OrderBatches",
                EntityType = typeof(OrderBatch),
                Keys = new KeyDefinition
                {
                    HashKeyName = "BatchId",
                    HashKeyType = ScalarAttributeType.S
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_Orders",
                EntityType = typeof(Order),
                Keys = new KeyDefinition
                {
                    HashKeyName = "BatchId",
                    HashKeyType = ScalarAttributeType.S,
                    RangeKeyName = "UserId",
                    RangeKeyType = ScalarAttributeType.S
                },
                Indexes = new List<CreateIndexDefinition>
                {
                    new CreateIndexDefinition
                    {
                        IndexName = "Omas_Orders_Idx_UserId",
                        Keys = new KeyDefinition
                        {
                            HashKeyName = "UserId",
                            HashKeyType = ScalarAttributeType.S
                        }
                    }
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_OrderLines",
                EntityType = typeof(OrderLine),
                Keys = new KeyDefinition
                {
                    HashKeyName = "BatchId",
                    HashKeyType = ScalarAttributeType.S,
                    RangeKeyName = "UserId_Sku",
                    RangeKeyType = ScalarAttributeType.S
                },
                Indexes = new List<CreateIndexDefinition>
                {
                    new CreateIndexDefinition
                    {
                        IndexName = "Omas_OrderLines_Idx_UserId",
                        Keys = new KeyDefinition
                        {
                            HashKeyName = "UserId",
                            HashKeyType = ScalarAttributeType.S
                        }
                    }
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_Users",
                EntityType = typeof(User),
                Keys = new KeyDefinition
                {
                    HashKeyName = "UserId",
                    HashKeyType = ScalarAttributeType.S
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_Settings",
                EntityType = typeof(Settings),
                Keys = new KeyDefinition
                {
                    HashKeyName = "SettingsId",
                    HashKeyType = ScalarAttributeType.S
                }
            }
        };

        public Migration(IAmazonDynamoDB client, ILogger<Migration> logger, IOptions<AppSettings> appSettings)
        {
            _client = client;
            _logger = logger;
            _appSettings = appSettings;
        }

        public async Task<bool> Migrate()
        {
            foreach (var site in _appSettings.Value.Sites)
            {
                var tablePrefix = site.TablePrefix;

                var db = new DynamoDBContext(_client, new DynamoDBContextConfig
                {
                    Conversion = DynamoDBEntryConversion.V2,
                    TableNamePrefix = tablePrefix
                });

                foreach (var table in _tables)
                {
                    var req = new CreateTableRequest
                    {
                        TableName = tablePrefix + table.TableName,
                        AttributeDefinitions = table.GetAttributeDefinition(),
                        KeySchema = table.Keys.ToKeySchema(),
                        GlobalSecondaryIndexes = table.Indexes?.Select(i => new GlobalSecondaryIndex
                        {
                            IndexName = i.IndexName,
                            KeySchema = i.Keys.ToKeySchema(),
                            Projection = new Projection {ProjectionType = ProjectionType.ALL}
                        }).ToList(),
                        BillingMode = BillingMode.PAY_PER_REQUEST,
                    };

                    var result = await CreateTableAsync(req);
                    switch (result)
                    {
                        case CreateTableResult.Created:
                        case CreateTableResult.ExistsEmpty:
                            await PopulateTable(req, tablePrefix, db);
                            break;

                        case CreateTableResult.ExistsWithData:
                            break;

                        case CreateTableResult.Error:
                            return false;

                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }
            }

            return true;
        }

        public async Task Teardown()
        {
            foreach (var site in _appSettings.Value.Sites)
            {
                foreach (var table in _tables)
                {
                    await _client.DeleteTableAsync(site.TablePrefix + table.TableName);
                }
            }
        }

        private async Task<CreateTableResult> CreateTableAsync(CreateTableRequest request)
        {
            _logger.LogInformation($"Creating a new table named '{request.TableName}'");
            if (await CheckTableExistenceAsync(request.TableName))
            {
                try
                {
                    var res = await _client.DescribeTableAsync(request.TableName);
                    return res.Table.ItemCount == 0
                        ? CreateTableResult.ExistsEmpty
                        : CreateTableResult.ExistsWithData;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"However, its description is not available ({ex.Message})");
                }
            }

            return await CreateNewTableAsync(request);
        }

        private async Task<bool> CheckTableExistenceAsync(string tableName)
        {
            var tableList = await _client.ListTablesAsync();
            if (tableList.TableNames.Contains(tableName))
            {
                _logger.LogInformation($"A table named '{tableName}' already exists in DynamoDB");
                return true;
            }

            return false;
        }

        private async Task<CreateTableResult> CreateNewTableAsync(CreateTableRequest request)
        {
            try
            {
                await _client.CreateTableAsync(request);
                _logger.LogInformation($"Created table '{request.TableName}' successfully");
                return CreateTableResult.Created;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to create the new table ({ex.Message})");
                return CreateTableResult.Error;
            }
        }

        private async Task PopulateTable(CreateTableRequest request, string tablePrefix, IDynamoDBContext db)
        {
            var def = _tables.Single(t => tablePrefix + t.TableName == request.TableName);
            var entityType = def.EntityType;

            var fileName = Path.Join(
                Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location),
                "Data", "Migration",
                def.EntityType.Name + ".txt"
            );

            _logger.LogInformation($"Looking for data file '{fileName}'");

            if (File.Exists(fileName))
            {
                _logger.LogInformation($"Data file found; populating table '{request.TableName}'");

                dynamic entityClass = Activator.CreateInstance(entityType);

                if (entityClass != null)
                {
                    var entities = entityClass.Import(File.ReadLines(fileName));
                    foreach (var entity in entities)
                    {
                        await db.SaveAsync(entity);     // TODO use bulk action API
                    }
                }
            }
        }
    }

    public class CreateTableDefinition
    {
        public string TableName { get; set; }
        public Type EntityType { get; set; }
        public KeyDefinition Keys { get; set; }
        public List<CreateIndexDefinition> Indexes { get; set; }

        public List<AttributeDefinition> GetAttributeDefinition()
        {
            var attributeNames = new List<string>();

            var attributes = new List<AttributeDefinition>
            {
                new AttributeDefinition
                {
                    AttributeName = Keys.HashKeyName,
                    AttributeType = Keys.HashKeyType
                }
            };
            attributeNames.Add(Keys.HashKeyName);

            if (!Keys.RangeKeyName.IsNullOrEmpty())
            {
                attributes.Add(new AttributeDefinition
                {
                    AttributeName = Keys.RangeKeyName,
                    AttributeType = Keys.RangeKeyType
                }
                );
                attributeNames.Add(Keys.RangeKeyName);
            }

            if (Indexes != null)
            {
                foreach (var index in Indexes)
                {
                    if (!attributeNames.Contains(index.Keys.HashKeyName))
                    {
                        attributes.Add(new AttributeDefinition
                        {
                            AttributeName = index.Keys.HashKeyName,
                            AttributeType = index.Keys.HashKeyType
                        });
                        attributeNames.Add(index.Keys.HashKeyName);
                    }

                    if (!index.Keys.RangeKeyName.IsNullOrEmpty())
                    {
                        if (!attributeNames.Contains(index.Keys.RangeKeyName))
                        {
                            attributes.Add(new AttributeDefinition
                            {
                                AttributeName = index.Keys.RangeKeyName,
                                AttributeType = index.Keys.RangeKeyType
                            });
                            attributeNames.Add(index.Keys.RangeKeyName);
                        }
                    }
                }
            }

            return attributes;
        }
    }

    public class CreateIndexDefinition
    {
        public string IndexName { get; set; }
        public KeyDefinition Keys { get; set; }
    }

    public class KeyDefinition
    {
        public string HashKeyName { get; set; }
        public ScalarAttributeType HashKeyType { get; set; }
        public string RangeKeyName { get; set; }
        public ScalarAttributeType RangeKeyType { get; set; }

        public List<KeySchemaElement> ToKeySchema()
        {
            var keys = new List<KeySchemaElement>
            {
                new KeySchemaElement
                {
                    AttributeName = HashKeyName,
                    KeyType = KeyType.HASH
                }
            };

            if (!RangeKeyName.IsNullOrEmpty())
            {
                keys.Add(new KeySchemaElement
                {
                    AttributeName = RangeKeyName,
                    KeyType = KeyType.RANGE
                });
            }

            return keys;
        }
    }

    public enum CreateTableResult
    {
        Created,
        ExistsEmpty,
        ExistsWithData,
        Error
    }
}
