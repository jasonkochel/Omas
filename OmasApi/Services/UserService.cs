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

        public UserMapping GetByCognitoId(Guid cognitoId)
        {
            if (!_userCache.TryGetValue(cognitoId, out UserMapping userMapping))
            {
                var user = _db.Users.SingleOrDefault(u => u.CognitoId == cognitoId);

                if (user == null)
                {
                    throw new UnauthorizedException("User is not logged in or cannot be found");
                }

                userMapping = new UserMapping {UserId = user.UserId};
                _userCache.Set(cognitoId, userMapping);
            }

            return userMapping;
        }

        public void Impersonate(Guid cognitoId, int? userIdToImpersonate)
        {
            if (!_userCache.TryGetValue(cognitoId, out UserMapping userMapping))
            {
                userMapping = GetByCognitoId(cognitoId);
            }

            userMapping.ImpersonatingUserId = userIdToImpersonate;
            _userCache.Set(cognitoId, userMapping);
        }
    }

    public class UserMapping
    {
        public int UserId { get; set; }
        public int? ImpersonatingUserId { get; set; }
    }
}