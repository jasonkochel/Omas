using System;
using System.Collections.Generic;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_OrderBatches")]
    public class OrderBatch
    {
        [DynamoDBHashKey]
        public string BatchId { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public bool IsOpen { get; set; }

        public List<OrderBatch> Import(IEnumerable<string> lines)
        {
            return lines
                .Select(line => line.Split('\t'))
                .Where(fields => fields.Length == 4)
                .Select(fields => new OrderBatch
                {
                    BatchId = fields[0],
                    OrderDate = DateTime.Parse(fields[1]),
                    DeliveryDate = DateTime.Parse(fields[2]),
                    IsOpen = fields[3] == "1"
                }).ToList();
        }
    }
}
