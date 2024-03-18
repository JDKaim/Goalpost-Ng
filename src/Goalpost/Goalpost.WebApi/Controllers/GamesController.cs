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

        [HttpPost("{gameId}/{team}")]
        public async Task<ApiResponseDto<PlayerGameDto>> AddPlayerToRoster(int gameId, int playerId, string team)
        {
            if (team != "home" && team != "away")
            {
                return ApiResponseDto<PlayerGameDto>.CreateError("Team must be 'home' or 'away'.");
            }
            bool isHome = team == "home";
            PlayerGame? playerGame = await this.Db.PlayerGames.FindAsync(playerId, gameId, isHome);
            if (playerGame is not null)
            {
                if (!playerGame.IsCurrent)
                {
                    playerGame.IsCurrent = true;
                    await this.Db.SaveChangesAsync();
                }
                return ApiResponseDto<PlayerGameDto>.CreateSuccess(playerGame.ToDto());
            }


            Game? game = await this.Db.Games.FindAsync(gameId);
            if (game is null)
            {
                return ApiResponseDto<PlayerGameDto>.CreateError("Game does not exist.");
            }
            Player? player = await this.Db.Players.FindAsync(playerId);
            if (player is null)
            {
                return ApiResponseDto<PlayerGameDto>.CreateError("Player does not exist.");
            }

            playerGame = new PlayerGame()
            {
                Game = game,
                Player = player,
                IsHome = isHome,
                IsCurrent = true
            };
            this.Db.PlayerGames.Add(playerGame);
            await this.Db.SaveChangesAsync();
            return ApiResponseDto<PlayerGameDto>.CreateSuccess(playerGame.ToDto());
        }

        [HttpDelete("{gameId}/{team}/{playerId}")]
        public async Task<ApiResponseDto<bool>> RemovePlayerFromRoster(int gameId, string team, int playerId)
        {
            if (team != "home" && team != "away")
            {
                return ApiResponseDto<bool>.CreateError("Team must be 'home' or 'away'.");
            }
            bool isHome = team == "home";
            PlayerGame? playerGame = await this.Db.PlayerGames.FindAsync(playerId, gameId, isHome);
            if (playerGame is null)
            {
                return ApiResponseDto<bool>.CreateSuccess(false);
            }

            this.Db.PlayerGames.Remove(playerGame);
            await this.Db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        [HttpGet("{gameId}/{team}")]
        public async Task<ApiResponseDto<List<PlayerGameDto>>> GetRoster(int gameId, string team)
        {
            if (team != "home" && team != "away")
            {
                return ApiResponseDto<List<PlayerGameDto>>.CreateError("Team must be 'home' or 'away'.");
            }
            bool isHome = team == "home";
            return ApiResponseDto<List<PlayerGameDto>>.CreateSuccess(
                await this.Db.PlayerGames
                    .Where((playerGame) => playerGame.GameId == gameId && playerGame.IsHome == isHome)
                    .Select(playerGame => playerGame.ToDto())
                    .ToListAsync());
        }

        [HttpPost("{gameId}/Play")]
        public async Task<ApiResponseDto<GameDto>> AddPlay(int gameId, CreatePlayDto dto)
        {
            // Check that game exists.
            Game? game = await this.Db.Games.FindAsync(gameId);
            if (game is null)
            {
                return ApiResponseDto<GameDto>.CreateError("Game does not exist.");
            }

            // If the end of the play puts the ball in the end zone, points should be scored, and the correct amount should be scored.
            if (dto.YardLine + dto.Yardage >= 40)
            {
                if (dto.Points == 0)
                {
                    return ApiResponseDto<GameDto>.CreateError("Points should be scored on this play.");
                }
                else
                {
                    if (dto.Type == PlayType.Passing || dto.Type == PlayType.Rushing)
                    {
                        dto.Points = 6;
                    }
                    else if (dto.Type == PlayType.TwoPointPass || dto.Type == PlayType.TwoPointRush)
                    {
                        dto.Points = 2;
                    }
                    else
                    {
                        dto.Points = 1;
                    }
                }
            }

            // Ensure that turnover player exists if play resulted in a turnover.
            if (dto.TurnoverType == TurnoverType.Interception || dto.TurnoverType == TurnoverType.Fumble)
            {
                if (dto.TurnoverPlayerId == null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Turnover ID cannot be null.");
                }
                Player? turnoverPlayer = await this.Db.Players.FindAsync(dto.TurnoverPlayerId);
                PlayerGame? turnoverPlayerGame = await this.Db.PlayerGames.FindAsync(dto.TurnoverPlayerId, !dto.IsHomePlay);
                if (turnoverPlayer is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Turnover player does not exist.");
                }
                if (turnoverPlayerGame is null)
                {
                    await AddPlayerToRoster(gameId, (int)dto.TurnoverPlayerId, (dto.IsHomePlay) ? "away" : "home");
                }
            }
            // If turnover did not occur and points were not scored then ensure there's a flag puller that exists.
            else if (dto.Points == 0)
            {
                if (dto.FlagPullerId == null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Flag Puller ID cannot be null.");
                }
                Player? flagPuller = await this.Db.Players.FindAsync(dto.FlagPullerId);
                PlayerGame? flagPullerGame = await this.Db.PlayerGames.FindAsync(dto.FlagPullerId, !dto.IsHomePlay);
                if (flagPuller is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Flag puller does not exist.");
                }
                if (flagPullerGame is null)
                {
                    await AddPlayerToRoster(gameId, (int)dto.FlagPullerId, (dto.IsHomePlay) ? "away" : "home");
                }
            }

            // Ensure passer and receiver exist for passing play.
            if (dto.Type == PlayType.Passing || dto.Type == PlayType.OnePointPass || dto.Type == PlayType.TwoPointPass)
            {
                if (dto.PasserId is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Passer ID cannot be null.");
                }
                if (dto.ReceiverId is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Receiver ID cannot be null.");
                }
                Player? passer = await this.Db.Players.FindAsync(dto.PasserId);
                PlayerGame? passerGame = await this.Db.PlayerGames.FindAsync(dto.PasserId, dto.IsHomePlay);
                if (passer is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Passer does not exist.");
                }
                if (passerGame is null)
                {
                    await AddPlayerToRoster(gameId, (int)dto.PasserId, (dto.IsHomePlay) ? "home" : "away");
                }
                Player? receiver = await this.Db.Players.FindAsync(dto.ReceiverId);
                PlayerGame? receiverGame = await this.Db.PlayerGames.FindAsync(dto.ReceiverId, dto.IsHomePlay);
                if (receiver is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Receiver does not exist.");
                }
                if (receiverGame is null)
                {
                    await AddPlayerToRoster(gameId, (int)dto.ReceiverId, (dto.IsHomePlay) ? "home" : "away");
                }
            }
            // Ensure rusher exists for rushing play.
            else
            {
                if (dto.RusherId is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Rusher ID cannot be null.");
                }
                Player? rusher = await this.Db.Players.FindAsync(dto.RusherId);
                PlayerGame? rusherGame = await this.Db.PlayerGames.FindAsync(dto.RusherId, dto.IsHomePlay);
                if (rusher is null)
                {
                    return ApiResponseDto<GameDto>.CreateError("Rusher does not exist.");
                }
                if (rusherGame is null)
                {
                    await AddPlayerToRoster(gameId, (int)dto.RusherId, (dto.IsHomePlay) ? "home" : "away");
                }
            }

            return ApiResponseDto<GameDto>.CreateSuccess(null);
        }
    }
}
