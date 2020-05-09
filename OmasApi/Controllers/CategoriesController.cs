using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Controllers
{
    [ApiController]
    [AdminOnly]
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
            // TODO model validation necessary?

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            return category;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            if (_db.CatalogItems.Any(i => i.CategoryId == id))
            {
                throw new ReferentialIntegrityException("This category is in use and cannot be deleted");
            }

            var category = await Get(id);

            if (category == null)
            {
                throw new NotFoundException($"Category ID {id} does not exist");
            }

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();
        }
    }
}