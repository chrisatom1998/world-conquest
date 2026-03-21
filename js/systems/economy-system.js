/* ============================================================
   WORLD CONQUEST — Economy System (SuperPower 2-Style)
   Taxation, spending allocation, sectors, resources, debt
   ============================================================ */

/* ---------- Economic Sectors ---------- */
const ECONOMIC_SECTORS = {
  agriculture:   { name: "Agriculture",    icon: "🌾", baseContrib: 0.08 },
  mining:        { name: "Mining",          icon: "⛏️", baseContrib: 0.06 },
  manufacturing: { name: "Manufacturing",  icon: "🏭", baseContrib: 0.22 },
  energy:        { name: "Energy",          icon: "⚡", baseContrib: 0.12 },
  services:      { name: "Services",        icon: "🏢", baseContrib: 0.25 },
  telecom:       { name: "Telecommunications", icon: "📡", baseContrib: 0.10 },
  finance:       { name: "Finance",         icon: "🏦", baseContrib: 0.12 },
  tourism:       { name: "Tourism",         icon: "🏖️", baseContrib: 0.05 }
};

/* ---------- Spending Categories ---------- */
const SPENDING_CATEGORIES = {
  military:       { name: "Military",       icon: "🎖️", description: "Unit upkeep, production speed, recruiting" },
  education:      { name: "Education",      icon: "🎓", description: "Tech research speed, GDP growth" },
  healthcare:     { name: "Healthcare",     icon: "🏥", description: "Population growth, stability" },
  infrastructure: { name: "Infrastructure", icon: "🏗️", description: "GDP multiplier, trade efficiency" },
  research:       { name: "Research",       icon: "🔬", description: "Tech level advancement rate" }
};

/* ---------- Resource Types ---------- */
const RESOURCE_TYPES = {
  oil:      { name: "Oil",       icon: "🛢️", unit: "M bbl/day", pricePerUnit: 15 },
  minerals: { name: "Minerals",  icon: "💎", unit: "M tons",     pricePerUnit: 8 },
  food:     { name: "Food",      icon: "🌽", unit: "M tons",     pricePerUnit: 3 },
  steel:    { name: "Steel",     icon: "🔩", unit: "M tons",     pricePerUnit: 5 },
  tech:     { name: "Tech Goods",icon: "💻", unit: "B units",    pricePerUnit: 20 }
};

class EconomySystem {
  constructor() {
    /** @type {Map<string, CountryEconomy>} */
    this.economies = new Map();
  }

  /**
   * Initialize economies for all countries.
   */
  init(forces) {
    this.economies.clear();

    for (const [code, data] of Object.entries(forces)) {
      const milData = MILITARY_DATA[code] || data;
      const gdp = milData.gdp || 100;
      const pop = milData.population || 10000000;

      // Calculate base sector strengths from GDP
      const sectors = {};
      for (const [key, def] of Object.entries(ECONOMIC_SECTORS)) {
        // Nationalized = true means government controlled
        sectors[key] = {
          contribution: def.baseContrib,
          nationalized: false,
          investmentLevel: 0.5, // 0–1 scale
          output: Math.round(gdp * def.baseContrib)
        };
      }

      // Default spending allocation (percentages, must sum to 100)
      const spending = {
        military: 25,
        education: 20,
        healthcare: 20,
        infrastructure: 20,
        research: 15
      };

      // Resources
      const resources = {
        oil:      milData.oilProduction || 0,
        minerals: Math.max(0.1, pop / 100000000 * 2),
        food:     (milData.foodSecurity || 60) / 100 * pop / 100000000 * 5,
        steel:    Math.max(0.1, gdp / 5000 * 3),
        tech:     gdp > 2000 ? gdp / 5000 * 2 : 0.1
      };

      this.economies.set(code, {
        gdp,
        baseGdp: gdp,
        population: pop,
        stability: milData.stability || 60,
        foodSecurity: milData.foodSecurity || 60,
        oilProduction: milData.oilProduction || 0,

        // Taxation
        incomeTaxRate: 25,     // % (0–60)
        corporateTaxRate: 20,  // % (0–50)
        tariffRate: 10,        // % (0–40)

        // Budget
        revenue: 0,
        expenses: 0,
        budget: gdp * 0.04,
        debt: 0,
        inflation: 2.0,     // %

        // Sectors
        sectors,

        // Spending allocation (%)
        spending,

        // Resources
        resources,

        // Trade
        tradeBalance: 0,
        imports: 0,
        exports: 0
      });
    }
  }

