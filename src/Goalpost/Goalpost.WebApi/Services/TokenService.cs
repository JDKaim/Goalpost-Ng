using Goalpost.WebApi.Entities.Identity;
using Goalpost.WebApi.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Goalpost.WebApi.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly ILogger<TokenService> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenService(ILogger<TokenService> logger, IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            this._key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetValue<string>("AppSettings:TokenKey") ?? throw new ArgumentException("Required setting TokenKey is missing")));
            this._logger = logger;
            this._userManager = userManager;
        }

        public async Task<string> CreateTokenAsync(ApplicationUser user, DateTime utcExpiration)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!)
            };

            IList<string>? roles = await this._userManager.GetRolesAsync(user);
            if ((roles != null) && roles.Any())
            {
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            }

            var creds = new SigningCredentials(this._key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = utcExpiration,
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}