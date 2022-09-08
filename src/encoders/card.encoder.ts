import { Cards } from '@prisma/client';

const cardEncoder = (card: Cards) => ({
  id: card.id,
  border_color: card.borderColor,
  color_identity: card.colorIdentity,
  color_indicator: card.colorIndicator,
  colors: card.colors,
  converted_mana_cost: card.convertedManaCost,
  flavor_name: card.flavorName,
  flavor_text: card.flavorText,
  keywords: card.keywords,
  layout: card.layout,
  mana_cost: card.manaCost,
  mana_value: card.manaValue,
  multiverseId: card.multiverseId,
  name: card.name,
  power: card.power,
  rarity: card.rarity,
  set_code: card.setCode,
  subtypes: card.subtypes,
  supertypes: card.supertypes,
  text: card.text,
  toughness: card.toughness,
  type: card.type,
  types: card.types,
  uuid: card.uuid,
});

export default cardEncoder;
