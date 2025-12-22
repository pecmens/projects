using Microsoft.EntityFrameworkCore;
using SSPS.Api.Data;
using SSPS.Api.DTOs;
using SSPS.Api.Models;

namespace SSPS.Api.Services
{
    public class ArticleService : IArticleService
    {
        private readonly ApplicationDbContext _context;

        public ArticleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ArticleListDto>> GetArticlesAsync(int page = 1, int pageSize = 10, string? category = null, string? tag = null, string? search = null)
        {
            var query = _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(a => a.Category != null && a.Category.Slug == category);
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(a => a.Tags.Any(t => t.Slug == tag));
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => 
                    a.Title.ToLower().Contains(search.ToLower()) || 
                    a.Content.ToLower().Contains(search.ToLower()) || 
                    a.Excerpt != null && a.Excerpt.ToLower().Contains(search.ToLower()));
            }

            // Only return published articles for non-authenticated users
            // For now, returning all articles - can be modified based on authentication status

            var totalCount = await query.CountAsync();

            var articles = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var articleListDtos = articles.Select(a => new ArticleListDto
            {
                Id = a.Id,
                Title = a.Title,
                Slug = a.Slug,
                Excerpt = a.Excerpt,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Published = a.Published,
                AuthorName = a.Author?.UserName,
                CategoryName = a.Category?.Name,
                TagNames = a.Tags.Select(t => t.Name).ToList()
            }).ToList();

            return new PagedResult<ArticleListDto>
            {
                Items = articleListDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<ArticleDto?> GetArticleBySlugAsync(string slug)
        {
            var article = await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .FirstOrDefaultAsync(a => a.Slug == slug);

            if (article == null)
            {
                return null;
            }

            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Slug = article.Slug,
                Content = article.Content,
                Excerpt = article.Excerpt,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                Published = article.Published,
                AuthorId = article.AuthorId?.ToString(),
                AuthorName = article.Author?.UserName,
                CategoryId = article.CategoryId,
                CategoryName = article.Category?.Name,
                TagIds = article.Tags.Select(t => t.Id).ToList(),
                TagNames = article.Tags.Select(t => t.Name).ToList()
            };
        }

        public async Task<ArticleDto?> GetArticleByIdAsync(int id)
        {
            var article = await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return null;
            }

            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Slug = article.Slug,
                Content = article.Content,
                Excerpt = article.Excerpt,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                Published = article.Published,
                AuthorId = article.AuthorId?.ToString(),
                AuthorName = article.Author?.UserName,
                CategoryId = article.CategoryId,
                CategoryName = article.Category?.Name,
                TagIds = article.Tags.Select(t => t.Id).ToList(),
                TagNames = article.Tags.Select(t => t.Name).ToList()
            };
        }

        public async Task<ArticleDto> CreateArticleAsync(CreateArticleDto createArticleDto, string userId)
        {
            // Verify author exists
            var author = await _context.Users.FindAsync(userId);
            if (author == null)
            {
                throw new ArgumentException("Author not found");
            }

            var article = new Article
            {
                Title = createArticleDto.Title,
                Slug = createArticleDto.Slug,
                Content = createArticleDto.Content,
                Excerpt = createArticleDto.Excerpt,
                Published = createArticleDto.Published,
                AuthorId = int.Parse(userId),
                CategoryId = createArticleDto.CategoryId
            };

            // Add tags if provided
            if (createArticleDto.TagIds != null && createArticleDto.TagIds.Any())
            {
                var tags = await _context.Tags.Where(t => createArticleDto.TagIds.Contains(t.Id)).ToListAsync();
                article.Tags = tags;
            }

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Slug = article.Slug,
                Content = article.Content,
                Excerpt = article.Excerpt,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                Published = article.Published,
                AuthorId = article.AuthorId?.ToString(),
                AuthorName = author.UserName,
                CategoryId = article.CategoryId,
                CategoryName = article.Category?.Name,
                TagIds = article.Tags.Select(t => t.Id).ToList(),
                TagNames = article.Tags.Select(t => t.Name).ToList()
            };
        }

        public async Task<ArticleDto?> UpdateArticleAsync(int id, UpdateArticleDto updateArticleDto, string userId)
        {
            var article = await _context.Articles
                .Include(a => a.Tags)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return null;
            }

            // Check if user is the author
            if (article.AuthorId?.ToString() != userId)
            {
                throw new UnauthorizedAccessException("You can only update your own articles");
            }

            article.Title = updateArticleDto.Title;
            article.Slug = updateArticleDto.Slug;
            article.Content = updateArticleDto.Content;
            article.Excerpt = updateArticleDto.Excerpt;
            article.Published = updateArticleDto.Published;
            article.CategoryId = updateArticleDto.CategoryId;
            article.UpdatedAt = DateTime.UtcNow;

            // Update tags
            if (updateArticleDto.TagIds != null)
            {
                article.Tags.Clear();
                if (updateArticleDto.TagIds.Any())
                {
                    var tags = await _context.Tags.Where(t => updateArticleDto.TagIds.Contains(t.Id)).ToListAsync();
                    article.Tags = tags;
                }
            }

            await _context.SaveChangesAsync();

            var author = await _context.Users.FindAsync(userId);

            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Slug = article.Slug,
                Content = article.Content,
                Excerpt = article.Excerpt,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                Published = article.Published,
                AuthorId = article.AuthorId?.ToString(),
                AuthorName = author?.UserName,
                CategoryId = article.CategoryId,
                CategoryName = article.Category?.Name,
                TagIds = article.Tags.Select(t => t.Id).ToList(),
                TagNames = article.Tags.Select(t => t.Name).ToList()
            };
        }

        public async Task<bool> DeleteArticleAsync(int id, string userId)
        {
            var article = await _context.Articles.FindAsync(id);

            if (article == null)
            {
                return false;
            }

            // Check if user is the author
            if (article.AuthorId?.ToString() != userId)
            {
                throw new UnauthorizedAccessException("You can only delete your own articles");
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}