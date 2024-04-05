using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using System.Security.Claims;

namespace Goalpost.WebApi.Extensions
{
    public static class GameExtensions
    {
        public static GameDto ToDto(this Game game)
        {
            return new GameDto()
            {
                Id = game.Id,
                HomeTeamCode = game.HomeTeamCode,
                AwayTeamCode = game.AwayTeamCode,
                HomeTeamName = game.HomeTeamName,
                AwayTeamName = game.AwayTeamName,
                StartTime = game.StartTime,
                Location = game.Location,
                Status = game.Status,
                HomeScore = game.HomeScore,
                AwayScore = game.AwayScore
            };
        }

    }
}