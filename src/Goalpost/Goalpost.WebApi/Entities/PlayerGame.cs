namespace Goalpost.WebApi.Entities
{
    public class PlayerGame
    {
        public int Id { get; set; }
        public required Game Game { get; set; }
        public required Player Player { get; set; }
    }
}
