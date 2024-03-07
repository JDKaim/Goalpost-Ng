using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Responses
{
    public class GameDto
    {
        public int Id { get; set; }
        public required string HomeTeamCode { get; set; }
        public required string AwayTeamCode { get; set; }
        public required string HomeTeamName { get; set; }
        public required string AwayTeamName { get; set; }
        public long StartTime { get; set; }
        public required string Location { get; set; }
        public GameStatus Status { get; set; }
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
    }
}
