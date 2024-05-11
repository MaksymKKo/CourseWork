namespace Shop.Models.Tabels
{
    public class Category
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public virtual List<Product> Products { get; set; }
    }
}
