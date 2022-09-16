import type { Query } from 'express-serve-static-core';
import { isFinite } from 'lodash';
import type { CardSearchFilters } from '../types/card.types';

/**
 * Parse request query params into a filter object casting to correct types
 *
 * @param query Express.js `request.query` object
 * @returns Parsed filter object
 */
const parseQueryParams = (query: Query): CardSearchFilters => {
  const params: CardSearchFilters = { ...query };

  const manacost = parseInt(query.manacost as string, 10);
  const power = parseInt(query.power as string, 10);
  const toughness = parseInt(query.toughness as string, 10);

  if (query.manacost && isFinite(manacost)) {
    params.manacost = manacost;
  } else {
    delete params.manacost;
  }
  if (query.power && isFinite(power)) {
    params.power = power;
  } else {
    delete params.power;
  }
  if (query.toughness && isFinite(toughness)) {
    params.toughness = toughness;
  } else {
    delete params.toughness;
  }

  return params;
};

export default parseQueryParams;
