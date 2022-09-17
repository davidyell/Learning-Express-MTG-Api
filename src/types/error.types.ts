import type { DeckValidationErrors } from './deck.types';

export type GenericError = {
  data: {},
  error: {
    message: string;
    code: string;
  }
}

export type ValidationError = {
  data: {},
  error: {
    message: string;
    code: string;
  } & DeckValidationErrors
}
