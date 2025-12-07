using SSPS.Api.DTOs;
using SSPS.Api.Models;

namespace SSPS.Api.Services
{
    public interface IArticleService
    {
        Task<PagedResult<ArticleListDto>> GetArticlesAsync(int page = 1, int pageSize = 10, string? category = null, string? tag = null, string? search = null);
        Task<ArticleDto?> GetArticleBySlugAsync(string slug);
        Task<ArticleDto?> GetArticleByIdAsync(int id);
        Task<ArticleDto> CreateArticleAsync(CreateArticleDto createArticleDto, string userId);
        Task<ArticleDto?> UpdateArticleAsync(int id, UpdateArticleDto updateArticleDto, string userId);
        Task<bool> DeleteArticleAsync(int id, string userId);
    }

    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task<CategoryDto?> GetCategoryBySlugAsync(string slug);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<CategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto);
        Task<bool> DeleteCategoryAsync(int id);
    }

    public interface ITagService
    {
        Task<IEnumerable<TagDto>> GetTagsAsync();
        Task<TagDto?> GetTagByIdAsync(int id);
        Task<TagDto?> GetTagBySlugAsync(string slug);
        Task<TagDto> CreateTagAsync(CreateTagDto createTagDto);
        Task<TagDto?> UpdateTagAsync(int id, UpdateTagDto updateTagDto);
        Task<bool> DeleteTagAsync(int id);
    }

    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<UserDto?> GetCurrentUserAsync(string userId);
    }

    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasNextPage => Page < TotalPages;
        public bool HasPreviousPage => Page > 1;
    }
}