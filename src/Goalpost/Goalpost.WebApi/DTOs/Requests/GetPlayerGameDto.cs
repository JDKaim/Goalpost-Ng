using Goalpost.WebApi.Entities;
using System.ComponentModel.DataAnnotations;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class GetPlayerGameDto
    {
        public int PlayerId { get; set; }
        public int GameId { get; set; }
        public bool IsHome { get; set; }
    }
}
