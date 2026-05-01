import { describe, it, expect } from 'vitest'
import { converter, convert } from '../index'

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

  // ── same-unit round trip ──────────────────────────────────────────────────

  it('returns the same quantity when converting to the same unit', () => {
    expect(converter(5, 'cup', 'cup').quantity).toBeCloseTo(5)
    expect(converter(3, 'tbsp', 'tbsp').quantity).toBeCloseTo(3)
  })

  // ── error handling (doc: should throw) ────────────────────────────────────

  it('throws for an unrecognised to-unit', () => {
    expect(() => converter(2, 'kg', 'cans')).toThrow("Unsupported unit 'cans'")
  })

  it('throws for an unrecognised from-unit', () => {
    expect(() => converter(1, 'foobar', 'cup')).toThrow("Unsupported unit 'foobar'")
  })

  it('throws when quantity is zero', () => {
    expect(() => converter(0, 'cup')).toThrow('Quantity must be greater than 0')
  })

  it('throws when quantity is negative', () => {
    expect(() => converter(-1, 'kg')).toThrow('Quantity must be greater than 0')
  })

  // ── convert alias ─────────────────────────────────────────────────────────

  it('is also exported as "convert"', () => {
    const result = convert(2, 'tbsp', 'cup')
    expect(result.quantity).toBeCloseTo(0.125, 2)
    expect(result.unit).toBe('cup')
  })

  // ── unit aliases ──────────────────────────────────────────────────────────

  it('tablespoon aliases all resolve to the same value', () => {
    const ref = converter(1, 'tablespoon', 'grams').quantity
    expect(converter(1, 'tbsp', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 'T', 'grams').quantity).toBeCloseTo(ref)
  })

  it('teaspoon aliases all resolve to the same value', () => {
    const ref = converter(1, 'teaspoon', 'grams').quantity
    expect(converter(1, 'tsp', 'grams').quantity).toBeCloseTo(ref)
    expect(converter(1, 't', 'grams').quantity).toBeCloseTo(ref)
  })

  it('gram aliases resolve to 1g', () => {
    expect(converter(1, 'g', 'grams').quantity).toBeCloseTo(1)
    expect(converter(1, 'gram', 'grams').quantity).toBeCloseTo(1)
  })

  // ── case handling ─────────────────────────────────────────────────────────

  it('lowercases multi-character unit names', () => {
    const lower = converter(1, 'cup', 'grams').quantity
    expect(converter(1, 'Cup', 'grams').quantity).toBeCloseTo(lower)
    expect(converter(1, 'CUP', 'grams').quantity).toBeCloseTo(lower)
  })

  it('preserves case for single-character units (t = teaspoon, T = tablespoon)', () => {
    const tsp = converter(1, 't', 'grams').quantity
    const tbsp = converter(1, 'T', 'grams').quantity
    expect(tsp).toBeCloseTo(4.92, 1)
    expect(tbsp).toBeCloseTo(14.78, 1)
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

  // ── cross-unit conversions ────────────────────────────────────────────────

  it('converts cups to tablespoons', () => {
    // 1 cup = 16 tbsp
    const result = converter(1, 'cup', 'tbsp')
    expect(result.quantity).toBeCloseTo(16, 0)
  })

  it('converts pounds to ounces', () => {
    // 1 lb = 16 oz
    const result = converter(1, 'pound', 'oz')
    expect(result.quantity).toBeCloseTo(16, 1)
  })

  it('converts kilograms to grams', () => {
    const result = converter(1, 'kg', 'grams')
    expect(result.quantity).toBeCloseTo(1000)
  })

  it('converts pints to cups', () => {
    // 1 pint = 2 cups
    const result = converter(1, 'pint', 'cup')
    expect(result.quantity).toBeCloseTo(2, 1)
  })
})
