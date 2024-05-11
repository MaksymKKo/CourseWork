using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Shop.Models;
using Shop.Models.FormModels;
using Shop.Models.Tabels;

namespace Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ShopContext _context;

        public OrdersController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        // GET: api/Orders
        [HttpGet("UserOrders/{id}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUserId(int id)
        {
            return await _context.Orders.Where(p=>p.User_id == id).ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<Order>> PutOrder(int id, OrderModel order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }
            Order order1 = new Order() {Id = order.Id, User_id = order.User_id, OrderDate = order.OrderDate, TotalSum = order.TotalSum};
            _context.Entry(order1).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return order1;
        }
        // POST: api/Orders/PostUserOrder
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [Authorize]
        [HttpPost("PostUserOrder")]
        public async Task<ActionResult> PostUserOrder(OrderForUser order)
        {
            Order order1 = new Order() { User_id = order.User_id, OrderDate = order.OrderDate, TotalSum = order.TotalSum };
            _context.Orders.Add(order1);

            await _context.SaveChangesAsync();

            foreach (var product in order.Products)
            {
                _context.OrderProducts.Add(new OrderProduct() { OrderId = order1.Id, ProductId = product.ProductId });
            }

            await _context.SaveChangesAsync();

            return Ok();
        }


        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderModel order)
        {
            Order order1 = new Order() { User_id = order.User_id, OrderDate = order.OrderDate, TotalSum = order.TotalSum };
            _context.Orders.Add(order1);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order1.Id }, order1);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Order>> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return order;
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
