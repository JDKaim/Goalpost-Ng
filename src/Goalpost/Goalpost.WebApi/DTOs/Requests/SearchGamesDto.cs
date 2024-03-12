using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class SearchGamesDto
    {
        public string? TeamCode { get; set; }
        public string? SortBy { get; set; }
    }
}
