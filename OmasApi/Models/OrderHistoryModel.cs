using System;

namespace OmasApi.Models
{
    public class OrderHistoryModel
    {
        public DateTime? DeliveryDate { get; set; }
        public decimal Total { get; set; }
    }
}