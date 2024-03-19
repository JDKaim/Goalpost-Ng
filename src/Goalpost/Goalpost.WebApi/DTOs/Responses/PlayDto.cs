namespace Goalpost.WebApi.Entities
{
    public class PlayDto
    {
        public int Id { get; set; }
        public long Index { get; set; }
        public bool IsHomePlay { get; set; }
        public PlayType Type { get; set; }
        public int YardLine { get; set; }
        public int Down { get; set; }
        public int Points { get; set; }
        public int Yardage { get; set; }
        public bool IsCompletedPass { get; set; }
        public int? PasserId { get; set; }
        public int? RusherId { get; set; }
        public int? ReceiverId { get; set; }
        public TurnoverType TurnoverType { get; set; }
        public int? FlagPullerId { get; set; }
        public int? TurnoverPlayerId { get; set; }
        public bool IsSack { get; set; }
    }
}
