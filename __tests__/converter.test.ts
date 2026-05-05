import { describe, it, expect } from 'vitest'
import { converter, convert, isValidUnit, getCanonicalUnit, getSupportedUnits } from '../index'

describe('converter', () => {
  // ── doc examples ──────────────────────────────────────────────────────────

  it('converts 2 tbsp to cup (doc example)', () => {
    const result = converter(2, 'tbsp', 'cup')
    expect(result.quantity).toBeCloseTo(0.125, 2)
    expect(result.unit).toBe('cup')
  })

  it('converts 16 oz to grams with default unit (doc example)', () => {
    const result = converter(16, 'oz')
    expect(result.quantity).toBeCloseTo(453.592, 2)
    expect(result.unit).toBe('grams')
  })

  // ── default target unit ───────────────────────────────────────────────────

  it('defaults to grams', () => {
    const result = converter(1, 'pound')
    expect(result.unit).toBe('grams')
    expect(result.quantity).toBeCloseTo(453.592, 2)
  })

  // ── same-unit round trips ─────────────────────────────────────────────────

  it('returns the same quantity when converting to the same unit', () => {
    expect(converter(5, 'cup', 'cup').quantity).toBeCloseTo(5)
    expect(converter(3, 'tbsp', 'tbsp').quantity).toBeCloseTo(3)
  })

  // ── quantity validation ───────────────────────────────────────────────────

  it('throws when quantity is zero', () => {
    expect(() => converter(0, 'cup')).toThrow('Quantity must be greater than 0')
  })

  it('throws when quantity is negative', () => {
    expect(() => converter(-1, 'kg')).toThrow('Quantity must be greater than 0')
  })

  it('throws when quantity is negative infinity', () => {
    expect(() => converter(-Infinity, 'cup')).toThrow('Quantity must be greater than 0')
  })

  it('throws when quantity is NaN', () => {
    expect(() => converter(NaN, 'cup')).toThrow('Quantity must be greater than 0')
  })

  it('throws when quantity is Infinity', () => {
    expect(() => converter(Infinity, 'cup')).toThrow('Quantity must be greater than 0')
  })

  it('throws when quantity is not a number', () => {
    expect(() => converter('2' as unknown as number, 'cup')).toThrow(
      'Quantity must be greater than 0'
    )
  })

  it('accepts fractional quantities', () => {
    const result = converter(0.5, 'cup', 'tbsp')
    expect(result.quantity).toBeCloseTo(8, 0)
    expect(result.unit).toBe('tbsp')
  })

  // ── unrecognised unit errors ──────────────────────────────────────────────

  it('throws for an unrecognised to-unit', () => {
    expect(() => converter(2, 'kg', 'cans')).toThrow("Unsupported unit 'cans'")
  })

  it('throws for an unrecognised from-unit', () => {
    expect(() => converter(1, 'foobar', 'cup')).toThrow("Unsupported unit 'foobar'")
  })

  it('throws a clear error for an empty string unit', () => {
    expect(() => converter(1, '', 'cup')).toThrow("Unsupported unit ''")
  })

  // ── whitespace trimming ───────────────────────────────────────────────────

  it('trims leading whitespace from unit names', () => {
    expect(converter(1, ' cup', 'grams').quantity).toBeCloseTo(236.588, 0)
  })

  it('trims trailing whitespace from unit names', () => {
    expect(converter(1, 'cup ', 'grams').quantity).toBeCloseTo(236.588, 0)
  })

  it('trims whitespace from both from and to units', () => {
    const result = converter(2, ' tbsp ', ' cup ')
    expect(result.quantity).toBeCloseTo(0.125, 2)
  })

  // ── return value shape ────────────────────────────────────────────────────

  // The `unit` field echoes the original `to` string exactly, including casing
  it('return unit echoes the original to-string casing', () => {
    expect(converter(1, 'tbsp', 'Cup').unit).toBe('Cup')
    expect(converter(1, 'tbsp', 'GRAMS').unit).toBe('GRAMS')
  })

  // ── convert alias ─────────────────────────────────────────────────────────

  it('is also exported as "convert"', () => {
    const result = convert(2, 'tbsp', 'cup')
    expect(result.quantity).toBeCloseTo(0.125, 2)
    expect(result.unit).toBe('cup')
  })

  // ── unit aliases ──────────────────────────────────────────────────────────

  it('tablespoon full-word aliases all resolve to the same value', () => {
    const ref = converter(1, 'tablespoon', 'grams').quantity
    expect(converter(1, 'tbsp', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 'tbsps', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 'table spoon', 'grams').quantity).toBeCloseTo(ref)
  })

  it("single-char 'T' resolves to tablespoon", () => {
    expect(converter(1, 'T', 'grams').quantity).toBeCloseTo(14.787, 1)
  })

  it("multi-char tablespoon abbreviations 'T.', 'Ts.', 'Ts' resolve to tablespoon", () => {
    const tablespoonGrams = converter(1, 'tablespoon', 'grams').quantity
    expect(converter(1, 'T.', 'grams').quantity).toBeCloseTo(tablespoonGrams)
    expect(converter(1, 'Ts.', 'grams').quantity).toBeCloseTo(tablespoonGrams)
    expect(converter(1, 'Ts', 'grams').quantity).toBeCloseTo(tablespoonGrams)
  })

  it('teaspoon aliases all resolve to the same value', () => {
    const ref = converter(1, 'teaspoon', 'grams').quantity
    expect(converter(1, 'tsp', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 't', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 'tea spoon', 'grams').quantity).toBeCloseTo(ref)
  })

  it('gram aliases resolve to 1g', () => {
    expect(converter(1, 'g', 'grams').quantity).toBeCloseTo(1)
    expect(converter(1, 'gram', 'grams').quantity).toBeCloseTo(1)
    expect(converter(1, 'gs', 'grams').quantity).toBeCloseTo(1)
  })

  it('pound aliases resolve to the same value', () => {
    const ref = converter(1, 'pound', 'grams').quantity
    expect(converter(1, 'lb', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 'lbs', 'grams').quantity).toBeCloseTo(ref)
  })

  // ── case handling ─────────────────────────────────────────────────────────

  it('lowercases multi-character unit names', () => {
    const lower = converter(1, 'cup', 'grams').quantity
    expect(converter(1, 'Cup', 'grams').quantity).toBeCloseTo(lower)
    expect(converter(1, 'CUP', 'grams').quantity).toBeCloseTo(lower)
  })

  it("single-char 't' = teaspoon, 'T' = tablespoon (case-sensitive)", () => {
    const tsp = converter(1, 't', 'grams').quantity
    const tbsp = converter(1, 'T', 'grams').quantity
    expect(tsp).toBeCloseTo(4.929, 1)
    expect(tbsp).toBeCloseTo(14.787, 1)
    expect(tsp).not.toBeCloseTo(tbsp, 1)
  })

  // ── oz vs fluid ounce ─────────────────────────────────────────────────────

  it('oz (mass) and fluid ounce (volume) have distinct gram values', () => {
    const oz = converter(1, 'oz', 'grams').quantity
    const floz = converter(1, 'fluid ounce', 'grams').quantity
    expect(oz).toBeCloseTo(28.3495, 2)   // avoirdupois ounce
    expect(floz).toBeCloseTo(29.5735, 2) // US fluid ounce
    expect(oz).not.toBeCloseTo(floz, 1)
  })

  it('fl.oz abbreviation resolves to fluid ounce', () => {
    const floz = converter(1, 'fl.oz', 'grams').quantity
    expect(floz).toBeCloseTo(29.5735, 2)
  })

  // ── cross-unit conversions ────────────────────────────────────────────────

  it('converts cups to tablespoons (1 cup = 16 tbsp)', () => {
    expect(converter(1, 'cup', 'tbsp').quantity).toBeCloseTo(16, 0)
  })

  it('converts pounds to ounces (1 lb = 16 oz)', () => {
    expect(converter(1, 'pound', 'oz').quantity).toBeCloseTo(16, 1)
  })

  it('converts kilograms to grams', () => {
    expect(converter(1, 'kg', 'grams').quantity).toBeCloseTo(1000)
  })

  it('converts pints to cups (1 pint = 2 cups)', () => {
    expect(converter(1, 'pint', 'cup').quantity).toBeCloseTo(2, 1)
  })

  it('converts gallons to quarts (1 gallon = 4 quarts)', () => {
    expect(converter(1, 'gallon', 'quart').quantity).toBeCloseTo(4, 1)
  })

  it('converts quarts to pints (1 quart = 2 pints)', () => {
    expect(converter(1, 'quart', 'pint').quantity).toBeCloseTo(2, 1)
  })

  it('3 tsp equals 1 tbsp', () => {
    expect(converter(3, 'tsp', 'tbsp').quantity).toBeCloseTo(1, 3)
  })
})

