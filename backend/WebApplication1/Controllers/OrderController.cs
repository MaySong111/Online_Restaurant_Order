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
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {
        // create a method to get all orders for logged in user
        // 用户在前端点击"我的订单" → 看到订单列表（GetOrders）→ 点击某个订单 → 看详情（GetOrderById）
        // get all orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders(
            [FromQuery] string? status,
            [FromQuery] string? sortBy,
            [FromQuery] string? sortDirection,
            [FromQuery] string? search,
            [FromQuery] int? currentPage = 1,
            [FromQuery] int? pageSize = 5
        )
        {
            // Console.WriteLine($"GetOrders called with status={status}, sortBy={sortBy}, sortDirection={sortDirection}, search={search}, currentPage={currentPage}, pageSize={pageSize}");
            // 用户只能看到自己的订单
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var query = _context.Orders
                                .Include(o => o.OrderItems)
                                .ThenInclude(mi => mi.Review)
                                .AsQueryable();

            // admin can see all orders, other users can only see their own orders
            if (!User.IsInRole("Admin"))
            {
                query = query.Where(o => o.ApplicationUserId == loggedInUserId);
            }

            // filter by status
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.Status == status);
            }

            // Search by name, email or phone
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(o =>
                    o.PickUpName.Contains(search) ||
                    o.PickUpEmail.Contains(search) ||
                    o.PickUpPhoneNumber.Contains(search));
            }
            // Sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy == "TotalAmount")
                {
                    query = sortDirection == "Ascending"
                        ? query.OrderBy(o => o.OrderTotal)
                        : query.OrderByDescending(o => o.OrderTotal);
                }
                else if (sortBy == "CustomerName")
                {
                    query = sortDirection == "Ascending"
                        ? query.OrderBy(o => o.PickUpName)
                        : query.OrderByDescending(o => o.PickUpName);
                }
                else
                {
                    query = sortDirection == "Ascending"
                        ? query.OrderBy(o => o.OrderDate)
                        : query.OrderByDescending(o => o.OrderDate);
                }
            }
            else
            {
                query = query.OrderByDescending(o => o.OrderDate);
            }
            var totalOrders = await query.CountAsync();
            query = query.Skip((currentPage.Value - 1) * pageSize.Value).Take(pageSize.Value);

            var orders = await query.ToListAsync();
            var orderDtos = _mapper.Map<List<OrderDto>>(orders);
            return Ok(new { TotalOrders = totalOrders, Orders = orderDtos });
        }



        // 必须登录 + 验证是自己的订单才能查看:这个订单的详情
        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(string orderId)
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

        // create new order
        [HttpPost("create")]
        public async Task<ActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // Console.WriteLine($"User ID: {loggedInUserId}");
            // Console.WriteLine($"User ID Type: {loggedInUserId?.GetType()}");
            // Console.WriteLine("create order dto:", dto.OrderItems.Count);

            if (loggedInUserId == null)
            {
                return Unauthorized(new { Message = "User not logged in" });
            }

            var newOrder = _mapper.Map<Order>(dto);  // 这里不要映射orderitems,否则下面的forearch中还会再次映射orderitem的,那就会造成数量加倍了
            newOrder.ApplicationUserId = loggedInUserId;

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();  // 先保存 Order，生成 Id,生成 newOrder.Id,否则无法赋值给 OrderItem 的外键 OrderId

            // item type:OrderItemCreateDto, dto.OrderItems: List<OrderItemCreateDto>
            // _context.OrderItems.Add(newOrderItem);  可以,但是不合适, 存在的话我不是新增加,而是 增加数量!!!
            // 这里的 orderItemDto 是 OrderItemCreateDto，不是实体,在这里映射,不要在创建order的时候映射!!!!!! 否则数量会加倍
            foreach (var orderItemDto in dto.OrderItems)
            {
                var existingItem = await _context.OrderItems.FirstOrDefaultAsync(oi => oi.OrderId == newOrder.Id && oi.MenuItemId == orderItemDto.MenuItemId);

                if (existingItem != null)
                {
                    existingItem.Quantity += orderItemDto.Quantity;
                }
                else
                {
                    var newOrderItem = _mapper.Map<OrderItem>(orderItemDto);
                    newOrderItem.OrderId = newOrder.Id;
                    _context.OrderItems.Add(newOrderItem);
                }
            }
            await _context.SaveChangesAsync(); // 再保存 OrderItems

            return CreatedAtAction(nameof(GetOrderById), new { orderId = newOrder.Id }, new
            {
                Message = "Order created successfully"
            });
        }


        // 用户更新订单的状态-admin 也可以更新订单状态
        [HttpPut("update/{orderId}")]
        public async Task<ActionResult> UpdateOrder(string orderId, [FromBody] OrderItemUpdateDto dto)
        {
            Console.WriteLine("UpdateOrder called with status:", dto.Status);
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

            // check admin and order owner
            var isAdmin = User.IsInRole(StaticRoles.Role_Admin);

            // 如果不是 admin，检查是否是订单所有者
            if (!isAdmin && existingOrder.ApplicationUserId != loggedInUserId)
            {
                return Unauthorized(new { Message = "You are not authorized to update this order" });
            }

            if (existingOrder.Status == StaticOrderStatus.Status_Confirmed && dto.Status == StaticOrderStatus.Status_ReadyForPickup)
            {
                existingOrder.Status = StaticOrderStatus.Status_ReadyForPickup;
            }

            if (existingOrder.Status == StaticOrderStatus.Status_ReadyForPickup && dto.Status == StaticOrderStatus.Status_Completed)
            {
                existingOrder.Status = StaticOrderStatus.Status_Completed;
            }

            if (dto.Status == StaticOrderStatus.Status_Cancelled)
            {
                existingOrder.Status = StaticOrderStatus.Status_Cancelled;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Status updated successfully" });
        }
    }
}
