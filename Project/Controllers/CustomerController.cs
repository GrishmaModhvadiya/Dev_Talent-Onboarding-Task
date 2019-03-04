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
    public class CustomerController : Controller
    {
        private StorageDatabaseEntities db = new StorageDatabaseEntities();

       
        public ActionResult Index()
        {
            return View();
        }
        // GET: Customer
        public ActionResult GetCustomers()
        {
            var customers = db.Customers;

            var result = new List<CustomerViewModel>();
            foreach(var customer in customers)
            {
                var customerViewModel = new CustomerViewModel();
                customerViewModel.Id = customer.Id;
                customerViewModel.Address = customer.Address;
                customerViewModel.Name = customer.Name;
                result.Add(customerViewModel);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        
        // POST: Customer/Create
       
        [HttpPost]
        public ActionResult Create(CustomerViewModel customerViewModel)
        {
            if (ModelState.IsValid)
            {
                var customer = new Customer();
                customer.Name = customerViewModel.Name;
                customer.Address = customerViewModel.Address;

                db.Customers.Add(customer);
                db.SaveChanges();
                return Json("OK");
            }
            throw new Exception("Invalid model");
        }

        
        // POST: Customer/Edit/5
       
        [HttpPost]
        public ActionResult Edit(CustomerViewModel customerViewModel)
        {
            if (ModelState.IsValid)
            {
                var customer = db.Customers.Find(customerViewModel.Id);

                customer.Name = customerViewModel.Name;
                customer.Address = customerViewModel.Address;

               
                db.SaveChanges();
                return Json("Ok");
               
            }
            throw new Exception("Invalid model");
        }

       

        // POST: Customer/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Customer customer = db.Customers.Find(id);
            db.Customers.Remove(customer);
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
