using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.core.DbData;
using WebApplication1.core.Dtos.Review;
using WebApplication1.core.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController(ApplicationDbContext _context) : ControllerBase
    {

        [HttpPost("create/{orderItemId}")]
        public async Task<ActionResult> CreateReview([FromRoute] string orderItemId,
        [FromBody] ReviewDto dto)
        {
            // 1.check if review for this orderItemId already exists
            var orderItem = _context.OrderItems.FirstOrDefault(oi => oi.Id == orderItemId);
            if (orderItem == null)
            {
                return NotFound("OrderItem not found");
            }
            // 2.check if logged in user is the owner of the orderItem
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = _context.Orders.FirstOrDefault(o => o.ApplicationUserId == loggedInUserId &&
            o.OrderItems.Any(oi => oi.Id == orderItemId));
            if (order == null)
            {
                return Forbid("You are not allowed to review this item");
            }
            // 3.check if review already exists
            var existingReview = await _context.Reviews.FirstOrDefaultAsync(r => r.OrderItemId == orderItemId);
            // if review exists, return error,only one review per order item is allowed
            if (existingReview != null)
            {
                return Forbid("You have already reviewed this item");
            }
            // 4. check if rating is between 1 and 5
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5");
            }

            var newReview = new Review
            {
                Rating = dto.Rating,
                OrderItemId = orderItemId
            };
            // 5. save the review!!!  
             _context.Reviews.Add(newReview);
            await _context.SaveChangesAsync();


            // 6. calculate the new average rating and total reviews for the menu item
            var menuItemId = orderItem.MenuItemId;
            var menuItem = await _context.MenuItems.FindAsync(menuItemId);

            var totalReviews = _context.Reviews.Count(r => r.OrderItem.MenuItemId == menuItemId);
            var averageRating = _context.Reviews.Where(r => r.OrderItem.MenuItemId == menuItemId).Average(r => r.Rating);
            // update MenuItem's AverageRating and TotalReviews fields
            if (menuItem != null)
            {
                menuItem.AverageRating = averageRating;
                menuItem.TotalReviews = totalReviews;
            }

           
            return Ok(new { Message = "Review created successfully" });
        }



        [HttpPut("update/{orderItemId}")]
        public async Task<ActionResult> UpdateReview([FromRoute] string orderItemId,
        [FromBody] ReviewDto dto)
        {
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var review = await _context.Reviews
            .Include(r => r.OrderItem)
            .ThenInclude(oi => oi.Order)
            .FirstOrDefaultAsync(r => r.OrderItemId == orderItemId &&
            r.OrderItem.Order.ApplicationUserId == loggedInUserId);

            if (review == null)
            {
                return NotFound("Review not found or you are not authorized to update this review");
            }
            //  check if rating is between 1 and 5
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5");
            }

            // calculate the new average rating and total reviews for the menu item
            var orderItem = review.OrderItem;
            var menuItemId = orderItem.MenuItemId;
            var menuItem = await _context.MenuItems.FindAsync(menuItemId);

            var totalReviews = _context.Reviews.Count(r => r.OrderItem.MenuItemId == menuItemId);
            var averageRating = _context.Reviews.Where(r => r.OrderItem.MenuItemId == menuItemId).Average(r => r.Rating);
            // update MenuItem's AverageRating and TotalReviews fields
            if (menuItem != null)
            {
                menuItem.AverageRating = averageRating;
                menuItem.TotalReviews = totalReviews;
            }

            review.Rating = dto.Rating;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Review updated successfully" });
        }

        // // this logged user can get only his own review for the specific orderitem-用户查自己的 Review 没意义
        // [HttpGet("item/{orderItemId}")]
        // public async Task<ActionResult> GetReviewByOrderItemId([FromRoute] string orderItemId)
        // {
        //     var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     var review = await _context.Reviews
        //         .Include(r => r.OrderItem)
        //         .ThenInclude(oi => oi.Order)
        //         .FirstOrDefaultAsync(r => r.OrderItemId == orderItemId &&
        //         r.OrderItem.Order.ApplicationUserId == loggedInUserId);

        //     if (review == null)
        //     {
        //         return NotFound("Review not found");
        //     }
        //     return Ok(review);
        // }

        // 不需要 [Authorize]，所有人都能看评价
        [HttpGet("menuitem/{menuItemId}")]
        public async Task<ActionResult> GetReviewsByMenuItemId([FromRoute] string menuItemId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.OrderItem)
                .ThenInclude(oi => oi.Order)
                .Where(r => r.OrderItem.MenuItemId == menuItemId)
                .ToListAsync();
            return Ok(reviews);
        }
    }

}