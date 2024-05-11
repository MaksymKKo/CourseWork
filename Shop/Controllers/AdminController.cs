using Microsoft.AspNetCore.Mvc;

namespace Shop.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Users()
        {
            var userId = HttpContext.User.FindFirst("UserId")?.Value;
            ViewBag.UserId = userId;
            return View();
        }
        public IActionResult Products()
        {
            return View();
        }
        public IActionResult Categories()
        {
            return View();
        }
        public IActionResult Orders()
        {
            return View();
        }
    }
}
