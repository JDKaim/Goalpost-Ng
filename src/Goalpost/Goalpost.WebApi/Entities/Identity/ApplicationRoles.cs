namespace Goalpost.WebApi.Entities.Identity
{
    public class ApplicationRoles
    {
        public const string Administrator = "Administrator";
        public const string Scorekeeper = "Scorekeeper";
        public static string[] All = new string[]
        {
            ApplicationRoles.Administrator,
            ApplicationRoles.Scorekeeper
        };
    }
}
