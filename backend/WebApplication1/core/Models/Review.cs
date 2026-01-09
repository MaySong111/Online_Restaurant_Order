namespace WebApplication1.core.Models
{
    public class Review
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required int Rating { get; set; }

        // fk
        public string OrderItemId { get; set; } = "";
        // nav prop

        // public OrderItem OrderItem { get; set; } = new OrderItem();
        public OrderItem OrderItem { get; set; } = null!;
    }
}