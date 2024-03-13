using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class SearchPlayersDto
    {
        public string? Name { get; set; }
        public string? SortBy { get; set; }
    }
}
