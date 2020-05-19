﻿using System.Collections.Generic;
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
}