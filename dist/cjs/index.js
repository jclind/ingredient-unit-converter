"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.converter = void 0;
const units_js_1 = require("./src/units.js");
/**
 * Converts a quantity from one ingredient unit to another.
 * @param quantity - must be greater than 0
 * @param from - the starting unit (e.g. 'tbsp', 'oz')
 * @param to - the target unit, defaults to 'grams'
 * @returns { quantity: number, unit: string }
 * @throws if quantity <= 0 or either unit is unrecognised
 */
const converter = (quantity, from, to = 'grams') => {
    if (quantity <= 0)
        throw new Error('Quantity must be greater than 0');
    const fromVal = from.length > 1 ? from.toLowerCase() : from;
    const toVal = to.length > 1 ? to.toLowerCase() : to;
    const { grams: fromUnitGrams } = units_js_1.units.find(unit => unit.names.includes(fromVal)) ?? {};
    const { grams: toUnitGrams } = units_js_1.units.find(unit => unit.names.includes(toVal)) ?? {};
    if (!fromUnitGrams)
        throw new Error(`Unsupported unit '${fromVal}'`);
    if (!toUnitGrams)
        throw new Error(`Unsupported unit '${toVal}'`);
    const ratio = fromUnitGrams / toUnitGrams;
    const total = ratio * quantity;
    return { quantity: total, unit: to };
};
exports.converter = converter;
exports.convert = converter;
