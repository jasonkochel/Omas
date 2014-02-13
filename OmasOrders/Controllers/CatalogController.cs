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
    public class CatalogController : ApiController
    {
        private OmasDbContext db = new OmasDbContext();

        // GET api/Catalog
        public IQueryable<Catalog> GetCatalogs()
        {
            return db.Catalogs.Where(c => c.BatchID == 0).OrderBy(c => c.Sequence);
        }

        // GET api/Catalog/5
        [ResponseType(typeof(Catalog))]
        public async Task<IHttpActionResult> GetCatalog(int id)
        {
            Catalog catalog = await db.Catalogs.FindAsync(id);
            if (catalog == null)
            {
                return NotFound();
            }

            return Ok(catalog);
        }

        // PUT api/Catalog/5
        public async Task<IHttpActionResult> PutCatalog(int id, Catalog catalog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != catalog.CatalogID)
            {
                return BadRequest();
            }

            db.Entry(catalog).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CatalogExists(id))
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

        // POST api/Catalog
        [ResponseType(typeof(Catalog))]
        public async Task<IHttpActionResult> PostCatalog(Catalog catalog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Catalogs.Add(catalog);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = catalog.CatalogID }, catalog);
        }

        // DELETE api/Catalog/5
        [ResponseType(typeof(Catalog))]
        public async Task<IHttpActionResult> DeleteCatalog(int id)
        {
            Catalog catalog = await db.Catalogs.FindAsync(id);
            if (catalog == null)
            {
                return NotFound();
            }

            db.Catalogs.Remove(catalog);
            await db.SaveChangesAsync();

            return Ok(catalog);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CatalogExists(int id)
        {
            return db.Catalogs.Count(e => e.CatalogID == id) > 0;
        }
    }
}