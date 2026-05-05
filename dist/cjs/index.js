"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedUnits = exports.getCanonicalUnit = exports.isValidUnit = exports.convert = exports.converter = void 0;
const units_js_1 = require("./src/units.js");
const lookupUnit = (input) => {
    const s = input.trim();
    if (s.length === 1) {
        return units_js_1.units.find(unit => unit.names.includes(s));
    }
    // Try exact case first (preserves mixed-case abbreviations like 'T.', 'Ts', 'mL')
    return (units_js_1.units.find(unit => unit.names.includes(s)) ??
        units_js_1.units.find(unit => unit.names.includes(s.toLowerCase())));
};
/**
 * Converts a quantity from one ingredient unit to another.
 * @param quantity - must be a finite number greater than 0
 * @param from - the starting unit (e.g. 'tbsp', 'oz')
 * @param to - the target unit, defaults to 'grams'
 * @returns { quantity: number, unit: string }
 * @throws if quantity is not a positive finite number, or either unit is unrecognised
 */
const converter = (quantity, from, to = 'grams') => {
    if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0)
        throw new Error('Quantity must be greater than 0');
    const fromUnit = lookupUnit(from);
    const toUnit = lookupUnit(to);
    if (!fromUnit)
        throw new Error(`Unsupported unit '${from.trim()}'`);
    if (!toUnit)
        throw new Error(`Unsupported unit '${to.trim()}'`);
    return { quantity: (fromUnit.grams / toUnit.grams) * quantity, unit: to };
};
exports.converter = converter;
exports.convert = converter;
/** Returns true if the given string resolves to a known unit. */
const isValidUnit = (unit) => lookupUnit(unit) !== undefined;
exports.isValidUnit = isValidUnit;
/**
 * Returns the canonical (first) name for a unit, or null if unrecognised.
 * Useful for normalising aliases: getCanonicalUnit('tbsp') === 'tablespoon'
 */
const getCanonicalUnit = (unit) => {
    const found = lookupUnit(unit);
    return found ? found.names[0] : null;
};
exports.getCanonicalUnit = getCanonicalUnit;
/** Returns all supported units, each with its canonical name and list of aliases. */
const getSupportedUnits = () => units_js_1.units.map(unit => ({ name: unit.names[0], aliases: unit.names.slice(1) }));
exports.getSupportedUnits = getSupportedUnits;
