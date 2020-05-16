using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public IEnumerable<Category> GetAll()
        {
            return _db.Categories.OrderBy(c => c.Sequence).ToList();
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

        [HttpPost]
        public async Task<Category> Post([FromBody] Category category)
        {
            // Put the new category at the top of the list by setting Sequence = 0...
            category.Sequence = 0;

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            // ...then incrementing Sequence of entire table
            _db.Database.ExecuteSqlRaw("UPDATE Categories SET Sequence = Sequence + 1");

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

            var sql = (FormattableString)$"UPDATE Categories SET Sequence = Sequence - 1 WHERE Sequence > {category.Sequence}";
            await _db.Database.ExecuteSqlInterpolatedAsync(sql);
        }

        [HttpPatch("{id}/up")]
        public async Task MoveUp(int id)
        {
            await SwapSequence(id, SwapDirection.Up);
        }

        [HttpPatch("{id}/down")]
        public async Task MoveDown(int id)
        {
            await SwapSequence(id, SwapDirection.Down);
        }

        private async Task SwapSequence(int id, SwapDirection direction)
        {
            var category = _db.Categories.SingleOrDefault(c => c.CategoryId == id);
            if (category != null)
            {
                // Find the record that was in the slot that "id" is being moved to...
                var otherCategory = _db.Categories.SingleOrDefault(c => c.Sequence == category.Sequence + (int) direction);
                if (otherCategory != null)
                {
                    // ...move it into "id"'s old slot...
                    otherCategory.Sequence = category.Sequence;
                    // ...and move "id" up/down
                    category.Sequence += (int)direction;
                }
            }

            await _db.SaveChangesAsync();
        }

        private enum SwapDirection
        {
            Up = -1,
            Down = 1
        }
    }

}