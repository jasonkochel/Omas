using System;

namespace OmasApi.Models
{
    public class OrderHistoryModel
    {
        public int BatchId { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public decimal Total { get; set; }
    }
}