import Player, { Direction } from "../engine/components/Player";

import PlayerSpriteUrl from "../assets/player.png";

export default new Player([0, 0], Direction.Down, PlayerSpriteUrl, 200);
