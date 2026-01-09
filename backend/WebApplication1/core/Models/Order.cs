using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.core.Utility;

namespace WebApplication1.core.Models
{
    public class Order
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string PickUpName { get; set; } = "";
        [Required]
        public string PickUpPhoneNumber { get; set; } = "";
        [Required]
        public string PickUpEmail { get; set; } = "";
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public double OrderTotal { get; set; }
        public string Status { get; set; } = StaticOrderStatus.Status_Confirmed;
        public int TotalItem { get; set; }
        // fk
        public string ApplicationUserId { get; set; } = "";
        [ForeignKey("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        // navigation property
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}