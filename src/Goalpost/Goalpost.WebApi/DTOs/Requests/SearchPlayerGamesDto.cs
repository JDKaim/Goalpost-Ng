using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class SearchPlayerGamesDto
    {
        public string? PlayerId { get; set; }
        public string? GameId { get; set; }
        public string? SortBy { get; set; }
    }
}
