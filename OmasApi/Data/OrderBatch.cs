using System;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
{
    [DynamoDBTable("Omas_OrderBatches")]
    public class OrderBatch
    {
        [DynamoDBHashKey]
        public string BatchId { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public bool IsOpen { get; set; }
    }
}
