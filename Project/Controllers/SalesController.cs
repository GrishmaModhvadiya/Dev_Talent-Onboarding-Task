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
    public class SalesController : Controller
    {
        private StorageDatabaseEntities db = new StorageDatabaseEntities();

        // GET: Sales
        public ActionResult Index()
        {
            
            return View();
        }

        //GET:Sales
        public ActionResult GetSales()
        {
            var sales = db.Sales;
            var result = new List<SalesViewModel>();
            foreach(var sale in sales)
            {
                var salesViewModel = new SalesViewModel();
                salesViewModel.Id = sale.Id;
                salesViewModel.CustomerId = sale.CustomerId;
                salesViewModel.CustomerName = sale.Customer.Name;
                salesViewModel.ProductId = sale.ProductId;
                salesViewModel.ProductName = sale.Product.Name;
                salesViewModel.StoreId = sale.StoreId;
                salesViewModel.StoreName = sale.Store.Name;
                salesViewModel.DateSold = sale.DateSold;
                result.Add(salesViewModel);

            }
            return Json (result, JsonRequestBehavior.AllowGet);
        }

        
        // POST: Sales/Create
        [HttpPost]
        public ActionResult Create(SalesViewModel salesViewModel)
        {
            if (ModelState.IsValid)
            {
                var sale = new Sale();
                sale.CustomerId = salesViewModel.CustomerId;
                sale.ProductId = salesViewModel.ProductId;
                sale.StoreId = salesViewModel.StoreId;
                sale.DateSold = salesViewModel.DateSold;
                db.Sales.Add(sale);
                db.SaveChanges();
                return Json("OK");
            }
            throw new Exception("Invalid model");
        }

        // POST: Sales/Edit/5
        
        [HttpPost]
       
        public ActionResult Edit(SalesViewModel salesViewModel)
        {
            if (ModelState.IsValid)
            {
                var sale = db.Sales.Find(salesViewModel.Id);
                sale.ProductId= salesViewModel.ProductId;
                sale.StoreId = salesViewModel.StoreId;
                sale.CustomerId= salesViewModel.CustomerId;
                sale.DateSold = salesViewModel.DateSold;               
                db.SaveChanges();
                return Json("OK");
            }

            throw  new Exception("Invalid model");
        }

        

        // POST: Sales/Delete/5
        [HttpPost, ActionName("Delete")]
       
        public ActionResult DeleteConfirmed(int id)
        {
            Sale sale = db.Sales.Find(id);
            db.Sales.Remove(sale);
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
