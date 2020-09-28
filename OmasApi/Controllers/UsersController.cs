using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Models;
using OmasApi.Services;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _repo;
        private readonly UserIdentity _identity;
        private readonly UserService _userService;

        public UsersController(UserRepository repo, UserIdentity identity, UserService userService)
        {
            _repo = repo;
            _identity = identity;
            _userService = userService;
        }

        [AdminOnly]
        [HttpGet]
        public async Task<List<User>> GetAll()
        {
            return await _repo.Scan();
        }

        [HttpGet("{cognitoId}")]
        public async Task<UserModel> Get([FromRoute] string cognitoId)
        {
            if (cognitoId != _identity.CognitoId)
            {
                throw new UnauthorizedException("Specified User ID does not match logged in user");
            }

            var user = await _repo.Get(cognitoId);

            if (user == null)
            {
                throw new NotFoundException($"User ID '{cognitoId}' does not exist");
            }

            var userModel = new UserModel
            {
                Name = user.Name,
                Email = user.Email,
                IsAdmin = _identity.Admin
            };

            var userMapping = await _userService.GetByCognitoId(cognitoId);

            if (!userMapping.ImpersonatingUserId.IsNullOrEmpty())
            {
                var impersonatingUser = await _repo.Get(userMapping.ImpersonatingUserId);
                userModel.ImpersonatingName = impersonatingUser?.Name;
                userModel.ImpersonatingEmail = impersonatingUser?.Email;
            }

            return userModel;
        }

        [HttpPost]
        public async Task Post()
        {
            var user = await _repo.Get(_identity.CognitoId);

            if (user == null)
            {
                user = new User
                {
                    UserId = _identity.CognitoId,
                    Email = _identity.Email,
                    Name = _identity.Name,
                    Phone = _identity.Phone
                };

                await _repo.Put(user);
            }
        }

        [AdminOnly]
        [HttpPost("admin/impersonation")]
        public async Task<UserModel> SetImpersonation([FromQuery] string userId, [FromQuery] bool impersonate)
        {
            if (impersonate && userId == null)
            {
                throw new BadRequestException("No User ID was specified to impersonate");
            }

            await _userService.Impersonate(_identity.CognitoId, impersonate ? userId : null);

            return await Get(_identity.CognitoId);
        }
    }
}