using Microsoft.Extensions.Caching.Memory;

namespace FileTransfer.WebRTC.Services
{
    public class RoomManager : IRoomManager
    {
        private readonly IMemoryCache _cache;
        private readonly Random _random = new Random();
        private const string RoomCacheKeyPrefix = "room_";
        private const int RoomExpirationMinutes = 30;

        public RoomManager(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string CreateRoom()
        {
            // 生成6位随机字符串作为房间码
            string code;
            do
            {
                code = GenerateCode();
            } while (_cache.TryGetValue(RoomCacheKeyPrefix + code, out _));

            var roomInfo = new RoomInfo
            {
                Code = code,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(RoomExpirationMinutes)
            };

            // 缓存房间信息，设置过期时间
            _cache.Set(
                RoomCacheKeyPrefix + code,
                roomInfo,
                new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = roomInfo.ExpiresAt,
                    Size = 1
                });

            return code;
        }

        public RoomInfo? GetRoomInfo(string code)
        {
            if (string.IsNullOrEmpty(code))
                return null;

            _cache.TryGetValue(RoomCacheKeyPrefix + code, out RoomInfo? roomInfo);
            return roomInfo;
        }

        public bool AddClientToRoom(string code, WebRtcClient client)
        {
            var roomInfo = GetRoomInfo(code);
            if (roomInfo == null)
                return false;

            // 根据角色分配客户端
            if (client.Role == "sender")
            {
                if (roomInfo.Sender != null && roomInfo.Sender.ConnectionId != client.ConnectionId)
                    return false; // 房间已有关联的发送者
                roomInfo.Sender = client;
            }
            else if (client.Role == "receiver")
            {
                if (roomInfo.Receiver != null && roomInfo.Receiver.ConnectionId != client.ConnectionId)
                    return false; // 房间已有关联的接收者
                roomInfo.Receiver = client;
            }

            // 更新缓存
            _cache.Set(
                RoomCacheKeyPrefix + code,
                roomInfo,
                new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = roomInfo.ExpiresAt,
                    Size = 1
                });

            return true;
        }

        public void RemoveClientFromRoom(string code, string clientId)
        {
            var roomInfo = GetRoomInfo(code);
            if (roomInfo == null)
                return;

            // 移除对应的客户端
            if (roomInfo.Sender?.ConnectionId == clientId)
                roomInfo.Sender = null;
            if (roomInfo.Receiver?.ConnectionId == clientId)
                roomInfo.Receiver = null;

            // 如果房间为空，考虑清理
            if (roomInfo.Sender == null && roomInfo.Receiver == null)
            {
                _cache.Remove(RoomCacheKeyPrefix + code);
            }
            else
            {
                // 更新缓存
                _cache.Set(
                    RoomCacheKeyPrefix + code,
                    roomInfo,
                    new MemoryCacheEntryOptions
                    {
                        AbsoluteExpiration = roomInfo.ExpiresAt,
                        Size = 1
                    });
            }
        }

        public void CleanupExpiredRooms()
        {
            // 依赖MemoryCache自动过期机制
            // 这里可以添加额外的清理逻辑
        }

        private string GenerateCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[_random.Next(s.Length)]).ToArray());
        }
    }
}