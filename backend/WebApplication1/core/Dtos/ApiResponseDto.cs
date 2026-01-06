namespace WebApplication1.core.Dtos
{
    public class ApiResponseDto<T>
    {
        public T? Data { get; set; }
        public string Message { get; set; } = "";
        public List<string> ErrorMessages { get; set; } = [];
    }
}