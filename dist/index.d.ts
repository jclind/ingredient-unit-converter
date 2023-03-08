/**
 * Takes the quantity of the original unit and converts it to another given unit
 * @param {Number} quantity The quantity of the from unit
 * @param {String} from the original unit to be converted
 * @param {String} to the unit to be converted to
 * @returns {Object} returns error if either unit doesn't exist or quantity is invalid or returns converted quantity and unit
 */
declare const converter: (quantity: number, from: string, to?: string) => {
    quantity: number;
    unit: string;
} | {
    error: string;
};
export { converter };
