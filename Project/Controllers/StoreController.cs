using Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Data;
using System.Net;

namespace Project.Controllers
{
    public class StoreController : Controller
    {
        private StorageDatabaseEntities db = new StorageDatabaseEntities();
        
        
        public ActionResult Index()
        {
            return View();
        }


        // GET: Store
        public ActionResult GetStores()
        {
            var stores = db.Stores;
            var result = new List<StoreViewModel>();
            foreach (var store in stores)
            {
                var storeViewModel = new StoreViewModel();
                storeViewModel.Id = store.Id;
                storeViewModel.Name = store.Name;
                storeViewModel.Address = store.Address;
                result.Add(storeViewModel);
            }
            return Json(result, JsonRequestBehavior.AllowGet);

        }

       
        // POST: Store/Create
        [HttpPost]
        
        public ActionResult Create(StoreViewModel storeViewModel)
        {
            if (ModelState.IsValid)
            {
                var store = new Store();
                store.Name = storeViewModel.Name;
                store.Address = storeViewModel.Address;

                db.Stores.Add(store);
                db.SaveChanges();
                return Json("OK");
            }
            throw new Exception("Invalid model");
        }

        

        // POST: Store/Edit/5
        [HttpPost]
        public ActionResult Edit(StoreViewModel storeViewModel)
        {
            if(ModelState.IsValid)
            {

                var store = db.Stores.Find(storeViewModel.Id);

                store.Name = storeViewModel.Name;
                store.Address = storeViewModel.Address;


                db.SaveChanges();
                return Json("Ok");

            }
            throw new Exception("Invalid model");
        }

        

        // POST: Store/Delete/5
        [HttpPost]
        
        public ActionResult Delete(int id)
        {
            
                Store store = db.Stores.Find(id);
                db.Stores.Remove(store);
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
