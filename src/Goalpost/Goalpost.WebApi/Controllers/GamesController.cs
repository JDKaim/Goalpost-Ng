using Goalpost.WebApi.Data;
using Goalpost.WebApi.DTOs.Requests;
using Goalpost.WebApi.DTOs.Responses;
using Goalpost.WebApi.Entities;
using Goalpost.WebApi.Entities.Identity;
using Goalpost.WebApi.Extensions;
using Goalpost.WebApi.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.ExceptionServices;

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
        //[Authorize(Roles = ApplicationRoles.Administrator)]
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

        [HttpPost("{gameId}/Roster/{team}")]
        public async Task<ApiResponseDto<PlayerGameDto>> AddPlayerToRoster(int gameId, string team, IdDto playerId)
        {
            if (team != "home" && team != "away")
            {
                return ApiResponseDto<PlayerGameDto>.CreateError("Team must be 'home' or 'away'.");
            }
            bool isHome = team == "home";
            PlayerGame? playerGame = await this.Db.PlayerGames.FindAsync(playerId.Id, gameId, isHome);
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
            Player? player = await this.Db.Players.FindAsync(playerId.Id);
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

        [HttpDelete("{gameId}/Roster/{team}/{playerId}")]
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

        [HttpGet("{gameId}/Roster/{team}")]
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

        [HttpPost("SearchPlayerGames")]
        public async Task<ApiResponseDto<List<PlayerGameDto>>> SearchPlayerGames(SearchPlayerGamesDto dto)
        {
            var query = this.Db.PlayerGames.AsQueryable();

            if (dto.GameId is not null)
            {
                query = query.Where((playerGame) => playerGame.GameId == dto.GameId);
            }

            if (dto.PlayerId is not null)
            {
                query = query.Where((playerGame) => playerGame.PlayerId == dto.PlayerId);
            }

            if (dto.SortBy is null)
            {
                dto.SortBy = "PointsScored";
            }

            switch (dto.SortBy)
            {
                case "PointsScored":
                    query = query.OrderBy((game) => game.PointsScored);
                    break;
                case "PassingAttempts":
                    query = query.OrderBy((game) => game.PassingAttempts);
                    break;
                default:
                    throw new BadHttpRequestException($"SortBy parameter '{dto.SortBy}' unsupported.");
            }

            return ApiResponseDto<List<PlayerGameDto>>.CreateSuccess(await query.Select((playerGame) => playerGame.ToDto()).ToListAsync());
        }

        [HttpPost("{gameId}/Play")]
        public async Task<ApiResponseDto<PlayDto>> AddPlay(int gameId, CreatePlayDto dto)
        {
            PlayHelper.VerifyPlay(dto);

            // Check that game exists.
            Game? game = await this.Db.Games.FindAsync(gameId);
            if (game is null)
            {
                return ApiResponseDto<PlayDto>.CreateError("Game does not exist.");
            }
            if (game.Status != GameStatus.Ongoing && game.Status != GameStatus.Final)
            {
                return ApiResponseDto<PlayDto>.CreateError("Game is ineligible for plays to be added.");
            }

            Play play = new Play()
            {
                Down = dto.Down,
                Game = game,
                Index = DateTime.UtcNow.Ticks,
                IsCompletedPass = dto.IsCompletedPass,
                IsHomePlay = dto.IsHomePlay,
                IsSack = dto.IsSack,
                Type = dto.Type,
                TurnoverType = dto.TurnoverType,
                Yardage = dto.Yardage,
                YardLine = dto.YardLine
            };


            if (dto.PasserId != null)
            {
                play.Passer = await this.Db.PlayerGames
                    .Where((playerGame) => playerGame.GameId == game.Id && playerGame.PlayerId == dto.PasserId && playerGame.IsHome == dto.IsHomePlay && playerGame.IsCurrent)
                    .Select((player) => player.Player)
                    .FirstOrDefaultAsync();
                if (play.Passer == null)
                {
                    return ApiResponseDto<PlayDto>.CreateError("Passing player was not found on this roster.");
                }
            }
            if (dto.RusherId != null)
            {
                play.Rusher = await this.Db.PlayerGames
                    .Where((playerGame) => playerGame.GameId == game.Id && playerGame.PlayerId == dto.RusherId && playerGame.IsHome == dto.IsHomePlay && playerGame.IsCurrent)
                    .Select((player) => player.Player)
                    .FirstOrDefaultAsync();
                if (play.Rusher == null)
                {
                    return ApiResponseDto<PlayDto>.CreateError("Rushing player was not found on this roster.");
                }
            }
            if (dto.ReceiverId != null)
            {
                play.Receiver = await this.Db.PlayerGames.Where((playerGame) => playerGame.GameId == game.Id && playerGame.PlayerId == dto.ReceiverId && playerGame.IsHome == dto.IsHomePlay && playerGame.IsCurrent).Select((player) => player.Player).FirstOrDefaultAsync();
                if (play.Receiver == null)
                {
                    return ApiResponseDto<PlayDto>.CreateError("Receiving player was not found on this roster.");
                }
            }
            if (dto.TurnoverPlayerId != null)
            {
                play.TurnoverPlayer = await this.Db.PlayerGames.Where((playerGame) => playerGame.GameId == game.Id && playerGame.PlayerId == dto.TurnoverPlayerId && playerGame.IsHome != dto.IsHomePlay && playerGame.IsCurrent).Select((player) => player.Player).FirstOrDefaultAsync();
                if (play.TurnoverPlayer == null)
                {
                    return ApiResponseDto<PlayDto>.CreateError("Turnover player was not found on this roster.");
                }
            }
            if (dto.FlagPullerId != null)
            {
                bool flagPullerTeam = !dto.IsHomePlay;
                if (dto.TurnoverPlayerId != null)
                {
                    flagPullerTeam = !flagPullerTeam;
                }
                play.FlagPuller = await this.Db.PlayerGames.Where((playerGame) => playerGame.GameId == game.Id && playerGame.PlayerId == dto.FlagPullerId && playerGame.IsHome != flagPullerTeam && playerGame.IsCurrent).Select((player) => player.Player).FirstOrDefaultAsync();
                if (play.FlagPuller == null)
                {
                    return ApiResponseDto<PlayDto>.CreateError("Flag pulling player was not found on this roster.");
                }
            }

            int endYardLine = dto.YardLine - dto.Yardage;
            if (endYardLine == 0)
            {
                switch (dto.Type)
                {
                    case PlayType.Passing:
                    case PlayType.Rushing:
                        play.Points = 6;
                        break;
                    case PlayType.OnePointPass:
                    case PlayType.OnePointRush:
                        play.Points = 1;
                        break;
                    case PlayType.TwoPointPass:
                    case PlayType.TwoPointRush:
                        play.Points = 2;
                        break;
                }
            }
            bool isPassingPlay = play.Type == PlayType.Passing || play.Type == PlayType.OnePointPass || play.Type == PlayType.TwoPointPass;
            if (endYardLine == 40 && (!isPassingPlay || play.IsCompletedPass || play.IsSack))
            {
                switch (dto.Type)
                {
                    case PlayType.Passing:
                    case PlayType.Rushing:
                        play.Points = 6;
                        break;
                    case PlayType.OnePointPass:
                    case PlayType.OnePointRush:
                        play.Points = 1;
                        break;
                    case PlayType.TwoPointPass:
                    case PlayType.TwoPointRush:
                        play.Points = 2;
                        break;
                }
                if (dto.TurnoverPlayerId == null)
                {
                    play.Points = 2;
                }
            }

            this.Db.Plays.Add(play);
            await this.Db.SaveChangesAsync();

            PlayDto playDto = new PlayDto()
            {
                Id = play.Id,
                Index = play.Index,
                IsHomePlay = play.IsHomePlay,
                Type = play.Type,
                YardLine = play.YardLine,
                Down = play.Down,
                Points = play.Points,
                Yardage = play.Yardage,
                IsCompletedPass = play.IsCompletedPass,
                PasserId = dto.PasserId,
                RusherId = dto.RusherId,
                ReceiverId = dto.ReceiverId,
                TurnoverType = dto.TurnoverType,
                FlagPullerId = dto.FlagPullerId,
                TurnoverPlayerId = dto.TurnoverPlayerId,
                IsSack = play.IsSack
            };
            await UpdateGameStatsAsync(play);

            return ApiResponseDto<PlayDto>.CreateSuccess(playDto);
        }

        [HttpGet("Plays/{playId}")]
        public async Task<ApiResponseDto<PlayDto>> GetPlay(int playId)
        {
            Play? play = await this.Db.Plays.FirstAsync((play) => play.Id == playId);
            if (play is null)
            {
                return ApiResponseDto<PlayDto>.CreateError("Play not found.");
            }
            return ApiResponseDto<PlayDto>.CreateSuccess(play.ToDto());
        }

        [HttpPost("Plays/Search")]
        public async Task<ApiResponseDto<List<PlayDto>>> SearchPlays(SearchPlaysDto dto)
        {
            var query = this.Db.Plays.AsQueryable();

            if (dto.GameId is not null)
            {
                query = query.Where((play) => play.Game.Id == dto.GameId);
            }

            if (dto.PlayerId is not null)
            {
                query = query.Where((play) => (((play.Passer != null) && (play.Passer.Id == dto.PlayerId)) ||
                ((play.Rusher != null) && (play.Rusher.Id == dto.PlayerId)) ||
                ((play.Receiver != null) && (play.Receiver.Id == dto.PlayerId)) ||
                ((play.TurnoverPlayer != null) && (play.TurnoverPlayer.Id == dto.PlayerId)) ||
                ((play.FlagPuller != null) && (play.FlagPuller.Id == dto.PlayerId))));
            }

            if (dto.SortBy is null)
            {
                dto.SortBy = "Index";
            }

            switch (dto.SortBy)
            {
                case "Index":
                    query = query.OrderBy((play) => play.Index);
                    break;
                case "Points":
                    query = query.OrderBy((game) => game.Points);
                    break;
                default:
                    throw new BadHttpRequestException($"SortBy parameter '{dto.SortBy}' unsupported.");
            }

            return ApiResponseDto<List<PlayDto>>.CreateSuccess(await query.Select((play) => play.ToDto()).ToListAsync());
        }

        [HttpDelete("Plays/{id}")]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<ApiResponseDto<bool>> DeletePlay(int id)
        {
            Play? play = await this.Db.Plays.FirstOrDefaultAsync(play => play.Id == id);
            if (play is not null)
            {
                this.Db.Plays.Remove(play);
                await this.Db.SaveChangesAsync();
                await UpdateGameStatsAsync(play.GameId);
            }
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        [HttpPost("List")]
        public async Task<ApiResponseDto<List<GameDto>>> GetGames(int[] ids)
        {
            if (!ids.Any())
            {
                return ApiResponseDto<List<GameDto>>.CreateSuccess(new List<GameDto>());
            }
            return ApiResponseDto<List<GameDto>>.CreateSuccess(await this.Db.Games.Where(game => ids.Contains(game.Id)).Select((game) => game.ToDto()).ToListAsync());
        }

        private async Task UpdateGameStatsAsync(Play play)
        {
            List<Play> plays = await this.Db.Plays.Where((playItem) => playItem.Game.Id == play.Game.Id).ToListAsync();
            await UpdatePlayerGameStatsAsync(play.Passer?.Id, play.Game.Id, play.IsHomePlay, plays);
            await UpdatePlayerGameStatsAsync(play.Rusher?.Id, play.Game.Id, play.IsHomePlay, plays);
            await UpdatePlayerGameStatsAsync(play.Receiver?.Id, play.Game.Id, play.IsHomePlay, plays);
            await UpdatePlayerGameStatsAsync(play.TurnoverPlayer?.Id, play.Game.Id, !play.IsHomePlay, plays);
            if (play.TurnoverPlayer is not null)
            {
                await UpdatePlayerGameStatsAsync(play.FlagPuller?.Id, play.Game.Id, play.IsHomePlay, plays);
            }
            else
            {
                await UpdatePlayerGameStatsAsync(play.FlagPuller?.Id, play.Game.Id, !play.IsHomePlay, plays);
            }

            if (play.Points is not 0)
            {
                bool isHomePoints = (play.IsHomePlay == play.TurnoverPlayer is null);
                bool isPassingPlay = play.Type == PlayType.Passing || play.Type == PlayType.OnePointPass || play.Type == PlayType.TwoPointPass;
                if (play.YardLine - play.Yardage == 40 && (!isPassingPlay || play.IsCompletedPass || play.IsSack) && play.TurnoverType == TurnoverType.None)
                {
                    isHomePoints = !isHomePoints;
                }

                if (isHomePoints)
                {
                    play.Game.HomeScore += play.Points;
                }
                else
                {
                    play.Game.AwayScore += play.Points;
                }
                await this.Db.SaveChangesAsync();
            }
        }

        private async Task UpdateGameStatsAsync(int gameId)
        {
            Game? game = await this.Db.Games.FirstOrDefaultAsync((game) => game.Id == gameId);
            if (game is null)
            {
                return;
            }
            List<Play> plays = await this.Db.Plays.Where((playItem) => playItem.GameId == gameId).ToListAsync();
            List<PlayerGame> homeRoster = await this.Db.PlayerGames.Where((playerGame) => (playerGame.GameId == gameId && playerGame.IsHome)).ToListAsync();
            List<PlayerGame> awayRoster = await this.Db.PlayerGames.Where((playerGame) => (playerGame.GameId == gameId && !playerGame.IsHome)).ToListAsync();
            foreach (var playerGame in homeRoster)
            {
                await UpdatePlayerGameStatsAsync(playerGame.PlayerId, gameId, true, plays);
            }
            foreach (var playerGame in awayRoster)
            {
                await UpdatePlayerGameStatsAsync(playerGame.PlayerId, gameId, false, plays);
            }
            foreach (var play in plays.Where(play => play.Points is not 0))
            {
                bool isHomePoints = (play.IsHomePlay == play.TurnoverPlayer is null);
                bool isPassingPlay = play.Type == PlayType.Passing || play.Type == PlayType.OnePointPass || play.Type == PlayType.TwoPointPass;
                if (play.YardLine - play.Yardage == 40 && (!isPassingPlay || play.IsCompletedPass || play.IsSack) && play.TurnoverType == TurnoverType.None)
                {
                    isHomePoints = !isHomePoints;
                }

                if (isHomePoints)
                {
                    game.HomeScore += play.Points;
                }
                else
                {
                    game.AwayScore += play.Points;
                }
            }
            await this.Db.SaveChangesAsync();
        }

        private async Task UpdatePlayerGameStatsAsync(int? playerId, int gameId, bool isHome, List<Play> plays)
        {
            if (playerId is null)
            {
                return;
            }
            PlayerGame playerGame = await this.Db.PlayerGames.FindAsync(playerId, gameId, isHome) ?? throw new Exception($"{nameof(playerGame)} does not exist.");
            
            PlayHelper.UpdatePlayerStats(plays, playerGame);

            await UpdatePlayerStatsAsync(playerId.Value);
        }

        private async Task UpdatePlayerStatsAsync(int playerId)
        {
            Player? player = await this.Db.Players.FindAsync(playerId);
            if (player == null)
            {
                throw new ArgumentException("Player does not exist.");
            }

            List<PlayerGame> playerGames = await this.Db.PlayerGames.Where((playerGame) => playerGame.Player.Id == playerId).ToListAsync();

            player.Games = playerGames.GroupBy((playerGame) => playerGame.GameId).Count();
            player.DefensiveFumbles = playerGames.Sum((playerGame) => playerGame.DefensiveFumbles);
            player.DefensiveInterceptions = playerGames.Sum((playerGame) => playerGame.DefensiveInterceptions);
            player.DefensiveOnePointConversions = playerGames.Sum((playerGame) => playerGame.DefensiveOnePointConversions);
            player.DefensiveSacks = playerGames.Sum((playerGame) => playerGame.DefensiveSacks);
            player.DefensiveSafeties = playerGames.Sum((playerGame) => playerGame.DefensiveSafeties);
            player.DefensiveTds = playerGames.Sum((playerGame) => playerGame.DefensiveTds);
            player.DefensiveTwoPointConversions = playerGames.Sum((playerGame) => playerGame.DefensiveTwoPointConversions);
            player.FlagPulls = playerGames.Sum((playerGame) => playerGame.FlagPulls);
            player.OffensiveFumbles = playerGames.Sum((playerGame) => playerGame.OffensiveFumbles);
            player.OffensiveSacks = playerGames.Sum((playerGame) => playerGame.OffensiveSacks);
            player.OffensiveSafeties = playerGames.Sum((playerGame) => playerGame.OffensiveSafeties);
            player.PassingAttempts = playerGames.Sum((playerGame) => playerGame.PassingAttempts);
            player.PassingCompletions = playerGames.Sum((playerGame) => playerGame.PassingCompletions);
            player.PassingInterceptions = playerGames.Sum((playerGame) => playerGame.PassingInterceptions);
            player.PassingOnePointConversions = playerGames.Sum((playerGame) => playerGame.PassingOnePointConversions);
            player.PassingTds = playerGames.Sum((playerGame) => playerGame.PassingTds);
            player.PassingTwoPointConversions = playerGames.Sum((playerGame) => playerGame.PassingTwoPointConversions);
            player.PassingYardage = playerGames.Sum((playerGame) => playerGame.PassingYardage);
            player.PointsScored = playerGames.Sum((playerGame) => playerGame.PointsScored);
            player.ReceivingCompletions = playerGames.Sum((playerGame) => playerGame.ReceivingCompletions);
            player.ReceivingOnePointConversions = playerGames.Sum((playerGame) => playerGame.ReceivingOnePointConversions);
            player.ReceivingTargets = playerGames.Sum((playerGame) => playerGame.ReceivingTargets);
            player.ReceivingTds = playerGames.Sum((playerGame) => playerGame.ReceivingTds);
            player.ReceivingTwoPointConversions = playerGames.Sum((playerGame) => playerGame.ReceivingTwoPointConversions);
            player.ReceivingYardage = playerGames.Sum((playerGame) => playerGame.ReceivingYardage);
            player.RushingAttempts = playerGames.Sum((playerGame) => playerGame.RushingAttempts);
            player.RushingOnePointConversions = playerGames.Sum((playerGame) => playerGame.RushingOnePointConversions);
            player.RushingTds = playerGames.Sum((playerGame) => playerGame.RushingTds);
            player.RushingTwoPointConversions = playerGames.Sum((playerGame) => playerGame.RushingTwoPointConversions);
            player.RushingYardage = playerGames.Sum((playerGame) => playerGame.RushingYardage);

            await this.Db.SaveChangesAsync();
        }

    }
}
