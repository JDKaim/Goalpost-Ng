using Goalpost.WebApi.Entities;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Goalpost.WebApi.Helpers
{
    public static class PlayHelper
    {
        public static void VerifyPlay(CreatePlayDto dto)
        {
            bool isPassingPlay = dto.Type == PlayType.Passing || dto.Type == PlayType.OnePointPass || dto.Type == PlayType.TwoPointPass;
            bool isRushingPlay = dto.Type == PlayType.Rushing || dto.Type == PlayType.OnePointRush || dto.Type == PlayType.TwoPointRush;
            if (dto.Down > 4 || dto.Down < 1)
            {
                throw new Exception($"{nameof(dto.Down)} must be between 1 and 4.");
            }
            if (isPassingPlay)
            {
                if (dto.PasserId == null)
                {
                    throw new Exception($"{nameof(dto.PasserId)} needs to exist on passing play.");
                }
                if (dto.ReceiverId == null && !dto.IsSack)
                {
                    throw new Exception($"{nameof(dto.ReceiverId)} needs to exist on passing play.");
                }
            }
            else if (isRushingPlay)
            {
                if (dto.RusherId == null)
                {
                    throw new Exception($"{nameof(dto.RusherId)} needs to exist on rushing play.");
                }
            }
            else
            {
                throw new Exception("Unsupported play type.");
            }

            if (dto.TurnoverType == TurnoverType.Interception || dto.TurnoverType == TurnoverType.Fumble)
            {
                if (dto.TurnoverPlayerId == null)
                {
                    throw new Exception($"{nameof(dto.TurnoverPlayerId)} needs to exist on turnover play.");
                }
            }
            int endYardLine = dto.YardLine - dto.Yardage;
            if (endYardLine < 0 || endYardLine > 40)
            {
                throw new Exception("Play must end between the 0 and 40 yard line.");
            }
            bool isScoringPlay = (endYardLine == 0) || (endYardLine == 40);
            if (!isScoringPlay)
            {
                if (dto.FlagPullerId == null)
                {
                    throw new Exception($"{nameof(dto.FlagPullerId)} needs to exist on non-scoring play.");
                }
            }
            else if (endYardLine == 40)
            {
                if (dto.TurnoverPlayerId == null && (dto.IsSack || dto.IsCompletedPass || isRushingPlay))
                {
                    if (dto.FlagPullerId == null)
                    {
                        throw new Exception($"{nameof(dto.FlagPullerId)} needs to exist on safety play.");
                    }
                }
                else if (isPassingPlay && (!dto.IsCompletedPass || dto.TurnoverType == TurnoverType.None))
                {

                }
                else
                {
                    if (dto.FlagPullerId != null)
                    {
                        throw new Exception($"{nameof(dto.FlagPullerId)} should not exist on defensive score.");
                    }
                }
            }
            else
            {
                if (dto.FlagPullerId != null)
                {
                    throw new Exception($"{nameof(dto.FlagPullerId)} should not exist on offensive score.");
                }
            }

        }
    }
}
