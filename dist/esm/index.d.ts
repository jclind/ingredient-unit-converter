export type ConversionResult = {
    quantity: number;
    unit: string;
};
export type UnitInfo = {
    name: string;
    aliases: string[];
};
/**
 * Converts a quantity from one ingredient unit to another.
 * @param quantity - must be a finite number greater than 0
 * @param from - the starting unit (e.g. 'tbsp', 'oz')
 * @param to - the target unit, defaults to 'grams'
 * @returns { quantity: number, unit: string }
 * @throws if quantity is not a positive finite number, or either unit is unrecognised
 */
declare const converter: (quantity: number, from: string, to?: string) => ConversionResult;
/** Returns true if the given string resolves to a known unit. */
declare const isValidUnit: (unit: string) => boolean;
/**
 * Returns the canonical (first) name for a unit, or null if unrecognised.
 * Useful for normalising aliases: getCanonicalUnit('tbsp') === 'tablespoon'
 */
declare const getCanonicalUnit: (unit: string) => string | null;
/** Returns all supported units, each with its canonical name and list of aliases. */
declare const getSupportedUnits: () => UnitInfo[];
export { converter, converter as convert, isValidUnit, getCanonicalUnit, getSupportedUnits };
