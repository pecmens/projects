using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SSPS.Api.Models
{
    public class Article
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public string? Excerpt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool Published { get; set; } = false;
        
        // Foreign keys
        public int? AuthorId { get; set; }
        public int? CategoryId { get; set; }
        
        // Navigation properties
        [ForeignKey("AuthorId")]
        public virtual ApplicationUser? Author { get; set; }
        
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
        
        public virtual ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}