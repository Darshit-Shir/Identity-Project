namespace Demo_Project.ResponseDTOs
{
    public class ApiPostResponse<T> : BaseApiResponse
    {
        /// <summary>
        /// Gets or sets data
        /// </summary>
        public virtual T Data { get; set; }
    }
}
