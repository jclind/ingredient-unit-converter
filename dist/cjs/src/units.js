"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.units = void 0;
exports.units = [
    {
        names: [
            'drop',
            'drops',
            'dr.',
            'dr',
            'drs.',
            'drs',
            'gt.',
            'gt',
            'gts.',
            'gts',
            'gtt',
            'gtt.',
            'gtts',
            'gtts.',
        ],
        grams: 0.05,
    },
    {
        names: [
            'smidgen',
            'smidgens',
            'smdg.',
            'smdg',
            'smdgs.',
            'smdgs',
            'smi',
            'smi.',
            'smis.',
            'smis',
        ],
        grams: 0.18,
    },
    {
        names: ['pinch', 'pinches', 'pinchs', 'pn.', 'pn', 'pns.', 'pns'],
        grams: 0.36,
    },
    {
        names: ['dash', 'dashs', 'dashes', 'ds.', 'ds', 'dss.', 'dss'],
        grams: 0.72,
    },
    {
        names: [
            'saltspoon',
            'salt spoon',
            'saltspoons',
            'salt spoons',
            'scruple',
            'scruples',
            'ssp.',
            'ssp',
            'ssps.',
            'ssps',
        ],
        grams: 1.23,
    },
    {
        names: [
            'coffeespoon',
            'coffee spoon',
            'coffeespoons',
            'coffee spoons',
            'csp.',
            'csp',
            'csps.',
            'csps',
        ],
        grams: 2.1,
    },
    {
        names: [
            'fluid dram',
            'fluiddram',
            'fluid drams',
            'fluiddrams',
            'fl.dr.',
            'fldr',
            'fl.dr',
            'fldr.',
            'fl.drs.',
            'fldrs',
            'fl.drs',
        ],
        grams: 3.69669, // 1 US fluid dram = 3.6966911953125 mL
    },
    {
        names: [
            'teaspoon',
            'tea spoon',
            'teaspoons',
            'tea spoons',
            'tsp.',
            'tsp',
            'tsps.',
            'tsps',
            't.',
            't',
            'ts.',
            'ts',
        ],
        grams: 4.92892, // 1 US teaspoon = 4.92892159375 mL
    },
    {
        names: [
            'dessertspoon',
            'dessert spoon',
            'dessertspoons',
            'dessert spoons',
            'dsp.',
            'dsp',
            'dsps.',
            'dsps',
            'dssp.',
            'dssp',
            'dssps.',
            'dssps',
            'dstspn.',
            'dstspn',
            'dstspns.',
            'dstspns',
        ],
        grams: 9.85784, // 2 US teaspoons = 2 × 4.92892 mL
    },
    {
        names: [
            'tablespoon',
            'table spoon',
            'tablespoons',
            'table spoons',
            'tbsp.',
            'tbsp',
            'tbsps.',
            'tbsps',
            'T.',
            'T',
            'Ts.',
            'Ts',
        ],
        grams: 14.78676, // 1 US tablespoon = 14.78676478125 mL
    },
    {
        names: ['oz.', 'oz', 'ozs.', 'ozs', 'ounce', 'ounces'],
        grams: 28.34952, // 1 avoirdupois ounce = 28.3495231 g
    },
    {
        names: [
            'fluid ounce',
            'fluidounce',
            'fluid ounces',
            'fluidounces',
            'fl.oz.',
            'floz',
            'fl.oz',
            'floz.',
            'fl.ozs.',
            'flozs',
            'fl.ozs',
            'flozs.',
        ],
        grams: 29.57353, // 1 US fluid ounce = 29.5735295625 mL
    },
    {
        names: [
            'wineglass',
            'wine glass',
            'wineglasses',
            'wine glasses',
            'wgf.',
            'wgf',
            'wgfs.',
            'wgfs',
        ],
        grams: 59.14706, // 2 US fluid ounces = 59.1470591 mL
    },
    {
        names: [
            'gill',
            'gills',
            'teacup',
            'tea cup',
            'teacups',
            'tea cups',
            'tcf.',
            'tcf',
            'tcfs.',
            'tcfs',
        ],
        grams: 118.29412, // 4 US fluid ounces = 118.2941182 mL
    },
    {
        names: ['cup', 'cups', 'C.', 'C', 'c.', 'c', 'Cs.', 'Cs'],
        grams: 236.58824, // 1 US cup = 236.5882365 mL
    },
    {
        names: ['pint', 'pints', 'pt.', 'pt', 'pts.', 'pts'],
        grams: 473.17647, // 1 US pint = 473.176473 mL
    },
    {
        names: ['quart', 'quarts', 'qt.', 'qt', 'qts.', 'qts'],
        grams: 946.35294, // 1 US quart = 946.352946 mL
    },
    {
        names: ['gallon', 'gallons', 'gal.', 'gal', 'gals.', 'gals'],
        grams: 3785.41178, // 1 US gallon = 3785.41178 mL
    },
    {
        names: ['pound', 'pounds', 'lb.', 'lb', 'lbs.', 'lbs'],
        grams: 453.59237, // 1 avoirdupois pound = 453.59237 g
    },
    {
        names: ['gram', 'grams', 'g.', 'g', 'gs.', 'gs'],
        grams: 1,
    },
    {
        names: [
            'kilogram',
            'kilo gram',
            'kilograms',
            'kilo grams',
            'kg.',
            'kg',
            'kgs.',
            'kgs',
        ],
        grams: 1000,
    },
    {
        names: [
            'milliliter',
            'milliliters',
            'millilitre',
            'millilitres',
            'ml',
            'mL',
            'mls',
            'mLs',
        ],
        grams: 1, // 1 mL of water = 1 g
    },
    {
        names: [
            'centiliter',
            'centiliters',
            'centilitre',
            'centilitres',
            'cl',
            'cL',
            'cls',
            'cLs',
        ],
        grams: 10, // 1 cL = 10 mL
    },
    {
        names: [
            'deciliter',
            'deciliters',
            'decilitre',
            'decilitres',
            'dl',
            'dL',
            'dls',
            'dLs',
        ],
        grams: 100, // 1 dL = 100 mL
    },
    {
        names: ['liter', 'liters', 'litre', 'litres', 'l.', 'l', 'ls.', 'ls'],
        grams: 1000,
    },
    {
        names: ['stick', 'sticks'],
        grams: 113.39809, // 1 stick of butter = 4 oz = 4 × 28.34952 g
    },
];
