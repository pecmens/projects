using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SSPS.Api.Models
{
    public class ArticleTag
    {
        [Key]
        public int Id { get; set; }
        
        // Foreign keys
        public int ArticleId { get; set; }
        public int TagId { get; set; }
        
        // Navigation properties
        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; } = null!;
        
        [ForeignKey("TagId")]
        public virtual Tag Tag { get; set; } = null!;
    }
}