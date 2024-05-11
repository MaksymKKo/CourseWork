namespace Shop.Models.Tabels
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public List<Order> Orders { get; set; }
    }
}
