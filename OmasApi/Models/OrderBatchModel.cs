using System;

namespace OmasApi.Models
{
    public class OrderBatchModel
    {
        public string BatchId { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public bool IsOpen { get; set; }
        public int CustomerCount { get; set; }
        public decimal Total { get; set; }
    }
}