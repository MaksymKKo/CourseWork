namespace Shop.Models.Tabels
{
    public class OrderProduct
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Orders { get; set; }

        public int ProductId { get; set; }
        public Product Products { get; set; }
    }
}
