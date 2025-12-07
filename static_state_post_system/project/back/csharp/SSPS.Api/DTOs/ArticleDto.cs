namespace SSPS.Api.DTOs
{
    public class ArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Published { get; set; }
        public string? AuthorId { get; set; }
        public string? AuthorName { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
        public List<string> TagNames { get; set; } = new List<string>();
    }

    public class CreateArticleDto
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public bool Published { get; set; } = false;
        public int? CategoryId { get; set; }
        public List<int>? TagIds { get; set; }
    }

    public class UpdateArticleDto
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public bool Published { get; set; } = false;
        public int? CategoryId { get; set; }
        public List<int>? TagIds { get; set; }
    }

    public class ArticleListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Published { get; set; }
        public string? AuthorName { get; set; }
        public string? CategoryName { get; set; }
        public List<string> TagNames { get; set; } = new List<string>();
    }
}