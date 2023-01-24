# `@jclind/ingredient-unit-converter`

`@jclind/ingredient-unit-converter` is an npm package that allows you to convert a given quantity of an ingredient from one unit to another.

## Installation

To install the package, run the following command in your project's root directory:

```
npm install @jclind/ingredient-unit-converter
```

## Usage

```
import { converter } from '@jclind/ingredient-unit-converter'

const converted = converter(2, 'tbsp', 'cup');
console.log(converted);
// { quantity: 0.125, unit: 'cup' }
```

## API

`convert(quantity: number, initialUnit: string, finalUnit: string) => { quantity: number, unit: string }`
Takes a quantity, an initial unit, and a unit to be converted to and returns an object with the converted quantity and the new converted unit name.

- `quantity` (number) [required] : The quantity of ingredient that needs to be converted
- `initialUnit` (string) [required] : The initial unit of the ingredient (e.g. 'tbsp', 'cup', 'oz')
- `finalUnit` (string) : The unit to which the ingredient needs to be converted (e.g. 'tbsp', 'cup', 'oz', 'g'), defaults to grams

## Supported Units

- drop
- smidgen
- pinch
- dash
- saltspoon
- coffeespoon
- fluid
- dram
- teaspoon
- dessertspoon
- tablespoon
- fluid
- ounce
- wineglass
- gill
- cup
- pint
- quart
- gallon
- pound
- gram
- kilogram
- liter

Please note that this package supports converting between all units, however converting between units of mass and volume will not be 100% accurate.

## Examples

```
const converted = ingredientUnitConverter.convert(2, 'tbsp', 'cup');
console.log(converted);
// { quantity: 0.125, unit: 'cup' }
```

```
const converted = ingredientUnitConverter.convert(16, 'oz');
console.log(converted);
// { quantity: 453.592, unit: 'grams' }
```

## Error Handling

```
const converted = ingredientUnitConverter.convert(2, 'kg', 'cans');
// throw error: "Unsupported unit 'cans'"
```

```
const converted = ingredientUnitConverter.convert(-1, 'kg');
// throw error: "Quantity must be greater than 0"
```

## Note

This package supports converting between units of volume and weight for ingredients, however, these conversions may be inaccurate due to the mass of the ingredient (i.e. the mass of water and flour are different).
