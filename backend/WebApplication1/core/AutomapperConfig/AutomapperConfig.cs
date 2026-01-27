using AutoMapper;
using WebApplication1.core.Dtos.Auth;
using WebApplication1.core.Dtos.Menu;
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
            CreateMap<OrderCreateDto, Order>()
                .ForMember(dest => dest.ApplicationUserId, opt => opt.Ignore()) // 忽略 ApplicationUserId 映射，手动设置
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore()); // 忽略 orderItems 映射

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Review.Rating));

            CreateMap<Order, OrderDto>();
            CreateMap<MenuItem, MenuItemDto>();

            CreateMap<ApplicationUser, UserInfoDto>()
            .ForMember(dest => dest.Role, opt => opt.Ignore());
        }
    }
}