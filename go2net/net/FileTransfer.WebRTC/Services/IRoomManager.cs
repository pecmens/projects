namespace FileTransfer.WebRTC.Services
{
    public interface IRoomManager
    {
        /// <summary>
        /// 创建新房间并返回6位取件码
        /// </summary>
        string CreateRoom();

        /// <summary>
        /// 获取房间信息
        /// </summary>
        RoomInfo? GetRoomInfo(string code);

        /// <summary>
        /// 添加客户端到房间
        /// </summary>
        bool AddClientToRoom(string code, WebRtcClient client);

        /// <summary>
        /// 从房间移除客户端
        /// </summary>
        void RemoveClientFromRoom(string code, string clientId);

        /// <summary>
        /// 清理过期房间
        /// </summary>
        void CleanupExpiredRooms();
    }

    public class RoomInfo
    {
        public string Code { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public WebRtcClient? Sender { get; set; }
        public WebRtcClient? Receiver { get; set; }
    }

    public class WebRtcClient
    {
        public string Id { get; set; }
        public string Role { get; set; } // sender 或 receiver
        public string ConnectionId { get; set; }
    }
}