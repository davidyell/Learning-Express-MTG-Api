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

  const manacost = parseFloat(query.manacost as string);

  if (query.manacost && isFinite(manacost)) {
    params.manacost = manacost;
  } else {
    delete params.manacost;
  }

  return params;
};

export default parseQueryParams;
