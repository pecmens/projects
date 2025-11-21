using Microsoft.AspNetCore.Mvc;
using FileTransfer.WebRTC.Services;

namespace FileTransfer.WebRTC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomManager _roomManager;

        public RoomController(IRoomManager roomManager)
        {
            _roomManager = roomManager;
        }

        /// <summary>
        /// 创建新房间
        /// </summary>
        [HttpPost("create")]
        public IActionResult CreateRoom()
        {
            var code = _roomManager.CreateRoom();
            return Ok(new {
                code = code,
                expiresAt = DateTime.UtcNow.AddMinutes(30),
                createdAt = DateTime.UtcNow
            });
        }

        /// <summary>
        /// 获取房间状态
        /// </summary>
        [HttpGet("status/{code}")]
        public IActionResult GetRoomStatus(string code)
        {
            var roomInfo = _roomManager.GetRoomInfo(code);
            if (roomInfo == null)
            {
                return NotFound(new { error = "Room not found" });
            }

            return Ok(new {
                code = roomInfo.Code,
                hasSender = roomInfo.Sender != null,
                hasReceiver = roomInfo.Receiver != null,
                createdAt = roomInfo.CreatedAt,
                expiresAt = roomInfo.ExpiresAt
            });
        }

        /// <summary>
        /// 检查房间是否存在
        /// </summary>
        [HttpGet("exists/{code}")]
        public IActionResult CheckRoomExists(string code)
        {
            var roomInfo = _roomManager.GetRoomInfo(code);
            return Ok(new {
                exists = roomInfo != null,
                hasSender = roomInfo?.Sender != null,
                hasReceiver = roomInfo?.Receiver != null
            });
        }
    }
}