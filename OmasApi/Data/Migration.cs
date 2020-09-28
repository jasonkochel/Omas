using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Logging;

namespace OmasApi.Data
{
    public class Migration
    {
        private readonly IAmazonDynamoDB _client;
        private readonly ILogger<Migration> _logger;

        private readonly List<CreateTableDefinition> _tables = new List<CreateTableDefinition>
        {
            new CreateTableDefinition
            {
                TableName = "Omas_Categories",
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
                Keys = new KeyDefinition
                {
                    HashKeyName = "BatchId",
                    HashKeyType = ScalarAttributeType.S
                }
            },
            new CreateTableDefinition
            {
                TableName = "Omas_Orders",
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
                Keys = new KeyDefinition
                {
                    HashKeyName = "UserId",
                    HashKeyType = ScalarAttributeType.S
                }
            }
        };

        public Migration(IAmazonDynamoDB client, ILogger<Migration> logger)
        {
            _client = client;
            _logger = logger;
        }

        public async Task<bool> Migrate()
        {
            // ReSharper disable once ForeachCanBePartlyConvertedToQueryUsingAnotherGetEnumerator
            foreach (var table in _tables)
            {
                var req = new CreateTableRequest
                {
                    TableName = table.TableName,
                    AttributeDefinitions = table.Keys.ToAttributeDefinition(),
                    KeySchema = table.Keys.ToKeySchema(),
                    GlobalSecondaryIndexes = table.Indexes.Select(i => new GlobalSecondaryIndex
                    {
                        IndexName = i.IndexName,
                        KeySchema = i.Keys.ToKeySchema()
                    }).ToList(),
                    ProvisionedThroughput = new ProvisionedThroughput
                    {
                        ReadCapacityUnits = 5,
                        WriteCapacityUnits = 5
                    }
                };

                if (!await CreateTableAsync(req))
                {
                    return false;
                }
            }

            return true;
        }

        public async Task Teardown()
        {
            foreach (var table in _tables)
            {
                await _client.DeleteTableAsync(table.TableName);
            }
        }

        private async Task<bool> CreateTableAsync(CreateTableRequest request)
        {
            _logger.LogInformation($"Creating a new table named {request.TableName}");
            if (await CheckTableExistenceAsync(request.TableName))
            {
                return true;
            }

            return await CreateNewTableAsync(request);
        }

        private async Task<bool> CheckTableExistenceAsync(string tableName)
        {
            var tableList = await _client.ListTablesAsync();
            if (tableList.TableNames.Contains(tableName))
            {
                _logger.LogInformation($"A table named {tableName} already exists in DynamoDB");

                try
                {
                    await _client.DescribeTableAsync(tableName);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"However, its description is not available ({ex.Message})");
                }

                return true;
            }

            return false;
        }

        public async Task<bool> CreateNewTableAsync(CreateTableRequest request)
        {
            try
            {
                await _client.CreateTableAsync(request);
                _logger.LogInformation($"Created table '{request.TableName}' successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to create the new table ({ex.Message})");
                return false;
            }
        }
    }

    public class CreateTableDefinition
    {
        public string TableName { get; set; }
        public KeyDefinition Keys { get; set; }
        public List<CreateIndexDefinition> Indexes { get; set; }
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

        public List<AttributeDefinition> ToAttributeDefinition()
        {
            var attributes = new List<AttributeDefinition>
            {
                new AttributeDefinition
                {
                    AttributeName = HashKeyName,
                    AttributeType = HashKeyType
                }
            };

            if (!RangeKeyName.IsNullOrEmpty())
            {
                attributes.Add(new AttributeDefinition
                    {
                        AttributeName = RangeKeyName,
                        AttributeType = RangeKeyType
                    }
                );
            }

            return attributes;
        }
    }
}
