using Demo_Product.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Demo_Product.Data.DbRepository
{
    public interface IProductRepository
    {
        Task<List<ProductModel>> GetProductlist(string mode);
        Task<List<CategoryModel>> GetCategorylist();
        Task<ProductModel> GetProduct(int id, string mode);
        Task<string> AddProduct(ProductModel model);
        Task<string> UpdateProduct(ProductModel model);
        Task<string> DeleteProduct(int id, string mode);
    }
}
