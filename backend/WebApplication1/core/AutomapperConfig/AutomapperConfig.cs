using AutoMapper;
using WebApplication1.core.Dtos;
using WebApplication1.core.Models;


namespace WebApplication1.core.AutomapperConfig
{
    public class AutomapperConfig : Profile
    {
        public AutomapperConfig()
        {
            CreateMap<MenuItemCreateDto, MenuItem>();
        }
    }
}