using Goalpost.WebApi.Entities;
using System.ComponentModel.DataAnnotations;

namespace Goalpost.WebApi.DTOs.Requests
{
    public class AddPlayerToRosterDto
    {
        public int PlayerId { get; set; }
        public int GameId { get; set; }
        public bool IsHome { get; set; }
    }
}
