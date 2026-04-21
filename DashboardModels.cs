// Models for Dashboard API responses

namespace RMagicApi.Models
{
    public class DashboardResponse
    {
        public TransactionSummary Purchase { get; set; }
        public TransactionSummary Sales { get; set; }
        public List<TransactionDetail> PurchaseDetails { get; set; }
        public List<TransactionDetail> SalesDetails { get; set; }
    }

    public class TransactionSummary
    {
        public int TotalBills { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class TransactionDetail
    {
        public string DocNo { get; set; }
        public DateTime DocDate { get; set; }
        public decimal Quantity { get; set; }
        public decimal Amount { get; set; }
    }
}