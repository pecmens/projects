using Microsoft.EntityFrameworkCore;
using SSPS.Api.Data;
using SSPS.Api.DTOs;
using SSPS.Api.Models;

namespace SSPS.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();

            var categoryDtos = new List<CategoryDto>();

            foreach (var category in categories)
            {
                var articleCount = await _context.Articles.CountAsync(a => a.CategoryId == category.Id);
                
                categoryDtos.Add(new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Slug = category.Slug,
                    Description = category.Description,
                    CreatedAt = category.CreatedAt,
                    ArticleCount = articleCount
                });
            }

            return categoryDtos;
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return null;
            }

            var articleCount = await _context.Articles.CountAsync(a => a.CategoryId == category.Id);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                CreatedAt = category.CreatedAt,
                ArticleCount = articleCount
            };
        }

        public async Task<CategoryDto?> GetCategoryBySlugAsync(string slug)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug);

            if (category == null)
            {
                return null;
            }

            var articleCount = await _context.Articles.CountAsync(a => a.CategoryId == category.Id);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                CreatedAt = category.CreatedAt,
                ArticleCount = articleCount
            };
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            var category = new Category
            {
                Name = createCategoryDto.Name,
                Slug = createCategoryDto.Slug,
                Description = createCategoryDto.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                CreatedAt = category.CreatedAt,
                ArticleCount = 0
            };
        }

        public async Task<CategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return null;
            }

            category.Name = updateCategoryDto.Name;
            category.Slug = updateCategoryDto.Slug;
            category.Description = updateCategoryDto.Description;

            await _context.SaveChangesAsync();

            var articleCount = await _context.Articles.CountAsync(a => a.CategoryId == category.Id);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                CreatedAt = category.CreatedAt,
                ArticleCount = articleCount
            };
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return false;
            }

            // Check if there are articles assigned to this category
            var articles = await _context.Articles.Where(a => a.CategoryId == id).ToListAsync();
            if (articles.Any())
            {
                // Set CategoryId to null for these articles
                foreach (var article in articles)
                {
                    article.CategoryId = null;
                }
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}