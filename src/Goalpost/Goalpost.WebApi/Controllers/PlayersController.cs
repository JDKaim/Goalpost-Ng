using Goalpost.WebApi.Data;
using Goalpost.WebApi.DTOs.Requests;
using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using Goalpost.WebApi.Entities.Identity;
using Goalpost.WebApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Goalpost.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly ILogger<PlayersController> _logger;
        private readonly ApplicationDbContext Db;

        public PlayersController(ILogger<PlayersController> logger, ApplicationDbContext db)
        {
            this._logger = logger;
            this.Db = db;
        }

        [HttpPost()]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<PlayerDto>> CreatePlayer(CreatePlayerDto dto)
        {
            string id = this.User.GetUserId();

            Player player = new Player()
            {
                Name = dto.Name ?? "AWAY",
            };
            this.Db.Players.Add(player);
            await this.Db.SaveChangesAsync();
            PlayerDto playerDto = new PlayerDto()
            {
                Name = player.Name,
                Id = player.Id,
            };
            return ApiResponseDto<PlayerDto>.CreateSuccess(playerDto);
        }

        [HttpGet("{id}")]
        public async Task<ApiResponseDto<PlayerDto>> GetPlayer(int id)
        {
            Player? player = await this.Db.Players.FindAsync(id);
            if (player is null)
            {
                return ApiResponseDto<PlayerDto>.CreateSuccess(null);
            }
            PlayerDto playerDto = new PlayerDto()
            {
                Name = player.Name,
                Id = player.Id,
            };
            return ApiResponseDto<PlayerDto>.CreateSuccess(playerDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<bool>> DeletePlayer(int id)
        {
            Player? player = await this.Db.Players.FindAsync(id);
            if (player is not null)
            {
                this.Db.Players.Remove(player);
                await this.Db.SaveChangesAsync();
            }
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<PlayerDto>> UpdatePlayer(UpdatePlayerDto dto, int id)
        {
            Player? player = await this.Db.Players.FindAsync(id);
            if (player is null)
            {
                return ApiResponseDto<PlayerDto>.CreateError("Player does not exist.");
            }
            player.Name = dto.Name ?? player.Name;
            await this.Db.SaveChangesAsync();
            PlayerDto playerDto = new PlayerDto()
            {
                Name = player.Name,
                Id = player.Id,
            };
            return ApiResponseDto<PlayerDto>.CreateSuccess(playerDto);
        }

        [HttpPost("Search")]
        public async Task<ApiResponseDto<List<PlayerDto>>> SearchPlayer(SearchPlayersDto dto)
        {
            var query = this.Db.Players.AsQueryable();

            if (dto.Name is not null)
            {
                query = query.Where((player) => player.Name == dto.Name);
            }

            if (dto.SortBy is null)
            {
                dto.SortBy = "Id";
            }

            switch (dto.SortBy)
            {
                case "Id":
                    query = query.OrderBy((game) => game.Id);
                    break;
                default:
                    throw new BadHttpRequestException($"SortBy parameter '{dto.SortBy}' unsupported.");
            }

            return ApiResponseDto<List<PlayerDto>>.CreateSuccess(await query.Select((player) =>
            new PlayerDto()
            {
                Name = player.Name,
                Id = player.Id,
            }).ToListAsync());
        }
    }
}
