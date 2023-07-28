using Demo_Product.Model.Models;
using Demo_Product.Services.Product;
using Demo_Project.ResponseDTOs;
using Microsoft.AspNetCore.Mvc;

namespace Demo_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private IProductServices _ProductServices;
        private readonly IWebHostEnvironment _hostEnvironment;

        public ProductController(IProductServices ProductServices, IWebHostEnvironment hostEnvironment)
        {
            _ProductServices = ProductServices;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("GetProductList")]
        public async Task<ApiResponse<ProductModel>> GetProductList(string mode)
        {
            try
            {
                ApiResponse<ProductModel> response = new ApiResponse<ProductModel>() { Data = new List<ProductModel>() };

                List<ProductModel> data = await _ProductServices.GetProductlist(mode);
                
                if (data != null)
                {
                    response.Data = data;
                    response.Success = true;
                    response.Message = "Success";
                }
                else
                {
                    response.Success = false;
                    response.Message = "No data found";
                }
                return response;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpPost("AddProduct")]
        public async Task<BaseApiResponse> AddProduct()
        {
            try
            {
                BaseApiResponse baseApiResponse = new BaseApiResponse();
                var file = Request.Form.Files[0];

                string FileName = null;
                string uploadFolder = Path.Combine(_hostEnvironment.WebRootPath, "Images");
                FileName = file.FileName;
                string filePath = Path.Combine(uploadFolder, FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var model = new ProductModel()
                {
                    Name = Request.Form["Name"],
                    Image = file.FileName,
                    Category = Request.Form["Category"],
                    Color = Request.Form["Color"],
                    Description = Request.Form["Description"],
                    CreatedBy = Request.Form["CreatedBy"],
                    CreatedDate = Convert.ToDateTime(Request.Form["CreatedDate"]),
                    IsActive = Convert.ToBoolean(Request.Form["IsActive"]),
                    IsOutofstock = Convert.ToBoolean(Request.Form["IsOutofstock"]),
                    Manufacturing_Date = Convert.ToDateTime(Request.Form["Manufacturing_Date"]),
                    Mode = Request.Form["mode"],
                    ModifiedBy = Request.Form["ModifiedBy"],
                    ModifiedDate = Convert.ToDateTime(Request.Form["ModifiedDate"]),
                    Quantity = Convert.ToInt32(Request.Form["Quantity"]),
                    Price = Convert.ToInt32(Request.Form["Price"])
                };

                string result = await _ProductServices.AddProduct(model);

                if (result == "0")
                {
                    baseApiResponse.Message = "Data Added Successfully";
                    baseApiResponse.Success = true;
                }
                else if(result == "1")
                {
                    baseApiResponse.Message = "Entered product name already exists";
                    baseApiResponse.Success = false;
                }
                return baseApiResponse;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet("GetProduct")]
        public async Task<ApiResponse<ProductModel>> GetProduct(int id, string mode)
        {
            ApiResponse<ProductModel> response = new ApiResponse<ProductModel>();
            ProductModel data = await _ProductServices.GetProduct(id, mode);
            if (data != null)
            {
                response.Data = new List<ProductModel> { data };
                response.Success = true;
                response.Message = "Success";
            }
            else
            {
                response.Success = false;
                response.Message = "No Such Record";
            }
            return response;
        }

        [HttpPut("UpdateProduct")]
        public async Task<BaseApiResponse> UpdateProduct(IFormFile? formFile)
        {
            try
            {
                BaseApiResponse response = new BaseApiResponse();

                var checkData = Request.Form["ProfilePic"].ToString();
                var editFileName = Request.Form["ProfilePic"];

                if (checkData == "")
                {
                    var file = Request.Form.Files[0];
                    string FileName = null;
                    string uploadFolder = Path.Combine(_hostEnvironment.WebRootPath, "Images");
                    FileName = file.FileName;
                    editFileName = file.FileName;
                    string filePath = Path.Combine(uploadFolder, FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
                
                

                var model = new ProductModel()
                {
                    id = Convert.ToInt32(Request.Form["id"]),
                    Name = Request.Form["Name"],
                    Image = editFileName,
                    Category = Request.Form["Category"],
                    Color = Request.Form["Color"],
                    Description = Request.Form["Description"],
                    CreatedBy = Request.Form["CreatedBy"],
                    CreatedDate = Convert.ToDateTime(Request.Form["CreatedDate"]),
                    IsActive = Convert.ToBoolean(Request.Form["IsActive"]),
                    IsOutofstock = Convert.ToBoolean(Request.Form["IsOutofstock"]),
                    Manufacturing_Date = Convert.ToDateTime(Request.Form["Manufacturing_Date"]),
                    Mode = Request.Form["mode"],
                    ModifiedBy = Request.Form["ModifiedBy"],
                    ModifiedDate = Convert.ToDateTime(Request.Form["ModifiedDate"]),
                    Quantity = Convert.ToInt32(Request.Form["Quantity"]),
                    Price = Convert.ToInt32(Request.Form["Price"])
                };

                string result = await _ProductServices.UpdateProduct(model);
                if (result == "0")
                {
                    response.Success = true;
                    response.Message = "Data Updated Successfully";
                }
                else if(result == "1")
                {
                    response.Success = false;
                    response.Message = "Entered Product already exists.";
                }
                return response;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpDelete("DeleteProduct")]
        public async Task<BaseApiResponse> DeleteProduct(int id, string mode)
        {
            try
            {
                BaseApiResponse response = new BaseApiResponse();
                string result = await _ProductServices.DeleteProduct(id, mode);
                if (result == "0")
                {
                    response.Success = true;
                    response.Message = "Product Deleted Successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = result.ToString();
                }
                return response;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet("GetCategoryList")]
        public async Task<ApiResponse<CategoryModel>> GetCategoryList()
        {
            try
            {
                ApiResponse<CategoryModel> response = new ApiResponse<CategoryModel>() { Data = new List<CategoryModel>() };

                List<CategoryModel> data = await _ProductServices.GetCategorylist();
                response.Data = data;
                response.Success = true;
                response.Message = "Success";

                return response;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
