using Microsoft.EntityFrameworkCore;
using SSPS.Api.Data;
using SSPS.Api.DTOs;
using SSPS.Api.Models;

namespace SSPS.Api.Services
{
    public class TagService : ITagService
    {
        private readonly ApplicationDbContext _context;

        public TagService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TagDto>> GetTagsAsync()
        {
            var tags = await _context.Tags.ToListAsync();

            var tagDtos = new List<TagDto>();

            foreach (var tag in tags)
            {
                var articleCount = await _context.ArticleTags.CountAsync(at => at.TagId == tag.Id);
                
                tagDtos.Add(new TagDto
                {
                    Id = tag.Id,
                    Name = tag.Name,
                    Slug = tag.Slug,
                    CreatedAt = tag.CreatedAt,
                    ArticleCount = articleCount
                });
            }

            return tagDtos;
        }

        public async Task<TagDto?> GetTagByIdAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return null;
            }

            var articleCount = await _context.ArticleTags.CountAsync(at => at.TagId == tag.Id);

            return new TagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                Slug = tag.Slug,
                CreatedAt = tag.CreatedAt,
                ArticleCount = articleCount
            };
        }

        public async Task<TagDto?> GetTagBySlugAsync(string slug)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Slug == slug);

            if (tag == null)
            {
                return null;
            }

            var articleCount = await _context.ArticleTags.CountAsync(at => at.TagId == tag.Id);

            return new TagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                Slug = tag.Slug,
                CreatedAt = tag.CreatedAt,
                ArticleCount = articleCount
            };
        }

        public async Task<TagDto> CreateTagAsync(CreateTagDto createTagDto)
        {
            var tag = new Tag
            {
                Name = createTagDto.Name,
                Slug = createTagDto.Slug
            };

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return new TagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                Slug = tag.Slug,
                CreatedAt = tag.CreatedAt,
                ArticleCount = 0
            };
        }

        public async Task<TagDto?> UpdateTagAsync(int id, UpdateTagDto updateTagDto)
        {
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return null;
            }

            tag.Name = updateTagDto.Name;
            tag.Slug = updateTagDto.Slug;

            await _context.SaveChangesAsync();

            var articleCount = await _context.ArticleTags.CountAsync(at => at.TagId == tag.Id);

            return new TagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                Slug = tag.Slug,
                CreatedAt = tag.CreatedAt,
                ArticleCount = articleCount
            };
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return false;
            }

            // Remove all article-tag relationships
            var articleTags = await _context.ArticleTags.Where(at => at.TagId == id).ToListAsync();
            _context.ArticleTags.RemoveRange(articleTags);

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}