  /**
   * Get economy data for a country.
   */
  getEconomy(code) {
    return this.economies.get(code) || null;
  }

  /**
   * Set tax rate for a country.
   * @param {string} taxType - 'income', 'corporate', or 'tariff'
   * @param {number} rate - New rate percentage
   */
  setTaxRate(code, taxType, rate) {
    const eco = this.economies.get(code);
    if (!eco) return false;

    switch (taxType) {
      case "income":
        eco.incomeTaxRate = Math.max(0, Math.min(60, rate));
        // High taxes reduce stability
        if (eco.incomeTaxRate > 40) eco.stability = Math.max(20, eco.stability - 1);
        break;
      case "corporate":
        eco.corporateTaxRate = Math.max(0, Math.min(50, rate));
        break;
      case "tariff":
        eco.tariffRate = Math.max(0, Math.min(40, rate));
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Set spending allocation (percentages).
   * All categories must sum to 100.
   */
  setSpendingAllocation(code, newSpending) {
    const eco = this.economies.get(code);
    if (!eco) return false;

    // Normalize to 100%
    const total = Object.values(newSpending).reduce((s, v) => s + v, 0);
    if (total <= 0) return false;

    for (const [cat, val] of Object.entries(newSpending)) {
      if (eco.spending[cat] !== undefined) {
        eco.spending[cat] = Math.round((val / total) * 100);
      }
    }
    return true;
  }

  /**
   * Toggle nationalization of a sector.
   * Nationalized: +15% contribution but -5% GDP growth
   * Privatized: -10% direct contribution but +8% GDP growth
   */
  toggleSectorNationalization(code, sectorKey) {
    const eco = this.economies.get(code);
    if (!eco || !eco.sectors[sectorKey]) return false;

    const sector = eco.sectors[sectorKey];
    sector.nationalized = !sector.nationalized;

    if (sector.nationalized) {
      sector.contribution *= 1.15;
    } else {
      sector.contribution /= 1.15;
    }
    return sector.nationalized;
  }

  /**
   * Process a full economic turn for all countries.
   * @param {Object} forces - Current military forces
   * @param {Object} ownership - Territory ownership map
   * @param {Object} geopolitics - Geopolitics instance
   * @param {Object} [facilities] - Territory facilities map from GameEngine
   */
  processTurn(forces, ownership, geopolitics, facilities) {
    for (const [code, eco] of this.economies) {
      this._processCountryTurn(code, eco, forces, ownership, geopolitics, facilities);
    }
  }

  _processCountryTurn(code, eco, forces, ownership, geopolitics, facilities) {
    const f = forces[code];
    if (!f) return;

    // ── Aggregate facilities across all territories this country owns ──
    let totalFactories = 0, totalMines = 0, totalFarms = 0, totalOil = 0, totalMilBases = 0;
    if (facilities) {
      for (const [tid, owner] of Object.entries(ownership)) {
        if (owner === code && facilities[tid]) {
          const fac = facilities[tid];
          totalFactories += fac.factory || 0;
          totalMines += fac.mine || 0;
          totalFarms += fac.farm || 0;
          totalOil += fac.oil || 0;
          totalMilBases += fac.military || 0;
        }
      }
    }

    // ── Government & Policy Modifiers ──
    let govMods = { gdpMod: 0, stabilityMod: 0, militaryMod: 0, taxMod: 0, conscription: false };
    if (geopolitics?.getGovernmentModifiers) {
      govMods = geopolitics.getGovernmentModifiers(code);
    }

    // ── GDP Calculation ──
    let gdpMultiplier = 1.0;

    // Infrastructure spending boosts GDP
    gdpMultiplier += (eco.spending.infrastructure / 100) * 0.15;

    // Education spending boosts GDP slightly
    gdpMultiplier += (eco.spending.education / 100) * 0.08;

    // SR2030: Factories boost manufacturing sector and overall GDP
    gdpMultiplier += totalFactories * 0.02;

    // Government type & policies GDP modifier
    gdpMultiplier += govMods.gdpMod;

    // Tax effects: higher taxes reduce growth
    const avgTax = (eco.incomeTaxRate + eco.corporateTaxRate) / 2;
    if (avgTax > 35) gdpMultiplier -= (avgTax - 35) * 0.005;

    // Stability effect
    gdpMultiplier *= (eco.stability / 100);

    // Trade deals boost (from geopolitics)
    if (geopolitics) {
      const owner = ownership[code] || code;
      for (const deal of geopolitics.tradeDeals || []) {
        const [a, b] = deal.split("-");
        if (a === owner || b === owner) gdpMultiplier += 0.10;
      }

      // Sanctions reduce GDP
      const sanctions = geopolitics.sanctions?.[code];
      if (sanctions?.size > 0) {
        gdpMultiplier -= 0.18 * sanctions.size;
        gdpMultiplier = Math.max(gdpMultiplier, 0.2);
      }

      // War penalty
      let warCount = 0;
      for (const w of geopolitics.wars || []) {
        const [a, b] = w.split("-");
        const owner2 = ownership[code] || code;
        if (a === owner2 || b === owner2) warCount++;
      }
      gdpMultiplier -= warCount * 0.12;

      // Nuclear wasteland
      if (geopolitics.nuclearWasteland?.[code]) {
        gdpMultiplier *= 0.1;
      }
    }

    gdpMultiplier = Math.max(0.15, gdpMultiplier);

    // Sector contributions (SR2030: facilities boost specific sectors)
    let sectorGdp = 0;
    for (const [key, sector] of Object.entries(eco.sectors)) {
      let sectorBoost = 1.0;
      if (key === "manufacturing") sectorBoost += totalFactories * 0.05;
      if (key === "mining") sectorBoost += totalMines * 0.06;
      if (key === "agriculture") sectorBoost += totalFarms * 0.07;
      if (key === "energy") sectorBoost += totalOil * 0.06;

      sector.output = Math.round(eco.baseGdp * sector.contribution * gdpMultiplier * sectorBoost);
      sectorGdp += sector.output;
    }

    // ── Resource Production (SR2030: facilities boost resource output) ──
    eco.resources.oil = (eco.oilProduction || 0) + totalOil * 2;
    eco.resources.minerals = Math.max(0.1, eco.population / 100000000 * 2) + totalMines * 1.5;
    eco.resources.food = (eco.foodSecurity || 60) / 100 * eco.population / 100000000 * 5 + totalFarms * 3;
    eco.resources.steel = Math.max(0.1, eco.baseGdp / 5000 * 3) + totalFactories * 1.0;
    eco.resources.tech = (eco.baseGdp > 2000 ? eco.baseGdp / 5000 * 2 : 0.1) + totalFactories * 0.5;

    // ── Resource Consumption Loop ──
    const popMillions = eco.population / 1000000;
    const foodNeeded = popMillions * 0.03;    // M tons per million pop per month
    const oilNeeded = (f.activeMilitary || 0) / 500000 + popMillions * 0.005; // Military + civilian oil
    
    const foodSurplus = eco.resources.food - foodNeeded;
    const oilSurplus = eco.resources.oil - oilNeeded;

    // Food security updates based on surplus/deficit
    if (foodSurplus >= 0) {
      eco.foodSecurity = Math.min(100, eco.foodSecurity + 1);
    } else {
      eco.foodSecurity = Math.max(0, eco.foodSecurity - 2);
    }

    // Oil income
    const oilIncome = Math.max(0, oilSurplus) * RESOURCE_TYPES.oil.pricePerUnit;
    const oilImportCost = Math.abs(Math.min(0, oilSurplus)) * RESOURCE_TYPES.oil.pricePerUnit * 1.2;

    // Resource exports (surplus resources generate revenue)
    let resourceExports = 0;
    let resourceImports = 0;
    
    resourceExports += Math.max(0, foodSurplus) * RESOURCE_TYPES.food.pricePerUnit * 0.3;
    resourceImports += Math.abs(Math.min(0, foodSurplus)) * RESOURCE_TYPES.food.pricePerUnit;
    resourceExports += oilIncome;
    resourceImports += oilImportCost;
    
    // Other resources export a fraction
    resourceExports += Math.max(0, eco.resources.minerals * 0.3) * RESOURCE_TYPES.minerals.pricePerUnit * 0.2;
    resourceExports += Math.max(0, eco.resources.steel * 0.2) * RESOURCE_TYPES.steel.pricePerUnit * 0.2;
    resourceExports += Math.max(0, eco.resources.tech * 0.15) * RESOURCE_TYPES.tech.pricePerUnit * 0.3;

    eco.gdp = Math.max(1, Math.round(sectorGdp + oilIncome));

    // ── Revenue ──
    const taxRevenue = eco.gdp * (eco.incomeTaxRate / 100) * 0.3;
    const corpRevenue = eco.gdp * (eco.corporateTaxRate / 100) * 0.2;
    const tariffRevenue = eco.gdp * (eco.tariffRate / 100) * 0.05;
    // Government type tax modifier
    const govTaxFactor = 1 + govMods.taxMod;
    eco.revenue = Math.round((taxRevenue + corpRevenue + tariffRevenue + resourceExports) * govTaxFactor * 10) / 10;

    // ── Expenses ──
    const militaryUpkeep = this._calcMilitaryUpkeep(f) * (eco.spending.military / 100) * 4;
    // Military base bonus: reduce upkeep by 3% per base
    const milBaseDiscount = Math.min(0.3, totalMilBases * 0.03);
    // Government military modifier reduces effective upkeep cost
    const govMilFactor = Math.max(0.5, 1 - govMods.militaryMod);
    const adjustedMilUpkeep = militaryUpkeep * (1 - milBaseDiscount) * govMilFactor;
    
    const socialSpending = eco.gdp * 0.02 * (
      (eco.spending.education / 100) * 0.3 +
      (eco.spending.healthcare / 100) * 0.3 +
      (eco.spending.infrastructure / 100) * 0.25 +
      (eco.spending.research / 100) * 0.15
    );
    eco.expenses = Math.round((adjustedMilUpkeep + socialSpending + resourceImports) * 10) / 10;

    // ── Budget ──
    const netIncome = eco.revenue - eco.expenses;
    eco.budget = Math.round((eco.budget + netIncome) * 10) / 10;

    // ── Trade balance ──
    eco.exports = Math.round(resourceExports * 10) / 10;
    eco.imports = Math.round(resourceImports * 10) / 10;
    eco.tradeBalance = Math.round((eco.exports - eco.imports) * 10) / 10;

    // ── Debt & Inflation ──
    if (eco.budget < 0) {
      eco.debt += Math.abs(eco.budget);
      eco.inflation += 0.5;
    } else if (eco.debt > 0) {
      // Pay down debt
      const payment = Math.min(eco.budget * 0.2, eco.debt);
      eco.debt -= payment;
      eco.budget -= payment;
    }

    // Inflation natural drift toward 2%
    if (eco.inflation > 2) eco.inflation = Math.max(2, eco.inflation - 0.3);
    if (eco.inflation > 10) eco.stability = Math.max(10, eco.stability - 3);

    // ── Stability ──
    const baseStability = (MILITARY_DATA[code]?.stability || 60) + govMods.stabilityMod;

    // Healthcare spending improves stability
    if (eco.spending.healthcare > 25) eco.stability = Math.min(100, eco.stability + 0.5);

    // Food insecurity hurts stability
    if (eco.foodSecurity < 50) eco.stability = Math.max(10, eco.stability - 2);
    if (eco.foodSecurity < 25) eco.stability = Math.max(5, eco.stability - 3);

    // High taxes drain stability (SP2-style)
    if (eco.incomeTaxRate > 45) eco.stability = Math.max(15, eco.stability - 1.5);
    if (eco.corporateTaxRate > 40) eco.stability = Math.max(15, eco.stability - 1);

    // High debt reduces stability
    if (eco.debt > eco.gdp * 0.5) eco.stability = Math.max(10, eco.stability - 1);

    // Military bases boost base stability slightly
    if (totalMilBases > 0) eco.stability = Math.min(100, eco.stability + totalMilBases * 0.2);

    // Natural stability recovery
    if (eco.stability < baseStability && eco.debt < eco.gdp * 0.3) {
      eco.stability = Math.min(baseStability, eco.stability + 0.5);
    }

    // ── Population growth ──
    const growthRate = 0.001 + (eco.spending.healthcare / 100) * 0.002;
    eco.population = Math.round(eco.population * (1 + growthRate));
  }

  _calcMilitaryUpkeep(forces) {
    if (!forces) return 0;
    const troops = (forces.activeMilitary || 0) * 0.0001;
    const armor = (forces.tanks || 0) * 0.003;
    const air = (forces.aircraft || 0) * 0.015;
    const naval = (forces.navalVessels || 0) * 0.04;
    const subs = (forces.submarines || 0) * 0.08;
    const carriers = (forces.aircraftCarriers || 0) * 2;
    const nukes = (forces.nuclearWeapons || 0) * 0.005;
    return Math.round((troops + armor + air + naval + subs + carriers + nukes) * 10) / 10;
  }

  /**
   * Get a summary of a faction's total economy.
   */
  getFactionSummary(factionCode, ownership) {
    let totalGdp = 0, totalRevenue = 0, totalExpenses = 0, totalBudget = 0;
    let totalPop = 0, avgStability = 0, count = 0, totalDebt = 0;
    const territories = [];

    for (const [code, owner] of Object.entries(ownership)) {
      if (owner === factionCode) {
        const eco = this.economies.get(code);
        if (!eco) continue;
        totalGdp += eco.gdp;
        totalRevenue += eco.revenue;
        totalExpenses += eco.expenses;
        totalBudget += eco.budget;
        totalPop += eco.population;
        avgStability += eco.stability;
        totalDebt += eco.debt;
        count++;
        territories.push(code);
      }
    }

    return {
      gdp: Math.round(totalGdp),
      revenue: Math.round(totalRevenue * 10) / 10,
      expenses: Math.round(totalExpenses * 10) / 10,
      budget: Math.round(totalBudget * 10) / 10,
      population: totalPop,
      stability: count > 0 ? Math.round(avgStability / count) : 0,
      debt: Math.round(totalDebt * 10) / 10,
      territories
    };
  }

  /**
   * Get faction GDP as percentage of world GDP.
   */
  getFactionGDPPercent(factionCode, ownership) {
    let factionGdp = 0, worldGdp = 0;
    for (const [code, eco] of this.economies) {
      worldGdp += eco.gdp;
      if (ownership[code] === factionCode) factionGdp += eco.gdp;
    }
    return worldGdp > 0 ? (factionGdp / worldGdp) * 100 : 0;
  }

  /**
   * Calculate research progress — how close a country is to next tech level.
   * Based on research spending percentage and GDP.
   */
  getResearchProgress(code) {
    const eco = this.economies.get(code);
    if (!eco) return 0;
    return Math.min(1, (eco.spending.research / 100) * (eco.gdp / 5000));
  }
}
