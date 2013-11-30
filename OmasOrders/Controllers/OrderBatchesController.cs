using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using OmasOrders.Models;

namespace OmasOrders.Controllers
{
    public class OrderBatchesController : ApiController
    {
        private OmasOrdersContext db = new OmasOrdersContext();

        // GET api/OrderBatches
        public IQueryable<OrderBatch> GetOrderBatches()
        {
            return db.OrderBatches;
        }

        // GET api/OrderBatches/5
        [ResponseType(typeof(OrderBatch))]
        public async Task<IHttpActionResult> GetOrderBatch(int id)
        {
            OrderBatch orderbatch = await db.OrderBatches.FindAsync(id);
            if (orderbatch == null)
            {
                return NotFound();
            }

            return Ok(orderbatch);
        }

        // PUT api/OrderBatches/5
        public async Task<IHttpActionResult> PutOrderBatch(int id, OrderBatch orderbatch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != orderbatch.Id)
            {
                return BadRequest();
            }

            db.Entry(orderbatch).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderBatchExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/OrderBatches
        [ResponseType(typeof(OrderBatch))]
        public async Task<IHttpActionResult> PostOrderBatch(OrderBatch orderbatch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.OrderBatches.Add(orderbatch);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = orderbatch.Id }, orderbatch);
        }

        // DELETE api/OrderBatches/5
        [ResponseType(typeof(OrderBatch))]
        public async Task<IHttpActionResult> DeleteOrderBatch(int id)
        {
            OrderBatch orderbatch = await db.OrderBatches.FindAsync(id);
            if (orderbatch == null)
            {
                return NotFound();
            }

            db.OrderBatches.Remove(orderbatch);
            await db.SaveChangesAsync();

            return Ok(orderbatch);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderBatchExists(int id)
        {
            return db.OrderBatches.Count(e => e.Id == id) > 0;
        }
    }
}