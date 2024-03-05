using Goalpost.WebApi.Dtos;
using Goalpost.WebApi.Entities.Identity;
using Goalpost.WebApi.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Goalpost.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;

        public AuthenticationController(ILogger<AuthenticationController> logger, UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager, ITokenService tokenService)
        {
            this._logger = logger;
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._tokenService = tokenService;
        }
        private async Task<string> CreateBearerTokenAsync(ApplicationUser user)
        {
            DateTime expiration = DateTime.UtcNow.AddDays(90);
            return await this._tokenService.CreateTokenAsync(user, expiration);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<string>> Login(LoginDto loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password)) { return this.BadRequest(); }

            ApplicationUser? user = await this._userManager.FindByEmailAsync(loginDto.Email);
            if ((user == null) || !(await this._userManager.CheckPasswordAsync(user, loginDto.Password)))
            {
                return this.Unauthorized("Invalid email/password combination.");
            }

            return await this.CreateBearerTokenAsync(user);
        }

    }

}
