using Goalpost.WebApi.Entities;
using System.ComponentModel.DataAnnotations;

namespace Goalpost.WebApi.DTOs.Requests
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
