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
    public class CatalogItemsController : ApiController
    {
        private OmasOrdersContext db = new OmasOrdersContext();

        // GET api/CatalogItems
        public IQueryable<CatalogItem> GetCatalogItems()
        {
            return db.CatalogItems;
        }

        // GET api/CatalogItems/5
        [ResponseType(typeof(CatalogItem))]
        public async Task<IHttpActionResult> GetCatalogItem(int id)
        {
            CatalogItem catalogitem = await db.CatalogItems.FindAsync(id);
            if (catalogitem == null)
            {
                return NotFound();
            }

            return Ok(catalogitem);
        }

        // PUT api/CatalogItems/5
        public async Task<IHttpActionResult> PutCatalogItem(int id, CatalogItem catalogitem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != catalogitem.Id)
            {
                return BadRequest();
            }

            db.Entry(catalogitem).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CatalogItemExists(id))
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

        // POST api/CatalogItems
        [ResponseType(typeof(CatalogItem))]
        public async Task<IHttpActionResult> PostCatalogItem(CatalogItem catalogitem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CatalogItems.Add(catalogitem);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = catalogitem.Id }, catalogitem);
        }

        // DELETE api/CatalogItems/5
        [ResponseType(typeof(CatalogItem))]
        public async Task<IHttpActionResult> DeleteCatalogItem(int id)
        {
            CatalogItem catalogitem = await db.CatalogItems.FindAsync(id);
            if (catalogitem == null)
            {
                return NotFound();
            }

            db.CatalogItems.Remove(catalogitem);
            await db.SaveChangesAsync();

            return Ok(catalogitem);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CatalogItemExists(int id)
        {
            return db.CatalogItems.Count(e => e.Id == id) > 0;
        }
    }
}