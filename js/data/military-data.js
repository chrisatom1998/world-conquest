/* ============================================================
   WORLD CONQUEST — Real-World Military Data
   Based on Global Firepower 2024 estimates
   ============================================================ */

const MILITARY_DATA = {
  USA: {
    name: "United States", flag: "🇺🇸", region: "North America",
    activeMilitary: 1390000, reserveMilitary: 442000,
    tanks: 6612, artillery: 3461, aircraft: 13300, fighters: 1957, helicopters: 5584,
    navalVessels: 484, submarines: 68, aircraftCarriers: 11,
    defenseBudget: 877, nuclearWeapons: 5550, powerIndex: 0.0712,
    gdp: 25460, population: 331900000, stability: 82, oilProduction: 11.9, foodSecurity: 95
  },
  RUS: {
    name: "Russia", flag: "🇷🇺", region: "Europe/Asia",
    activeMilitary: 1330000, reserveMilitary: 2000000,
    tanks: 12420, artillery: 7571, aircraft: 4255, fighters: 809, helicopters: 1543,
    navalVessels: 605, submarines: 64, aircraftCarriers: 1,
    defenseBudget: 109, nuclearWeapons: 6257, powerIndex: 0.0714,
    gdp: 2240, population: 144100000, stability: 68, oilProduction: 10.8, foodSecurity: 80
  },
  CHN: {
    name: "China", flag: "🇨🇳", region: "Asia",
    activeMilitary: 2000000, reserveMilitary: 510000,
    tanks: 5800, artillery: 5788, aircraft: 3260, fighters: 1200, helicopters: 912,
    navalVessels: 730, submarines: 78, aircraftCarriers: 3,
    defenseBudget: 292, nuclearWeapons: 350, powerIndex: 0.0722,
    gdp: 17960, population: 1412000000, stability: 78, oilProduction: 4.0, foodSecurity: 85
  },
  IND: {
    name: "India", flag: "🇮🇳", region: "Asia",
    activeMilitary: 1455550, reserveMilitary: 1155000,
    tanks: 4614, artillery: 4158, aircraft: 2296, fighters: 564, helicopters: 813,
    navalVessels: 295, submarines: 18, aircraftCarriers: 2,
    defenseBudget: 81.4, nuclearWeapons: 164, powerIndex: 0.1025,
    gdp: 3730, population: 1408000000, stability: 72, oilProduction: 0.8, foodSecurity: 70
  },
  KOR: {
    name: "South Korea", flag: "🇰🇷", region: "Asia",
    activeMilitary: 555000, reserveMilitary: 3100000,
    tanks: 2130, artillery: 6038, aircraft: 1595, fighters: 402, helicopters: 736,
    navalVessels: 234, submarines: 22, aircraftCarriers: 0,
    defenseBudget: 46.4, nuclearWeapons: 0, powerIndex: 0.1416,
    gdp: 1665, population: 51740000, stability: 85, oilProduction: 0, foodSecurity: 88
  },
  GBR: {
    name: "United Kingdom", flag: "🇬🇧", region: "Europe",
    activeMilitary: 150350, reserveMilitary: 37000,
    tanks: 227, artillery: 620, aircraft: 697, fighters: 133, helicopters: 314,
    navalVessels: 75, submarines: 10, aircraftCarriers: 2,
    defenseBudget: 68.4, nuclearWeapons: 225, powerIndex: 0.1435,
    gdp: 3070, population: 67330000, stability: 84, oilProduction: 0.8, foodSecurity: 90
  },
  JPN: {
    name: "Japan", flag: "🇯🇵", region: "Asia",
    activeMilitary: 247150, reserveMilitary: 56000,
    tanks: 1004, artillery: 600, aircraft: 1449, fighters: 297, helicopters: 540,
    navalVessels: 155, submarines: 23, aircraftCarriers: 0,
    defenseBudget: 47.6, nuclearWeapons: 0, powerIndex: 0.1599,
    gdp: 4230, population: 125700000, stability: 90, oilProduction: 0, foodSecurity: 92
  },
  TUR: {
    name: "Türkiye", flag: "🇹🇷", region: "Europe/Asia",
    activeMilitary: 355200, reserveMilitary: 378700,
    tanks: 3022, artillery: 2152, aircraft: 1067, fighters: 207, helicopters: 507,
    navalVessels: 194, submarines: 12, aircraftCarriers: 1,
    defenseBudget: 10.6, nuclearWeapons: 0, powerIndex: 0.1697,
    gdp: 906, population: 85280000, stability: 65, oilProduction: 0.07, foodSecurity: 78
  },
  PAK: {
    name: "Pakistan", flag: "🇵🇰", region: "Asia",
    activeMilitary: 654000, reserveMilitary: 550000,
    tanks: 3742, artillery: 2072, aircraft: 1387, fighters: 357, helicopters: 356,
    navalVessels: 114, submarines: 8, aircraftCarriers: 0,
    defenseBudget: 10.3, nuclearWeapons: 165, powerIndex: 0.1711,
    gdp: 376, population: 231400000, stability: 55, oilProduction: 0.08, foodSecurity: 60
  },
  ITA: {
    name: "Italy", flag: "🇮🇹", region: "Europe",
    activeMilitary: 165500, reserveMilitary: 18300,
    tanks: 200, artillery: 396, aircraft: 862, fighters: 94, helicopters: 377,
    navalVessels: 184, submarines: 8, aircraftCarriers: 2,
    defenseBudget: 29.2, nuclearWeapons: 0, powerIndex: 0.1863,
    gdp: 2010, population: 58940000, stability: 80, oilProduction: 0.1, foodSecurity: 88
  },
  FRA: {
    name: "France", flag: "🇫🇷", region: "Europe",
    activeMilitary: 205000, reserveMilitary: 35000,
    tanks: 406, artillery: 534, aircraft: 1055, fighters: 266, helicopters: 482,
    navalVessels: 180, submarines: 10, aircraftCarriers: 1,
    defenseBudget: 53.6, nuclearWeapons: 290, powerIndex: 0.1848,
    gdp: 2780, population: 67750000, stability: 78, oilProduction: 0.02, foodSecurity: 90
  },
  EGY: {
    name: "Egypt", flag: "🇪🇬", region: "Africa",
    activeMilitary: 438500, reserveMilitary: 479000,
    tanks: 4664, artillery: 2189, aircraft: 1092, fighters: 215, helicopters: 316,
    navalVessels: 316, submarines: 8, aircraftCarriers: 2,
    defenseBudget: 7.85, nuclearWeapons: 0, powerIndex: 0.1869,
    gdp: 476, population: 104260000, stability: 62, oilProduction: 0.6, foodSecurity: 55
  },
  BRA: {
    name: "Brazil", flag: "🇧🇷", region: "South America",
    activeMilitary: 366500, reserveMilitary: 1340000,
    tanks: 439, artillery: 900, aircraft: 679, fighters: 43, helicopters: 261,
    navalVessels: 112, submarines: 7, aircraftCarriers: 0,
    defenseBudget: 22.9, nuclearWeapons: 0, powerIndex: 0.1944,
    gdp: 1920, population: 214300000, stability: 70, oilProduction: 3.0, foodSecurity: 85
  },
  IDN: {
    name: "Indonesia", flag: "🇮🇩", region: "Asia",
    activeMilitary: 395500, reserveMilitary: 400000,
    tanks: 313, artillery: 533, aircraft: 451, fighters: 33, helicopters: 203,
    navalVessels: 282, submarines: 5, aircraftCarriers: 0,
    defenseBudget: 9.4, nuclearWeapons: 0, powerIndex: 0.2251,
    gdp: 1319, population: 275500000, stability: 72, oilProduction: 0.6, foodSecurity: 78
  },
  DEU: {
    name: "Germany", flag: "🇩🇪", region: "Europe",
    activeMilitary: 184000, reserveMilitary: 30000,
    tanks: 266, artillery: 421, aircraft: 626, fighters: 128, helicopters: 266,
    navalVessels: 80, submarines: 6, aircraftCarriers: 0,
    defenseBudget: 55.8, nuclearWeapons: 0, powerIndex: 0.2322,
    gdp: 4070, population: 83200000, stability: 88, oilProduction: 0.04, foodSecurity: 92
  },
  IRN: {
    name: "Iran", flag: "🇮🇷", region: "Middle East",
    activeMilitary: 610000, reserveMilitary: 350000,
    tanks: 1996, artillery: 2840, aircraft: 551, fighters: 186, helicopters: 126,
    navalVessels: 398, submarines: 19, aircraftCarriers: 0,
    defenseBudget: 6.8, nuclearWeapons: 0, powerIndex: 0.2269,
    gdp: 388, population: 87920000, stability: 55, oilProduction: 3.8, foodSecurity: 72
  },
  AUS: {
    name: "Australia", flag: "🇦🇺", region: "Oceania",
    activeMilitary: 60500, reserveMilitary: 28600,
    tanks: 59, artillery: 295, aircraft: 456, fighters: 79, helicopters: 184,
    navalVessels: 48, submarines: 6, aircraftCarriers: 0,
    defenseBudget: 32.3, nuclearWeapons: 0, powerIndex: 0.2405,
    gdp: 1675, population: 26000000, stability: 90, oilProduction: 0.3, foodSecurity: 95
  },
  ISR: {
    name: "Israel", flag: "🇮🇱", region: "Middle East",
    activeMilitary: 170000, reserveMilitary: 465000,
    tanks: 2200, artillery: 650, aircraft: 601, fighters: 241, helicopters: 146,
    navalVessels: 67, submarines: 5, aircraftCarriers: 0,
    defenseBudget: 23.4, nuclearWeapons: 90, powerIndex: 0.2596,
    gdp: 525, population: 9660000, stability: 70, oilProduction: 0, foodSecurity: 82
  },
  SAU: {
    name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East",
    activeMilitary: 257000, reserveMilitary: 0,
    tanks: 1062, artillery: 1210, aircraft: 897, fighters: 281, helicopters: 245,
    navalVessels: 55, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 75.8, nuclearWeapons: 0, powerIndex: 0.2724,
    gdp: 1108, population: 36410000, stability: 75, oilProduction: 10.5, foodSecurity: 70
  },
  UKR: {
    name: "Ukraine", flag: "🇺🇦", region: "Europe",
    activeMilitary: 500000, reserveMilitary: 250000,
    tanks: 1890, artillery: 3508, aircraft: 318, fighters: 69, helicopters: 112,
    navalVessels: 38, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 5.9, nuclearWeapons: 0, powerIndex: 0.2798,
    gdp: 161, population: 43790000, stability: 50, oilProduction: 0.06, foodSecurity: 72
  },
  POL: {
    name: "Poland", flag: "🇵🇱", region: "Europe",
    activeMilitary: 114050, reserveMilitary: 20000,
    tanks: 1228, artillery: 1168, aircraft: 466, fighters: 48, helicopters: 242,
    navalVessels: 46, submarines: 1, aircraftCarriers: 0,
    defenseBudget: 16.8, nuclearWeapons: 0, powerIndex: 0.3406,
    gdp: 688, population: 37750000, stability: 82, oilProduction: 0.02, foodSecurity: 88
  },
  TWN: {
    name: "Taiwan", flag: "🇹🇼", region: "Asia",
    activeMilitary: 170000, reserveMilitary: 1657000,
    tanks: 750, artillery: 1618, aircraft: 741, fighters: 286, helicopters: 229,
    navalVessels: 117, submarines: 4, aircraftCarriers: 0,
    defenseBudget: 16.7, nuclearWeapons: 0, powerIndex: 0.3445,
    gdp: 790, population: 23890000, stability: 85, oilProduction: 0, foodSecurity: 82
  },
  THA: {
    name: "Thailand", flag: "🇹🇭", region: "Asia",
    activeMilitary: 360850, reserveMilitary: 200000,
    tanks: 722, artillery: 824, aircraft: 563, fighters: 60, helicopters: 233,
    navalVessels: 292, submarines: 0, aircraftCarriers: 1,
    defenseBudget: 7.7, nuclearWeapons: 0, powerIndex: 0.3571,
    gdp: 536, population: 71800000, stability: 68, oilProduction: 0.2, foodSecurity: 80
  },
  VNM: {
    name: "Vietnam", flag: "🇻🇳", region: "Asia",
    activeMilitary: 482000, reserveMilitary: 5000000,
    tanks: 2050, artillery: 2700, aircraft: 318, fighters: 71, helicopters: 120,
    navalVessels: 65, submarines: 6, aircraftCarriers: 0,
    defenseBudget: 7.9, nuclearWeapons: 0, powerIndex: 0.3586,
    gdp: 409, population: 99460000, stability: 75, oilProduction: 0.2, foodSecurity: 82
  },
  ESP: {
    name: "Spain", flag: "🇪🇸", region: "Europe",
    activeMilitary: 124100, reserveMilitary: 16000,
    tanks: 327, artillery: 438, aircraft: 511, fighters: 125, helicopters: 182,
    navalVessels: 54, submarines: 2, aircraftCarriers: 1,
    defenseBudget: 14.5, nuclearWeapons: 0, powerIndex: 0.3574,
    gdp: 1398, population: 47420000, stability: 82, oilProduction: 0.01, foodSecurity: 88
  },
  CAN: {
    name: "Canada", flag: "🇨🇦", region: "North America",
    activeMilitary: 72000, reserveMilitary: 36500,
    tanks: 82, artillery: 195, aircraft: 383, fighters: 64, helicopters: 146,
    navalVessels: 63, submarines: 4, aircraftCarriers: 0,
    defenseBudget: 26.5, nuclearWeapons: 0, powerIndex: 0.3956,
    gdp: 2140, population: 38930000, stability: 90, oilProduction: 4.7, foodSecurity: 95
  },
  ARG: {
    name: "Argentina", flag: "🇦🇷", region: "South America",
    activeMilitary: 80400, reserveMilitary: 0,
    tanks: 348, artillery: 470, aircraft: 247, fighters: 24, helicopters: 72,
    navalVessels: 42, submarines: 3, aircraftCarriers: 0,
    defenseBudget: 4.3, nuclearWeapons: 0, powerIndex: 0.4231,
    gdp: 632, population: 45810000, stability: 58, oilProduction: 0.6, foodSecurity: 82
  },
  PRK: {
    name: "North Korea", flag: "🇰🇵", region: "Asia",
    activeMilitary: 1280000, reserveMilitary: 600000,
    tanks: 5895, artillery: 21100, aircraft: 949, fighters: 458, helicopters: 202,
    navalVessels: 492, submarines: 36, aircraftCarriers: 0,
    defenseBudget: 3.6, nuclearWeapons: 50, powerIndex: 0.2811,
    gdp: 18, population: 25970000, stability: 60, oilProduction: 0, foodSecurity: 40
  },
  NGA: {
    name: "Nigeria", flag: "🇳🇬", region: "Africa",
    activeMilitary: 223000, reserveMilitary: 0,
    tanks: 391, artillery: 396, aircraft: 148, fighters: 11, helicopters: 52,
    navalVessels: 75, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 2.6, nuclearWeapons: 0, powerIndex: 0.4720,
    gdp: 477, population: 218500000, stability: 50, oilProduction: 1.4, foodSecurity: 55
  },
  ZAF: {
    name: "South Africa", flag: "🇿🇦", region: "Africa",
    activeMilitary: 73000, reserveMilitary: 15000,
    tanks: 195, artillery: 380, aircraft: 219, fighters: 17, helicopters: 94,
    navalVessels: 30, submarines: 3, aircraftCarriers: 0,
    defenseBudget: 3.6, nuclearWeapons: 0, powerIndex: 0.4632,
    gdp: 405, population: 60600000, stability: 58, oilProduction: 0, foodSecurity: 65
  },
  MEX: {
    name: "Mexico", flag: "🇲🇽", region: "North America",
    activeMilitary: 277150, reserveMilitary: 81500,
    tanks: 0, artillery: 368, aircraft: 478, fighters: 0, helicopters: 248,
    navalVessels: 143, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 8.6, nuclearWeapons: 0, powerIndex: 0.4274,
    gdp: 1322, population: 128900000, stability: 62, oilProduction: 1.7, foodSecurity: 75
  },
  SWE: {
    name: "Sweden", flag: "🇸🇪", region: "Europe",
    activeMilitary: 24400, reserveMilitary: 31800,
    tanks: 122, artillery: 260, aircraft: 210, fighters: 98, helicopters: 49,
    navalVessels: 74, submarines: 5, aircraftCarriers: 0,
    defenseBudget: 8.4, nuclearWeapons: 0, powerIndex: 0.4391,
    gdp: 586, population: 10420000, stability: 92, oilProduction: 0, foodSecurity: 92
  },
  NOR: {
    name: "Norway", flag: "🇳🇴", region: "Europe",
    activeMilitary: 26800, reserveMilitary: 40000,
    tanks: 36, artillery: 93, aircraft: 169, fighters: 57, helicopters: 63,
    navalVessels: 62, submarines: 6, aircraftCarriers: 0,
    defenseBudget: 8.1, nuclearWeapons: 0, powerIndex: 0.4983,
    gdp: 579, population: 5470000, stability: 95, oilProduction: 1.8, foodSecurity: 95
  },
  GRC: {
    name: "Greece", flag: "🇬🇷", region: "Europe",
    activeMilitary: 142700, reserveMilitary: 221350,
    tanks: 1244, artillery: 1398, aircraft: 633, fighters: 187, helicopters: 199,
    navalVessels: 115, submarines: 11, aircraftCarriers: 0,
    defenseBudget: 8.1, nuclearWeapons: 0, powerIndex: 0.3712,
    gdp: 219, population: 10640000, stability: 72, oilProduction: 0, foodSecurity: 82
  },
  NLD: {
    name: "Netherlands", flag: "🇳🇱", region: "Europe",
    activeMilitary: 40600, reserveMilitary: 5000,
    tanks: 18, artillery: 150, aircraft: 162, fighters: 24, helicopters: 62,
    navalVessels: 33, submarines: 4, aircraftCarriers: 0,
    defenseBudget: 14.4, nuclearWeapons: 0, powerIndex: 0.5071,
    gdp: 1009, population: 17590000, stability: 90, oilProduction: 0.02, foodSecurity: 92
  },
  MYS: {
    name: "Malaysia", flag: "🇲🇾", region: "Asia",
    activeMilitary: 113000, reserveMilitary: 296500,
    tanks: 74, artillery: 362, aircraft: 279, fighters: 26, helicopters: 79,
    navalVessels: 88, submarines: 2, aircraftCarriers: 0,
    defenseBudget: 4.1, nuclearWeapons: 0, powerIndex: 0.4633,
    gdp: 407, population: 33570000, stability: 75, oilProduction: 0.6, foodSecurity: 80
  },
  COL: {
    name: "Colombia", flag: "🇨🇴", region: "South America",
    activeMilitary: 295000, reserveMilitary: 34950,
    tanks: 0, artillery: 225, aircraft: 457, fighters: 22, helicopters: 246,
    navalVessels: 234, submarines: 4, aircraftCarriers: 0,
    defenseBudget: 12.2, nuclearWeapons: 0, powerIndex: 0.4254,
    gdp: 343, population: 51870000, stability: 60, oilProduction: 0.7, foodSecurity: 72
  },
  PHL: {
    name: "Philippines", flag: "🇵🇭", region: "Asia",
    activeMilitary: 150000, reserveMilitary: 280000,
    tanks: 30, artillery: 291, aircraft: 280, fighters: 0, helicopters: 117,
    navalVessels: 120, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 4.2, nuclearWeapons: 0, powerIndex: 0.4691,
    gdp: 404, population: 113900000, stability: 65, oilProduction: 0, foodSecurity: 72
  },
  PER: {
    name: "Peru", flag: "🇵🇪", region: "South America",
    activeMilitary: 120660, reserveMilitary: 188000,
    tanks: 85, artillery: 295, aircraft: 275, fighters: 24, helicopters: 65,
    navalVessels: 60, submarines: 6, aircraftCarriers: 0,
    defenseBudget: 2.8, nuclearWeapons: 0, powerIndex: 0.5192,
    gdp: 242, population: 33720000, stability: 58, oilProduction: 0.04, foodSecurity: 70
  },
  CHL: {
    name: "Chile", flag: "🇨🇱", region: "South America",
    activeMilitary: 80000, reserveMilitary: 40000,
    tanks: 243, artillery: 270, aircraft: 267, fighters: 46, helicopters: 64,
    navalVessels: 69, submarines: 4, aircraftCarriers: 0,
    defenseBudget: 5.6, nuclearWeapons: 0, powerIndex: 0.4861,
    gdp: 301, population: 19490000, stability: 78, oilProduction: 0.01, foodSecurity: 85
  },
  DZA: {
    name: "Algeria", flag: "🇩🇿", region: "Africa",
    activeMilitary: 130000, reserveMilitary: 150000,
    tanks: 2405, artillery: 1262, aircraft: 551, fighters: 90, helicopters: 251,
    navalVessels: 213, submarines: 6, aircraftCarriers: 0,
    defenseBudget: 9.1, nuclearWeapons: 0, powerIndex: 0.3589,
    gdp: 188, population: 44900000, stability: 60, oilProduction: 1.0, foodSecurity: 65
  },
  IRQ: {
    name: "Iraq", flag: "🇮🇶", region: "Middle East",
    activeMilitary: 193000, reserveMilitary: 0,
    tanks: 272, artillery: 500, aircraft: 350, fighters: 34, helicopters: 100,
    navalVessels: 14, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 7.1, nuclearWeapons: 0, powerIndex: 0.5597,
    gdp: 264, population: 43530000, stability: 45, oilProduction: 4.4, foodSecurity: 55
  },
  ETH: {
    name: "Ethiopia", flag: "🇪🇹", region: "Africa",
    activeMilitary: 162000, reserveMilitary: 0,
    tanks: 440, artillery: 650, aircraft: 92, fighters: 24, helicopters: 44,
    navalVessels: 0, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 1.0, nuclearWeapons: 0, powerIndex: 0.5745,
    gdp: 126, population: 120280000, stability: 42, oilProduction: 0, foodSecurity: 40
  },
  MMR: {
    name: "Myanmar", flag: "🇲🇲", region: "Asia",
    activeMilitary: 406000, reserveMilitary: 0,
    tanks: 504, artillery: 876, aircraft: 267, fighters: 61, helicopters: 78,
    navalVessels: 135, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 2.4, nuclearWeapons: 0, powerIndex: 0.4089,
    gdp: 65, population: 54410000, stability: 35, oilProduction: 0, foodSecurity: 55
  },
  ROU: {
    name: "Romania", flag: "🇷🇴", region: "Europe",
    activeMilitary: 72500, reserveMilitary: 53000,
    tanks: 420, artillery: 556, aircraft: 149, fighters: 17, helicopters: 72,
    navalVessels: 30, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 5.2, nuclearWeapons: 0, powerIndex: 0.5289,
    gdp: 301, population: 19120000, stability: 75, oilProduction: 0.07, foodSecurity: 85
  },
  KAZ: {
    name: "Kazakhstan", flag: "🇰🇿", region: "Asia",
    activeMilitary: 39000, reserveMilitary: 31500,
    tanks: 890, artillery: 586, aircraft: 207, fighters: 57, helicopters: 84,
    navalVessels: 17, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 3.2, nuclearWeapons: 0, powerIndex: 0.5595,
    gdp: 225, population: 19400000, stability: 70, oilProduction: 1.8, foodSecurity: 78
  },
  ARE: {
    name: "UAE", flag: "🇦🇪", region: "Middle East",
    activeMilitary: 63000, reserveMilitary: 0,
    tanks: 454, artillery: 495, aircraft: 558, fighters: 141, helicopters: 182,
    navalVessels: 75, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 22.8, nuclearWeapons: 0, powerIndex: 0.3453,
    gdp: 507, population: 9440000, stability: 88, oilProduction: 3.2, foodSecurity: 78
  },
  NZL: {
    name: "New Zealand", flag: "🇳🇿", region: "Oceania",
    activeMilitary: 9600, reserveMilitary: 2400,
    tanks: 0, artillery: 24, aircraft: 52, fighters: 0, helicopters: 25,
    navalVessels: 10, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 3.1, nuclearWeapons: 0, powerIndex: 0.8375,
    gdp: 247, population: 5120000, stability: 95, oilProduction: 0.01, foodSecurity: 95
  },
  PRT: {
    name: "Portugal", flag: "🇵🇹", region: "Europe",
    activeMilitary: 24700, reserveMilitary: 211950,
    tanks: 224, artillery: 245, aircraft: 106, fighters: 27, helicopters: 34,
    navalVessels: 38, submarines: 2, aircraftCarriers: 0,
    defenseBudget: 4.1, nuclearWeapons: 0, powerIndex: 0.5349,
    gdp: 255, population: 10330000, stability: 82, oilProduction: 0, foodSecurity: 88
  },
  FIN: {
    name: "Finland", flag: "🇫🇮", region: "Europe",
    activeMilitary: 23800, reserveMilitary: 900000,
    tanks: 200, artillery: 700, aircraft: 164, fighters: 62, helicopters: 27,
    navalVessels: 27, submarines: 0, aircraftCarriers: 0,
    defenseBudget: 4.9, nuclearWeapons: 0, powerIndex: 0.5078,
    gdp: 282, population: 5540000, stability: 92, oilProduction: 0, foodSecurity: 92
  }
};

