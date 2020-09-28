using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
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

        [DynamoDBIgnore]
        public List<OrderLine> LineItems { get; set; }

        [DynamoDBIgnore]
        public User User { get; set; }
    }
}
