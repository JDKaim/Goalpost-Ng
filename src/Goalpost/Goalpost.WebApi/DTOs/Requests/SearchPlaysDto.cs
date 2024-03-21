using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class SearchPlaysDto
    {
        public int? GameId { get; set; }
        public int? PlayerId { get; set; }
        public string? SortBy { get; set; }
    }
}
