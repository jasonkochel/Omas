using System;

namespace OmasApi.Models
{
    public class OrderHistoryModel
    {
        public string BatchId { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public decimal Total { get; set; }
    }
}