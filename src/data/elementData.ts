// The following data as well as data from ./emissionLinePlotData.ts is taken from https://physics.uwo.ca/~lgonchar/courses/p9826/xdb.pdf

interface Element {
  symbol: string,
  atomicNumber: number
  emissionLines: [number, string, number][]
}

interface ElementData {
  elements: Element[]
}

export const emissionLinesData: ElementData = {
  elements: [
    {
      symbol: "Li",
      atomicNumber: 3,
      emissionLines: [
        [
          54.3,
          "K\\alpha 1,2",
          150
        ]
      ]
    },
    {
      symbol: "Be",
      atomicNumber: 4,
      emissionLines: [
        [
          108.5,
          "K\\alpha 1,2",
          150
        ]
      ]
    },
    {
      symbol: "B",
      atomicNumber: 5,
      emissionLines: [
        [
          183.3,
          "K\\alpha 1,2",
          151
        ]
      ]
    },
    {
      symbol: "C",
      atomicNumber: 6,
      emissionLines: [
        [
          277,
          "K\\alpha 1,2",
          147
        ]
      ]
    },
    {
      symbol: "N",
      atomicNumber: 7,
      emissionLines: [
        [
          392.4,
          "K\\alpha 1,2",
          150
        ]
      ]
    },
    {
      symbol: "O",
      atomicNumber: 8,
      emissionLines: [
        [
          524.9,
          "K\\alpha 1,2",
          151
        ]
      ]
    },
    {
      symbol: "F",
      atomicNumber: 9,
      emissionLines: [
        [
          676.8,
          "K\\alpha 1,2",
          148
        ]
      ]
    },
    {
      symbol: "Ne",
      atomicNumber: 10,
      emissionLines: [
        [
          848.6,
          "K\\alpha 1,2",
          150
        ]
      ]
    },
    {
      symbol: "Na",
      atomicNumber: 11,
      emissionLines: [
        [
          1041,
          "K\\alpha 1,2",
          150
        ]
      ]
    },
    {
      symbol: "Mg",
      atomicNumber: 12,
      emissionLines: [
        [
          1253.6,
          "K\\alpha 1,2",
          150
        ]
      ]
    },
    {
      symbol: "Al",
      atomicNumber: 13,
      emissionLines: [
        [
          1486.3,
          "K\\alpha 2",
          50
        ],
        [
          1486.7,
          "K\\alpha 1",
          100
        ],
        [
          1557.4,
          "K\\beta 1",
          1
        ]
      ]
    },
    {
      symbol: "Si",
      atomicNumber: 14,
      emissionLines: [
        [
          1739.4,
          "K\\alpha 2",
          50
        ],
        [
          1740,
          "K\\alpha 1",
          100
        ],
        [
          1835.9,
          "K\\beta 1",
          2
        ]
      ]
    },
    {
      symbol: "P",
      atomicNumber: 15,
      emissionLines: [
        [
          2012.7,
          "K\\alpha 2",
          50
        ],
        [
          2013.7,
          "K\\alpha 1",
          100
        ],
        [
          2139.1,
          "K\\beta 1",
          3
        ]
      ]
    },
    {
      symbol: "S",
      atomicNumber: 16,
      emissionLines: [
        [
          2306.6,
          "K\\alpha 2",
          50
        ],
        [
          2307.8,
          "K\\alpha 1",
          100
        ],
        [
          2464,
          "K\\beta 1",
          5
        ]
      ]
    },
    {
      symbol: "Cl",
      atomicNumber: 17,
      emissionLines: [
        [
          2620.8,
          "K\\alpha 2",
          50
        ],
        [
          2622.4,
          "K\\alpha 1",
          100
        ],
        [
          2815.6,
          "K\\beta 1",
          6
        ]
      ]
    },
    {
      symbol: "Ar",
      atomicNumber: 18,
      emissionLines: [
        [
          2955.6,
          "K\\alpha 2",
          50
        ],
        [
          2957.7,
          "K\\alpha 1",
          100
        ],
        [
          3190.5,
          "K\\beta 1,3",
          10
        ]
      ]
    },
    {
      symbol: "K",
      atomicNumber: 19,
      emissionLines: [
        [
          3311.1,
          "K\\alpha 2",
          50
        ],
        [
          3313.8,
          "K\\alpha 1",
          100
        ],
        [
          3589.6,
          "K\\beta 1,3",
          11
        ]
      ]
    },
    {
      symbol: "Ca",
      atomicNumber: 20,
      emissionLines: [
        [
          3688.1,
          "K\\alpha 2",
          50
        ],
        [
          3691.7,
          "K\\alpha 1",
          100
        ],
        [
          4012.7,
          "K\\beta 1,3",
          13
        ]
      ]
    },
    {
      symbol: "Sc",
      atomicNumber: 21,
      emissionLines: [
        [
          348.3,
          "Ll",
          21
        ],
        [
          395.4,
          "L\\alpha 1,2",
          111
        ],
        [
          399.6,
          "L\\beta 1",
          77
        ],
        [
          4086.1,
          "K\\alpha 2",
          50
        ],
        [
          4090.6,
          "K\\alpha 1",
          100
        ],
        [
          4460.5,
          "K\\beta 1,3",
          15
        ]
      ]
    },
    {
      symbol: "Ti",
      atomicNumber: 22,
      emissionLines: [
        [
          395.3,
          "Ll",
          46
        ],
        [
          452.2,
          "L\\alpha 1,2",
          111
        ],
        [
          458.4,
          "L\\beta 1",
          79
        ],
        [
          4504.9,
          "K\\alpha 2",
          50
        ],
        [
          4510.8,
          "K\\alpha 1",
          100
        ],
        [
          4931.8,
          "K\\beta 1,3",
          15
        ]
      ]
    },
    {
      symbol: "V",
      atomicNumber: 23,
      emissionLines: [
        [
          446.5,
          "Ll",
          28
        ],
        [
          511.3,
          "L\\alpha 1,2",
          111
        ],
        [
          519.2,
          "L\\beta 1",
          80
        ],
        [
          4944.6,
          "K\\alpha 2",
          50
        ],
        [
          4952.2,
          "K\\alpha 1",
          100
        ],
        [
          5427.3,
          "K\\beta 1,3",
          15
        ]
      ]
    },
    {
      symbol: "Cr",
      atomicNumber: 24,
      emissionLines: [
        [
          500.3,
          "Ll",
          17
        ],
        [
          572.8,
          "L\\alpha 1,2",
          111
        ],
        [
          582.8,
          "L\\beta 1",
          79
        ],
        [
          5405.5,
          "K\\alpha 2",
          50
        ],
        [
          5414.7,
          "K\\alpha 1",
          100
        ],
        [
          5946.7,
          "K\\beta 1,3",
          15
        ]
      ]
    },
    {
      symbol: "Mn",
      atomicNumber: 25,
      emissionLines: [
        [
          556.3,
          "Ll",
          15
        ],
        [
          637.4,
          "L\\alpha 1,2",
          111
        ],
        [
          648.8,
          "L\\beta 1",
          77
        ],
        [
          5887.6,
          "K\\alpha 2",
          50
        ],
        [
          5898.8,
          "K\\alpha 1",
          100
        ],
        [
          6490.4,
          "K\\beta 1,3",
          17
        ]
      ]
    },
    {
      symbol: "Fe",
      atomicNumber: 26,
      emissionLines: [
        [
          615.2,
          "Ll",
          10
        ],
        [
          705,
          "L\\alpha 1,2",
          111
        ],
        [
          718.5,
          "L\\beta 1",
          66
        ],
        [
          6390.8,
          "K\\alpha 2",
          50
        ],
        [
          6403.8,
          "K\\alpha 1",
          100
        ],
        [
          7058,
          "K\\beta 1,3",
          17
        ]
      ]
    },
    {
      symbol: "Co",
      atomicNumber: 27,
      emissionLines: [
        [
          677.8,
          "Ll",
          10
        ],
        [
          776.2,
          "L\\alpha 1,2",
          111
        ],
        [
          791.4,
          "L\\beta 1",
          76
        ],
        [
          6915.3,
          "K\\alpha 2",
          51
        ],
        [
          6930.3,
          "K\\alpha 1",
          100
        ],
        [
          7649.4,
          "K\\beta 1,3",
          17
        ]
      ]
    },
    {
      symbol: "Ni",
      atomicNumber: 28,
      emissionLines: [
        [
          742.7,
          "Ll",
          9
        ],
        [
          851.5,
          "L\\alpha 1,2",
          111
        ],
        [
          868.8,
          "L\\beta 1",
          68
        ],
        [
          7460.9,
          "K\\alpha 2",
          51
        ],
        [
          7478.2,
          "K\\alpha 1",
          100
        ],
        [
          8264.7,
          "K\\beta 1,3",
          17
        ]
      ]
    },
    {
      symbol: "Cu",
      atomicNumber: 29,
      emissionLines: [
        [
          811.1,
          "Ll",
          8
        ],
        [
          929.7,
          "L\\alpha 1,2",
          111
        ],
        [
          949.8,
          "L\\beta 1",
          65
        ],
        [
          8027.8,
          "K\\alpha 2",
          5
        ],
        [
          8047.8,
          "K\\alpha 1",
          100
        ],
        [
          8905.3,
          "K\\beta 1,3",
          17
        ]
      ]
    },
    {
      symbol: "Zn",
      atomicNumber: 30,
      emissionLines: [
        [
          884,
          "Ll",
          7
        ],
        [
          1011.7,
          "L\\alpha 1,2",
          111
        ],
        [
          1034.7,
          "L\\beta 1",
          65
        ],
        [
          8615.8,
          "K\\alpha 2",
          51
        ],
        [
          8638.9,
          "K\\alpha 1",
          100
        ],
        [
          9572,
          "K\\beta 1,3",
          17
        ]
      ]
    },
    {
      symbol: "Ga",
      atomicNumber: 31,
      emissionLines: [
        [
          957.2,
          "Ll",
          7
        ],
        [
          1097.9,
          "L\\alpha 1,2",
          111
        ],
        [
          1124.8,
          "L\\beta 1",
          66
        ],
        [
          9224.8,
          "K\\alpha 2",
          51
        ],
        [
          9251.7,
          "K\\alpha 1",
          100
        ],
        [
          10260.3,
          "K\\beta 3",
          5
        ],
        [
          10264.2,
          "K\\beta 1",
          66
        ]
      ]
    },
    {
      symbol: "Ge",
      atomicNumber: 32,
      emissionLines: [
        [
          1036.2,
          "Ll",
          6
        ],
        [
          1188,
          "L\\alpha 1,2",
          111
        ],
        [
          1218.5,
          "L\\beta 1",
          60
        ],
        [
          9855.3,
          "K\\alpha 2",
          51
        ],
        [
          9886.4,
          "K\\alpha 1",
          100
        ],
        [
          10978,
          "K\\beta 3",
          6
        ],
        [
          10982.1,
          "K\\beta 1",
          60
        ]
      ]
    },
    {
      symbol: "As",
      atomicNumber: 33,
      emissionLines: [
        [
          1120,
          "Ll",
          6
        ],
        [
          1282,
          "L\\alpha 1,2",
          111
        ],
        [
          1317,
          "L\\beta 1",
          60
        ],
        [
          10508,
          "K\\alpha 2",
          51
        ],
        [
          10543.7,
          "K\\alpha 1",
          100
        ],
        [
          11720.3,
          "K\\beta 3",
          6
        ],
        [
          11726.2,
          "K\\beta 1",
          13
        ],
        [
          11864,
          "K\\beta 2",
          1
        ]
      ]
    },
    {
      symbol: "Se",
      atomicNumber: 34,
      emissionLines: [
        [
          1204.4,
          "Ll",
          6
        ],
        [
          1379.1,
          "L\\alpha 1,2",
          111
        ],
        [
          1419.2,
          "L\\beta 1",
          59
        ],
        [
          11181.4,
          "K\\alpha 2",
          52
        ],
        [
          11222.4,
          "K\\alpha 1",
          100
        ],
        [
          12489.6,
          "K\\beta 3",
          6
        ],
        [
          12495.9,
          "K\\beta 1",
          13
        ],
        [
          12652,
          "K\\beta 2",
          1
        ]
      ]
    },
    {
      symbol: "Br",
      atomicNumber: 35,
      emissionLines: [
        [
          1293.5,
          "Ll",
          5
        ],
        [
          1480.4,
          "L\\alpha 1,2",
          111
        ],
        [
          1525.9,
          "L\\beta 1",
          59
        ],
        [
          11877.6,
          "K\\alpha 2",
          52
        ],
        [
          11924.2,
          "K\\alpha 1",
          100
        ],
        [
          13284.5,
          "K\\beta 3",
          7
        ],
        [
          13291.4,
          "K\\beta 1",
          14
        ],
        [
          13469.5,
          "K\\beta 2",
          1
        ]
      ]
    },
    {
      symbol: "Kr",
      atomicNumber: 36,
      emissionLines: [
        [
          1386,
          "Ll",
          5
        ],
        [
          1586,
          "L\\alpha 1,2",
          111
        ],
        [
          1636.6,
          "L\\beta 1",
          57
        ],
        [
          12598,
          "K\\alpha 2",
          52
        ],
        [
          12649,
          "K\\alpha 1",
          100
        ],
        [
          14104,
          "K\\beta 3",
          7
        ],
        [
          14112,
          "K\\beta 1",
          14
        ],
        [
          14315,
          "K\\beta 2",
          2
        ]
      ]
    },
    {
      symbol: "Rb",
      atomicNumber: 37,
      emissionLines: [
        [
          1482.4,
          "Ll",
          5
        ],
        [
          1692.6,
          "L\\alpha 2",
          11
        ],
        [
          1694.1,
          "L\\alpha 1",
          100
        ],
        [
          1752.2,
          "L\\beta 1",
          58
        ],
        [
          13335.8,
          "K\\alpha 2",
          52
        ],
        [
          13395.3,
          "K\\alpha 1",
          100
        ],
        [
          14951.7,
          "K\\beta 3",
          7
        ],
        [
          14961.3,
          "K\\beta 1",
          14
        ],
        [
          15185,
          "K\\beta 2",
          2
        ]
      ]
    },
    {
      symbol: "Sr",
      atomicNumber: 38,
      emissionLines: [
        [
          1582.2,
          "Ll",
          5
        ],
        [
          1804.7,
          "L\\alpha 2",
          11
        ],
        [
          1806.6,
          "L\\alpha 1",
          100
        ],
        [
          1871.7,
          "L\\beta 1",
          58
        ],
        [
          14097.9,
          "K\\alpha 2",
          52
        ],
        [
          14165,
          "K\\alpha 1",
          100
        ],
        [
          15824.9,
          "K\\beta 3",
          7
        ],
        [
          15835.7,
          "K\\beta 1",
          14
        ],
        [
          16084.6,
          "K\\beta 2",
          3
        ]
      ]
    },
    {
      symbol: "Y",
      atomicNumber: 39,
      emissionLines: [
        [
          1685.4,
          "Ll",
          5
        ],
        [
          1920.5,
          "L\\alpha 2",
          11
        ],
        [
          1922.6,
          "L\\alpha 1",
          100
        ],
        [
          1995.8,
          "L\\beta 1",
          57
        ],
        [
          14882.9,
          "K\\alpha 2",
          52
        ],
        [
          14958.4,
          "K\\alpha 1",
          100
        ],
        [
          16725.8,
          "K\\beta 3",
          8
        ],
        [
          16737.8,
          "K\\beta 1",
          15
        ],
        [
          17015.4,
          "K\\beta 2",
          3
        ]
      ]
    },
    {
      symbol: "Zr",
      atomicNumber: 40,
      emissionLines: [
        [
          1792,
          "Ll",
          5
        ],
        [
          2039.9,
          "L\\alpha 2",
          11
        ],
        [
          2042.4,
          "L\\alpha 1",
          100
        ],
        [
          2124.4,
          "L\\beta 1",
          54
        ],
        [
          2219.4,
          "L\\beta 2,15",
          1
        ],
        [
          2302.7,
          "L\\gamma 1",
          2
        ],
        [
          15690.9,
          "K\\alpha 2",
          52
        ],
        [
          15775.1,
          "K\\alpha 1",
          100
        ],
        [
          17654,
          "K\\beta 3",
          8
        ],
        [
          17667.8,
          "K\\beta 1",
          15
        ],
        [
          17970,
          "K\\beta 2",
          3
        ]
      ]
    },
    {
      symbol: "Nb",
      atomicNumber: 41,
      emissionLines: [
        [
          1902.2,
          "Ll",
          5
        ],
        [
          2163,
          "L\\alpha 2",
          11
        ],
        [
          2165.9,
          "L\\alpha 1",
          100
        ],
        [
          2257.4,
          "L\\beta 1",
          52
        ],
        [
          2367,
          "L\\beta 2,15",
          3
        ],
        [
          2461.8,
          "L\\gamma 1",
          2
        ],
        [
          16521,
          "K\\alpha 2",
          52
        ],
        [
          16615.1,
          "K\\alpha 1",
          100
        ],
        [
          18606.3,
          "K\\beta 3",
          8
        ],
        [
          18622.5,
          "K\\beta 1",
          15
        ],
        [
          18953,
          "K\\beta 2",
          3
        ]
      ]
    },
    {
      symbol: "Mo",
      atomicNumber: 42,
      emissionLines: [
        [
          2015.7,
          "Ll",
          5
        ],
        [
          2289.8,
          "L\\alpha 2",
          11
        ],
        [
          2293.2,
          "L\\alpha 1",
          100
        ],
        [
          2394.8,
          "L\\beta 1",
          53
        ],
        [
          2518.3,
          "L\\beta 2,15",
          5
        ],
        [
          2623.5,
          "L\\gamma 1",
          3
        ],
        [
          17374.3,
          "K\\alpha 2",
          52
        ],
        [
          17479.3,
          "K\\alpha 1",
          100
        ],
        [
          19590.3,
          "K\\beta 3",
          8
        ],
        [
          19608.3,
          "K\\beta 1",
          15
        ],
        [
          19965.2,
          "K\\beta 2",
          3
        ]
      ]
    },
    {
      symbol: "Tc",
      atomicNumber: 43,
      emissionLines: [
        [
          2122,
          "Ll",
          5
        ],
        [
          2420,
          "L\\alpha 2",
          11
        ],
        [
          2424,
          "L\\alpha 1",
          100
        ],
        [
          2538,
          "L\\beta 1",
          54
        ],
        [
          2674,
          "L\\beta 2,15",
          7
        ],
        [
          2792,
          "L\\gamma 1",
          3
        ],
        [
          18250.8,
          "K\\alpha 2",
          53
        ],
        [
          18367.1,
          "K\\alpha 1",
          100
        ],
        [
          20599,
          "K\\beta 3",
          8
        ],
        [
          20619,
          "K\\beta 1",
          16
        ],
        [
          21005,
          "K\\beta 2",
          4
        ]
      ]
    },
    {
      symbol: "Ru",
      atomicNumber: 44,
      emissionLines: [
        [
          2252.8,
          "Ll",
          4
        ],
        [
          2554.3,
          "L\\alpha 2",
          11
        ],
        [
          2558.6,
          "L\\alpha 1",
          100
        ],
        [
          2683.2,
          "L\\beta 1",
          54
        ],
        [
          2836,
          "L\\beta 2,15",
          10
        ],
        [
          2964.5,
          "L\\gamma 1",
          4
        ],
        [
          19150.4,
          "K\\alpha 2",
          53
        ],
        [
          19279.2,
          "K\\alpha 1",
          100
        ],
        [
          21634.6,
          "K\\beta 3",
          8
        ],
        [
          21656.8,
          "K\\beta 1",
          16
        ],
        [
          22074,
          "K\\beta 2",
          4
        ]
      ]
    },
    {
      symbol: "Rh",
      atomicNumber: 45,
      emissionLines: [
        [
          2376.5,
          "Ll",
          4
        ],
        [
          2692,
          "L\\alpha 2",
          11
        ],
        [
          2696.7,
          "L\\alpha 1",
          100
        ],
        [
          2834.4,
          "L\\beta 1",
          52
        ],
        [
          3001.3,
          "L\\beta 2,15",
          10
        ],
        [
          3143.8,
          "L\\gamma 1",
          5
        ],
        [
          20073.7,
          "K\\alpha 2",
          53
        ],
        [
          20216.1,
          "K\\alpha 1",
          100
        ],
        [
          22698.9,
          "K\\beta 3",
          8
        ],
        [
          22723.6,
          "K\\beta 1",
          16
        ],
        [
          23172.8,
          "K\\beta 2",
          4
        ]
      ]
    },
    {
      symbol: "Pd",
      atomicNumber: 46,
      emissionLines: [
        [
          2503.4,
          "Ll",
          4
        ],
        [
          2833.3,
          "L\\alpha 2",
          11
        ],
        [
          2838.6,
          "L\\alpha 1",
          100
        ],
        [
          2990.2,
          "L\\beta 1",
          53
        ],
        [
          3171.8,
          "L\\beta 2,15",
          12
        ],
        [
          3328.7,
          "L\\gamma 1",
          6
        ],
        [
          21020.1,
          "K\\alpha 2",
          53
        ],
        [
          21177.1,
          "K\\alpha 1",
          100
        ],
        [
          23791.1,
          "K\\beta 3",
          8
        ],
        [
          23818.7,
          "K\\beta 1",
          16
        ],
        [
          24299.1,
          "K\\beta 2",
          4
        ]
      ]
    },
    {
      symbol: "Ag",
      atomicNumber: 47,
      emissionLines: [
        [
          2633.7,
          "Ll",
          4
        ],
        [
          2978.2,
          "L\\alpha 2",
          11
        ],
        [
          2984.3,
          "L\\alpha 1",
          100
        ],
        [
          3150.9,
          "L\\beta 1",
          56
        ],
        [
          3347.8,
          "L\\beta 2,15",
          13
        ],
        [
          3519.6,
          "L\\gamma 1",
          6
        ],
        [
          21990.3,
          "K\\alpha 2",
          53
        ],
        [
          22162.9,
          "K\\alpha 1",
          100
        ],
        [
          24911.5,
          "K\\beta 3",
          9
        ],
        [
          24942.4,
          "K\\beta 1",
          16
        ],
        [
          25456.4,
          "K\\beta 2",
          4
        ]
      ]
    },
    {
      symbol: "Cd",
      atomicNumber: 48,
      emissionLines: [
        [
          2767.4,
          "Ll",
          4
        ],
        [
          3126.9,
          "L\\alpha 2",
          11
        ],
        [
          3133.7,
          "L\\alpha 1",
          100
        ],
        [
          3316.6,
          "L\\beta 1",
          58
        ],
        [
          3528.1,
          "L\\beta 2,15",
          15
        ],
        [
          3716.9,
          "L\\gamma 1",
          6
        ],
        [
          22984.1,
          "K\\alpha 2",
          53
        ],
        [
          23173.6,
          "K\\alpha 1",
          100
        ],
        [
          26061.2,
          "K\\beta 3",
          9
        ],
        [
          26095.5,
          "K\\beta 1",
          17
        ],
        [
          26643.8,
          "K\\beta 2",
          4
        ]
      ]
    },
    {
      symbol: "In",
      atomicNumber: 49,
      emissionLines: [
        [
          2904.4,
          "Ll",
          4
        ],
        [
          3279.3,
          "L\\alpha 2",
          11
        ],
        [
          3286.9,
          "L\\alpha 1",
          100
        ],
        [
          3487.2,
          "L\\beta 1",
          58
        ],
        [
          3713.8,
          "L\\beta 2,15",
          15
        ],
        [
          3920.8,
          "L\\gamma 1",
          6
        ],
        [
          24002,
          "K\\alpha 2",
          53
        ],
        [
          24209.7,
          "K\\alpha 1",
          100
        ],
        [
          27237.7,
          "K\\beta 3",
          9
        ],
        [
          27275.9,
          "K\\beta 1",
          17
        ],
        [
          27860.8,
          "K\\beta 2",
          5
        ]
      ]
    },
    {
      symbol: "Sn",
      atomicNumber: 50,
      emissionLines: [
        [
          3045,
          "Ll",
          4
        ],
        [
          3435.4,
          "L\\alpha 2",
          11
        ],
        [
          3444,
          "L\\alpha 1",
          100
        ],
        [
          3662.8,
          "L\\beta 1",
          60
        ],
        [
          3904.9,
          "L\\beta 2,15",
          16
        ],
        [
          4131.1,
          "L\\gamma 1",
          7
        ],
        [
          25044,
          "K\\alpha 2",
          53
        ],
        [
          25271.3,
          "K\\alpha 1",
          100
        ],
        [
          28444,
          "K\\beta 3",
          9
        ],
        [
          28486,
          "K\\beta 1",
          17
        ],
        [
          29109.3,
          "K\\beta 2",
          5
        ]
      ]
    },
    {
      symbol: "Sb",
      atomicNumber: 51,
      emissionLines: [
        [
          3188.6,
          "Ll",
          4
        ],
        [
          3595.3,
          "L\\alpha 2",
          11
        ],
        [
          3604.7,
          "L\\alpha 1",
          100
        ],
        [
          3843.6,
          "L\\beta 1",
          61
        ],
        [
          4100.8,
          "L\\beta 2,15",
          17
        ],
        [
          4347.8,
          "L\\gamma 1",
          8
        ],
        [
          26110.8,
          "K\\alpha 2",
          54
        ],
        [
          26359.1,
          "K\\alpha 1",
          100
        ],
        [
          29679.2,
          "K\\beta 3",
          9
        ],
        [
          29725.6,
          "K\\beta 1",
          18
        ],
        [
          30389.5,
          "K\\beta 2",
          5
        ]
      ]
    },
    {
      symbol: "Te",
      atomicNumber: 52,
      emissionLines: [
        [
          3335.6,
          "Ll",
          4
        ],
        [
          3758.8,
          "L\\alpha 2",
          11
        ],
        [
          3769.3,
          "L\\alpha 1",
          100
        ],
        [
          4029.6,
          "L\\beta 1",
          61
        ],
        [
          4301.7,
          "L\\beta 2,15",
          18
        ],
        [
          4570.9,
          "L\\gamma 1",
          8
        ],
        [
          27201.7,
          "K\\alpha 2",
          54
        ],
        [
          27472.3,
          "K\\alpha 1",
          100
        ],
        [
          30944.3,
          "K\\beta 3",
          9
        ],
        [
          30995.7,
          "K\\beta 1",
          18
        ],
        [
          31700.4,
          "K\\beta 2",
          5
        ]
      ]
    },
    {
      symbol: "I",
      atomicNumber: 53,
      emissionLines: [
        [
          3485,
          "Ll",
          4
        ],
        [
          3926,
          "L\\alpha 2",
          11
        ],
        [
          3937.6,
          "L\\alpha 1",
          100
        ],
        [
          4220.7,
          "L\\beta 1",
          61
        ],
        [
          4507.5,
          "L\\beta 2,15",
          19
        ],
        [
          4800.9,
          "L\\gamma 1",
          8
        ],
        [
          28317.2,
          "K\\alpha 2",
          54
        ],
        [
          28612,
          "K\\alpha 1",
          100
        ],
        [
          32239.4,
          "K\\beta 3",
          9
        ],
        [
          32294.7,
          "K\\beta 1",
          18
        ],
        [
          33042,
          "K\\beta 2",
          5
        ]
      ]
    },
    {
      symbol: "Xe",
      atomicNumber: 54,
      emissionLines: [
        [
          3636,
          "Ll",
          4
        ],
        [
          4093,
          "L\\alpha 2",
          11
        ],
        [
          4109.9,
          "L\\alpha 1",
          100
        ],
        [
          4414,
          "L\\beta 1",
          60
        ],
        [
          4714,
          "L\\beta 2,15",
          20
        ],
        [
          5034,
          "L\\gamma 1",
          8
        ],
        [
          29458,
          "K\\alpha 2",
          54
        ],
        [
          29779,
          "K\\alpha 1",
          100
        ],
        [
          33562,
          "K\\beta 3",
          9
        ],
        [
          33624,
          "K\\beta 1",
          18
        ],
        [
          34415,
          "K\\beta 2",
          5
        ]
      ]
    },
    {
      symbol: "Cs",
      atomicNumber: 55,
      emissionLines: [
        [
          3795,
          "Ll",
          4
        ],
        [
          4272.2,
          "L\\alpha 2",
          11
        ],
        [
          4286.5,
          "L\\alpha 1",
          100
        ],
        [
          4619.8,
          "L\\beta 1",
          61
        ],
        [
          4935.9,
          "L\\beta 2,15",
          20
        ],
        [
          5280.4,
          "L\\gamma 1",
          8
        ],
        [
          30625.1,
          "K\\alpha 2",
          54
        ],
        [
          30972.8,
          "K\\alpha 1",
          100
        ],
        [
          34919.4,
          "K\\beta 3",
          9
        ],
        [
          34986.9,
          "K\\beta 1",
          18
        ],
        [
          35822,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Ba",
      atomicNumber: 56,
      emissionLines: [
        [
          3954.1,
          "Ll",
          4
        ],
        [
          4450.9,
          "L\\alpha 2",
          11
        ],
        [
          4466.3,
          "L\\alpha 1",
          100
        ],
        [
          4827.5,
          "L\\beta 1",
          60
        ],
        [
          5156.5,
          "L\\beta 2,15",
          20
        ],
        [
          5531.1,
          "L\\gamma 1",
          9
        ],
        [
          31817.1,
          "K\\alpha 2",
          54
        ],
        [
          32193.6,
          "K\\alpha 1",
          100
        ],
        [
          36304,
          "K\\beta 3",
          10
        ],
        [
          36378.2,
          "K\\beta 1",
          18
        ],
        [
          37257,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "La",
      atomicNumber: 57,
      emissionLines: [
        [
          833,
          "M\\alpha 1",
          100
        ],
        [
          4124,
          "Ll",
          4
        ],
        [
          4634.2,
          "L\\alpha 2",
          11
        ],
        [
          4651,
          "L\\alpha 1",
          100
        ],
        [
          5042.1,
          "L\\beta 1",
          60
        ],
        [
          5383.5,
          "L\\beta 2,15",
          21
        ],
        [
          5788.5,
          "L\\gamma 1",
          9
        ],
        [
          33034.1,
          "K\\alpha 2",
          54
        ],
        [
          33441.8,
          "K\\alpha 1",
          100
        ],
        [
          37720.2,
          "K\\beta 3",
          10
        ],
        [
          37801,
          "K\\beta 1",
          19
        ],
        [
          38729.9,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Ce",
      atomicNumber: 58,
      emissionLines: [
        [
          883,
          "M\\alpha 1",
          100
        ],
        [
          4287.5,
          "Ll",
          4
        ],
        [
          4823,
          "L\\alpha 2",
          11
        ],
        [
          4840.2,
          "L\\alpha 1",
          100
        ],
        [
          5262.2,
          "L\\beta 1",
          61
        ],
        [
          5613.4,
          "L\\beta 2,15",
          21
        ],
        [
          6052,
          "L\\gamma 1",
          9
        ],
        [
          34278.9,
          "K\\alpha 2",
          55
        ],
        [
          34719.7,
          "K\\alpha 1",
          100
        ],
        [
          39170.1,
          "K\\beta 3",
          10
        ],
        [
          39257.3,
          "K\\beta 1",
          19
        ],
        [
          40233,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Pr",
      atomicNumber: 59,
      emissionLines: [
        [
          929.2,
          "M\\alpha 1",
          100
        ],
        [
          4453.2,
          "Ll",
          4
        ],
        [
          5013.5,
          "L\\alpha 2",
          11
        ],
        [
          5033.7,
          "L\\alpha 1",
          100
        ],
        [
          5488.9,
          "L\\beta 1",
          61
        ],
        [
          5850,
          "L\\beta 2,15",
          21
        ],
        [
          6322.1,
          "L\\gamma 1",
          9
        ],
        [
          35550.2,
          "K\\alpha 2",
          55
        ],
        [
          36026.3,
          "K\\alpha 1",
          100
        ],
        [
          40652.9,
          "K\\beta 3",
          10
        ],
        [
          40748.2,
          "K\\beta 1",
          19
        ],
        [
          41773,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Nd",
      atomicNumber: 60,
      emissionLines: [
        [
          978,
          "M\\alpha 1",
          100
        ],
        [
          4633,
          "Ll",
          4
        ],
        [
          5207.7,
          "L\\alpha 2",
          11
        ],
        [
          5230.4,
          "L\\alpha 1",
          100
        ],
        [
          5721.6,
          "L\\beta 1",
          60
        ],
        [
          6089.4,
          "L\\beta 2,15",
          21
        ],
        [
          6602.1,
          "L\\gamma 1",
          10
        ],
        [
          36847.4,
          "K\\alpha 2",
          55
        ],
        [
          37361,
          "K\\alpha 1",
          100
        ],
        [
          42166.5,
          "K\\beta 3",
          10
        ],
        [
          42271.3,
          "K\\beta 1",
          19
        ],
        [
          43335,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Pm",
      atomicNumber: 61,
      emissionLines: [
        [
          4809,
          "Ll",
          4
        ],
        [
          5408,
          "L\\alpha 2",
          11
        ],
        [
          5432,
          "L\\alpha 1",
          100
        ],
        [
          5961,
          "L\\beta 1",
          61
        ],
        [
          6339,
          "L\\beta 2",
          21
        ],
        [
          6892,
          "L\\gamma 1",
          10
        ],
        [
          38171.2,
          "K\\alpha 2",
          55
        ],
        [
          38724.7,
          "K\\alpha 1",
          100
        ],
        [
          43713,
          "K\\beta 3",
          10
        ],
        [
          43826,
          "K\\beta 1",
          19
        ],
        [
          44942,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Sm",
      atomicNumber: 62,
      emissionLines: [
        [
          1081,
          "M\\alpha 1",
          100
        ],
        [
          4994.5,
          "Ll",
          4
        ],
        [
          5609,
          "L\\alpha 2",
          11
        ],
        [
          5636.1,
          "L\\alpha 1",
          100
        ],
        [
          6205.1,
          "L\\beta 1",
          61
        ],
        [
          6587,
          "L\\beta 2,15",
          21
        ],
        [
          7178,
          "L\\gamma 1",
          10
        ],
        [
          39522.4,
          "K\\alpha 2",
          55
        ],
        [
          40118.1,
          "K\\alpha 1",
          100
        ],
        [
          45289,
          "K\\beta 3",
          10
        ],
        [
          45413,
          "K\\beta 1",
          19
        ],
        [
          46578,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Eu",
      atomicNumber: 63,
      emissionLines: [
        [
          1131,
          "M\\alpha 1",
          100
        ],
        [
          5177.2,
          "Ll",
          4
        ],
        [
          5816.6,
          "L\\alpha 2",
          11
        ],
        [
          5845.7,
          "L\\alpha 1",
          100
        ],
        [
          6456.4,
          "L\\beta 1",
          62
        ],
        [
          6843.2,
          "L\\beta 2,15",
          21
        ],
        [
          7480.3,
          "L\\gamma 1",
          10
        ],
        [
          40901.9,
          "K\\alpha 2",
          56
        ],
        [
          41542.2,
          "K\\alpha 1",
          100
        ],
        [
          46903.6,
          "K\\beta 3",
          10
        ],
        [
          47037.9,
          "K\\beta 1",
          19
        ],
        [
          48256,
          "K\\beta 2",
          6
        ]
      ]
    },
    {
      symbol: "Gd",
      atomicNumber: 64,
      emissionLines: [
        [
          1185,
          "M\\alpha 1",
          100
        ],
        [
          5362.1,
          "Ll",
          4
        ],
        [
          6025,
          "L\\alpha 2",
          11
        ],
        [
          6057.2,
          "L\\alpha 1",
          100
        ],
        [
          6713.2,
          "L\\beta 1",
          62
        ],
        [
          7102.8,
          "L\\beta 2,15",
          21
        ],
        [
          7785.8,
          "L\\gamma 1",
          11
        ],
        [
          42308.9,
          "K\\alpha 2",
          56
        ],
        [
          42996.2,
          "K\\alpha 1",
          100
        ],
        [
          48555,
          "K\\beta 3",
          10
        ],
        [
          48697,
          "K\\beta 1",
          20
        ],
        [
          49959,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Tb",
      atomicNumber: 65,
      emissionLines: [
        [
          1240,
          "M\\alpha 1",
          100
        ],
        [
          5546.7,
          "Ll",
          4
        ],
        [
          6238,
          "L\\alpha 2",
          11
        ],
        [
          6272.8,
          "L\\alpha 1",
          100
        ],
        [
          6978,
          "L\\beta 1",
          61
        ],
        [
          7366.7,
          "L\\beta 2,15",
          21
        ],
        [
          8102,
          "L\\gamma 1",
          11
        ],
        [
          43744.1,
          "K\\alpha 2",
          56
        ],
        [
          44481.6,
          "K\\alpha 1",
          100
        ],
        [
          50229,
          "K\\beta 3",
          10
        ],
        [
          50382,
          "K\\beta 1",
          20
        ],
        [
          51698,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Dy",
      atomicNumber: 66,
      emissionLines: [
        [
          1293,
          "M\\alpha 1",
          100
        ],
        [
          5743.1,
          "Ll",
          4
        ],
        [
          6457.7,
          "L\\alpha 2",
          11
        ],
        [
          6495.2,
          "L\\alpha 1",
          100
        ],
        [
          7247.7,
          "L\\beta 1",
          62
        ],
        [
          7635.7,
          "L\\beta 2",
          20
        ],
        [
          8418.8,
          "L\\gamma 1",
          11
        ],
        [
          45207.8,
          "K\\alpha 2",
          56
        ],
        [
          45998.4,
          "K\\alpha 1",
          100
        ],
        [
          51957,
          "K\\beta 3",
          10
        ],
        [
          52119,
          "K\\beta 1",
          20
        ],
        [
          53476,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Ho",
      atomicNumber: 67,
      emissionLines: [
        [
          1348,
          "M\\alpha 1",
          100
        ],
        [
          5943.4,
          "Ll",
          4
        ],
        [
          6679.5,
          "L\\alpha 2",
          11
        ],
        [
          6719.8,
          "L\\alpha 1",
          100
        ],
        [
          7525.3,
          "L\\beta 1",
          64
        ],
        [
          7911,
          "L\\beta 2,15",
          20
        ],
        [
          8747,
          "L\\gamma 1",
          11
        ],
        [
          46699.7,
          "K\\alpha 2",
          56
        ],
        [
          47546.7,
          "K\\alpha 1",
          100
        ],
        [
          53711,
          "K\\beta 3",
          11
        ],
        [
          53877,
          "K\\beta 1",
          20
        ],
        [
          55293,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Er",
      atomicNumber: 68,
      emissionLines: [
        [
          1406,
          "M\\alpha 1",
          100
        ],
        [
          6152,
          "Ll",
          4
        ],
        [
          6905,
          "L\\alpha 2",
          11
        ],
        [
          6948.7,
          "L\\alpha 1",
          100
        ],
        [
          7810.9,
          "L\\beta 1",
          64
        ],
        [
          8189,
          "L\\beta 2,15",
          20
        ],
        [
          9089,
          "L\\gamma 1",
          11
        ],
        [
          48221.1,
          "K\\alpha 2",
          56
        ],
        [
          49127.7,
          "K\\alpha 1",
          100
        ],
        [
          55494,
          "K\\beta 3",
          11
        ],
        [
          55681,
          "K\\beta 1",
          21
        ],
        [
          57210,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Tm",
      atomicNumber: 69,
      emissionLines: [
        [
          1462,
          "M\\alpha 1",
          100
        ],
        [
          6341.9,
          "Ll",
          4
        ],
        [
          7133.1,
          "L\\alpha 2",
          11
        ],
        [
          7179.9,
          "L\\alpha 1",
          100
        ],
        [
          8101,
          "L\\beta 1",
          64
        ],
        [
          8468,
          "L\\beta 2,15",
          20
        ],
        [
          9426,
          "L\\gamma 1",
          12
        ],
        [
          49772.6,
          "K\\alpha 2",
          57
        ],
        [
          50741.6,
          "K\\alpha 1",
          100
        ],
        [
          57304,
          "K\\beta 3",
          11
        ],
        [
          57517,
          "K\\beta 1",
          21
        ],
        [
          59090,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Yb",
      atomicNumber: 70,
      emissionLines: [
        [
          1521.4,
          "M\\alpha 1",
          100
        ],
        [
          6545.5,
          "Ll",
          4
        ],
        [
          7367.3,
          "L\\alpha 2",
          11
        ],
        [
          7415.6,
          "L\\alpha 1",
          100
        ],
        [
          8401.8,
          "L\\beta 1",
          65
        ],
        [
          8758.8,
          "L\\beta 2,15",
          20
        ],
        [
          9780.1,
          "L\\gamma 1",
          12
        ],
        [
          51354,
          "K\\alpha 2",
          57
        ],
        [
          52388.9,
          "K\\alpha 1",
          100
        ],
        [
          59140,
          "K\\beta 3",
          11
        ],
        [
          59370,
          "K\\beta 1",
          21
        ],
        [
          60980,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Lu",
      atomicNumber: 71,
      emissionLines: [
        [
          1581.3,
          "M\\alpha 1",
          100
        ],
        [
          6752.8,
          "Ll",
          4
        ],
        [
          7604.9,
          "L\\alpha 2",
          11
        ],
        [
          7655.5,
          "L\\alpha 1",
          100
        ],
        [
          8709,
          "L\\beta 1",
          66
        ],
        [
          9048.9,
          "L\\beta 2",
          19
        ],
        [
          10143.4,
          "L\\gamma 1",
          12
        ],
        [
          52965,
          "K\\alpha 2",
          57
        ],
        [
          54069.8,
          "K\\alpha 1",
          100
        ],
        [
          61050,
          "K\\beta 3",
          11
        ],
        [
          61283,
          "K\\beta 1",
          21
        ],
        [
          62970,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Hf",
      atomicNumber: 72,
      emissionLines: [
        [
          1644.6,
          "M\\alpha 1",
          100
        ],
        [
          6959.6,
          "Ll",
          5
        ],
        [
          7844.6,
          "L\\alpha 2",
          11
        ],
        [
          7899,
          "L\\alpha 1",
          100
        ],
        [
          9022.7,
          "L\\beta 1",
          67
        ],
        [
          9347.3,
          "L\\beta 2",
          20
        ],
        [
          10515.8,
          "L\\gamma 1",
          12
        ],
        [
          54611.4,
          "K\\alpha 2",
          57
        ],
        [
          55790.2,
          "K\\alpha 1",
          100
        ],
        [
          62980,
          "K\\beta 3",
          11
        ],
        [
          63234,
          "K\\beta 1",
          22
        ],
        [
          64980,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "Ta",
      atomicNumber: 73,
      emissionLines: [
        [
          1709.6,
          "M\\alpha 1",
          100
        ],
        [
          7173.1,
          "Ll",
          5
        ],
        [
          8087.9,
          "L\\alpha 2",
          11
        ],
        [
          8146.1,
          "L\\alpha 1",
          100
        ],
        [
          9343.1,
          "L\\beta 1",
          67
        ],
        [
          9651.8,
          "L\\beta 2",
          20
        ],
        [
          10895.2,
          "L\\gamma 1",
          12
        ],
        [
          56277,
          "K\\alpha 2",
          57
        ],
        [
          57532,
          "K\\alpha 1",
          100
        ],
        [
          64948.8,
          "K\\beta 3",
          11
        ],
        [
          65223,
          "K\\beta 1",
          22
        ],
        [
          66990,
          "K\\beta 2",
          7
        ]
      ]
    },
    {
      symbol: "W",
      atomicNumber: 74,
      emissionLines: [
        [
          1775.4,
          "M\\alpha 1",
          100
        ],
        [
          7387.8,
          "Ll",
          5
        ],
        [
          8335.2,
          "L\\alpha 2",
          11
        ],
        [
          8397.6,
          "L\\alpha 1",
          100
        ],
        [
          9672.4,
          "L\\beta 1",
          67
        ],
        [
          9961.5,
          "L\\beta 2",
          21
        ],
        [
          11285.9,
          "L\\gamma 1",
          13
        ],
        [
          57981.7,
          "K\\alpha 2",
          58
        ],
        [
          59318.2,
          "K\\alpha 1",
          100
        ],
        [
          66951.4,
          "K\\beta 3",
          11
        ],
        [
          67244.3,
          "K\\beta 1",
          22
        ],
        [
          69067,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Re",
      atomicNumber: 75,
      emissionLines: [
        [
          1842.5,
          "M\\alpha 1",
          100
        ],
        [
          7603.6,
          "Ll",
          5
        ],
        [
          8586.2,
          "L\\alpha 2",
          11
        ],
        [
          8652.5,
          "L\\alpha 1",
          100
        ],
        [
          10010,
          "L\\beta 1",
          66
        ],
        [
          10275.2,
          "L\\beta 2",
          22
        ],
        [
          11685.4,
          "L\\gamma 1",
          13
        ],
        [
          59717.9,
          "K\\alpha 2",
          58
        ],
        [
          61140.3,
          "K\\alpha 1",
          100
        ],
        [
          68994,
          "K\\beta 3",
          12
        ],
        [
          69310,
          "K\\beta 1",
          22
        ],
        [
          71232,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Os",
      atomicNumber: 76,
      emissionLines: [
        [
          1910.2,
          "M\\alpha 1",
          100
        ],
        [
          7822.2,
          "Ll",
          5
        ],
        [
          8841,
          "L\\alpha 2",
          11
        ],
        [
          8911.7,
          "L\\alpha 1",
          100
        ],
        [
          10355.3,
          "L\\beta 1",
          67
        ],
        [
          10598.5,
          "L\\beta 2",
          22
        ],
        [
          12095.3,
          "L\\gamma 1",
          13
        ],
        [
          61486.7,
          "K\\alpha 2",
          58
        ],
        [
          63000.5,
          "K\\alpha 1",
          100
        ],
        [
          71077,
          "K\\beta 3",
          12
        ],
        [
          71413,
          "K\\beta 1",
          23
        ],
        [
          73363,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Ir",
      atomicNumber: 77,
      emissionLines: [
        [
          1979.9,
          "M\\alpha 1",
          100
        ],
        [
          8045.8,
          "Ll",
          5
        ],
        [
          9099.5,
          "L\\alpha 2",
          11
        ],
        [
          9175.1,
          "L\\alpha 1",
          100
        ],
        [
          10708.3,
          "L\\beta 1",
          66
        ],
        [
          10920.3,
          "L\\beta 2",
          22
        ],
        [
          12512.6,
          "L\\gamma 1",
          13
        ],
        [
          63286.7,
          "K\\alpha 2",
          58
        ],
        [
          64895.6,
          "K\\alpha 1",
          100
        ],
        [
          73202.7,
          "K\\beta 3",
          12
        ],
        [
          73560.8,
          "K\\beta 1",
          23
        ],
        [
          75575,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Pt",
      atomicNumber: 78,
      emissionLines: [
        [
          2050.5,
          "M\\alpha 1",
          100
        ],
        [
          8268,
          "Ll",
          5
        ],
        [
          9361.8,
          "L\\alpha 2",
          11
        ],
        [
          9442.3,
          "L\\alpha 1",
          100
        ],
        [
          11070.7,
          "L\\beta 1",
          67
        ],
        [
          11250.5,
          "L\\beta 2",
          23
        ],
        [
          12942,
          "L\\gamma 1",
          13
        ],
        [
          65112,
          "K\\alpha 2",
          58
        ],
        [
          66832,
          "K\\alpha 1",
          100
        ],
        [
          75368,
          "K\\beta 3",
          12
        ],
        [
          75748,
          "K\\beta 1",
          23
        ],
        [
          77850,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Au",
      atomicNumber: 79,
      emissionLines: [
        [
          2122.9,
          "M\\alpha 1",
          100
        ],
        [
          8493.9,
          "Ll",
          5
        ],
        [
          9628,
          "L\\alpha 2",
          11
        ],
        [
          9713.3,
          "L\\alpha 1",
          100
        ],
        [
          11442.3,
          "L\\beta 1",
          67
        ],
        [
          11584.7,
          "L\\beta 2",
          23
        ],
        [
          13381.7,
          "L\\gamma 1",
          13
        ],
        [
          66989.5,
          "K\\alpha 2",
          59
        ],
        [
          68803.7,
          "K\\alpha 1",
          100
        ],
        [
          77580,
          "K\\beta 3",
          12
        ],
        [
          77984,
          "K\\beta 1",
          23
        ],
        [
          80150,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Hg",
      atomicNumber: 80,
      emissionLines: [
        [
          2195.3,
          "M\\alpha 1",
          100
        ],
        [
          8721,
          "Ll",
          5
        ],
        [
          9897.6,
          "L\\alpha 2",
          11
        ],
        [
          9988.8,
          "L\\alpha 1",
          100
        ],
        [
          11822.6,
          "L\\beta 1",
          67
        ],
        [
          11924.1,
          "L\\beta 2",
          24
        ],
        [
          13830.1,
          "L\\gamma 1",
          14
        ],
        [
          68895,
          "K\\alpha 2",
          59
        ],
        [
          70819,
          "K\\alpha 1",
          100
        ],
        [
          79822,
          "K\\beta 3",
          12
        ],
        [
          80253,
          "K\\beta 1",
          23
        ],
        [
          82515,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Tl",
      atomicNumber: 81,
      emissionLines: [
        [
          2270.6,
          "M\\alpha 1",
          100
        ],
        [
          8953.2,
          "Ll",
          6
        ],
        [
          10172.8,
          "L\\alpha 2",
          11
        ],
        [
          10268.5,
          "L\\alpha 1",
          100
        ],
        [
          12213.3,
          "L\\beta 1",
          67
        ],
        [
          12271.5,
          "L\\beta 2",
          25
        ],
        [
          14291.5,
          "L\\gamma 1",
          14
        ],
        [
          70831.9,
          "K\\alpha 2",
          60
        ],
        [
          72871.5,
          "K\\alpha 1",
          100
        ],
        [
          82118,
          "K\\beta 3",
          12
        ],
        [
          82576,
          "K\\beta 1",
          23
        ],
        [
          84910,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Pb",
      atomicNumber: 82,
      emissionLines: [
        [
          2345.5,
          "M\\alpha 1",
          100
        ],
        [
          9184.5,
          "Ll",
          6
        ],
        [
          10449.5,
          "L\\alpha 2",
          11
        ],
        [
          10551.5,
          "L\\alpha 1",
          100
        ],
        [
          12613.7,
          "L\\beta 1",
          66
        ],
        [
          12622.6,
          "L\\beta 2",
          25
        ],
        [
          14764.4,
          "L\\gamma 1",
          14
        ],
        [
          72804.2,
          "K\\alpha 2",
          60
        ],
        [
          74969.4,
          "K\\alpha 1",
          100
        ],
        [
          84450,
          "K\\beta 3",
          12
        ],
        [
          84936,
          "K\\beta 1",
          23
        ],
        [
          87320,
          "K\\beta 2",
          8
        ]
      ]
    },
    {
      symbol: "Bi",
      atomicNumber: 83,
      emissionLines: [
        [
          2422.6,
          "M\\alpha 1",
          100
        ],
        [
          9420.4,
          "Ll",
          6
        ],
        [
          10730.9,
          "L\\alpha 2",
          11
        ],
        [
          10838.8,
          "L\\alpha 1",
          100
        ],
        [
          12979.9,
          "L\\beta 2",
          25
        ],
        [
          13023.5,
          "L\\beta 1",
          67
        ],
        [
          15247.7,
          "L\\gamma 1",
          14
        ],
        [
          74814.8,
          "K\\alpha 2",
          60
        ],
        [
          77107.9,
          "K\\alpha 1",
          100
        ],
        [
          86834,
          "K\\beta 3",
          12
        ],
        [
          87343,
          "K\\beta 1",
          23
        ],
        [
          89830,
          "K\\beta 2",
          9
        ]
      ]
    },
    {
      symbol: "Th",
      atomicNumber: 90,
      emissionLines: [
        [
          2996.1,
          "M\\alpha 1",
          100
        ],
        [
          11118.6,
          "Ll",
          6
        ],
        [
          12809.6,
          "L\\alpha 2",
          11
        ],
        [
          12968.7,
          "L\\alpha 1",
          100
        ],
        [
          15623.7,
          "L\\beta 2",
          26
        ],
        [
          16202.2,
          "L\\beta 1",
          69
        ],
        [
          18982.5,
          "L\\gamma 1",
          16
        ],
        [
          89953,
          "K\\alpha 2",
          62
        ],
        [
          93350,
          "K\\alpha 1",
          100
        ],
        [
          104831,
          "K\\beta 3",
          12
        ],
        [
          105609,
          "K\\beta 1",
          24
        ],
        [
          108640,
          "K\\beta 2",
          9
        ]
      ]
    },
    {
      symbol: "U",
      atomicNumber: 92,
      emissionLines: [
        [
          3170.8,
          "M\\alpha 1",
          100
        ],
        [
          11618.3,
          "Ll",
          7
        ],
        [
          13438.8,
          "L\\alpha 2",
          11
        ],
        [
          13614.7,
          "L\\alpha 1",
          100
        ],
        [
          16428.3,
          "L\\beta 2",
          26
        ],
        [
          17220,
          "L\\beta 1",
          61
        ],
        [
          20167.1,
          "L\\gamma 1",
          15
        ],
        [
          94665,
          "K\\alpha 2",
          62
        ],
        [
          98439,
          "K\\alpha 1",
          100
        ],
        [
          110406,
          "K\\beta 3",
          13
        ],
        [
          111300,
          "K\\beta 1",
          24
        ],
        [
          114530,
          "K\\beta 2",
          9
        ]
      ]
    }
  ]
}

export const elementSymbols: string[] = ["Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Th", "U"]


