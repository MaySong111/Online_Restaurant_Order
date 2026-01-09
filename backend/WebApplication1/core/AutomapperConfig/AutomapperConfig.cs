using AutoMapper;
using WebApplication1.core.Dtos.Order;
using WebApplication1.core.Menu.Dtos;
using WebApplication1.core.Models;



namespace WebApplication1.core.AutomapperConfig
{
    public class AutomapperConfig : Profile
    {
        public AutomapperConfig()
        {
            CreateMap<MenuItemCreateDto, MenuItem>();
            CreateMap<MenuItemUpdateDto, MenuItem>();

            CreateMap<OrderItemCreateDto, OrderItem>();
            CreateMap<OrderCreateDto, Order>();
            CreateMap<OrderUpdateDto, Order>();
        }
    }
}