// ── new units ──────────────────────────────────────────────────────────────────

describe('milliliter', () => {
  it('ml resolves to 1g', () => {
    expect(converter(1, 'ml', 'grams').quantity).toBeCloseTo(1)
  })

  it('mL (uppercase L) resolves to 1g', () => {
    expect(converter(1, 'mL', 'grams').quantity).toBeCloseTo(1)
  })

  it('milliliter canonical name resolves to 1g', () => {
    expect(converter(1, 'milliliter', 'grams').quantity).toBeCloseTo(1)
  })

  it('millilitre British spelling resolves to 1g', () => {
    expect(converter(1, 'millilitre', 'grams').quantity).toBeCloseTo(1)
  })

  it('1000 ml = 1 liter', () => {
    expect(converter(1000, 'ml', 'liter').quantity).toBeCloseTo(1)
  })

  it('236.588 ml ≈ 1 cup', () => {
    expect(converter(236.588, 'ml', 'cup').quantity).toBeCloseTo(1, 1)
  })
})

describe('centiliter', () => {
  it('cl resolves to 10g', () => {
    expect(converter(1, 'cl', 'grams').quantity).toBeCloseTo(10)
  })

  it('cL (uppercase L) resolves to 10g', () => {
    expect(converter(1, 'cL', 'grams').quantity).toBeCloseTo(10)
  })

  it('10 cl = 1 dl', () => {
    expect(converter(10, 'cl', 'dl').quantity).toBeCloseTo(1)
  })

  it('100 cl = 1 liter', () => {
    expect(converter(100, 'cl', 'liter').quantity).toBeCloseTo(1)
  })
})

