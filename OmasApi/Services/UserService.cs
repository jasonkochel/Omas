using System;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Services
{
    public class UserService
    {
        private readonly IMemoryCache _userCache;
        private readonly OmasDbContext _db;

        public UserService(IMemoryCache memoryCache, OmasDbContext db)
        {
            _userCache = memoryCache;
            _db = db;
        }

        public int GetByCognitoId(Guid cognitoId)
        {
            if (!_userCache.TryGetValue(cognitoId, out int userId))
            {
                var user = _db.Users.SingleOrDefault(u => u.CognitoId == cognitoId);

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