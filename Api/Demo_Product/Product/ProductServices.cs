using Demo_Product.Data.DbRepository;
using Demo_Product.Model.Models;

namespace Demo_Product.Services.Product
{
    public class ProductServices : IProductServices
    {
        private readonly IProductRepository _ProductRepository;

        public ProductServices(IProductRepository productRepository)
        {
            _ProductRepository = productRepository;
        }

        public Task<string> AddProduct(ProductModel model)
        {
            return _ProductRepository.AddProduct(model);
        }

        public Task<string> DeleteProduct(int id, string mode)
        {
            return _ProductRepository.DeleteProduct(id,mode);
        }

        public Task<ProductModel> GetProduct(int id, string mode)
        {
            return _ProductRepository.GetProduct(id,mode);
        }

        public async Task<List<ProductModel>> GetProductlist(string mode)
        {
            return await _ProductRepository.GetProductlist(mode);
        }

        public Task<List<CategoryModel>> GetCategorylist()
        {
            return _ProductRepository.GetCategorylist();
        }

        public Task<string> UpdateProduct(ProductModel model)
        {
            return _ProductRepository.UpdateProduct(model);
        }
    }
}
