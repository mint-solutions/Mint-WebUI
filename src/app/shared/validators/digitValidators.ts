type DigitValidator = (char: string) => boolean;
import { includes } from 'lodash';

const charKeyCode = [];

export const NumericValidator = (char: string) => /[0-9]{1}/.test(char);

export const AllowedKeys = (code: number) => includes([8, 9, 27, 37, 39, 46], code);
export const AllowedCurrencyKeys = (code: number) => includes([8, 9, 27, 37, 39, 46, 190], code);
