using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSPS.Api.DTOs;
using SSPS.Api.Services;

namespace SSPS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
        {
            var tags = await _tagService.GetTagsAsync();
            return Ok(tags);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(int id)
        {
            var tag = await _tagService.GetTagByIdAsync(id);
            if (tag == null)
            {
                return NotFound(new { message = "标签不存在" });
            }
            
            return Ok(tag);
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<TagDto>> GetTagBySlug(string slug)
        {
            var tag = await _tagService.GetTagBySlugAsync(slug);
            if (tag == null)
            {
                return NotFound(new { message = "标签不存在" });
            }
            
            return Ok(tag);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TagDto>> CreateTag(CreateTagDto createTagDto)
        {
            var tag = await _tagService.CreateTagAsync(createTagDto);
            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tag);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<TagDto>> UpdateTag(int id, UpdateTagDto updateTagDto)
        {
            var tag = await _tagService.UpdateTagAsync(id, updateTagDto);
            if (tag == null)
            {
                return NotFound(new { message = "标签不存在" });
            }
            
            return Ok(tag);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var result = await _tagService.DeleteTagAsync(id);
            if (!result)
            {
                return NotFound(new { message = "标签不存在" });
            }
            
            return NoContent();
        }
    }
}