namespace Shop.Models.FormModels
{
    public class ProductUserModel
    {
        public int ProductId { get; set; }
    }
    public class OrderForUser
    {
        public int Id { get; set; }
        public int User_id { get; set; }
        public DateTime OrderDate { get; set; }
        public double TotalSum { get; set; }
        public List<ProductUserModel> Products { get; set; }
    }
}