describe('deciliter', () => {
  it('dl resolves to 100g', () => {
    expect(converter(1, 'dl', 'grams').quantity).toBeCloseTo(100)
  })

  it('dL (uppercase L) resolves to 100g', () => {
    expect(converter(1, 'dL', 'grams').quantity).toBeCloseTo(100)
  })

  it('10 dl = 1 liter', () => {
    expect(converter(10, 'dl', 'liter').quantity).toBeCloseTo(1)
  })
})

describe('stick (of butter)', () => {
  it('stick resolves to ~113.4g', () => {
    expect(converter(1, 'stick', 'grams').quantity).toBeCloseTo(113.4, 0)
  })

  it('sticks alias resolves to the same value', () => {
    expect(converter(2, 'sticks', 'grams').quantity).toBeCloseTo(226.8, 0)
  })

  it('2 sticks = 1 cup (approximate — butter density differs from water)', () => {
    // Volumetrically 1 stick = ½ cup; gram values assume water density so this
    // is a rough sanity check rather than an exact equality.
    expect(converter(2, 'sticks', 'cup').quantity).toBeCloseTo(0.96, 1)
  })
})

// ── tad ───────────────────────────────────────────────────────────────────────────

describe('tad', () => {
  it('tad resolves to ~1.232g', () => {
    expect(converter(1, 'tad', 'grams').quantity).toBeCloseTo(1.232, 2)
  })

  it('tads alias resolves to the same value', () => {
    expect(converter(2, 'tads', 'grams').quantity).toBeCloseTo(2.464, 2)
  })

  it('4 tads = 1 teaspoon', () => {
    expect(converter(4, 'tad', 'teaspoon').quantity).toBeCloseTo(1, 2)
  })
})

