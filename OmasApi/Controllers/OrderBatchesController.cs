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
    public class OrderBatchesController : ControllerBase
    {
        private readonly OmasDbContext _db;

        public OrderBatchesController(OmasDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public Task<List<OrderBatch>> GetAll()
        {
            return _db.OrderBatches
                .AsNoTracking()
                .OrderByDescending(b => b.DeliveryDate)
                .ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<OrderBatch> Get(int id)
        {
            var batch = await _db.OrderBatches.FindAsync(id);

            if (batch== null)
            {
                throw new NotFoundException($"Batch '{id}' does not exist");
            }

            return batch;
        }

        [HttpPost]
        public async Task<OrderBatch> Post([FromBody] OrderBatch batch)
        {
            _db.OrderBatches.Add(batch);
            await _db.SaveChangesAsync();

            return batch;
        }

        [HttpPut("{id}")]
        public async Task<OrderBatch> Put(int id, [FromBody] OrderBatch batch)
        {
            if (!_db.OrderBatches.Any(b => b.BatchId == id))
            {
                throw new NotFoundException($"Batch '{id}' does not exist");
            }

            if (id != batch.BatchId)
            {
                throw new BadRequestException("Route BatchID does not match request body");
            }

            _db.OrderBatches.Update(batch);
            await _db.SaveChangesAsync();

            return batch;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            if (_db.OrderItems.Any(i => i.BatchId == id))
            {
                throw new ReferentialIntegrityException($"Batch '{id}' contains orders and cannot be deleted");
            }

            var batch = await Get(id);

            _db.OrderBatches.Remove(batch);
            await _db.SaveChangesAsync();
        }
    }
}