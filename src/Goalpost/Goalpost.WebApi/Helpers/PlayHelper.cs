using Goalpost.WebApi.Entities;
using System.Diagnostics;
using System.Numerics;
using System.Runtime.CompilerServices;

namespace Goalpost.WebApi.Helpers
{
    public static class PlayHelper
    {
        public static void VerifyPlay(CreatePlayDto dto)
        {
            bool isPassingPlay = dto.Type == PlayType.Passing || dto.Type == PlayType.OnePointPass || dto.Type == PlayType.TwoPointPass;
            bool isRushingPlay = dto.Type == PlayType.Rushing || dto.Type == PlayType.OnePointRush || dto.Type == PlayType.TwoPointRush;
            if (dto.Down > 4 || dto.Down < 1)
            {
                throw new Exception($"{nameof(dto.Down)} must be between 1 and 4.");
            }
            if (isPassingPlay)
            {
                if (dto.PasserId == null)
                {
                    throw new Exception($"{nameof(dto.PasserId)} needs to exist on passing play.");
                }
                if (dto.ReceiverId == null && !dto.IsSack)
                {
                    throw new Exception($"{nameof(dto.ReceiverId)} needs to exist on passing play.");
                }
            }
            else if (isRushingPlay)
            {
                if (dto.RusherId == null)
                {
                    throw new Exception($"{nameof(dto.RusherId)} needs to exist on rushing play.");
                }
            }
            else
            {
                throw new Exception("Unsupported play type.");
            }

            if (dto.TurnoverType == TurnoverType.Interception || dto.TurnoverType == TurnoverType.Fumble)
            {
                if (dto.TurnoverPlayerId == null)
                {
                    throw new Exception($"{nameof(dto.TurnoverPlayerId)} needs to exist on turnover play.");
                }
            }
            int endYardLine = dto.YardLine - dto.Yardage;
            if (endYardLine < 0 || endYardLine > 40)
            {
                throw new Exception("Play must end between the 0 and 40 yard line.");
            }
            bool isScoringPlay = (endYardLine == 0) || (endYardLine == 40);
            if (!isScoringPlay)
            {
                if (isPassingPlay && dto.TurnoverType == TurnoverType.None && dto.IsCompletedPass == false)
                { }
                else if (dto.FlagPullerId == null)
                {
                    throw new Exception($"{nameof(dto.FlagPullerId)} needs to exist on non-scoring play.");
                }
            }
            else if (endYardLine == 40)
            {
                if (dto.TurnoverPlayerId == null && (dto.IsSack || dto.IsCompletedPass || isRushingPlay))
                {
                    if (dto.FlagPullerId == null)
                    {
                        throw new Exception($"{nameof(dto.FlagPullerId)} needs to exist on safety play.");
                    }
                }
                else if (isPassingPlay && (!dto.IsCompletedPass || dto.TurnoverType == TurnoverType.None))
                {

                }
                else
                {
                    if (dto.FlagPullerId != null)
                    {
                        throw new Exception($"{nameof(dto.FlagPullerId)} should not exist on defensive score.");
                    }
                }
            }
            else
            {
                if (dto.FlagPullerId != null)
                {
                    throw new Exception($"{nameof(dto.FlagPullerId)} should not exist on offensive score.");
                }
            }

        }

