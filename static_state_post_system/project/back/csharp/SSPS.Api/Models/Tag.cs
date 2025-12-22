using System.ComponentModel.DataAnnotations;

namespace SSPS.Api.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Slug { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}