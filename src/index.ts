import { units } from './units.js'

const converter = (quantity: number, from: string, to: string = 'grams') => {
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

export default converter
