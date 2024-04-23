import { Player } from "@league-site";
import { PlayerPipe } from "./player.pipe";

describe('PlayerPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new PlayerPipe();

  it('transforms Player to name', () => {
    const player = <Player> {
      name: "First Last"
    };

    expect(pipe.transform(player)).toBe("First Last");
  });
});
