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
                PasserId = play.Passer?.Id,
                RusherId = play.Rusher?.Id,
                ReceiverId = play.Receiver?.Id,
                TurnoverType = play.TurnoverType,
                FlagPullerId = play.FlagPuller?.Id,
                TurnoverPlayerId = play.TurnoverPlayer?.Id,
                IsSack = play.IsSack
            };
        }

    }
}