// ── splash ────────────────────────────────────────────────────────────────────────

describe('splash', () => {
  it('splash resolves to 10g', () => {
    expect(converter(1, 'splash', 'grams').quantity).toBeCloseTo(10)
  })

  it('splashes alias resolves to the same value', () => {
    expect(converter(2, 'splashes', 'grams').quantity).toBeCloseTo(20)
  })
})

// ── milligram ─────────────────────────────────────────────────────────────────────

describe('milligram', () => {
  it('milligram resolves to 0.001g', () => {
    expect(converter(1, 'milligram', 'grams').quantity).toBeCloseTo(0.001, 4)
  })

  it('mg alias resolves to 0.001g', () => {
    expect(converter(1, 'mg', 'grams').quantity).toBeCloseTo(0.001, 4)
  })

  it('milligramme British spelling resolves', () => {
    expect(converter(1, 'milligramme', 'grams').quantity).toBeCloseTo(0.001, 4)
  })

  it('1000 mg = 1 gram', () => {
    expect(converter(1000, 'mg', 'gram').quantity).toBeCloseTo(1, 4)
  })
})

// ── shot / jigger / pony ──────────────────────────────────────────────────────────

describe('shot / jigger / pony', () => {
  it('shot resolves to ~44.36g', () => {
    expect(converter(1, 'shot', 'grams').quantity).toBeCloseTo(44.36, 1)
  })

  it('jigger alias resolves to the same value as shot', () => {
    expect(converter(1, 'jigger', 'grams').quantity).toBeCloseTo(44.36, 1)
  })

  it('1 shot = 1.5 fluid ounces', () => {
    expect(converter(1, 'shot', 'fluid ounce').quantity).toBeCloseTo(1.5, 2)
  })

  it('pony resolves to same as fluid ounce (~29.574g)', () => {
    expect(converter(1, 'pony', 'grams').quantity).toBeCloseTo(29.574, 2)
  })

  it('ponies alias resolves to the same value', () => {
    expect(converter(2, 'ponies', 'grams').quantity).toBeCloseTo(59.147, 2)
  })

  it('1 shot = 2 ponies', () => {
    expect(converter(1, 'shot', 'pony').quantity).toBeCloseTo(1.5, 2)
  })
})

// ── dry measures ──────────────────────────────────────────────────────────────────

describe('dry measures', () => {
  it('dry pint resolves to ~550.61g', () => {
    expect(converter(1, 'dry pint', 'grams').quantity).toBeCloseTo(550.61, 1)
  })

  it('dry pint is larger than liquid pint', () => {
    const dryPint = converter(1, 'dry pint', 'grams').quantity
    const wetPint = converter(1, 'pint', 'grams').quantity
    expect(dryPint).toBeGreaterThan(wetPint)
  })

  it('dry quart resolves to ~1101.22g', () => {
    expect(converter(1, 'dry quart', 'grams').quantity).toBeCloseTo(1101.22, 1)
  })

  it('2 dry pints = 1 dry quart', () => {
    expect(converter(2, 'dry pint', 'dry quart').quantity).toBeCloseTo(1, 2)
  })

  it('dry gallon resolves to ~4404.88g', () => {
    expect(converter(1, 'dry gallon', 'grams').quantity).toBeCloseTo(4404.88, 1)
  })

  it('4 dry quarts = 1 dry gallon', () => {
    expect(converter(4, 'dry quart', 'dry gallon').quantity).toBeCloseTo(1, 2)
  })

  it('peck resolves to ~8809.77g', () => {
    expect(converter(1, 'peck', 'grams').quantity).toBeCloseTo(8809.77, 1)
  })

  it('pk alias resolves to the same value as peck', () => {
    expect(converter(1, 'pk', 'grams').quantity).toBeCloseTo(8809.77, 1)
  })

  it('2 dry gallons = 1 peck', () => {
    expect(converter(2, 'dry gallon', 'peck').quantity).toBeCloseTo(1, 2)
  })

  it('8 dry quarts = 1 peck', () => {
    expect(converter(8, 'dry quart', 'peck').quantity).toBeCloseTo(1, 2)
  })
})

