import { Players } from '@prisma/client';

const PlayerEncoder = (player: Players) => ({
  id: player.id,
  first_name: player.first_name,
  last_name: player.last_name,
  avatar: player.avatar,
});

export default PlayerEncoder;
