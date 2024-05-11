namespace Shop.Models.FormModels
{
    public class ProductModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public int Price { get; set; }
        public string Characteristics { get; set; }
        public int Category_id { get; set; }
    }
}
