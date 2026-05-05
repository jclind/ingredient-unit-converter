# @jclind/ingredient-unit-converter

[![npm version](https://img.shields.io/npm/v/@jclind/ingredient-unit-converter)](https://www.npmjs.com/package/@jclind/ingredient-unit-converter)
[![license](https://img.shields.io/npm/l/@jclind/ingredient-unit-converter)](https://github.com/jclind/ingredient-unit-converter/blob/main/LICENSE)

A lightweight, zero-dependency TypeScript package for converting between culinary units. Supports US customary, UK imperial, metric, and informal recipe measures — with full ESM and CommonJS output.

## Installation

```sh
npm install @jclind/ingredient-unit-converter
```

## Quick Start

```ts
import { converter } from '@jclind/ingredient-unit-converter'

converter(2, 'tbsp', 'cup')   // { quantity: 0.125, unit: 'cup' }
converter(16, 'oz')            // { quantity: 453.592, unit: 'grams' }
converter(1, 'uk pint', 'ml') // { quantity: 568.261, unit: 'ml' }
```

## API

### `converter(quantity, from, to?)`

Converts a quantity from one unit to another. Also exported as `convert`.

```ts
import { converter, convert } from '@jclind/ingredient-unit-converter'

converter(quantity: number, from: string, to?: string): { quantity: number; unit: string }
```

| Parameter  | Type     | Required | Default    | Description                        |
|------------|----------|----------|------------|------------------------------------|
| `quantity` | `number` | Yes      | —          | Must be a finite number greater than 0 |
| `from`     | `string` | Yes      | —          | Starting unit (name or alias)      |
| `to`       | `string` | No       | `'grams'`  | Target unit (name or alias)        |

**Returns** `{ quantity: number; unit: string }` — the converted quantity and the `to` string echoed back exactly as given (including original casing).

**Throws** if `quantity` is not a positive finite number, or if either unit string is unrecognised.

---

### `isValidUnit(unit)`

Returns `true` if the string resolves to a known unit.

```ts
import { isValidUnit } from '@jclind/ingredient-unit-converter'

isValidUnit('tbsp')    // true
isValidUnit('handful') // false
```

---

### `getCanonicalUnit(unit)`

Returns the canonical name for a unit, or `null` if unrecognised. Useful for normalising aliases before storing or comparing.

```ts
import { getCanonicalUnit } from '@jclind/ingredient-unit-converter'

getCanonicalUnit('tbsp') // 'tablespoon'
getCanonicalUnit('T')    // 'tablespoon'
getCanonicalUnit('mL')   // 'milliliter'
getCanonicalUnit('pony') // 'fluid ounce'
```

---

### `getSupportedUnits()`

Returns the full list of supported units, each with its canonical name and aliases.

```ts
import { getSupportedUnits } from '@jclind/ingredient-unit-converter'

getSupportedUnits()
// [{ name: 'tablespoon', aliases: ['table spoon', 'tbsp', 'T', ...] }, ...]
```

## Supported Units

Unit strings are case-insensitive for multi-character inputs. Single-character inputs are case-sensitive: `'t'` = teaspoon, `'T'` = tablespoon.

### Tiny & informal

| Canonical name | Common aliases          | Approx. size |
|----------------|-------------------------|--------------|
| `drop`         | `drops`, `gt`, `gtt`    | 0.05 mL      |
| `smidgen`      | `smidgens`, `smdg`      | 0.18 mL      |
| `pinch`        | `pinches`, `pn`         | 0.36 mL      |
| `dash`         | `dashes`, `ds`          | 0.72 mL      |
| `tad`          | `tads`                  | ¼ tsp        |
| `saltspoon`    | `ssp`, `scruple`        | 1.23 mL      |
| `coffeespoon`  | `csp`                   | 2.1 mL       |
| `splash`       | `splashes`              | ~10 mL ¹     |

### Spoon measures (US)

| Canonical name  | Common aliases                      | Approx. size |
|-----------------|-------------------------------------|--------------|
| `fluid dram`    | `fl.dr`, `fldr`                     | 3.70 mL      |
| `teaspoon`      | `tsp`, `t`                          | 4.93 mL      |
| `dessertspoon`  | `dsp`, `dssp`, `dstspn`            | 9.86 mL      |
| `tablespoon`    | `tbsp`, `T`                         | 14.79 mL     |

### US volume

| Canonical name | Common aliases                     | Approx. size |
|----------------|------------------------------------|--------------|
| `fluid ounce`  | `fl.oz`, `floz`, `pony`, `ponies` | 29.57 mL     |
| `shot`         | `shots`, `jigger`, `jiggers`      | 44.36 mL (1.5 fl oz) |
| `wineglass`    | `wgf`                              | 59.15 mL     |
| `gill`         | `gills`, `teacup`                  | 118.29 mL    |
| `cup`          | `cups`, `c`, `C`                   | 236.59 mL    |
| `pint`         | `pints`, `pt`                      | 473.18 mL    |
| `quart`        | `quarts`, `qt`                     | 946.35 mL    |
| `gallon`       | `gallons`, `gal`                   | 3785.41 mL   |

### US dry measures

Distinct from liquid measures — use these when a recipe specifies a dry container (e.g. "1 pint of blueberries").

| Canonical name | Common aliases   | Approx. size |
|----------------|------------------|--------------|
| `dry pint`     | `dry pints`      | 550.61 mL    |
| `dry quart`    | `dry quarts`     | 1101.22 mL   |
| `dry gallon`   | `dry gallons`    | 4404.88 mL   |
| `peck`         | `pecks`, `pk`    | 8809.77 mL   |

### UK imperial

| Canonical name   | Common aliases        | Value         |
|------------------|-----------------------|---------------|
| `uk teaspoon`    | `uk teaspoons`, `uk tsp`   | 5.92 mL  |
| `uk tablespoon`  | `uk tablespoons`, `uk tbsp` | 17.76 mL |
| `uk fluid ounce` | `uk fl.oz`, `uk floz` | 28.41 mL      |
| `uk gill`        | `uk gills`            | 142.07 mL     |
| `uk cup`         | `uk cups`             | 284.13 mL     |
| `uk pint`        | `uk pints`            | 568.26 mL     |
| `uk quart`       | `uk quarts`           | 1136.52 mL    |
| `uk gallon`      | `uk gallons`          | 4546.09 mL    |

### Metric volume

| Canonical name | Common aliases                          | Value    |
|----------------|-----------------------------------------|----------|
| `milliliter`   | `millilitre`, `ml`, `mL`               | 1 mL     |
| `centiliter`   | `centilitre`, `cl`, `cL`               | 10 mL    |
| `deciliter`    | `decilitre`, `dl`, `dL`               | 100 mL   |
| `liter`        | `litre`, `l`                            | 1000 mL  |
| `metric cup`   | `au cup`, `australian cup`             | 250 mL   |

### Weight & mass

| Canonical name | Common aliases                     | Value        |
|----------------|------------------------------------|--------------|
| `milligram`    | `milligramme`, `mg`                | 0.001 g      |
| `gram`         | `grams`, `g`                       | 1 g          |
| `kilogram`     | `kilograms`, `kg`                  | 1000 g       |
| `oz.`          | `oz`, `ounce`, `ounces`            | 28.35 g      |
| `pound`        | `pounds`, `lb`, `lbs`              | 453.59 g     |

### International & special

| Canonical name | Common aliases                          | Value     |
|----------------|-----------------------------------------|-----------|
| `gō`           | `go`, `gou`                             | 180 mL (Japanese 合) |
| `stick`        | `sticks`                                | 113.40 g (1 stick of butter) |
| `knob`         | `knobs`, `knob of butter`              | ~10 g ¹   |

¹ Informal unit with no fixed standard — a reasonable culinary convention is used.

## Error Handling

```ts
converter(2, 'kg', 'cans')
// throws: "Unsupported unit 'cans'"

converter(-1, 'kg')
// throws: "Quantity must be greater than 0"

converter(0, 'cup')
// throws: "Quantity must be greater than 0"
```

## TypeScript

This package ships with full type declarations for both ESM and CommonJS consumers. No `@types` package needed.

```ts
import { converter, ConversionResult, UnitInfo } from '@jclind/ingredient-unit-converter'

const result: ConversionResult = converter(1, 'cup', 'ml')
// { quantity: 236.588, unit: 'ml' }
```

## Notes

- **Water density assumption** — all volume-to-mass conversions assume 1 mL = 1 g (water). Converting between volume and mass units (e.g. cups to grams) will be inaccurate for ingredients denser or lighter than water, such as flour, oil, or honey.
- **US customary by default** — unqualified units (`pint`, `tablespoon`, `cup`, etc.) use US values. Prefix with `uk ` for UK imperial values, or use `metric cup` / `au cup` for the 250 mL metric cup.
- **Dry vs liquid** — US dry pints, quarts, and gallons are distinct from their liquid equivalents and are accessed via `dry pint`, `dry quart`, and `dry gallon`.

## Issues & Contributing

Found a bug or missing unit? [Open an issue](https://github.com/jclind/ingredient-unit-converter/issues) on GitHub. PRs are welcome.
