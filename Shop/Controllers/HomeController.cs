using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Models;
using Shop.Models.Tabels;
using System.Diagnostics;

namespace Shop.Controllers
{
    public class HomeController : Controller
    {
        private readonly ShopContext _context;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, ShopContext context)
        {
            _logger = logger;
            _context = context;
        }
        public IActionResult Index()
        {
            var userId = HttpContext.User.FindFirst("UserId")?.Value;
            var userIdentity = User.Identity.IsAuthenticated;
            if (userId == null) { 
                userId = "0"; 
            }
            ViewBag.UserId = userId;
            ViewBag.Identity = userIdentity;
            return View();
        }

        [Route("Home/Product/{id}")]
        public IActionResult Product(string id)
        {
            var productId = id;
            ViewBag.ProductId = productId;
            return View();
        }
        public IActionResult Cart()
        {
            return View();
        }
        [Authorize]
        public IActionResult Orders()
        {    
            return View();
        }
        [Authorize]
        public IActionResult Order(string id)
        {
            var orderId = id;
            ViewBag.OrderId = orderId;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
