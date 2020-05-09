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
    [Route("[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly OmasDbContext _db;

        public CatalogController(OmasDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public List<Category> GetCatalog([FromQuery] CatalogQueryType queryType)
        {
            var batchId = 0;

            if (queryType == CatalogQueryType.Current)
            {
                var batch = _db.OrderBatches.OrderByDescending(ob => ob.DeliveryDate).FirstOrDefault(ob => ob.IsOpen);
                if (batch == null)
                {
                    throw new NotFoundException("There is no open ordering batch");
                }

                batchId = batch.BatchId;
            }

            var results = _db.Categories
                .AsNoTracking()
                .OrderBy(c => c.Sequence)
                .Select(c => new Category
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Description = c.Description,
                    CatalogItems = c.CatalogItems.OrderBy(i => i.Sequence).Where(i => i.BatchId == batchId).Select(i => i).ToList()
                })
                .ToList();
            
            return results;
        }


        [HttpGet("{id}")]
        public async Task<CatalogItem> Get(int id)
        {
            var catalog = await _db.CatalogItems.FindAsync(id);
            if (catalog == null)
            {
                throw new NotFoundException($"CatalogItem ID '{id}' does not exist");
            }

            return catalog;
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

        [HttpPost]
        public async Task<CatalogItem> Post([FromBody] CatalogItem catalogItem)
        {
            _db.CatalogItems.Add(catalogItem);
            await _db.SaveChangesAsync();

            return catalogItem;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var catalog = await Get(id);

            _db.CatalogItems.Remove(catalog);
            await _db.SaveChangesAsync();
        }
    }

    public enum CatalogQueryType
    {
        Base,
        Current
    }
}