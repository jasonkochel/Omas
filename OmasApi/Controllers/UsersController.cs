using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OmasApi.Data;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly OmasDbContext _db;
        private readonly UserIdentity _identity;

        public UsersController(OmasDbContext db, UserIdentity identity)
        {
            _db = db;
            _identity = identity;
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
    }

}