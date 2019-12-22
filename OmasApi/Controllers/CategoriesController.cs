using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly OmasDbContext _db;

        public CategoriesController(OmasDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IEnumerable<Category> GetAll([FromQuery] bool includeItems = false)
        {
            var query = _db.Categories.AsQueryable();

            if (includeItems)
            {
                query = query.Include(c => c.CatalogItems);
            }

            var results = query.OrderBy(c => c.Sequence).ToList();

            if (includeItems)
            {
                foreach (var r in results)
                {
                    r.CatalogItems = r.CatalogItems.OrderBy(ci => ci.Sequence).ToList();
                }
            }

            return results;
        }

        [HttpGet("{id}")]
        public async Task<Category> Get(int id)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null)
            {
                throw new NotFoundException($"Category ID '{id}' does not exist");
            }

            return category;
        }

        [HttpPut("{id}")]
        public async Task<Category> Put(int id, [FromBody] Category category)
        {
            if (id != category.CategoryId)
            {
                throw new BadRequestException("Route CategoryID does not match request body");
            }

            _db.Categories.Update(category);
            await _db.SaveChangesAsync();

            return category;
        }

        [HttpPost]
        public async Task<Category> Post([FromBody] Category category)
        {
            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            return category;
        }

        [HttpDelete("{id}")]
        public async Task DeleteCatalog(int id)
        {
            var category = await Get(id);

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();
        }
    }
}