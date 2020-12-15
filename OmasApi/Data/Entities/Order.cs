using System;
using System.Collections.Generic;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_Orders")]
    public class Order
    {
        [DynamoDBHashKey]
        public string BatchId { get; set; }

        [DynamoDBRangeKey]
        public string UserId { get; set; }

        public bool Confirmed { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }

        public decimal SubTotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Shipping { get; set; }

        [DynamoDBIgnore]
        public OrderBatch OrderBatch { get; set; }

        [DynamoDBIgnore]
        public List<OrderLine> LineItems { get; set; }

        [DynamoDBIgnore]
        public User User { get; set; }

        public List<Order> Import(IEnumerable<string> lines)
        {
            /*
            select u.CognitoID, o.BatchID, o.Confirmed, ob.DeliveryDate, ob.OrderDate
            from orders o
            join users u on o.userid=u.userid
            join OrderBatches ob on o.BatchID = ob.BatchID
            */

            return lines
                .Select(line => line.Split('\t'))
                .Where(fields => fields.Length == 5)
                .Select(fields => new Order
                {
                    UserId = fields[0].ToLower(),
                    BatchId = fields[1],
                    Confirmed = fields[2] == "1",
                    DeliveryDate = DateTime.Parse(fields[3]),
                    OrderDate = DateTime.Parse(fields[4])
                }).ToList();
        }
    }
}
