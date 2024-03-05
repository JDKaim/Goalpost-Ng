using Goalpost.WebApi.Entities.Identity;

namespace Goalpost.WebApi.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(ApplicationUser user, DateTime utcExpiration);
    }
}