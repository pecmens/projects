using Microsoft.AspNetCore.Mvc;
using SSPS.Api.DTOs;
using SSPS.Api.Services;

namespace SSPS.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                return BadRequest(new { message = "用户名或邮箱已存在，或注册失败" });
            }
            
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized(new { message = "用户名或密码错误" });
            }
            
            return Ok(result);
        }

        [HttpGet("user")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirst("nameid")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "未认证" });
            }
            
            var user = await _authService.GetCurrentUserAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "用户不存在" });
            }
            
            return Ok(user);
        }
    }
}