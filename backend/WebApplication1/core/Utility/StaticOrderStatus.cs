namespace WebApplication1.core.Utility
{
    public class StaticOrderStatus
    {
        public const string Status_Confirmed = "Confirmed";
        public const string Status_ReadyForPickup = "Ready for Pickup";
        public const string Status_Completed = "Completed";
        public const string Status_Cancelled = "Cancelled";
    }
}



// status更新逻辑: 只有status是confirmed-- 才能, 且只能更新为ready for pickup
//                只有status是ready for pickup, 才能, 且只能更新为completed
//                用户可以在任何时候取消订单