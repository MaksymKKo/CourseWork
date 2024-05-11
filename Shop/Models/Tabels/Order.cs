namespace Shop.Models.Tabels
{
    public class Order
    {
        public int Id { get; set; }
        public int User_id { get; set; }
        public virtual User User { get; set; }
        public DateTime OrderDate { get; set; }
        public double TotalSum { get; set; }
        public virtual List<OrderProduct> OrderProducts { get; set; }
    }
}
