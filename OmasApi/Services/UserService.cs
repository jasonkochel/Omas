using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OmasApi.Controllers.Middleware;
using OmasApi.Data.Repositories;

namespace OmasApi.Services
{
    public class UserService
    {
        private readonly IMemoryCache _userCache;
        private readonly UserRepository _repo;

        public UserService(IMemoryCache memoryCache, UserRepository repo)
        {
            _userCache = memoryCache;
            _repo = repo;
        }

        public async Task<UserMapping> GetByCognitoId(string cognitoId)
        {
            if (!_userCache.TryGetValue(cognitoId, out UserMapping userMapping))
            {
                var user = await _repo.Get(cognitoId);

                if (user == null)
                {
                    throw new UnauthorizedException("User is not logged in or cannot be found");
                }

                userMapping = new UserMapping { UserId = user.UserId };
                _userCache.Set(cognitoId, userMapping);
            }

            return userMapping;
        }

        public async Task Impersonate(string cognitoId, string userIdToImpersonate)
        {
            if (!_userCache.TryGetValue(cognitoId, out UserMapping userMapping))
            {
                userMapping = await GetByCognitoId(cognitoId);
            }

            userMapping.ImpersonatingUserId = userIdToImpersonate;
            _userCache.Set(cognitoId, userMapping);
        }
    }

    public class UserMapping
    {
        public string UserId { get; set; }
        public string ImpersonatingUserId { get; set; }
    }
}