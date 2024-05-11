using Shop.Models.Tabels;

namespace Shop.Models.FormModels
{
    public class OrderModel
    {
        public int Id { get; set; }
        public int User_id { get; set; }
        public DateTime OrderDate { get; set; }
        public double TotalSum { get; set; }
    }
}
