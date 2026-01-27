using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.core.Models
{
    public class UserLike
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        // fk to user
        public required string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        // fk to menu item
        public required string MenuItemId { get; set; }
        [ForeignKey("MenuItemId")]
        public MenuItem MenuItem { get; set; }


    }
}