import { units } from './units.js'

/**
 * Takes the quantity of the original unit and converts it to another given unit
 * @param {Number} quantity The quantity of the from unit
 * @param {String} from the original unit to be converted
 * @param {String} to the unit to be converted to
 * @returns {Object|number} returns error if either unit doesn't exist or quantity is invalid or returns converted unit amount
 */
const converter = (
  quantity: number,
  from: string,
  to: string = 'grams'
): number | { error: string } => {
  if (quantity <= 0) return { error: `Quantity must be greater than 0` }

  const fromVal = from.length > 1 ? from.toLowerCase() : from
  const toVal = to.length > 1 ? to.toLowerCase() : to

  const { grams: fromUnitGrams } =
    units.find(unit => unit.names.includes(fromVal)) ?? {}
  const { grams: toUnitGrams } =
    units.find(unit => unit.names.includes(toVal)) ?? {}

  if (!fromUnitGrams) return { error: `Unit unknown: ${fromVal}` }
  if (!toUnitGrams) return { error: `Unit unknown: ${toVal}` }

  const ratio = fromUnitGrams / toUnitGrams
  const total = ratio * quantity
  return total
}

export { converter }
