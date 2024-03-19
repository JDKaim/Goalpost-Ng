using Microsoft.EntityFrameworkCore;

namespace Goalpost.WebApi.Entities
{
    [PrimaryKey(nameof(PlayerId), nameof(GameId), nameof(IsHome))]
    public class PlayerGame
    {
        public required Game Game { get; set; }
        public int GameId {  get; set; }
        public required Player Player { get; set; }
        public int PlayerId {  get; set; }
        public bool IsHome { get; set; }
        public bool IsCurrent { get; set; }
        public int PointsScored { get; set; }
        public int PassingAttempts { get; set; }
        public int PassingCompletions { get; set; }
        public int PassingYardage { get; set; }
        public int PassingTds { get; set; }
        public int PassingOnePointConversions { get; set; }
        public int PassingTwoPointConversions { get; set; }
        public int RushingAttempts { get; set; }
        public int RushingYardage { get; set; }
        public int RushingTds { get; set; }
        public int RushingOnePointConversions { get; set; }
        public int RushingTwoPointConversions { get; set; }
        public int ReceivingTargets {  get; set; }
        public int ReceivingCompletions { get; set; }
        public int ReceivingYardage { get; set; }
        public int ReceivingTds { get; set; }
        public int ReceivingOnePointConversions { get; set; }
        public int ReceivingTwoPointConversions { get; set; }
        public int FlagPulls { get; set; }
        public int PassingInterceptions {  get; set; }
        public int DefensiveInterceptions {  get; set; }
        public int OffensiveFumbles {  get; set; }
        public int DefensiveFumbles { get; set; }
        public int OffensiveSacks {  get; set; }
        public int DefensiveSacks { get; set; }
        public int DefensiveTds { get; set; }
        public int DefensiveOnePointConversions { get; set; }
        public int DefensiveTwoPointConversions { get; set; }
        public int OffensiveSafeties {  get; set; }
        public int DefensiveSafeties { get; set; }

    }
}
