using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class SearchPlayerGamesDto
    {
        public int? PlayerId { get; set; }
        public int? GameId { get; set; }
        public string? SortBy { get; set; }
    }
}