// ── metric / au cup ───────────────────────────────────────────────────────────────

describe('metric / au cup', () => {
  it('metric cup resolves to 250g', () => {
    expect(converter(1, 'metric cup', 'grams').quantity).toBeCloseTo(250)
  })

  it('au cup alias resolves to 250g', () => {
    expect(converter(1, 'au cup', 'grams').quantity).toBeCloseTo(250)
  })

  it('australian cup alias resolves to 250g', () => {
    expect(converter(1, 'australian cup', 'grams').quantity).toBeCloseTo(250)
  })

  it('metric cup is larger than US cup', () => {
    const metricCup = converter(1, 'metric cup', 'grams').quantity
    const usCup = converter(1, 'cup', 'grams').quantity
    expect(metricCup).toBeGreaterThan(usCup)
  })
})

// ── UK units ──────────────────────────────────────────────────────────────────────

describe('uk units', () => {
  it('uk teaspoon resolves to ~5.919g', () => {
    expect(converter(1, 'uk teaspoon', 'grams').quantity).toBeCloseTo(5.919, 2)
  })

  it('uk tsp alias resolves to uk teaspoon', () => {
    expect(converter(1, 'uk tsp', 'grams').quantity).toBeCloseTo(5.919, 2)
  })

  it('uk teaspoon is distinct from US teaspoon', () => {
    const uk = converter(1, 'uk teaspoon', 'grams').quantity
    const us = converter(1, 'teaspoon', 'grams').quantity
    expect(uk).not.toBeCloseTo(us, 1)
  })

  it('uk tablespoon resolves to ~17.758g', () => {
    expect(converter(1, 'uk tablespoon', 'grams').quantity).toBeCloseTo(17.758, 2)
  })

  it('uk tbsp alias resolves to uk tablespoon', () => {
    expect(converter(1, 'uk tbsp', 'grams').quantity).toBeCloseTo(17.758, 2)
  })

  it('uk tablespoon is distinct from US tablespoon', () => {
    const uk = converter(1, 'uk tablespoon', 'grams').quantity
    const us = converter(1, 'tablespoon', 'grams').quantity
    expect(uk).not.toBeCloseTo(us, 1)
  })

  it('uk fluid ounce resolves to ~28.413g', () => {
    expect(converter(1, 'uk fluid ounce', 'grams').quantity).toBeCloseTo(28.413, 2)
  })

  it('uk fl.oz alias resolves to uk fluid ounce', () => {
    expect(converter(1, 'uk fl.oz', 'grams').quantity).toBeCloseTo(28.413, 2)
  })

  it('uk fluid ounce is distinct from US fluid ounce', () => {
    const uk = converter(1, 'uk fluid ounce', 'grams').quantity
    const us = converter(1, 'fluid ounce', 'grams').quantity
    expect(uk).not.toBeCloseTo(us, 1)
  })

  it('uk gill resolves to ~142.065g', () => {
    expect(converter(1, 'uk gill', 'grams').quantity).toBeCloseTo(142.065, 2)
  })

  it('uk cup resolves to ~284.131g', () => {
    expect(converter(1, 'uk cup', 'grams').quantity).toBeCloseTo(284.131, 2)
  })

  it('uk pint resolves to ~568.261g', () => {
    expect(converter(1, 'uk pint', 'grams').quantity).toBeCloseTo(568.261, 2)
  })

  it('uk pint is larger than US pint', () => {
    const uk = converter(1, 'uk pint', 'grams').quantity
    const us = converter(1, 'pint', 'grams').quantity
    expect(uk).toBeGreaterThan(us)
  })

  it('2 uk cups = 1 uk pint', () => {
    expect(converter(2, 'uk cup', 'uk pint').quantity).toBeCloseTo(1, 2)
  })

  it('uk quart resolves to ~1136.523g', () => {
    expect(converter(1, 'uk quart', 'grams').quantity).toBeCloseTo(1136.523, 2)
  })

  it('2 uk pints = 1 uk quart', () => {
    expect(converter(2, 'uk pint', 'uk quart').quantity).toBeCloseTo(1, 2)
  })

  it('uk gallon resolves to ~4546.09g', () => {
    expect(converter(1, 'uk gallon', 'grams').quantity).toBeCloseTo(4546.09, 1)
  })

  it('8 uk pints = 1 uk gallon', () => {
    expect(converter(8, 'uk pint', 'uk gallon').quantity).toBeCloseTo(1, 2)
  })

  it('4 uk quarts = 1 uk gallon', () => {
    expect(converter(4, 'uk quart', 'uk gallon').quantity).toBeCloseTo(1, 2)
  })
})

