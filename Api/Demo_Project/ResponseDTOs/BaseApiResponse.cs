namespace Demo_Project.ResponseDTOs
{
    public class BaseApiResponse
    {
        /// <summary>
        /// Gets or sets a value indicating whether response is success or fail
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// Gets or sets Message
        /// </summary>
        public string Message { get; set; }
    }
}
