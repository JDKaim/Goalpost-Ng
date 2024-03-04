using Goalpost.WebApi.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Goalpost.WebApi.Data
{
    public class Seeder
    {
        public static async Task SeedUsers(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) { return; }
            
            foreach (string roleName in ApplicationRoles.All)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            List<string> adminEmails = new List<string>() { "jdkaim@hotmail.com" };
            foreach (string email in adminEmails)
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email,
                };

                var identity = await userManager.CreateAsync(user, $"P@ssw0rd{Guid.NewGuid()}");
                await userManager.AddToRoleAsync(user, ApplicationRoles.Administrator);
            }

            List<string> scorekeeperEmails = new List<string>() { "scorekeeper@jdkaim.com" };
            foreach (string email in scorekeeperEmails)
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email,
                };

                var identity = await userManager.CreateAsync(user, $"P@ssw0rd{Guid.NewGuid()}");
                await userManager.AddToRoleAsync(user, ApplicationRoles.Scorekeeper);
            }

        }
    }
}
