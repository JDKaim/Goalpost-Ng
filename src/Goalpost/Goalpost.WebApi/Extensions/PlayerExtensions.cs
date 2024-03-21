using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using System.Security.Claims;

namespace Goalpost.WebApi.Extensions
{
    public static class PlayerExtensions
    {
        public static PlayerDto ToDto(this Player player)
        {
            return new PlayerDto()
            {
                Id = player.Id,
                Name = player.Name,
                Games = player.Games,
                PointsScored = player.PointsScored,
                PassingAttempts = player.PassingAttempts,
                PassingCompletions = player.PassingCompletions,
                PassingYardage = player.PassingYardage,
                PassingTds = player.PassingTds,
                PassingOnePointConversions = player.PassingOnePointConversions,
                PassingTwoPointConversions = player.PassingTwoPointConversions,
                RushingAttempts = player.RushingAttempts,
                RushingYardage = player.RushingYardage,
                RushingTds = player.RushingTds,
                RushingOnePointConversions = player.RushingOnePointConversions,
                RushingTwoPointConversions = player.RushingTwoPointConversions,
                ReceivingTargets = player.ReceivingTargets,
                ReceivingCompletions = player.ReceivingCompletions,
                ReceivingYardage = player.ReceivingYardage,
                ReceivingTds = player.ReceivingTds,
                ReceivingOnePointConversions = player.ReceivingOnePointConversions,
                ReceivingTwoPointConversions = player.ReceivingTwoPointConversions,
                FlagPulls = player.FlagPulls,
                PassingInterceptions = player.PassingInterceptions,
                DefensiveInterceptions = player.DefensiveInterceptions,
                OffensiveFumbles = player.OffensiveFumbles,
                DefensiveFumbles = player.DefensiveFumbles,
                OffensiveSacks = player.OffensiveSacks,
                DefensiveSacks = player.DefensiveSacks,
                DefensiveTds = player.DefensiveTds,
                DefensiveOnePointConversions = player.DefensiveOnePointConversions,
                DefensiveTwoPointConversions = player.DefensiveTwoPointConversions,
                OffensiveSafeties = player.OffensiveSafeties,
                DefensiveSafeties = player.DefensiveSafeties
            };
        }

    }
}