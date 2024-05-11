namespace Shop.Models.Tabels
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public double Price { get; set; }
        public string Characteristics { get; set; }
        public int Category_id { get; set; }
        public virtual Category Category { get; set; }
        public virtual List<OrderProduct> OrderProducts { get; set; }
    }
}