        public static void UpdatePlayerStats(List<Play> plays, PlayerGame playerGame)
        {
            List<Play> passingPlays = plays
                    .Where((play) => play.GameId == playerGame.GameId && play.PasserId == playerGame.PlayerId && play.IsHomePlay == playerGame.IsHome)
                    .ToList();
            List<Play> rushingPlays = plays
                    .Where((play) => play.GameId == playerGame.GameId && play.RusherId == playerGame.PlayerId && play.IsHomePlay == playerGame.IsHome)
                    .ToList();
            List<Play> receivingPlays = plays
                    .Where((play) => play.GameId == playerGame.GameId && play.ReceiverId == playerGame.PlayerId && play.IsHomePlay == playerGame.IsHome)
                    .ToList();
            List<Play> turnoverPlays = plays
                    .Where((play) => play.GameId == playerGame.GameId && play.TurnoverPlayerId == playerGame.PlayerId && play.IsHomePlay != playerGame.IsHome)
                    .ToList();
            List<Play> flagPullerPlays = plays
                    .Where((play) => play.GameId == playerGame.GameId && play.FlagPullerId == playerGame.PlayerId &&
                    ((play.IsHomePlay == playerGame.IsHome && (play.TurnoverType == TurnoverType.Interception || play.TurnoverType == TurnoverType.Fumble)) ||
                    (play.IsHomePlay != playerGame.IsHome && (play.TurnoverType != TurnoverType.Interception && play.TurnoverType != TurnoverType.Fumble))))
                    .ToList();

            playerGame.DefensiveFumbles = turnoverPlays.FindAll((play) => play.TurnoverType == TurnoverType.Fumble).Count;
            playerGame.DefensiveInterceptions = turnoverPlays.FindAll((play) => play.TurnoverType == TurnoverType.Interception).Count;
            playerGame.DefensiveOnePointConversions = turnoverPlays.FindAll((play) => play.Points == 1).Count;
            playerGame.DefensiveTwoPointConversions = turnoverPlays.FindAll((play) => play.Points == 2).Count;
            playerGame.DefensiveTds = turnoverPlays.FindAll((play) => play.Points == 6).Count;
            playerGame.DefensiveSafeties = flagPullerPlays.FindAll((play) => play.Points == 2 && (play.YardLine - play.Yardage == 40)).Count;
            playerGame.DefensiveSacks = flagPullerPlays.FindAll((play) => play.IsSack).Count;
            playerGame.OffensiveSacks = passingPlays.FindAll((play) => play.IsSack).Count;
            playerGame.PassingAttempts = passingPlays.FindAll((play) => !play.IsSack).Count;
            playerGame.PassingCompletions = passingPlays.FindAll((play) => play.IsCompletedPass).Count;
            playerGame.PassingInterceptions = passingPlays.FindAll((play) => play.TurnoverType == TurnoverType.Interception).Count;
            playerGame.PassingOnePointConversions = passingPlays.FindAll((play) => play.Points == 1 && (play.Yardage == play.YardLine)).Count;
            playerGame.PassingTwoPointConversions = passingPlays.FindAll((play) => play.Points == 2 && (play.Yardage == play.YardLine)).Count;
            playerGame.PassingTds = passingPlays.FindAll((play) => play.Points == 6 && (play.Yardage == play.YardLine)).Count;
            playerGame.PassingYardage = passingPlays.FindAll((play) => play.IsCompletedPass && play.TurnoverType != TurnoverType.Fumble && play.TurnoverType != TurnoverType.Interception).Sum((play) => play.Yardage);
            playerGame.FlagPulls = flagPullerPlays.Count;
            playerGame.RushingAttempts = rushingPlays.Count;
            playerGame.RushingOnePointConversions = rushingPlays.FindAll((play) => play.Points == 1 && (play.Yardage == play.YardLine)).Count;
            playerGame.RushingTwoPointConversions = rushingPlays.FindAll((play) => play.Points == 2 && (play.Yardage == play.YardLine)).Count;
            playerGame.RushingTds = rushingPlays.FindAll((play) => play.Points == 6 && (play.Yardage == play.YardLine)).Count;
            playerGame.RushingYardage = rushingPlays.FindAll((play) => play.TurnoverType != TurnoverType.Fumble).Sum((play) => play.Yardage);
            playerGame.ReceivingTargets = receivingPlays.Count;
            playerGame.ReceivingCompletions = receivingPlays.FindAll((play) => play.IsCompletedPass).Count;
            playerGame.ReceivingOnePointConversions = receivingPlays.FindAll((play) => play.Points == 1 && (play.Yardage == play.YardLine)).Count;
            playerGame.ReceivingTwoPointConversions = receivingPlays.FindAll((play) => play.Points == 2 && (play.Yardage == play.YardLine)).Count;
            playerGame.ReceivingTds = receivingPlays.FindAll((play) => play.Points == 6 && (play.Yardage == play.YardLine)).Count;
            playerGame.ReceivingYardage = receivingPlays.FindAll((play) => play.IsCompletedPass && play.TurnoverType != TurnoverType.Fumble && play.TurnoverType != TurnoverType.Interception).Sum((play) => play.Yardage);
            playerGame.OffensiveFumbles = passingPlays.FindAll((play) => play.IsSack && play.TurnoverType == TurnoverType.Fumble).Count +
                rushingPlays.FindAll((play) => play.TurnoverType == TurnoverType.Fumble).Count +
                receivingPlays.FindAll((play) => play.TurnoverType == TurnoverType.Fumble && play.IsCompletedPass).Count;
            playerGame.OffensiveSafeties = passingPlays.FindAll((play) => play.IsSack && play.Points == 2).Count +
                rushingPlays.FindAll((play) => (play.YardLine - play.Yardage == 40)).Count +
                receivingPlays.FindAll((play) => (play.YardLine - play.Yardage == 40) && play.IsCompletedPass).Count;
            playerGame.PointsScored = (2 * playerGame.DefensiveSafeties) + playerGame.DefensiveOnePointConversions + playerGame.PassingOnePointConversions + playerGame.ReceivingOnePointConversions + playerGame.RushingOnePointConversions +
                (2 * (playerGame.DefensiveTwoPointConversions + playerGame.PassingTwoPointConversions + playerGame.ReceivingTwoPointConversions + playerGame.RushingTwoPointConversions)) +
                (6 * (playerGame.DefensiveTds + playerGame.PassingTds + playerGame.ReceivingTds + playerGame.RushingTds));
        }
    }
}
