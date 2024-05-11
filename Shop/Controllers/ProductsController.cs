using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.Models;
using Shop.Models.FormModels;
using Shop.Models.Tabels;

namespace Shop.Controllers
{
    public class ProductWithQuantity
    {
        public Product Product { get; set; }
        public int Quantity { get; set; }
    }
    /// <summary>
    /// При можливості добавити вибір категорії зі списку 
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ShopContext _context;

        public ProductsController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }
        // GET by category: api/ProductsByCategory/5
        [HttpGet("ProductsByCategory/{id}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(int id)
        {
            var productsInCategory = await _context.Products
                .Where(product => product.Category_id == id)
                .ToListAsync();
            return productsInCategory;
        }

        // GET by category: api/ProductsByTitle/Apple
        [HttpGet("ProductsByTitle/{find}")]
        public async Task<ActionResult<IEnumerable<Product>>> ProductsByTitle(string find)
        {
            var exactMatchProduct = await _context.Products.FirstOrDefaultAsync(product => product.Title.Equals(find));

            if (exactMatchProduct != null)
                return new List<Product> { exactMatchProduct };

            string trimmedFind = find.Replace(" ", "");
            var trimmedProducts = await _context.Products
                .Where(product => product.Title.Replace(" ", "").Contains(trimmedFind))
                .ToListAsync();

            if (trimmedProducts != null)
                return trimmedProducts;
            else
                return new List<Product>();
        }

        // GET by category: api/OrderProducts/5
        [HttpGet("OrderProducts/{id}")]
        public async Task<ActionResult<IEnumerable<ProductWithQuantity>>> OrderProducts(int id)
        {
            var orderId = id; // Замените на фактический id заказа

            // Получаем список id продуктов из заказа с их количеством
            var productsWithQuantity = await _context.OrderProducts
                .Where(op => op.OrderId == orderId)
                .GroupBy(op => op.ProductId)
                .Select(g => new ProductWithQuantity
                {
                    Product = _context.Products.FirstOrDefault(p => p.Id == g.Key),
                    Quantity = g.Count()
                })
                .ToListAsync();

            return productsWithQuantity;
        }


        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> PutProduct(int id, ProductModel product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            Product product2 = new Product() { Id = product.Id, Title = product.Title, Description = product.Description,
                Picture = product.Picture, Price = product.Price, Characteristics = product.Characteristics, Category_id = product.Category_id};
            

            _context.Entry(product2).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return product2;
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(ProductModel product)
        {
            Product product2 = new Product() { Title = product.Title, Description = product.Description,
                Picture = product.Picture, Price = product.Price, Characteristics = product.Characteristics, Category_id = product.Category_id};
            _context.Products.Add(product2);
            
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetProduct", new { id = product2.Id }, product2);
        }

        // DELETE: api/Products/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return product;
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
