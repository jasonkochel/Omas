using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Services;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly OmasDbContext _db;
        private readonly UserIdentity _identity;
        private readonly UserService _userService;

        public UsersController(OmasDbContext db, UserIdentity identity, UserService userService)
        {
            _db = db;
            _identity = identity;
            _userService = userService;
        }

        [HttpGet]
        public Task<List<User>> GetAll()
        {
            return _db.Users.Select(u => new User
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email
            }).ToListAsync();
        }

        [HttpPost]
        public void Post()
        {
            var user = _db.Users.SingleOrDefault(u => u.CognitoId == _identity.CognitoId);

            if (user == null)
            {
                user = new User
                {
                    CognitoId = _identity.CognitoId,
                    Email = _identity.Email,
                    Name = _identity.Name,
                    Phone = _identity.Phone
                };

                _db.Users.Add(user);
                _db.SaveChanges();
            }
        }

        [AdminOnly]
        [HttpPost("admin/impersonation")]
        public User SetImpersonation([FromQuery] int? userId, [FromQuery] bool impersonate)
        {
            if (impersonate && userId == null)
            {
                throw new BadRequestException("No User ID was specified to impersonate");
            }

            _userService.Impersonate(_identity.CognitoId, impersonate ? userId : null);

            return impersonate ? _db.Users.SingleOrDefault(u => u.UserId == userId) : null;
        }
    }
}