/**
 * Adjacency map: which countries share land or sea borders.
 * Used for attack targeting — you can only attack neighbors.
 */
const NEIGHBORS = {
  USA: ["CAN", "MEX", "RUS", "GBR", "JPN", "KOR", "CHN"],
  RUS: ["CHN", "PRK", "JPN", "KAZ", "UKR", "FIN", "NOR", "POL", "ROU", "TUR", "GRC", "USA"],
  CHN: ["RUS", "IND", "PAK", "PRK", "KOR", "JPN", "VNM", "MMR", "TWN", "KAZ", "MYS", "PHL"],
  IND: ["CHN", "PAK", "MMR", "IDN", "IRN", "ARE", "SAU"],
  KOR: ["PRK", "JPN", "CHN", "USA"],
  GBR: ["FRA", "NLD", "NOR", "ITA", "ESP", "USA"],
  JPN: ["KOR", "CHN", "RUS", "TWN", "USA", "PHL"],
  TUR: ["GRC", "ROU", "IRN", "IRQ", "SAU", "EGY", "RUS", "UKR", "ISR"],
  PAK: ["IND", "CHN", "IRN", "ARE", "SAU"],
  ITA: ["FRA", "GRC", "ESP", "GBR", "DZA", "EGY", "TUR"],
  FRA: ["GBR", "DEU", "ITA", "ESP", "NLD", "DZA"],
  EGY: ["ISR", "SAU", "DZA", "ETH", "NGA", "ITA", "GRC", "TUR", "IRQ"],
  BRA: ["ARG", "COL", "PER", "CHL"],
  IDN: ["MYS", "AUS", "PHL", "IND", "THA", "VNM"],
  DEU: ["FRA", "NLD", "POL", "SWE", "NOR", "GBR"],
  IRN: ["IRQ", "PAK", "TUR", "ARE", "SAU", "KAZ", "IND"],
  AUS: ["IDN", "NZL", "PHL", "MYS"],
  ISR: ["EGY", "SAU", "TUR", "IRQ"],
  SAU: ["ISR", "EGY", "IRQ", "IRN", "ARE", "PAK", "IND", "ETH", "TUR"],
  UKR: ["RUS", "POL", "ROU", "TUR"],
  POL: ["DEU", "UKR", "SWE", "ROU", "RUS"],
  TWN: ["CHN", "JPN", "PHL"],
  THA: ["VNM", "MMR", "MYS", "IDN"],
  VNM: ["CHN", "THA", "PHL", "MYS", "IDN"],
  ESP: ["FRA", "PRT", "ITA", "DZA", "GBR"],
  CAN: ["USA"],
  ARG: ["BRA", "CHL", "PER", "COL"],
  PRK: ["KOR", "CHN", "RUS", "JPN"],
  NGA: ["DZA", "EGY", "ETH", "ZAF"],
  ZAF: ["NGA", "ETH", "DZA"],
  MEX: ["USA", "COL", "BRA"],
  SWE: ["NOR", "FIN", "DEU", "POL", "GBR"],
  NOR: ["SWE", "FIN", "RUS", "GBR", "DEU"],
  GRC: ["TUR", "ITA", "ROU", "EGY"],
  NLD: ["DEU", "GBR", "FRA"],
  MYS: ["IDN", "THA", "VNM", "PHL", "AUS"],
  COL: ["BRA", "PER", "MEX", "ARG"],
  PHL: ["TWN", "JPN", "IDN", "MYS", "VNM"],
  PER: ["BRA", "CHL", "COL", "ARG"],
  CHL: ["ARG", "PER", "BRA"],
  DZA: ["FRA", "ESP", "EGY", "NGA", "ETH", "ZAF", "ITA"],
  IRQ: ["IRN", "TUR", "SAU", "ISR", "EGY"],
  ETH: ["EGY", "SAU", "NGA", "ZAF", "DZA"],
  MMR: ["CHN", "IND", "THA"],
  ROU: ["UKR", "POL", "GRC", "TUR", "RUS"],
  KAZ: ["RUS", "CHN", "IRN"],
  ARE: ["SAU", "IRN", "PAK", "IND"],
  NZL: ["AUS"],
  PRT: ["ESP"],
  FIN: ["SWE", "NOR", "RUS"]
};

/**
 * Utility: format a number with commas
 */
function formatNumber(n) {
  if (n === undefined || n === null) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}

/**
 * Get neighbor country codes for a given country
 */
function getNeighbors(code) {
  return NEIGHBORS[code] || [];
}

/**
 * Calculate a composite military strength score for combat
 * Returns a number where higher = stronger
 */
function calcStrength(data) {
  if (!data) return 0;
  return (
    (data.activeMilitary || 0) * 1 +
    (data.reserveMilitary || 0) * 0.3 +
    (data.tanks || 0) * 50 +
    (data.artillery || 0) * 30 +
    (data.aircraft || 0) * 100 +
    (data.fighters || 0) * 200 +
    (data.helicopters || 0) * 80 +
    ((data.navalVessels || data.navelVessels || 0)) * 300 +
    (data.submarines || 0) * 1500 +
    (data.aircraftCarriers || 0) * 50000 +
    (data.nuclearWeapons || 0) * 5000 +
    (data.defenseBudget || 0) * 10000
  );
}
