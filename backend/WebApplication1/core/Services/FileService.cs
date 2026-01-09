namespace WebApplication1.core.Services
{
    public class FileService
    {
        public IWebHostEnvironment _env { get; }
        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            // 1. validate the format of the file(png,jpg,jpeg,gif)
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
                throw new Exception("Invalid file format");

            // 2. create folder
            var imagesPath = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(imagesPath))
                Directory.CreateDirectory(imagesPath);

            // 3. delete old file
            var filePath = Path.Combine(imagesPath, file.FileName);
            if (File.Exists(filePath))
                File.Delete(filePath);

            // 4. save new file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("images", file.FileName);
        }


        public void DeleteFile(string filePath)
        {
            var fullPath = Path.Combine(_env.WebRootPath, filePath);
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }
    }
}