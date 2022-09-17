import type { Query } from 'express-serve-static-core';
import { isFinite } from 'lodash';
import { Prisma } from '@prisma/client';
import { CardColor, CardSearchFilters } from '../types/card.types';

/**
 * Parse request query params into a filter object casting to correct types
 *
 * @param query Express.js `request.query` object
 * @returns Parsed filter object
 */
const parseQueryParams = (query: Query): CardSearchFilters => {
  const params: CardSearchFilters = { ...query };

  const manacost = parseFloat(query.manacost as string);

  if (query.manacost && isFinite(manacost)) {
    params.manacost = manacost;
  } else {
    delete params.manacost;
  }

  if (query.color) {
    // TODO: This doesn't feel like the right way to use a string enum
    const index = Object.values(CardColor).indexOf(query.color as unknown as CardColor);
    if (index !== -1) {
      params.color = Object.keys(CardColor)[index] as CardColor;
    }
  } else {
    delete params.color;
  }

  return params;
};

/**
 * Create a Prisma where clause object based on the parsed query params object
 *
 * @param filter The parsed query params filter object
 * @returns Compiled where clause object
 */
const filterToWhereClause = (filter: CardSearchFilters): Prisma.CardWhereInput => {
  const whereClause: Prisma.CardWhereInput = {};

  whereClause.name = (filter.name) ? { contains: filter.name } : undefined;
  whereClause.colors = (filter.color) ? { contains: filter.color } : undefined;
  whereClause.types = (filter.type) ? { contains: filter.type } : undefined;
  whereClause.convertedManaCost = (filter.manacost) ? { equals: filter.manacost } : undefined;
  whereClause.keywords = (filter.ability) ? { contains: filter.ability } : undefined;
  whereClause.power = (filter.power) ? { equals: filter.power } : undefined;
  whereClause.toughness = (filter.toughness) ? { equals: filter.toughness } : undefined;
  whereClause.rarity = (filter.rarity) ? { equals: filter.rarity } : undefined;

  return whereClause;
};

export { parseQueryParams, filterToWhereClause };
