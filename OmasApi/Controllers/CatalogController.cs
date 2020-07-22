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
    [Route("[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly OmasDbContext _db;

        public CatalogController(OmasDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public Task<List<CatalogItem>> GetCatalog([FromQuery] int? categoryId)
        {
            var query = _db.CatalogItems.AsNoTracking();

            if (categoryId != null)
            {
                query = query.Where(c => c.CategoryId == categoryId);
            }

            return query.OrderBy(c => c.Sequence).ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<CatalogItem> Get(int id)
        {
            var item = await _db.CatalogItems.FindAsync(id);

            if (item == null)
            {
                throw new NotFoundException($"Item ID '{id}' does not exist");
            }

            return item;
        }

        [HttpPost]
        public async Task<CatalogItem> Post([FromBody] CatalogItem catalogItem)
        {
            // Make sequence of new item equal to sequence of first item in category
            var firstInCategory = _db.CatalogItems.OrderBy(i => i.Sequence)
                .FirstOrDefault(i => i.CategoryId == catalogItem.CategoryId);

            catalogItem.Sequence = firstInCategory?.Sequence ?? 0;

            _db.CatalogItems.Add(catalogItem);
            await _db.SaveChangesAsync();

            // Then increment sequence of the former-first item and everything below it
            var sql = (FormattableString)$@"
                UPDATE Catalog 
                SET Sequence = Sequence + 1 
                WHERE Sequence >= {catalogItem.Sequence} 
                AND CatalogID <> {catalogItem.CatalogId}
            ";
            await _db.Database.ExecuteSqlInterpolatedAsync(sql);

            return catalogItem;
        }

        [HttpPut("{id}")]
        public async Task<CatalogItem> Put(int id, [FromBody] CatalogItem catalogItem)
        {
            if (id != catalogItem.CatalogId)
            {
                throw new BadRequestException("Route CatalogID does not match request body");
            }

            _db.CatalogItems.Update(catalogItem);
            await _db.SaveChangesAsync();

            return catalogItem;
        }


        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            if (_db.OrderLines.Any(l => l.CatalogItem.CatalogId == id && l.Order.OrderBatch.IsOpen))
            {
                throw new ReferentialIntegrityException($"Item ID {id} is in use in an open order batch");
            }

            var item = await Get(id);

            _db.CatalogItems.Remove(item);
            await _db.SaveChangesAsync();

            var sql = (FormattableString)$"UPDATE Catalog SET Sequence = Sequence - 1 WHERE Sequence > {item.Sequence}";
            await _db.Database.ExecuteSqlInterpolatedAsync(sql);
        }

        [HttpPatch("{id}/up")]
        public async Task MoveUp([FromRoute] int id)
        {
            await SwapSequence(id, SwapDirection.Up);
        }

        [HttpPatch("{id}/down")]
        public async Task MoveDown([FromRoute] int id)
        {
            await SwapSequence(id, SwapDirection.Down);
        }

        [HttpPatch("{id}/new")]
        public async Task<CatalogItem> MarkAsNew([FromRoute] int id, [FromQuery] bool isNew)
        {
            var item = await Get(id);
            item.New = isNew;
            await _db.SaveChangesAsync();
            return item;
        }

        [HttpPatch("{id}/featured")]
        public async Task<CatalogItem> MarkAsFeatured([FromRoute] int id, [FromQuery] bool isFeatured)
        {
            var item = await Get(id);
            item.Featured = isFeatured;
            await _db.SaveChangesAsync();
            return item;
        }

        [HttpPatch("{id}/discontinued")]
        public async Task<CatalogItem> MarkAsDiscontinued([FromRoute] int id, [FromQuery] bool isDiscontinued)
        {
            var item = await Get(id);
            item.Discontinued = isDiscontinued;
            await _db.SaveChangesAsync();
            return item;
        }

        private async Task SwapSequence(int id, SwapDirection direction)
        {
            var item = _db.CatalogItems.SingleOrDefault(c => c.CatalogId == id);
            if (item != null)
            {
                // Find the record that was in the slot that "id" is being moved to...
                var otherItem = _db.CatalogItems.SingleOrDefault(c => c.Sequence == item.Sequence + (int)direction);
                if (otherItem != null)
                {
                    // ...move it into "id"'s old slot...
                    otherItem.Sequence = item.Sequence;
                    // ...and move "id" up/down
                    item.Sequence += (int)direction;
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