using Microsoft.AspNetCore.SignalR;
using FileTransfer.WebRTC.Services;

namespace FileTransfer.WebRTC.Hubs
{
    public class WebRtcSignalingHub : Hub
    {
        private readonly IRoomManager _roomManager;

        public WebRtcSignalingHub(IRoomManager roomManager)
        {
            _roomManager = roomManager;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // 从所有房间中移除断开连接的客户端
            var rooms = Context.Items.ContainsKey("roomCode") ? (string)Context.Items["roomCode"] : null;
            var clientId = Context.Items.ContainsKey("clientId") ? (string)Context.Items["clientId"] : null;

            if (!string.IsNullOrEmpty(rooms) && !string.IsNullOrEmpty(clientId))
            {
                _roomManager.RemoveClientFromRoom(rooms, Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// 创建新房间
        /// </summary>
        public async Task<object> CreateRoom()
        {
            var code = _roomManager.CreateRoom();
            return new { code = code, expiresAt = DateTime.UtcNow.AddMinutes(30) };
        }

        /// <summary>
        /// 加入房间
        /// </summary>
        public async Task<object> JoinRoom(string code, string role, string clientId)
        {
            if (string.IsNullOrEmpty(code) || !_roomManager.GetRoomInfo(code)?.Code.Equals(code) ?? true)
            {
                return new { ok = false, error = "Room not found" };
            }

            var client = new WebRtcClient
            {
                Id = clientId,
                Role = role,
                ConnectionId = Context.ConnectionId
            };

            if (!_roomManager.AddClientToRoom(code, client))
            {
                return new { ok = false, error = "Failed to join room" };
            }

            // 保存房间信息到连接上下文
            Context.Items["roomCode"] = code;
            Context.Items["clientId"] = clientId;

            // 加入房间组
            await Groups.AddToGroupAsync(Context.ConnectionId, code);

            // 获取房间信息
            var room = _roomManager.GetRoomInfo(code);
            var hasSender = room?.Sender != null;
            var hasReceiver = room?.Receiver != null;

            // 通知房间内其他用户
            if (role == "sender" && hasReceiver)
            {
                await Clients.Group(code).Except(Context.ConnectionId).SendAsync("peer_joined", new { role = role, clientId = clientId });
            }
            else if (role == "receiver" && hasSender)
            {
                await Clients.Group(code).Except(Context.ConnectionId).SendAsync("peer_joined", new { role = role, clientId = clientId });
            }

            return new {
                ok = true,
                code = code,
                hasSender = hasSender,
                hasReceiver = hasReceiver
            };
        }

        /// <summary>
        /// 发送WebRTC信令消息
        /// </summary>
        public async Task SendSignal(string code, string targetClientId, object signal)
        {
            var room = _roomManager.GetRoomInfo(code);
            if (room == null)
            {
                await Clients.Caller.SendAsync("error", "Room not found");
                return;
            }

            // 查找目标客户端的连接ID
            string? targetConnectionId = null;
            if (room.Sender?.Id == targetClientId)
                targetConnectionId = room.Sender.ConnectionId;
            else if (room.Receiver?.Id == targetClientId)
                targetConnectionId = room.Receiver.ConnectionId;

            if (targetConnectionId == null)
            {
                await Clients.Caller.SendAsync("error", "Target client not found");
                return;
            }

            // 转发信令消息
            await Clients.Client(targetConnectionId).SendAsync("signal", new {
                fromClientId = Context.Items.ContainsKey("clientId") ? (string)Context.Items["clientId"] : Context.ConnectionId,
                signal = signal
            });
        }

        /// <summary>
        /// 心跳检测
        /// </summary>
        public async Task Heartbeat()
        {
            await Clients.Caller.SendAsync("heartbeat", new { time = DateTime.UtcNow });
        }
    }
}