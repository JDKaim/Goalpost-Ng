using Goalpost.WebApi.Data;
using Goalpost.WebApi.DTOs;
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
        public async Task<GameDto> CreateGame(CreateGameDto dto)
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
            return gameDto;
        }

        [HttpGet("{id}")]
        public async Task<GameDto?> GetGame(int id)
        {
            Game? game = await this.Db.Games.FindAsync(id);
            if (game is null)
            {
                return null;
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
            return gameDto;
        }

        [HttpDelete("{id}")]
        public async Task DeleteGame(int id)
        {
            Game? game = await this.Db.Games.FindAsync(id);
            if (game is null)
            {
                return;
            }
            this.Db.Games.Remove(game);
            await this.Db.SaveChangesAsync();
        }

        [HttpPut()]
        public async Task<GameDto> UpdateGame(UpdateGameDto dto, int id)
        {
            Game? game = await this.Db.Games.FindAsync(id);
            if (game is null)
            {
                throw new Exception("Game does not exist.");
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
            return gameDto;
        }

        [HttpPost("Search")]
        public async Task<List<GameDto>> SearchGames(SearchGamesDto dto)
        {
            var query = this.Db.Games.AsQueryable();

            if (dto.TeamCode is not null)
            {
                query = query.Where((game) => game.AwayTeamCode == dto.TeamCode || game.HomeTeamCode == dto.TeamCode);
            }

            return await query.Select((game) =>
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
            }).ToListAsync();
        }
    }
}
