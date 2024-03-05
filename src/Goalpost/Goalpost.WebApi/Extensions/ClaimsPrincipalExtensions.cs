using System.Security.Claims;

namespace Goalpost.WebApi.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            // TODO: Throw if not found?
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        public static string GetUserEmail(this ClaimsPrincipal user)
        {
            // TODO: Throw if not found?
            return user.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
        }
    }
}