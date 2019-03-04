using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Project.Models;

namespace Project.Controllers
{
    public class ProductsController : Controller
    {
        private StorageDatabaseEntities db = new StorageDatabaseEntities();

        // GET: Products
        public ActionResult Index()
        {
            return View();
        }
        //GET: Products
        public ActionResult GetProducts()
        {
            var products = db.Products;

            var result = new List<ProductViewModel>();
            foreach (var product in products)
            {
                var productViewModel = new ProductViewModel();
                productViewModel.Id = product.Id;
                productViewModel.Name = product.Name;
                productViewModel.Price = product.Price;
                result.Add(productViewModel);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        // POST: Products/Create

        [HttpPost]

        public ActionResult Create(ProductViewModel productViewModel)
        {
            if (ModelState.IsValid)
            {
                var product = new Product();
                product.Name = productViewModel.Name;
                product.Price = productViewModel.Price;

                db.Products.Add(product);
                db.SaveChanges();
                return Json("OK");
            }
            throw new Exception("Invalid model");
        }
       

        // POST: Products/Edit/5
       
        [HttpPost]
        public ActionResult Edit(ProductViewModel productViewModel)
        {
            if (ModelState.IsValid)
            {
                var product = db.Products.Find(productViewModel.Id);

                product.Name = productViewModel.Name;
                product.Price = productViewModel.Price;

                db.SaveChanges();
                return Json("Ok");
            }
            throw new Exception("Invalid model");
        }

       
       
        // POST: Products/Delete/5
        [HttpPost, ActionName("Delete")]
        
        public ActionResult DeleteConfirmed(int id)
        {
            Product product = db.Products.Find(id);
            db.Products.Remove(product);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
