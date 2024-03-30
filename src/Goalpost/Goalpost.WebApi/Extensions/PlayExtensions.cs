using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using System.Security.Claims;

namespace Goalpost.WebApi.Extensions
{
    public static class PlayExtensions
    {
        public static PlayDto ToDto(this Play play)
        {
            return new PlayDto()
            {
                Id = play.Id,
                Index = play.Index,
                IsHomePlay = play.IsHomePlay,
                Type = play.Type,
                YardLine = play.YardLine,
                Down = play.Down,
                Points = play.Points,
                Yardage = play.Yardage,
                IsCompletedPass = play.IsCompletedPass,
                PasserId = play.PasserId,
                RusherId = play.RusherId,
                ReceiverId = play.ReceiverId,
                TurnoverType = play.TurnoverType,
                FlagPullerId = play.FlagPullerId,
                TurnoverPlayerId = play.TurnoverPlayerId,
                IsSack = play.IsSack
            };
        }

    }
}