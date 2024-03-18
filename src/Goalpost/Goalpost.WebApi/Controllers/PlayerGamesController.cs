//using Goalpost.WebApi.Data;
//using Goalpost.WebApi.DTOs.Requests;
//using Goalpost.WebApi.DTOs.Responses;
//using Goalpost.WebApi.Entities;
//using Goalpost.WebApi.Entities.Identity;
//using Goalpost.WebApi.Extensions;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Authorization.Infrastructure;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace Goalpost.WebApi.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class PlayerGamesController : ControllerBase
//    {
//        private readonly ILogger<PlayerGamesController> _logger;
//        private readonly ApplicationDbContext Db;

//        public PlayerGamesController(ILogger<PlayerGamesController> logger, ApplicationDbContext db)
//        {
//            this._logger = logger;
//            this.Db = db;
//        }

//        [HttpPost("")]
//        [Authorize(Roles = ApplicationRoles.Administrator)]
//        public async Task<ApiResponseDto<PlayerGameDto>> CreatePlayerGame(CreatePlayerGameDto dto)
//        {
//            string id = this.User.GetUserId();
//            Player? player = await this.Db.Players.FindAsync(dto.PlayerId);
//            Game? game = await this.Db.Games.FindAsync(dto.GameId);

//            if (player is null)
//            {
//                return ApiResponseDto<PlayerGameDto>.CreateError("Player does not exist.");
//            }

//            if (game is null)
//            {
//                return ApiResponseDto<PlayerGameDto>.CreateError("Game does not exist.");
//            }

//            PlayerGame playerGame = new PlayerGame()
//            {
//                PlayerId = dto.PlayerId,
//                Player = player,
//                GameId = dto.GameId,
//                Game = game,
//                IsHome = dto.IsHome,
//                IsCurrent = dto.IsCurrent,
//            };
//            this.Db.PlayerGames.Add(playerGame);
//            await this.Db.SaveChangesAsync();
//            PlayerGameDto playerGameDto = new PlayerGameDto()
//            {
//                PlayerId = playerGame.PlayerId,
//                GameId = playerGame.GameId,
//                IsHome = playerGame.IsHome,
//                IsCurrent = playerGame.IsCurrent,
//                PointsScored = playerGame.PointsScored,
//                PassingAttempts = playerGame.PassingAttempts,
//                PassingCompletions = playerGame.PassingCompletions,
//                PassingYardage = playerGame.PassingYardage,
//                PassingTds = playerGame.PassingTds,
//                PassingOnePointConversions = playerGame.PassingOnePointConversions,
//                PassingTwoPointConversions = playerGame.PassingTwoPointConversions,
//                RushingAttempts = playerGame.RushingAttempts,
//                RushingYardage = playerGame.RushingYardage,
//                RushingTds = playerGame.RushingTds,
//                RushingOnePointConversions = playerGame.RushingOnePointConversions,
//                RushingTwoPointConversions = playerGame.RushingTwoPointConversions,
//                ReceivingTargets = playerGame.ReceivingTargets,
//                ReceivingCompletions = playerGame.ReceivingCompletions,
//                ReceivingYardage = playerGame.ReceivingYardage,
//                ReceivingTds = playerGame.ReceivingTds,
//                ReceivingOnePointConversions = playerGame.ReceivingOnePointConversions,
//                ReceivingTwoPointConversions = playerGame.ReceivingTwoPointConversions,
//                FlagPulls = playerGame.FlagPulls,
//                PassingInterceptions = playerGame.PassingInterceptions,
//                DefensiveInterceptions = playerGame.DefensiveInterceptions,
//                OffensiveFumbles = playerGame.OffensiveFumbles,
//                DefensiveFumbles = playerGame.DefensiveFumbles,
//                OffensiveSacks = playerGame.OffensiveSacks,
//                DefensiveSacks = playerGame.DefensiveSacks,
//                DefensiveTds = playerGame.DefensiveTds,
//                DefensiveOnePointConversions = playerGame.DefensiveOnePointConversions,
//                DefensiveTwoPointConversions = playerGame.DefensiveTwoPointConversions,
//            };
//            return ApiResponseDto<PlayerGameDto>.CreateSuccess(playerGameDto);
//        }

