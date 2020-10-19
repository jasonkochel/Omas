using System;
using System.Collections.Generic;
using System.Linq;
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
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryRepository _repo;
        private readonly CatalogItemRepository _catalogItemRepo;

        public CategoriesController(CategoryRepository repo, CatalogItemRepository catalogItemRepo)
        {
            _repo = repo;
            _catalogItemRepo = catalogItemRepo;
        }

        [HttpGet]
        public async Task<List<Category>> GetAll([FromQuery] bool includeItems = false, [FromQuery] bool includeVirtual = false)
        {
            var results = await _repo.Scan();

            var items = new List<CatalogItem>();
            if (includeItems || includeVirtual)
            {
                items = await _catalogItemRepo.Scan();
            }

            if (includeItems)
            {
                foreach (var r in results)
                {
                    r.CatalogItems = items.Where(i => i.CategoryId == r.CategoryId && !i.Discontinued)
                        .OrderBy(i => i.Sequence).ToList();
                }
            }

            results.Sort((a, b) => a.Sequence - b.Sequence);

            if (includeVirtual)
            {
                results.Insert(0, new Category
                {
                    Name = "Featured Items",
                    CategoryId = "FeaturedItems",
                    Sequence = 0,
                    CatalogItems = items.Where(i => i.Featured).OrderBy(i => i.Sequence).ToList()
                });
                results.Insert(0, new Category
                {
                    Name = "New Items",
                    CategoryId = "NewItems",
                    Sequence = 0,
                    CatalogItems = items.Where(i => i.New).OrderBy(i => i.Sequence).ToList()
                });
                results.Add(new Category
                {
                    Name = "Discontinued Items",
                    CategoryId = "DiscontinuedItems",
                    Sequence = 99,
                    CatalogItems = items.Where(i => i.Discontinued).OrderBy(i => i.Sequence).ToList()
                });
            }

            return results;
        }


        [HttpGet("{id}")]
        public async Task<Category> Get(string id)
        {
            var category = await _repo.Get(id);

            if (category == null)
            {
                throw new NotFoundException($"Category ID '{id}' does not exist");
            }

            return category;
        }

        [HttpPost]
        public async Task<Category> Post([FromBody] Category category)
        {
            category.CategoryId = Guid.NewGuid().ToString();

            // Put the new category at the top of the list by setting Sequence = 0...
            category.Sequence = 0;

            await _repo.Put(category);

            // ...then incrementing Sequence of entire table
            await _repo.BulkUpdateSequence(0, 1);

            // simulate new sequence in memory for return value
            category.Sequence = 1;
            return category;
        }

        [HttpPut("{id}")]
        public async Task<Category> Put(string id, [FromBody] Category category)
        {
            if (id != category.CategoryId)
            {
                throw new BadRequestException("Route CategoryID does not match request body");
            }

            await _repo.Put(category);

            return category;
        }

        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            if ((await _catalogItemRepo.GetByCategory(id)).Any())
            {
                throw new ReferentialIntegrityException("This category is in use and cannot be deleted");
            }

            var category = await Get(id);

            await _repo.Delete(id);

            // decrement the sequence of everything after the deleted item, so there are no gaps
            await _repo.BulkUpdateSequence(category.Sequence, -1);
        }

        [HttpPatch("{id}/up")]
        public async Task MoveUp(string id)
        {
            await SwapSequence(id, SwapDirection.Up);
        }

        [HttpPatch("{id}/down")]
        public async Task MoveDown(string id)
        {
            await SwapSequence(id, SwapDirection.Down);
        }

        private async Task SwapSequence(string id, SwapDirection direction)
        {
            var category = await Get(id);

            if (category != null)
            {
                // Find the record that was in the slot that "id" is being moved to...
                var otherCategory = await _repo.GetBySequence(category.Sequence + (int)direction);

                if (otherCategory != null)
                {
                    // ...move it into "id"'s old slot...
                    otherCategory.Sequence = category.Sequence;
                    // ...and move "id" up/down
                    category.Sequence += (int)direction;

                    await _repo.Put(otherCategory);
                    await _repo.Put(category);
                }
            }
        }

        private enum SwapDirection
        {
            Up = -1,
            Down = 1
        }
    }

}