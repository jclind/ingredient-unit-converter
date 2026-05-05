# Units Improvement Report

## 1. The Biggest Gap: Regional Variants of Existing Units

This is the most important issue in the package and it's architectural. Several units already defined here have **meaningfully different values** depending on which country's recipe you're following:

| Unit | US (current) | UK/Imperial | Australian/Metric |
|------|-------------|-------------|-------------------|
| teaspoon | 4.929 mL | 5.919 mL | 5 mL |
| tablespoon | 14.787 mL | 17.758 mL | 20 mL |
| cup | 236.588 mL | 284.131 mL | 250 mL |
| pint | 473.176 mL | 568.261 mL | — |
| fluid ounce | 29.574 mL | 28.413 mL | 28.413 mL |
| gill | 118.294 mL | 142.065 mL | — |
| gallon | 3785.41 mL | 4546.09 mL | — |

The UK pint is ~20% larger than the US pint. The Australian tablespoon is 35% larger than the US tablespoon. These are recipe-breaking differences. Today the package silently uses US values for all of them with no way to opt into another system.

**Recommendation:** An optional `locale` or `system` parameter (`'us'` | `'uk'` | `'metric'`) on `converter()`, with dedicated unit name prefixes for explicit use (`'uk pint'`, `'metric cup'`, `'au tablespoon'`). This is the highest-impact change the package could make.

---

## 2. Milligram

**Priority: High**

`mg` is missing entirely. It appears constantly in modern recipe contexts — spice packets, food science recipes, nutrition-aware cooking, and baking with precise leavening amounts. `1 mg = 0.001 g`. Straightforward to add.

---

## 3. Shot / Jigger

**Priority: High**

Extremely common in cocktail recipes and any recipe using spirits (flambé, sauces, marinades). A US standard shot / jigger is **1.5 fl oz = 44.36 mL**. These terms appear in countless online recipes and both names are widely understood.

A `pony` (1 fl oz = 29.57 mL) is the smaller bartending measure and also worth including.

---

## 4. US Dry Measures

**Priority: High (for produce/grain recipes)**

The US has a parallel dry-measure system that is genuinely different from the liquid system:

| Unit | Dry | Liquid (current) |
|------|-----|-----------------|
| pint | 550.61 mL | 473.18 mL |
| quart | 1101.22 mL | 946.35 mL |
| gallon | 4404.88 mL | 3785.41 mL |

When a recipe says "1 pint of blueberries" or "1 quart of strawberries" it means the dry container, not the liquid measure. This is a silent accuracy problem in the current package — berry and produce recipes will be ~16% off.

These need distinct unit names: `'dry pint'`, `'dry quart'`, `'dry gallon'`.

---

## 5. Metric / Australian Cup (250 mL)

**Priority: High**

The metric cup (250 mL) is the standard in Australia, New Zealand, South Africa, and Canada. It's about 5.5% larger than the US cup (236.6 mL) — small enough to seem like rounding error, but real enough to affect baking. Australian cooking sites are enormously popular globally. This would be: `'metric cup'` / `'au cup'` = 250 mL.

---

## 6. Tad

**Priority: Medium**

Completes the informal small-measure ladder that already has drop, smidgen, pinch, and dash. A tad is defined as **¼ teaspoon = 1.232 mL** in most culinary references. It appears regularly in baking recipes particularly for salt and spices.

---

## 7. Splash

**Priority: Medium**

One of the most common informal instructions in savory cooking: "a splash of wine/stock/oil." It's loosely defined but has a culinary convention of approximately **5 mL (1 tsp)** to **15 mL (1 tbsp)** — the package could pick a midpoint convention (~10 mL) and document it clearly.

---

## 8. UK-Prefixed Units

**Priority: Medium**

Rather than changing existing unit behavior, adding explicitly prefixed variants covers the UK system without breaking anything:

| Unit | Value |
|------|-------|
| `uk pint` | 568.261 mL |
| `uk quart` | 1136.52 mL |
| `uk gallon` | 4546.09 mL |
| `uk fluid ounce` | 28.4131 mL |
| `uk tablespoon` | 17.758 mL |
| `uk teaspoon` | 5.9194 mL |
| `uk cup` | 284.131 mL (½ UK pint) |
| `uk gill` | 142.065 mL (¼ UK pint) |

---

## 9. Japanese Gō (合)

**Priority: Low–Medium**

The gō (180 mL) is the standard Japanese unit for measuring rice and sake and appears directly in the vast majority of Japanese recipes. 1 gō = 180 mL; 10 gō = 1 shō (1800 mL). Japanese cooking has a huge global following and this is a precise, well-defined unit.

---

## 10. Knob

**Priority: Low**

"A knob of butter" is ubiquitous in British recipes. It's informal but well-understood as roughly **7–14 g** (often cited as ~10 g). Less critical now that stick is supported, but it fills a British recipe gap.

---

## 11. Peck

**Priority: Low**

An old unit that still occasionally appears in heritage or American folk recipes: **1 peck = 2 dry gallons = 8 dry quarts = 8.80977 liters**. Low frequency but notable.

---

## Summary Table

| Item | Priority | Nature |
|------|----------|--------|
| Regional locale support (US/UK/metric system) | **Critical** | Architecture |
| Milligram (mg) | **High** | Simple addition |
| Shot / jigger (1.5 fl oz) | **High** | Simple addition |
| US dry pint / dry quart / dry gallon | **High** | Simple addition |
| Metric/Australian cup (250 mL) | **High** | Simple addition |
| Tad (¼ tsp) | Medium | Simple addition |
| Splash (~10 mL) | Medium | Needs convention decision |
| UK-prefixed unit variants | Medium | Simple additions |
| Japanese gō (180 mL) | Low–Medium | Simple addition |
| Knob (~10 g) | Low | Needs convention decision |
| Peck (8.81 L) | Low | Simple addition |

---

## Implementation Prompt

Implement the improvements listed in this file for the `@jclind/ingredient-unit-converter` package. Work through them in priority order:

1. **Simple unit additions first** — add milligram, shot/jigger/pony, dry pint/quart/gallon, metric/au cup, tad, splash, UK-prefixed units, Japanese gō, knob, and peck to `src/units.ts`. Use precise mL-to-gram values (assuming water density as the package already does). For informal units with no fixed standard (splash, knob) pick and document a clear convention in a comment.

2. **Regional locale support** — this is the most impactful and most complex change. Design and implement an optional third parameter or options object on `converter()` that accepts a `system` value of `'us'` (default, current behavior), `'uk'`, or `'metric'`. When a system is specified, ambiguous units like `'pint'`, `'cup'`, `'tablespoon'`, and `'teaspoon'` should resolve to that system's values. The explicit-prefix variants (`'uk pint'`, `'metric cup'`, etc.) should always work regardless of the system setting. Keep the change backward-compatible — omitting the system parameter must behave identically to the current API.

3. **Tests** — for every addition, write tests in `__tests__/converter.test.ts` that verify: the canonical name resolves correctly, at least one alias resolves correctly, and any cross-unit relationship holds (e.g. 10 dry quarts = 1 peck). For the locale system, write tests that confirm the same unit string returns different values under different systems, and that explicit-prefix units are unaffected by the system setting.

4. **Build** — run `npm test` and `npm run build` and confirm both pass before considering the task complete.