//        [HttpGet("{id}")]
//        public async Task<ApiResponseDto<PlayerGameDto>> GetPlayerGame(GetPlayerGameDto getPlayerGameDto)
//        {
//            PlayerGame? playerGame = await this.Db.PlayerGames.FindAsync(getPlayerGameDto);
//            if (playerGame is null)
//            {
//                return ApiResponseDto<PlayerGameDto>.CreateSuccess(null);
//            }
//            PlayerGameDto playerGameDto = new PlayerGameDto()
//            {
//                PlayerId = playerGame.PlayerId,
//                GameId = playerGame.GameId,
//                IsHome = playerGame.IsHome,
//                IsCurrent = playerGame.IsCurrent,
//                PointsScored = playerGame.PointsScored,
//                PassingAttempts = playerGame.PassingAttempts,
//                PassingCompletions = playerGame.PassingCompletions,
//                PassingYardage = playerGame.PassingYardage,
//                PassingTds = playerGame.PassingTds,
//                PassingOnePointConversions = playerGame.PassingOnePointConversions,
//                PassingTwoPointConversions = playerGame.PassingTwoPointConversions,
//                RushingAttempts = playerGame.RushingAttempts,
//                RushingYardage = playerGame.RushingYardage,
//                RushingTds = playerGame.RushingTds,
//                RushingOnePointConversions = playerGame.RushingOnePointConversions,
//                RushingTwoPointConversions = playerGame.RushingTwoPointConversions,
//                ReceivingTargets = playerGame.ReceivingTargets,
//                ReceivingCompletions = playerGame.ReceivingCompletions,
//                ReceivingYardage = playerGame.ReceivingYardage,
//                ReceivingTds = playerGame.ReceivingTds,
//                ReceivingOnePointConversions = playerGame.ReceivingOnePointConversions,
//                ReceivingTwoPointConversions = playerGame.ReceivingTwoPointConversions,
//                FlagPulls = playerGame.FlagPulls,
//                PassingInterceptions = playerGame.PassingInterceptions,
//                DefensiveInterceptions = playerGame.DefensiveInterceptions,
//                OffensiveFumbles = playerGame.OffensiveFumbles,
//                DefensiveFumbles = playerGame.DefensiveFumbles,
//                OffensiveSacks = playerGame.OffensiveSacks,
//                DefensiveSacks = playerGame.DefensiveSacks,
//                DefensiveTds = playerGame.DefensiveTds,
//                DefensiveOnePointConversions = playerGame.DefensiveOnePointConversions,
//                DefensiveTwoPointConversions = playerGame.DefensiveTwoPointConversions,
//            };
//            return ApiResponseDto<PlayerGameDto>.CreateSuccess(playerGameDto);
//        }

//        [HttpDelete("{id}")]
//        [Authorize(Roles = ApplicationRoles.Administrator)]
//        public async Task<ApiResponseDto<bool>> DeletePlayer(int id)
//        {
//            Player? player = await this.Db.Players.FindAsync(id);
//            if (player is not null)
//            {
//                this.Db.Players.Remove(player);
//                await this.Db.SaveChangesAsync();
//            }
//            return ApiResponseDto<bool>.CreateSuccess(true);
//        }

//        [HttpPut("{id}")]
//        [Authorize(Roles = ApplicationRoles.Administrator)]
//        public async Task<ApiResponseDto<PlayerDto>> UpdatePlayer(UpdatePlayerDto dto, int id)
//        {
//            Player? player = await this.Db.Players.FindAsync(id);
//            if (player is null)
//            {
//                return ApiResponseDto<PlayerDto>.CreateError("Player does not exist.");
//            }
//            player.Name = dto.Name ?? player.Name;
//            await this.Db.SaveChangesAsync();
//            PlayerDto playerDto = new PlayerDto()
//            {
//                Name = player.Name,
//                Id = player.Id,
//            };
//            return ApiResponseDto<PlayerDto>.CreateSuccess(playerDto);
//        }

//        [HttpPost("Search")]
//        public async Task<ApiResponseDto<List<PlayerDto>>> SearchPlayer(SearchPlayersDto dto)
//        {
//            var query = this.Db.Players.AsQueryable();

//            if (dto.Name is not null)
//            {
//                query = query.Where((player) => player.Name == dto.Name);
//            }

//            if (dto.SortBy is null)
//            {
//                dto.SortBy = "Id";
//            }

//            switch (dto.SortBy)
//            {
//                case "Id":
//                    query = query.OrderBy((game) => game.Id);
//                    break;
//                default:
//                    throw new BadHttpRequestException($"SortBy parameter '{dto.SortBy}' unsupported.");
//            }

//            return ApiResponseDto<List<PlayerDto>>.CreateSuccess(await query.Select((player) =>
//            new PlayerDto()
//            {
//                Name = player.Name,
//                Id = player.Id,
//            }).ToListAsync());
//        }
//    }
//}
