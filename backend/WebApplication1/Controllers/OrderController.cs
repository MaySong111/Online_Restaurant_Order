using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.core.DbData;
using WebApplication1.core.Dtos.Order;
using WebApplication1.core.Models;
using WebApplication1.core.Utility;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {
        // create a method to get all orders for logged in user
        // 用户在前端点击"我的订单" → 看到订单列表（GetOrders）→ 点击某个订单 → 看详情（GetOrderById）
        // get all orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            // 用户只能看到自己的订单
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var orders = await _context.Orders.Include(o => o.OrderItems)
            .ThenInclude(oi => oi.MenuItem)
            .OrderByDescending(o => o.OrderDate)
            .Where(o => o.ApplicationUserId == loggedInUserId)
            .ToListAsync();

            return Ok(orders);
        }

        // 必须登录 + 验证是自己的订单才能查看:这个订单的详情
        [HttpGet("{orderId}")]
        public async Task<ActionResult<Order>> GetOrderById(string orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found" });
            }

            // check if the logged in user is the owner of the order
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (order.ApplicationUserId != loggedInUserId)
            {
                return Unauthorized(new { Message = "You are not authorized to view this order" });
            }

            return Ok(order);
        }

        // create new order--
        [HttpPost("create")]
        public async Task<ActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (loggedInUserId == null)
            {
                return Unauthorized(new { Message = "User not logged in" });
            }
            var newOrder = _mapper.Map<Order>(dto);
            newOrder.ApplicationUserId = loggedInUserId;

            _context.Orders.Add(newOrder);

            // item type:OrderItemCreateDto, dto.OrderItems: List<OrderItemCreateDto>
            foreach (var item in dto.OrderItems)
            {
                var newOrderItem = _mapper.Map<OrderItem>(item);
                newOrderItem.OrderId = newOrder.Id;
                _context.OrderItems.Add(newOrderItem);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { orderId = newOrder.Id }, new
            {
                Message = "Order created successfully"
            });
        }

        // 用户更新订单的取餐信息
        [HttpPut("update/{orderId}")]
        public async Task<ActionResult> UpdateOrder(string orderId, [FromBody] OrderUpdateDto dto)
        {
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (loggedInUserId == null)
            {
                return Unauthorized(new { Message = "User not logged in" });
            }

            var existingOrder = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (existingOrder == null)
            {
                return NotFound(new { Message = "Order not found" });
            }
            
            if (existingOrder.ApplicationUserId != loggedInUserId)
            {
                return Unauthorized(new { Message = "You are not authorized to update this order" });
            }

            if (existingOrder.Status ==  StaticOrderStatus.Status_Confirmed && dto.Status != StaticOrderStatus.Status_ReadyForPickup)
            {
               existingOrder.Status = StaticOrderStatus.Status_ReadyForPickup;
            }

             if (existingOrder.Status ==  StaticOrderStatus.Status_Confirmed && dto.Status != StaticOrderStatus.Status_ReadyForPickup)
            {
               existingOrder.Status = StaticOrderStatus.Status_ReadyForPickup;
            }
            
             if (existingOrder.Status ==  StaticOrderStatus.Status_ReadyForPickup && dto.Status != StaticOrderStatus.Status_Completed)
            {
               existingOrder.Status = StaticOrderStatus.Status_Completed;
            }

            if( dto.Status == StaticOrderStatus.Status_Cancelled)
            {
               existingOrder.Status = StaticOrderStatus.Status_Cancelled;
            }

            _mapper.Map(dto, existingOrder);

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Order updated successfully" });
        }
    }
}
