# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build   # Compile dual CJS + ESM output to dist/
npm test        # Run tests with Vitest (vitest run)
npx vitest run __tests__/converter.test.ts   # Run a single test file
npx vitest run -t "test name pattern"        # Run tests matching a pattern
```

## Architecture

This is a TypeScript npm package (`@jclind/ingredient-unit-converter`) with no runtime dependencies, published as a dual CJS/ESM module.

**Entry points:**
- `index.ts` — exports `converter()`, `isValidUnit()`, `getCanonicalUnit()`, `getSupportedUnits()`
- `src/units.ts` — all unit definitions

**Build output:**
- `dist/cjs/` — CommonJS (`tsconfig.cjs.json`)
- `dist/esm/` — ES Modules (`tsconfig.esm.json`)
- The build script injects `package.json` files with `"type"` into each output directory so Node.js resolves modules correctly

**Conversion model:**
All conversions use a gram baseline — each unit stores its gram equivalent, and conversions are `(fromUnit.grams / toUnit.grams) * quantity`. Volume-to-mass conversions assume water density (1 mL = 1 g).

**Unit lookup:**
- Multi-character unit strings are matched case-insensitively against all aliases
- Single-character strings are case-sensitive (`'T'` = tablespoon, `'t'` = teaspoon)
- `converter()` returns the unit string in the same casing as the `to` argument

**Unit definitions (`src/units.ts`):**
Each unit entry has a `name`, `aliases` array (canonical name + abbreviations, plurals, space variants), and `grams` value. Adding a new unit means adding one object to the array; existing tests will catch alias regressions.

**Testing:**
Tests live in `__tests__/converter.test.ts` and use Vitest. Floating-point assertions use `toBeCloseTo()`. The test suite covers conversions, quantity validation, alias resolution, case handling, and all exported helper functions.

**Planned work:**
`UNITS_IMPROVEMENTS.md` documents a prioritized roadmap of unit additions and a future locale/regional system (US/UK/metric cups). The locale feature would require an optional parameter on `converter()` to remain backward-compatible.
