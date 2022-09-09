import { Player } from '@prisma/client';

const playerEncoder = (player: Player) => ({
  id: player.id,
  first_name: player.first_name,
  last_name: player.last_name,
  avatar: player.avatar,
});

export default playerEncoder;
