using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.core.Dtos.Review;


namespace WebApplication1.core.Models
{
    public class OrderItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string ItemName { get; set; } = "";
        [Required]
        public double Price { get; set; }

        // fk
        public string OrderId { get; set; } = "";
        [ForeignKey("OrderId")]
        public Order Order { get; set; } = new Order();
        // fk
        public string MenuItemId { get; set; } = "";
        [ForeignKey("MenuItemId")]
        public MenuItem? MenuItem { get; set; }

        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}


// 这里添加ItemName的原因,一旦用户下单,即使后续MenuItem被删除或者修改,OrderDetail中的ItemName依然保留当时下单时的名称.
// 同理Price也是一样的道理.就是保留下单时的价格.

// 一个order 可以有多个orderitem,一个orderitem只属于一个order.
// 一个menuitem 可以对应多个orderitem,一个orderitem只对应一个menuitem.