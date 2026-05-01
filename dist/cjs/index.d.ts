/**
 * Converts a quantity from one ingredient unit to another.
 * @param quantity - must be greater than 0
 * @param from - the starting unit (e.g. 'tbsp', 'oz')
 * @param to - the target unit, defaults to 'grams'
 * @returns { quantity: number, unit: string }
 * @throws if quantity <= 0 or either unit is unrecognised
 */
declare const converter: (quantity: number, from: string, to?: string) => {
    quantity: number;
    unit: string;
};
export { converter, converter as convert };
