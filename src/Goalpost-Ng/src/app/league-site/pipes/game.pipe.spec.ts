import { Game } from "@league-site";
import { GamePipe } from "./game.pipe";

describe('GamePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new GamePipe();

  it('transforms Player to name', () => {
    const game = <Game> {
      homeTeamCode: 'HOME',
      awayTeamCode: 'AWAY'
    };

    expect(pipe.transform(game)).toBe("AWAY @ HOME");
  });
});
