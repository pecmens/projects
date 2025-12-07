using System.ComponentModel.DataAnnotations;

namespace SSPS.Api.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Slug { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}