// ── gō (Japanese measure) ─────────────────────────────────────────────────────────

describe('gō', () => {
  it('gō resolves to 180g', () => {
    expect(converter(1, 'gō', 'grams').quantity).toBeCloseTo(180)
  })

  it('go alias resolves to 180g', () => {
    expect(converter(1, 'go', 'grams').quantity).toBeCloseTo(180)
  })

  it('gou alias resolves to 180g', () => {
    expect(converter(1, 'gou', 'grams').quantity).toBeCloseTo(180)
  })

  it('10 gō = 1800 mL (1 shō)', () => {
    expect(converter(10, 'gō', 'milliliter').quantity).toBeCloseTo(1800)
  })
})

// ── knob ─────────────────────────────────────────────────────────────────────────

describe('knob', () => {
  it('knob resolves to 10g', () => {
    expect(converter(1, 'knob', 'grams').quantity).toBeCloseTo(10)
  })

  it('knobs alias resolves to the same value', () => {
    expect(converter(2, 'knobs', 'grams').quantity).toBeCloseTo(20)
  })

  it('"knob of butter" phrase resolves', () => {
    expect(converter(1, 'knob of butter', 'grams').quantity).toBeCloseTo(10)
  })
})

// ── isValidUnit ───────────────────────────────────────────────────────────────

describe('isValidUnit', () => {
  it('returns true for a canonical unit name', () => {
    expect(isValidUnit('tablespoon')).toBe(true)
    expect(isValidUnit('cup')).toBe(true)
    expect(isValidUnit('gram')).toBe(true)
  })

  it('returns true for a unit alias', () => {
    expect(isValidUnit('tbsp')).toBe(true)
    expect(isValidUnit('oz')).toBe(true)
    expect(isValidUnit('ml')).toBe(true)
  })

  it('returns true for mixed-case abbreviations', () => {
    expect(isValidUnit('T')).toBe(true)  // tablespoon
    expect(isValidUnit('mL')).toBe(true) // milliliter
    expect(isValidUnit('cL')).toBe(true) // centiliter
  })

  it('returns true after case-folding multi-char units', () => {
    expect(isValidUnit('CUP')).toBe(true)
    expect(isValidUnit('GRAMS')).toBe(true)
  })

  it('returns false for an unrecognised unit', () => {
    expect(isValidUnit('cans')).toBe(false)
    expect(isValidUnit('handful')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidUnit('')).toBe(false)
  })

  it('returns true for whitespace-padded valid unit', () => {
    expect(isValidUnit(' cup ')).toBe(true)
  })
})

// ── getCanonicalUnit ──────────────────────────────────────────────────────────

