using Demo_Product.Model.Models;

namespace Demo_Product.Services.Product
{
    public interface IProductServices
    {
        Task<List<ProductModel>> GetProductlist(string mode);
        Task<List<CategoryModel>> GetCategorylist();
        Task<ProductModel> GetProduct(int id, string mode);
        Task<string> AddProduct(ProductModel model);
        Task<string> UpdateProduct(ProductModel model);
        Task<string> DeleteProduct(int id, string mode);
    }
}
