import type { Player } from '@prisma/client';

const playerEncoder = (player: Pick<Player, 'id' | 'first_name' | 'last_name' | 'avatar'>) => ({
  id: player.id,
  first_name: player.first_name,
  last_name: player.last_name,
  avatar: player.avatar,
});

export default playerEncoder;
