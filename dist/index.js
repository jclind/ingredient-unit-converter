"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converter = void 0;
const units_js_1 = require("./src/units.js");
/**
 * Takes the quantity of the original unit and converts it to another given unit
 * @param {Number} quantity The quantity of the from unit
 * @param {String} from the original unit to be converted
 * @param {String} to the unit to be converted to
 * @returns {Object} returns error if either unit doesn't exist or quantity is invalid or returns converted quantity and unit
 */
const converter = (quantity, from, to = 'grams') => {
    var _a, _b;
    if (quantity <= 0)
        return { error: `Quantity must be greater than 0` };
    const fromVal = from.length > 1 ? from.toLowerCase() : from;
    const toVal = to.length > 1 ? to.toLowerCase() : to;
    const { grams: fromUnitGrams } = (_a = units_js_1.units.find(unit => unit.names.includes(fromVal))) !== null && _a !== void 0 ? _a : {};
    const { grams: toUnitGrams } = (_b = units_js_1.units.find(unit => unit.names.includes(toVal))) !== null && _b !== void 0 ? _b : {};
    if (!fromUnitGrams)
        return { error: `Unit unknown: ${fromVal}` };
    if (!toUnitGrams)
        return { error: `Unit unknown: ${toVal}` };
    const ratio = fromUnitGrams / toUnitGrams;
    const total = ratio * quantity;
    return { quantity: total, unit: to };
};
exports.converter = converter;
