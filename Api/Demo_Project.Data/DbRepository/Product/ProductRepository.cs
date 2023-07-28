using Dapper;
using Demo_Product.Model.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Threading.Tasks;

namespace Demo_Product.Data.DbRepository
{
    public class ProductRepository :BaseRepository, IProductRepository
    {
        public IConfiguration _configuration;

        public ProductRepository(IConfiguration configuration,IOptions<DataConfig> dataConfig) : base(dataConfig)
        {
            _configuration = configuration;
        }

        public async Task<string> AddProduct(ProductModel model)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Mode", model.Mode);
            param.Add("@Image", model.Image);
            param.Add("@Name", model.Name);
            param.Add("@Category", model.Category);
            param.Add("@Description", model.Description);
            param.Add("@Quantity", model.Quantity);
            param.Add("@Manufacturing_Date", model.Manufacturing_Date);
            param.Add("@IsOutofstock", model.IsOutofstock);
            param.Add("@Price", model.Price);
            param.Add("@Color", model.Color);
            param.Add("@IsActive", model.IsActive);
            param.Add("@CreatedBy", model.CreatedBy);
            param.Add("@CreatedDate", model.CreatedDate);
            param.Add("@ModifiedBy", model.ModifiedBy);
            param.Add("@ModifiedDate", model.ModifiedDate);
            var result = await QueryFirstOrDefaultAsync<string>("[dbo].[sp_ProductMaster]", param, commandType: CommandType.StoredProcedure);
            return result;
        }

        public async Task<string> DeleteProduct(int id, string mode)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", id);
            param.Add("@Mode", mode);
            return await QueryFirstOrDefaultAsync<string>("[dbo].[sp_ProductMaster]", param, commandType: CommandType.StoredProcedure);
        }

        public async Task<ProductModel> GetProduct(int id,string mode)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", id);
            param.Add("@Mode", mode);
            return await QueryFirstOrDefaultAsync<ProductModel>("[dbo].[sp_ProductMaster]", param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ProductModel>> GetProductlist(string mode)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Mode", mode);
            IEnumerable<ProductModel> product = await QueryAsync<ProductModel>("[dbo].[sp_ProductMaster]",param,commandType: CommandType.StoredProcedure);
            return product.ToList();
        }

        public async Task<string> UpdateProduct(ProductModel model)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", model.id);
            param.Add("@Image", model.Image);
            param.Add("@Name", model.Name);
            param.Add("@Category", model.Category);
            param.Add("@Description", model.Description);
            param.Add("@Quantity", model.Quantity);
            param.Add("@Manufacturing_Date", model.Manufacturing_Date);
            param.Add("@IsOutofstock", model.IsOutofstock);
            param.Add("@Price", model.Price);
            param.Add("@Color", model.Color);
            param.Add("@Mode", model.Mode);
            param.Add("@IsActive", model.IsActive);
            param.Add("@CreatedBy", model.CreatedBy);
            param.Add("@CreatedDate", model.CreatedDate);
            param.Add("@ModifiedBy", model.ModifiedBy);
            param.Add("@ModifiedDate", model.ModifiedDate);
            var result = await QueryFirstOrDefaultAsync<string>("[dbo].[sp_ProductMaster]", param, commandType: CommandType.StoredProcedure);
            return result;
        }

        public async Task<List<CategoryModel>> GetCategorylist()
        {
            IEnumerable<CategoryModel> categories = await QueryAsync<CategoryModel>("[dbo].[sp_GetCategoryList]", commandType: CommandType.StoredProcedure);
            return categories.ToList();
        }
    }
}
