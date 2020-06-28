using System;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Services
{
    public class UserService
    {
        private readonly string _connectionString;
        private readonly IMemoryCache _userCache;

        public UserService(IMemoryCache memoryCache, IOptions<AppSettings> config)
        {
            _userCache = memoryCache;
            _connectionString = config.Value.ConnectionStrings.Default;
        }

        public int GetByCognitoId(Guid cognitoId)
        {
            if (!_userCache.TryGetValue(cognitoId, out int userId))
            {
                var db = new OmasDbContext(_connectionString);
                var user = db.Users.SingleOrDefault(u => u.CognitoId == cognitoId);

                if (user == null)
                {
                    throw new UnauthorizedException("User is not logged in or cannot be found");
                }

                userId = user.UserId;
                _userCache.Set(cognitoId, userId);
            }

            return userId;
        }
    }
}