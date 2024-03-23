using Goalpost.WebApi.Entities;
using Goalpost.WebApi.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Goalpost.WebApi.Data
{
    public class Seeder
    {
        public static async Task SeedUsers(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ConfigurationManager configurationManager)
        {
            if (await userManager.Users.AnyAsync()) { return; }
            
            foreach (string roleName in ApplicationRoles.All)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            List<string> adminEmails = new List<string>() { configurationManager.GetValue<string>("AppSettings:Admin:Email") ?? throw new Exception("The AppSettings:Admin:Email setting is required.") };
            foreach (string email in adminEmails)
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email,
                };

                var identity = await userManager.CreateAsync(user, configurationManager.GetValue<string>("AppSettings:Admin:Password") ?? throw new Exception("The AppSettings:Admin:Password setting is required."));
                await userManager.AddToRoleAsync(user, ApplicationRoles.Administrator);
            }

            List<string> scorekeeperEmails = new List<string>() { configurationManager.GetValue<string>("AppSettings:Scorekeeper:Email") ?? throw new Exception("The AppSettings:Scorekeeper:Email setting is required.") };
            foreach (string email in scorekeeperEmails)
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email,
                };

                var identity = await userManager.CreateAsync(user, configurationManager.GetValue<string>("AppSettings:Scorekeeper:Password") ?? throw new Exception("The AppSettings:Scorekeeper:Password setting is required."));
                await userManager.AddToRoleAsync(user, ApplicationRoles.Scorekeeper);
            }

        }

        public static async Task SeedGames(ApplicationDbContext db)
        {
            if (await db.Games.AnyAsync() || await db.Players.AnyAsync())
            {
                return;
            }
            Game game = new Game() { AwayTeamCode = "AWAY", HomeTeamCode = "HOME", AwayTeamName = "Away Team", HomeTeamName = "Home Team", Location = "Denny Field", Status = GameStatus.Future };
            db.Games.Add(game);
            Player player = new Player() { Name = "Hingle McCringleberry" };
            db.Players.Add(player);
            PlayerGame playerGame = new PlayerGame() { Game = game, Player = player, IsHome = true, IsCurrent = false };
            db.PlayerGames.Add(playerGame);
            await db.SaveChangesAsync();
        }
    }
}