describe('getCanonicalUnit', () => {
  it('returns the canonical name for common aliases', () => {
    expect(getCanonicalUnit('tbsp')).toBe('tablespoon')
    expect(getCanonicalUnit('T')).toBe('tablespoon')
    expect(getCanonicalUnit('tsp')).toBe('teaspoon')
    expect(getCanonicalUnit('kg')).toBe('kilogram')
    expect(getCanonicalUnit('lb')).toBe('pound')
    expect(getCanonicalUnit('ml')).toBe('milliliter')
    expect(getCanonicalUnit('mL')).toBe('milliliter')
  })

  it('returns the canonical name when given a plural form', () => {
    expect(getCanonicalUnit('grams')).toBe('gram')
    expect(getCanonicalUnit('cups')).toBe('cup')
    expect(getCanonicalUnit('tablespoons')).toBe('tablespoon')
  })

  it('returns the canonical name unchanged when already canonical', () => {
    expect(getCanonicalUnit('tablespoon')).toBe('tablespoon')
    expect(getCanonicalUnit('cup')).toBe('cup')
    expect(getCanonicalUnit('gram')).toBe('gram')
  })

  it('is case-insensitive for multi-char units', () => {
    expect(getCanonicalUnit('CUP')).toBe('cup')
    expect(getCanonicalUnit('GRAMS')).toBe('gram')
    expect(getCanonicalUnit('Tablespoon')).toBe('tablespoon')
  })

  it('returns null for an unrecognised unit', () => {
    expect(getCanonicalUnit('cans')).toBeNull()
    expect(getCanonicalUnit('handful')).toBeNull()
    expect(getCanonicalUnit('')).toBeNull()
  })
})

// ── getSupportedUnits ─────────────────────────────────────────────────────────

describe('getSupportedUnits', () => {
  it('returns a non-empty array', () => {
    const supported = getSupportedUnits()
    expect(Array.isArray(supported)).toBe(true)
    expect(supported.length).toBeGreaterThan(0)
  })

  it('each entry has a string name and an aliases array', () => {
    for (const entry of getSupportedUnits()) {
      expect(typeof entry.name).toBe('string')
      expect(entry.name.length).toBeGreaterThan(0)
      expect(Array.isArray(entry.aliases)).toBe(true)
    }
  })

  it('includes all expected canonical unit names', () => {
    const names = getSupportedUnits().map(u => u.name)
    for (const expected of [
      'drop', 'smidgen', 'pinch', 'dash', 'tad', 'saltspoon', 'coffeespoon',
      'fluid dram', 'teaspoon', 'dessertspoon', 'splash', 'tablespoon',
      'oz.', 'fluid ounce', 'shot', 'wineglass', 'gill', 'gō',
      'cup', 'metric cup', 'pint', 'quart', 'gallon',
      'uk teaspoon', 'uk tablespoon', 'uk fluid ounce', 'uk gill', 'uk cup',
      'uk pint', 'uk quart', 'uk gallon',
      'dry pint', 'dry quart', 'dry gallon', 'peck',
      'pound', 'milligram', 'gram', 'kilogram',
      'milliliter', 'centiliter', 'deciliter', 'liter', 'stick', 'knob',
    ]) {
      expect(names).toContain(expected)
    }
  })

  it('tablespoon entry includes common aliases', () => {
    const tbsp = getSupportedUnits().find(u => u.name === 'tablespoon')
    expect(tbsp?.aliases).toContain('tbsp')
    expect(tbsp?.aliases).toContain('T')
    expect(tbsp?.aliases).toContain('Ts')
  })

  it('milliliter entry includes ml and mL aliases', () => {
    const ml = getSupportedUnits().find(u => u.name === 'milliliter')
    expect(ml?.aliases).toContain('ml')
    expect(ml?.aliases).toContain('mL')
  })

  it('canonical name is not duplicated in aliases', () => {
    for (const entry of getSupportedUnits()) {
      expect(entry.aliases).not.toContain(entry.name)
    }
  })
})
