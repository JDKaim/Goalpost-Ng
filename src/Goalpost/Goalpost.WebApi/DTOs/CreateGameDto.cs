using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs
{
    public class CreateGameDto
    {
        public string? HomeTeamCode { get; set; }
        public string? AwayTeamCode { get; set; }
        public string? HomeTeamName { get; set; }
        public string? AwayTeamName { get; set; }
        public long? StartTime { get; set; }
        public string? Location { get; set; }
    }
}
