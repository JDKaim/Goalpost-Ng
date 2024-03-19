using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using System.Security.Claims;

namespace Goalpost.WebApi.Extensions
{
    public static class PlayerGameExtensions
    {
        public static PlayerGameDto ToDto(this PlayerGame playerGame)
        {
            return new PlayerGameDto()
            {
                PlayerId = playerGame.PlayerId,
                GameId = playerGame.GameId,
                IsHome = playerGame.IsHome,
                IsCurrent = playerGame.IsCurrent,
                PointsScored = playerGame.PointsScored,
                PassingAttempts = playerGame.PassingAttempts,
                PassingCompletions = playerGame.PassingCompletions,
                PassingYardage = playerGame.PassingYardage,
                PassingTds = playerGame.PassingTds,
                PassingOnePointConversions = playerGame.PassingOnePointConversions,
                PassingTwoPointConversions = playerGame.PassingTwoPointConversions,
                RushingAttempts = playerGame.RushingAttempts,
                RushingYardage = playerGame.RushingYardage,
                RushingTds = playerGame.RushingTds,
                RushingOnePointConversions = playerGame.RushingOnePointConversions,
                RushingTwoPointConversions = playerGame.RushingTwoPointConversions,
                ReceivingTargets = playerGame.ReceivingTargets,
                ReceivingCompletions = playerGame.ReceivingCompletions,
                ReceivingYardage = playerGame.ReceivingYardage,
                ReceivingTds = playerGame.ReceivingTds,
                ReceivingOnePointConversions = playerGame.ReceivingOnePointConversions,
                ReceivingTwoPointConversions = playerGame.ReceivingTwoPointConversions,
                FlagPulls = playerGame.FlagPulls,
                PassingInterceptions = playerGame.PassingInterceptions,
                DefensiveInterceptions = playerGame.DefensiveInterceptions,
                OffensiveFumbles = playerGame.OffensiveFumbles,
                DefensiveFumbles = playerGame.DefensiveFumbles,
                OffensiveSacks = playerGame.OffensiveSacks,
                DefensiveSacks = playerGame.DefensiveSacks,
                DefensiveTds = playerGame.DefensiveTds,
                DefensiveOnePointConversions = playerGame.DefensiveOnePointConversions,
                DefensiveTwoPointConversions = playerGame.DefensiveTwoPointConversions,
                OffensiveSafeties = playerGame.OffensiveSafeties,
                DefensiveSafeties = playerGame.DefensiveSafeties
            };
        }

    }
}