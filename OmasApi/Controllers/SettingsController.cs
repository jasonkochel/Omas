using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OmasApi.Controllers.Middleware;
using OmasApi.Data.Entities;
using OmasApi.Data.Repositories;

namespace OmasApi.Controllers
{
    [ApiController]
    [AdminOnly]
    [Route("[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly SettingsRepository _repo;

        public SettingsController(SettingsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<Settings> Get()
        {
            return await _repo.Get(_repo.SettingsId) ?? await Post(_repo.DefaultSettings);
        }

        [HttpPost]
        public async Task<Settings> Post([FromBody] Settings settings)
        {
            settings.SettingsId = _repo.SettingsId;

            await _repo.Put(settings);

            return settings;
        }
    }
}