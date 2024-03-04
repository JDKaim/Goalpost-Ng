namespace Goalpost.WebApi.Entities
{
    public class Play
    {
        public int Id { get; set; }
        public int Index { get; set; }
        public bool IsHomePlay { get; set; }
        public PlayType Type { get; set; }
        public int YardLine { get; set; }
        public int Down { get; set; }
        public int Points { get; set; }
        public int Yardage { get; set; }
        public bool IsCompletedPass { get; set; }
        public Player? Passer { get; set; }
        public Player? Rusher { get; set; }
        public Player? Receiver { get; set; }
        public TurnoverType TurnoverType { get; set; }
        public Player? FlagPuller { get; set; }
        public Player? TurnoverPlayer { get; set; }
        public bool IsSack { get; set; }
    }
}
