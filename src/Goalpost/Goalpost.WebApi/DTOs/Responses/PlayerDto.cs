using Goalpost.WebApi.Entities;

namespace Goalpost.WebApi.DTOs.Responses
{
    public class PlayerDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}
