using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSPS.Api.DTOs;
using SSPS.Api.Services;

namespace SSPS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ArticleListDto>>> GetArticles(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? tag = null,
            [FromQuery] string? search = null)
        {
            try 
            {
                var result = await _articleService.GetArticlesAsync(page, pageSize, category, tag, search);
                return Ok(new { 
                    success = true, 
                    data = result,
                    message = "Articles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    error = "An error occurred while retrieving articles",
                    message = ex.Message
                });
            }
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(string slug)
        {
            try 
            {
                var article = await _articleService.GetArticleBySlugAsync(slug);
                if (article == null)
                {
                    return NotFound(new { 
                        success = false, 
                        error = "Article not found",
                        message = "The requested article does not exist"
                    });
                }
                
                return Ok(new { 
                    success = true, 
                    data = article,
                    message = "Article retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    error = "An error occurred while retrieving the article",
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ArticleDto>> CreateArticle(CreateArticleDto createArticleDto)
        {
            try 
            {
                var userId = User.FindFirst("nameid")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        error = "Unauthorized",
                        message = "User not authenticated"
                    });
                }
                
                var article = await _articleService.CreateArticleAsync(createArticleDto, userId);
                return CreatedAtAction(nameof(GetArticle), new { slug = article.Slug }, new { 
                    success = true, 
                    data = article,
                    message = "Article created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    error = "An error occurred while creating the article",
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ArticleDto>> UpdateArticle(int id, UpdateArticleDto updateArticleDto)
        {
            try 
            {
                var userId = User.FindFirst("nameid")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        error = "Unauthorized",
                        message = "User not authenticated"
                    });
                }
                
                var article = await _articleService.UpdateArticleAsync(id, updateArticleDto, userId);
                if (article == null)
                {
                    return NotFound(new { 
                        success = false, 
                        error = "Article not found",
                        message = "The requested article does not exist"
                    });
                }
                
                return Ok(new { 
                    success = true, 
                    data = article,
                    message = "Article updated successfully"
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid(new { 
                    success = false, 
                    error = "Forbidden",
                    message = "You do not have permission to update this article"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    error = "An error occurred while updating the article",
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            try 
            {
                var userId = User.FindFirst("nameid")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        error = "Unauthorized",
                        message = "User not authenticated"
                    });
                }
                
                var result = await _articleService.DeleteArticleAsync(id, userId);
                if (!result)
                {
                    return NotFound(new { 
                        success = false, 
                        error = "Article not found",
                        message = "The requested article does not exist"
                    });
                }
                
                return Ok(new { 
                    success = true, 
                    message = "Article deleted successfully"
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid(new { 
                    success = false, 
                    error = "Forbidden",
                    message = "You do not have permission to delete this article"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    error = "An error occurred while deleting the article",
                    message = ex.Message
                });
            }
        }
    }
}