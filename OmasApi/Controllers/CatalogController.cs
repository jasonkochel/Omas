using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OmasApi.Controllers.Middleware;
using OmasApi.Data.Entities;
using OmasApi.Data.Repositories;
using OmasApi.Services;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly CatalogItemRepository _repo;
        private readonly OrderBatchRepository _batchRepo;
        private readonly OrderLineRepository _lineRepo;

        private readonly OrderBatchService _orderBatchService;

        public CatalogController(CatalogItemRepository repo, OrderBatchService orderBatchService, OrderLineRepository lineRepo, OrderBatchRepository batchRepo)
        {
            _repo = repo;
            _orderBatchService = orderBatchService;
            _lineRepo = lineRepo;
            _batchRepo = batchRepo;
        }

        [HttpGet]
        public async Task<List<CatalogItem>> GetCatalog([FromQuery] string categoryId)
        {
            var results = categoryId.IsNullOrEmpty() ? await _repo.Scan() : await _repo.GetByCategory(categoryId);
            results.Sort((a, b) => a.Sequence - b.Sequence);
            return results;
        }


        [HttpGet("{id}")]
        public async Task<CatalogItem> Get(string id)
        {
            var item = await _repo.Get(id);

            if (item == null)
            {
                throw new NotFoundException($"Item ID '{id}' does not exist");
            }

            return item;
        }

        [AdminOnly]
        [HttpPost]
        public async Task<CatalogItem> Post([FromBody] CatalogItem catalogItem)
        {
            catalogItem.CatalogId = Guid.NewGuid().ToString();

            // Put the new item at the top of its category by setting Sequence = 0...
            catalogItem.Sequence = 0;

            await _repo.Put(catalogItem);

            // ...then incrementing Sequence of entire category
            await _repo.BulkUpdateSequence(catalogItem.CategoryId, 0, 1);

            // simulate new sequence in memory for return value
            catalogItem.Sequence = 1;
            return catalogItem;
        }

        [AdminOnly]
        [HttpPut("{id}")]
        public async Task<CatalogItem> Put(string id, [FromBody] CatalogItem catalogItem)
        {
            if (id != catalogItem.CatalogId)
            {
                throw new BadRequestException("Route CatalogID does not match request body");
            }

            await _repo.Put(catalogItem);

            return catalogItem;
        }


        [AdminOnly]
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            var item = await Get(id);

            var currentBatch = await _batchRepo.Get(_orderBatchService.CurrentBatchId);

            if (currentBatch.IsOpen)
            {
                var lines = await _lineRepo.GetByBatch(_orderBatchService.CurrentBatchId);

                if (lines.Any(l => l.Sku == item.Sku))
                {
                    throw new ReferentialIntegrityException($"Item ID {id} is in use in an open order batch");
                }
            }

            await _repo.Delete(id);

            await _repo.BulkUpdateSequence(item.CategoryId, item.Sequence, -1);
        }

        [AdminOnly]
        [HttpPatch("{id}/up")]
        public async Task MoveUp([FromRoute] string id)
        {
            await SwapSequence(id, SwapDirection.Up);
        }

        [AdminOnly]
        [HttpPatch("{id}/down")]
        public async Task MoveDown([FromRoute] string id)
        {
            await SwapSequence(id, SwapDirection.Down);
        }

        [AdminOnly]
        [HttpPatch("{id}/new")]
        public async Task<CatalogItem> MarkAsNew([FromRoute] string id, [FromQuery] bool isNew)
        {
            var item = await Get(id);
            item.New = isNew;
            await _repo.Put(item);
            return item;
        }

        [AdminOnly]
        [HttpPatch("{id}/featured")]
        public async Task<CatalogItem> MarkAsFeatured([FromRoute] string id, [FromQuery] bool isFeatured)
        {
            var item = await Get(id);
            item.Featured = isFeatured;
            await _repo.Put(item);
            return item;
        }

        [AdminOnly]
        [HttpPatch("{id}/discontinued")]
        public async Task<CatalogItem> MarkAsDiscontinued([FromRoute] string id, [FromQuery] bool isDiscontinued)
        {
            var item = await Get(id);
            item.Discontinued = isDiscontinued;
            await _repo.Put(item);
            return item;
        }

        private async Task SwapSequence(string id, SwapDirection direction)
        {
            var item = await Get(id);

            if (item != null)
            {
                // Find the record that was in the slot that "id" is being moved to...
                // (NB: sequence is only guaranteed unique within a category, so must query by CategoryId+Sequence)
                var otherItem = await _repo.GetBySequence(item.CategoryId, item.Sequence + (int)direction);
            
                if (otherItem != null)
                {
                    // ...move it into "id"'s old slot...
                    otherItem.Sequence = item.Sequence;
                    // ...and move "id" up/down
                    item.Sequence += (int)direction;

                    await _repo.Put(item);
                    await _repo.Put(otherItem);
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