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
    public class GamesController : ControllerBase
    {
        private readonly ILogger<GamesController> _logger;
        private readonly ApplicationDbContext Db;

        public GamesController(ILogger<GamesController> logger, ApplicationDbContext db)
        {
            this._logger = logger;
            this.Db = db;
        }

        [HttpPost()]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<GameDto>> CreateGame(CreateGameDto dto)
        {
            string id = this.User.GetUserId();

            Game game = new Game()
            {
                AwayTeamCode = dto.AwayTeamCode ?? "AWAY",
                AwayTeamName = dto.AwayTeamName ?? "Away Team",
                HomeTeamCode = dto.HomeTeamCode ?? "HOME",
                HomeTeamName = dto.HomeTeamName ?? "Home Team",
                Location = dto.Location ?? "TBD",
                StartTime = dto.StartTime ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Status = GameStatus.Future,
            };
            this.Db.Games.Add(game);
            await this.Db.SaveChangesAsync();
            GameDto gameDto = new GameDto()
            {
                AwayTeamCode = game.AwayTeamCode,
                AwayTeamName = game.AwayTeamName,
                HomeTeamCode = game.HomeTeamCode,
                HomeTeamName = game.HomeTeamName,
                Location = game.Location,
                StartTime = game.StartTime,
                Status = game.Status,
                Id = game.Id,
                AwayScore = game.AwayScore,
                HomeScore = game.HomeScore
            };
            return ApiResponseDto<GameDto>.CreateSuccess(gameDto);
        }

        [HttpGet("{id}")]
        public async Task<ApiResponseDto<GameDto>> GetGame(int id)
        {
            Game? game = await this.Db.Games.FindAsync(id);
            if (game is null)
            {
                return ApiResponseDto<GameDto>.CreateSuccess(null);
            }
            GameDto gameDto = new GameDto()
            {
                AwayTeamCode = game.AwayTeamCode,
                AwayTeamName = game.AwayTeamName,
                HomeTeamCode = game.HomeTeamCode,
                HomeTeamName = game.HomeTeamName,
                Location = game.Location,
                StartTime = game.StartTime,
                Status = game.Status,
                Id = game.Id,
                AwayScore = game.AwayScore,
                HomeScore = game.HomeScore
            };
            return ApiResponseDto<GameDto>.CreateSuccess(gameDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<bool>> DeleteGame(int id)
        {
            Game? game = await this.Db.Games.FindAsync(id);
            if (game is not null)
            {
                this.Db.Games.Remove(game);
                await this.Db.SaveChangesAsync();
            }
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<GameDto>> UpdateGame(UpdateGameDto dto, int id)
        {
            Game? game = await this.Db.Games.FindAsync(id);
            if (game is null)
            {
                return ApiResponseDto<GameDto>.CreateError("Game does not exist.");
            }
            game.AwayTeamCode = dto.AwayTeamCode ?? game.AwayTeamCode;
            game.AwayTeamName = dto.AwayTeamName ?? game.AwayTeamName;
            game.HomeTeamCode = dto.HomeTeamCode ?? game.HomeTeamCode;
            game.HomeTeamName = dto.HomeTeamName ?? game.HomeTeamName;
            game.Location = dto.Location ?? game.Location;
            game.StartTime = dto.StartTime ?? game.StartTime;
            game.AwayScore = dto.AwayScore ?? game.AwayScore;
            game.HomeScore = dto.HomeScore ?? game.HomeScore;
            game.Status = dto.Status ?? game.Status;
            await this.Db.SaveChangesAsync();
            GameDto gameDto = new GameDto()
            {
                AwayTeamCode = game.AwayTeamCode,
                AwayTeamName = game.AwayTeamName,
                HomeTeamCode = game.HomeTeamCode,
                HomeTeamName = game.HomeTeamName,
                Location = game.Location,
                StartTime = game.StartTime,
                Status = game.Status,
                Id = game.Id,
                AwayScore = game.AwayScore,
                HomeScore = game.HomeScore
            };
            return ApiResponseDto<GameDto>.CreateSuccess(gameDto);
        }

        [HttpPost("Search")]
        public async Task<ApiResponseDto<List<GameDto>>> SearchGames(SearchGamesDto dto)
        {
            var query = this.Db.Games.AsQueryable();

            if (dto.TeamCode is not null)
            {
                query = query.Where((game) => game.AwayTeamCode == dto.TeamCode || game.HomeTeamCode == dto.TeamCode);
            }

            if (dto.SortBy is null)
            {
                dto.SortBy = "StartTime";
            }

            switch (dto.SortBy)
            {
                case "StartTime":
                    query = query.OrderBy((game) => game.StartTime);
                    break;
                case "Status":
                    query = query.OrderBy((game) => game.Status);
                    break;
                default:
                    throw new BadHttpRequestException($"SortBy parameter '{dto.SortBy}' unsupported.");
            }

            return ApiResponseDto<List<GameDto>>.CreateSuccess(await query.Select((game) =>
            new GameDto()
            {
                AwayTeamCode = game.AwayTeamCode,
                AwayTeamName = game.AwayTeamName,
                HomeTeamCode = game.HomeTeamCode,
                HomeTeamName = game.HomeTeamName,
                Location = game.Location,
                StartTime = game.StartTime,
                Status = game.Status,
                Id = game.Id,
                AwayScore = game.AwayScore,
                HomeScore = game.HomeScore
            }).ToListAsync());
        }
    }
}
