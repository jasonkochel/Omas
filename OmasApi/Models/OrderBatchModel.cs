using System;

namespace OmasApi.Models
{
    public class OrderLineInputModel
    {
        public string Sku { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderBatchModel
    {
        public string BatchId { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public bool IsOpen { get; set; }
        public int CustomerCount { get; set; }
        public decimal Total { get; set; }
        public int UnconfirmedCustomerCount { get; set; }
        public decimal UnconfirmedTotal { get; set; }
    }
}