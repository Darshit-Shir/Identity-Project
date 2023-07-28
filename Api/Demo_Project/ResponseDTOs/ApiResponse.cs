namespace Demo_Project.ResponseDTOs
{
    public class ApiResponse<T> : BaseApiResponse
    {
        /// <summary>
        /// Gets or sets list of data
        /// </summary>        
        public virtual IList<T> Data { get; set; }
    }
}
