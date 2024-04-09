using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using Goalpost.WebApi.Helpers;

namespace Goalpost.WebApi.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void UpdatePlayerStats()
        {
            Game game = new Game() { Id = 1, AwayTeamCode = "AWAY", HomeTeamCode = "HOME", AwayTeamName = "Away Team", HomeTeamName = "Home Team", Location = "Denny Field"};
            Player player = new Player() { Name = "Hingle McCringleberry", Id = 1 };
            PlayerGame playerGame = new PlayerGame() { Game = game, GameId = game.Id, Player = player, PlayerId = player.Id, IsHome = true };
            List<Play> plays = new List<Play>()
            {
                new Play() {Game = game, GameId = game.Id, Type = PlayType.Passing, PasserId = player.Id, IsCompletedPass = true, Yardage = 20, IsHomePlay = true},
                new Play() {Game = game, GameId = game.Id, Type = PlayType.Passing, PasserId = player.Id, IsCompletedPass = true, Yardage = 35, IsHomePlay = true} 
            };

            int expectedPassingYardage = 55;
            int expectedPassingAttempts = 2;
            int expectedPassingCompletions = 2;

            PlayHelper.UpdatePlayerStats(plays, playerGame);

            Assert.AreEqual(expectedPassingCompletions, playerGame.PassingCompletions);
            Assert.AreEqual(expectedPassingAttempts, playerGame.PassingAttempts);
            Assert.AreEqual(expectedPassingYardage, playerGame.PassingYardage);
        }
    }
}