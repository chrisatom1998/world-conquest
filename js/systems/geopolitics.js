/* ============================================================
   WORLD CONQUEST — Geopolitics Module
   Economy, Diplomacy, Military Production, Nuclear Systems
   ============================================================ */

/* ---------- Government Types (SP2-Style) ---------- */
const GOVERNMENT_TYPES = {
  democracy:      { name: "Democracy",       icon: "🗳️", taxMod: 0,    stabilityMod:  10, gdpMod:  0.05, militaryMod: 0,    conscription: false },
  authoritarian:  { name: "Authoritarian",    icon: "👁️", taxMod: 0.05, stabilityMod: -5,  gdpMod: -0.03, militaryMod: 0.10, conscription: true  },
  communist:      { name: "Communist",        icon: "☭",  taxMod: 0.15, stabilityMod: -10, gdpMod: -0.08, militaryMod: 0.05, conscription: true  },
  theocracy:      { name: "Theocracy",        icon: "⛪", taxMod: 0.10, stabilityMod:  5,  gdpMod: -0.05, militaryMod: 0,    conscription: false },
  monarchy:       { name: "Monarchy",         icon: "👑", taxMod: 0.03, stabilityMod:  8,  gdpMod:  0.02, militaryMod: 0.05, conscription: false },
  military_junta: { name: "Military Junta",   icon: "🎖️", taxMod: 0.08, stabilityMod: -15, gdpMod: -0.10, militaryMod: 0.20, conscription: true  }
};

/* ---------- Policies / Laws (SP2-Style) ---------- */
const POLICIES = {
  conscription:        { name: "Conscription",        icon: "🪖", desc: "+20% troops, -3 stability",            stabilityMod: -3,  gdpMod: 0,     militaryMod: 0.20, relationsMod: 0,   taxMod: 0    },
  free_press:          { name: "Free Press",           icon: "📰", desc: "+5 stability, -5% tax revenue",        stabilityMod:  5,  gdpMod: 0,     militaryMod: 0,    relationsMod: 0,   taxMod: -0.05 },
  open_borders:        { name: "Open Borders",         icon: "🌍", desc: "+8% GDP, -2 stability",               stabilityMod: -2,  gdpMod: 0.08,  militaryMod: 0,    relationsMod: 0,   taxMod: 0    },
  nuclear_program:     { name: "Nuclear Program",      icon: "☢️", desc: "Enables nukes, -15 world relations",   stabilityMod: 0,   gdpMod: 0,     militaryMod: 0,    relationsMod: -15, taxMod: 0    },
  state_religion:      { name: "State Religion",       icon: "🕌", desc: "+3 stability, -5% GDP",               stabilityMod:  3,  gdpMod: -0.05, militaryMod: 0,    relationsMod: 0,   taxMod: 0    },
  martial_law:         { name: "Martial Law",          icon: "⚔️", desc: "+15% military, -10 stability, +10% tax", stabilityMod: -10, gdpMod: 0,   militaryMod: 0.15, relationsMod: 0,   taxMod: 0.10 },
  universal_healthcare:{ name: "Universal Healthcare", icon: "🏥", desc: "+5 stability, +2% pop growth, -3% GDP", stabilityMod:  5,  gdpMod: -0.03, militaryMod: 0,   relationsMod: 0,   taxMod: 0    },
  foreign_aid:         { name: "Foreign Aid",          icon: "🤝", desc: "+10 world relations, -2% GDP",         stabilityMod: 0,   gdpMod: -0.02, militaryMod: 0,    relationsMod: 10,  taxMod: 0    }
};

/* ---------- Default government assignments ---------- */
const DEFAULT_GOVERNMENTS = {
  USA: "democracy", GBR: "democracy", CAN: "democracy", AUS: "democracy",
  DEU: "democracy", FRA: "democracy", JPN: "democracy", KOR: "democracy",
  ITA: "democracy", ESP: "democracy", BRA: "democracy", IND: "democracy",
  MEX: "democracy", ARG: "democracy", COL: "democracy", NOR: "democracy",
  CHN: "communist", PRK: "communist", CUB: "communist", VNM: "communist",
  RUS: "authoritarian", TUR: "authoritarian", EGY: "authoritarian", BLR: "authoritarian",
  IRN: "theocracy", SAU: "monarchy", ARE: "monarchy", JOR: "monarchy",
  THA: "monarchy", MYS: "monarchy",
  MMR: "military_junta"
};
class Geopolitics {
  constructor() {
    // Economy: code → { gdp, revenue, upkeep, budget, tradePartners, sanctionedBy, oilIncome }
    this.economy = {};
    // Diplomacy: "CODE1-CODE2" (sorted) → relation score -100..+100
    this.relations = {};
    // Wars: Set of "CODE1-CODE2" (sorted) strings
    this.wars = new Set();
    // Trade deals: Set of "CODE1-CODE2" (sorted)
    this.tradeDeals = new Set();
    // Sanctions: Map of target → Set of imposers
    this.sanctions = {};
    // Nuclear wasteland: code → turns remaining
    this.nuclearWasteland = {};
    // Action points
    this.actionPoints = 0;
    this.maxActionPoints = 3;
    // Government types: code → government key
    this.governmentTypes = {};
    // Policies: code → { policyKey: true/false }
    this.policies = {};
  }

  /**
   * Initialize all geopolitics state from military data and ownership
   */
  init(forces) {
    this.economy = {};
    this.relations = {};
    this.wars = new Set();
    this.tradeDeals = new Set();
    this.sanctions = {};
    this.nuclearWasteland = {};
    this.governmentTypes = {};
    this.policies = {};

    const codes = Object.keys(forces);

    // Init economy for each country
    for (const code of codes) {
      const data = MILITARY_DATA[code] || forces[code];
      this.economy[code] = {
        gdp: data.gdp || 100,
        baseGdp: data.gdp || 100,
        revenue: 0,
        upkeep: 0,
        budget: data.gdp ? data.gdp * 0.04 : 4, // Start with 4% of GDP as budget
        stability: data.stability || 60,
        population: data.population || 10000000,
        oilProduction: data.oilProduction || 0,
        foodSecurity: data.foodSecurity || 60
      };
      this.sanctions[code] = new Set();

      // Government type
      this.governmentTypes[code] = DEFAULT_GOVERNMENTS[code] || "democracy";

      // Policies — democracies start with Free Press
      this.policies[code] = {};
      for (const pKey of Object.keys(POLICIES)) {
        this.policies[code][pKey] = false;
      }
      if (this.governmentTypes[code] === "democracy") {
        this.policies[code].free_press = true;
      }
      if (this.governmentTypes[code] === "communist") {
        this.policies[code].conscription = true;
      }
      if (this.governmentTypes[code] === "military_junta") {
        this.policies[code].martial_law = true;
        this.policies[code].conscription = true;
      }
    }

    // Init relations: start with realistic relations based on region/alliances
    for (let i = 0; i < codes.length; i++) {
      for (let j = i + 1; j < codes.length; j++) {
        const key = this._relKey(codes[i], codes[j]);
        // Default: neutral with small random variation
        this.relations[key] = Math.round((Math.random() - 0.5) * 30);
      }
    }
    // Set some realistic starting relations
    this._setRelation("USA", "GBR", 60);
    this._setRelation("USA", "CAN", 70);
    this._setRelation("USA", "JPN", 50);
    this._setRelation("USA", "KOR", 50);
    this._setRelation("USA", "AUS", 60);
    this._setRelation("USA", "DEU", 45);
    this._setRelation("USA", "FRA", 40);
    this._setRelation("USA", "ISR", 55);
    this._setRelation("USA", "RUS", -30);
    this._setRelation("USA", "CHN", -25);
    this._setRelation("USA", "IRN", -60);
    this._setRelation("USA", "PRK", -80);
    this._setRelation("RUS", "CHN", 25);
    this._setRelation("RUS", "UKR", -70);
    this._setRelation("RUS", "IRN", 20);
    this._setRelation("CHN", "PRK", 30);
    this._setRelation("CHN", "TWN", -50);
    this._setRelation("CHN", "JPN", -20);
    this._setRelation("IND", "PAK", -50);
    this._setRelation("ISR", "IRN", -75);
    this._setRelation("ISR", "SAU", -10);
    this._setRelation("SAU", "IRN", -55);
    this._setRelation("GRC", "TUR", -25);
    this._setRelation("KOR", "PRK", -60);

    this.actionPoints = this.maxActionPoints;
  }

  /* =========== Government & Policies =========== */

  /**
   * Change a country's government type.
   * Costs stability (-10) for the transition.
   */
  setGovernment(code, govKey) {
    if (!GOVERNMENT_TYPES[govKey]) return { success: false, message: "Invalid government type." };
    if (this.governmentTypes[code] === govKey) return { success: false, message: "Already this government type." };

    const oldGov = GOVERNMENT_TYPES[this.governmentTypes[code]];
    const newGov = GOVERNMENT_TYPES[govKey];
    this.governmentTypes[code] = govKey;

    // Transition stability cost
    if (this.economy[code]) {
      this.economy[code].stability = Math.max(10, this.economy[code].stability - 10);
    }

    return {
      success: true,
      message: `Government changed to ${newGov.icon} ${newGov.name}! (-10 Stability for transition)`
    };
  }

  /**
   * Toggle a policy on/off for a country.
   */
  togglePolicy(code, policyKey) {
    const policy = POLICIES[policyKey];
    if (!policy) return { success: false, message: "Invalid policy." };
    if (!this.policies[code]) return { success: false, message: "Country not found." };

    const wasOn = this.policies[code][policyKey];
    this.policies[code][policyKey] = !wasOn;

    const newState = !wasOn;
    return {
      success: true,
      enabled: newState,
      message: `${policy.icon} ${policy.name} ${newState ? "enacted" : "repealed"}.`
    };
  }

  /**
   * Get aggregate modifiers from government type + active policies.
   * Returns { gdpMod, stabilityMod, militaryMod, taxMod, conscription }
   */
  getGovernmentModifiers(code) {
    const govKey = this.governmentTypes[code] || "democracy";
    const gov = GOVERNMENT_TYPES[govKey] || GOVERNMENT_TYPES.democracy;

    let totalGdpMod = gov.gdpMod;
    let totalStabilityMod = gov.stabilityMod;
    let totalMilitaryMod = gov.militaryMod;
    let totalTaxMod = gov.taxMod;
    let conscription = gov.conscription;

    const countryPolicies = this.policies[code] || {};
    for (const [pKey, isOn] of Object.entries(countryPolicies)) {
      if (!isOn) continue;
      const p = POLICIES[pKey];
      if (!p) continue;
      totalGdpMod += p.gdpMod;
      totalStabilityMod += p.stabilityMod;
      totalMilitaryMod += p.militaryMod;
      totalTaxMod += p.taxMod;
      if (pKey === "conscription") conscription = true;
    }

    return { gdpMod: totalGdpMod, stabilityMod: totalStabilityMod, militaryMod: totalMilitaryMod, taxMod: totalTaxMod, conscription };
  }

  /* =========== Action Points =========== */

  resetAP(playerCode, ownership) {
    // Base 3 AP, +1 if GDP > 5000B across all territories
    const totalGdp = this._getFactionGDP(playerCode, ownership);
    this.maxActionPoints = totalGdp > 5000 ? 4 : 3;
    this.actionPoints = this.maxActionPoints;
  }

  spendAP(cost) {
    if (this.actionPoints < cost) return false;
    this.actionPoints -= cost;
    return true;
  }

  /* =========== Economy =========== */

  /**
   * Process economy for a single turn
   */
  processEconomy(forces, ownership) {
    for (const code of Object.keys(this.economy)) {
      const eco = this.economy[code];
      const f = forces[code];
      if (!f || !eco) continue;

      // GDP modifiers
      let gdpMod = 1.0;

      // Trade deals boost GDP
      for (const deal of this.tradeDeals) {
        const [a, b] = deal.split("-");
        if (a === code || b === code) gdpMod += 0.12;
      }

      // Sanctions reduce GDP
      if (this.sanctions[code]?.size > 0) {
        gdpMod -= 0.20 * this.sanctions[code].size;
        gdpMod = Math.max(gdpMod, 0.2); // Floor at 20%
      }

      // Nuclear wasteland
      if (this.nuclearWasteland[code]) {
        gdpMod *= 0.1;
        this.nuclearWasteland[code]--;
        if (this.nuclearWasteland[code] <= 0) delete this.nuclearWasteland[code];
      }

      // War penalty: -15% GDP per active war
      let warCount = 0;
      const owner = ownership[code] || code;
      for (const w of this.wars) {
        const [a, b] = w.split("-");
        if (a === owner || b === owner) warCount++;
      }
      gdpMod -= warCount * 0.15;
      gdpMod = Math.max(gdpMod, 0.15);

      // Stability effect
      gdpMod *= (eco.stability / 100);

      // Oil income bonus
      const oilBonus = eco.oilProduction * 15; // $15B per million barrels/day

      eco.gdp = Math.round(eco.baseGdp * gdpMod + oilBonus);

      // Revenue = 6% of GDP (tax/government revenue)
      eco.revenue = Math.round(eco.gdp * 0.06 * 10) / 10;

      // Upkeep = cost of military
      eco.upkeep = this._calcUpkeep(f);

      // Budget = previous budget + revenue - upkeep
      eco.budget = Math.round((eco.budget + eco.revenue - eco.upkeep) * 10) / 10;

      // Stability recovery toward base
      const baseStability = MILITARY_DATA[code]?.stability || 60;
      if (eco.stability < baseStability) {
        eco.stability = Math.min(baseStability, eco.stability + 1);
      }

      // Food insecurity causes stability loss
      if (eco.foodSecurity < 50) {
        eco.stability = Math.max(10, eco.stability - 2);
      }
    }
  }

  _calcUpkeep(forces) {
    if (!forces) return 0;
    const troops = (forces.activeMilitary || 0) * 0.0001;
    const armor = (forces.tanks || 0) * 0.003;
    const air = (forces.aircraft || 0) * 0.015;
    const naval = ((forces.navalVessels || 0)) * 0.04;
    const subs = (forces.submarines || 0) * 0.08;
    const carriers = (forces.aircraftCarriers || 0) * 2;
    const nukes = (forces.nuclearWeapons || 0) * 0.005;
    return Math.round((troops + armor + air + naval + subs + carriers + nukes) * 10) / 10;
  }

  _getFactionGDP(factionCode, ownership) {
    let total = 0;
    for (const [code, owner] of Object.entries(ownership)) {
      if (owner === factionCode && this.economy[code]) {
        total += this.economy[code].gdp;
      }
    }
    return total;
  }

  getGlobalGDP(ownership) {
    let total = 0;
    for (const code of Object.keys(this.economy)) {
      total += this.economy[code]?.gdp || 0;
    }
    return total;
  }

  getFactionGDPPercent(factionCode, ownership) {
    const factionGdp = this._getFactionGDP(factionCode, ownership);
    const globalGdp = this.getGlobalGDP(ownership);
    return globalGdp > 0 ? (factionGdp / globalGdp) * 100 : 0;
  }

  /* =========== Diplomacy =========== */

  getRelation(codeA, codeB) {
    if (codeA === codeB) return 100;
    return this.relations[this._relKey(codeA, codeB)] ?? 0;
  }

  _setRelation(codeA, codeB, value) {
    this.relations[this._relKey(codeA, codeB)] = Math.max(-100, Math.min(100, Math.round(value)));
  }

  modifyRelation(codeA, codeB, delta) {
    const current = this.getRelation(codeA, codeB);
    this._setRelation(codeA, codeB, current + delta);
  }

  /**
   * Improve relations with a country (+10)
   * Cost: 1 AP
   */
  improveRelations(playerCode, targetCode) {
    this.modifyRelation(playerCode, targetCode, 10);
    return { type: "diplomacy", message: `Diplomatic outreach to ${MILITARY_DATA[targetCode]?.name || targetCode}. Relations improved.` };
  }

  /**
   * Denounce a country (-20 with target, +5 with their enemies)
   * Cost: 1 AP
   */
  denounce(playerCode, targetCode, ownership) {
    this.modifyRelation(playerCode, targetCode, -20);
    // Gain favor with target's enemies
    for (const w of this.wars) {
      const [a, b] = w.split("-");
      const enemy = a === targetCode ? b : (b === targetCode ? a : null);
      if (enemy && enemy !== playerCode) {
        this.modifyRelation(playerCode, enemy, 5);
      }
    }
    return { type: "diplomacy", message: `Publicly denounced ${MILITARY_DATA[targetCode]?.name || targetCode}! Relations deteriorated.` };
  }

  /**
   * Propose trade deal (+12% GDP each, +15 relations)
   * Cost: 1 AP, requires relations >= 0
   */
  proposeTrade(playerCode, targetCode) {
    if (this.getRelation(playerCode, targetCode) < 0) {
      return { type: "diplomacy", message: "Cannot propose trade with hostile nations!" };
    }
    const key = this._relKey(playerCode, targetCode);
    if (this.tradeDeals.has(key)) {
      // Cancel trade deal
      this.tradeDeals.delete(key);
      this.modifyRelation(playerCode, targetCode, -10);
      return { type: "diplomacy", message: `Trade deal cancelled with ${MILITARY_DATA[targetCode]?.name || targetCode}.` };
    }
    this.tradeDeals.add(key);
    this.modifyRelation(playerCode, targetCode, 15);
    return { type: "diplomacy", message: `Trade deal established with ${MILITARY_DATA[targetCode]?.name || targetCode}! GDP boosted.` };
  }

  /**
   * Impose sanction (-20% target GDP, -5% own GDP, -30 relations)
   * Cost: 1 AP
   */
  imposeSanction(playerCode, targetCode) {
    const key = this._relKey(playerCode, targetCode);
    // Remove any trade deal
    this.tradeDeals.delete(key);

    if (this.sanctions[targetCode]?.has(playerCode)) {
      // Lift sanction
      this.sanctions[targetCode].delete(playerCode);
      this.modifyRelation(playerCode, targetCode, 10);
      return { type: "diplomacy", message: `Sanctions lifted on ${MILITARY_DATA[targetCode]?.name || targetCode}.` };
    }

    if (!this.sanctions[targetCode]) this.sanctions[targetCode] = new Set();
    this.sanctions[targetCode].add(playerCode);
    this.modifyRelation(playerCode, targetCode, -30);
    return { type: "diplomacy", message: `Economic sanctions imposed on ${MILITARY_DATA[targetCode]?.name || targetCode}!` };
  }

  /**
   * Declare war (requires relations < 0 OR costs 2 AP)
   * Cost: 2 AP normally, 1 AP if relations < -30
   */
  declareWar(attackerCode, defenderCode, ownership) {
    const key = this._relKey(attackerCode, defenderCode);
    if (this.wars.has(key)) return { type: "war", message: "Already at war!", alreadyAtWar: true };

    this.wars.add(key);
    this._setRelation(attackerCode, defenderCode, -100);

    // Remove trade deals
    this.tradeDeals.delete(key);

    // Allies of defender lose relations with attacker
    for (const code of Object.keys(MILITARY_DATA)) {
      if (code === attackerCode || code === defenderCode) continue;
      const defRel = this.getRelation(defenderCode, code);
      if (defRel > 20) {
        this.modifyRelation(attackerCode, code, -15);
      }
    }

    // Stability hit for attacker (aggressor penalty)
    if (this.economy[attackerCode]) {
      this.economy[attackerCode].stability = Math.max(10, this.economy[attackerCode].stability - 5);
    }

    return { type: "war", message: `War declared on ${MILITARY_DATA[defenderCode]?.name || defenderCode}!` };
  }

  /**
   * Propose peace (ends war, sets relations to -10)
   * Cost: 1 AP
   */
  proposePeace(playerCode, targetCode) {
    const key = this._relKey(playerCode, targetCode);
    if (!this.wars.has(key)) return { type: "diplomacy", message: "Not at war with this country." };

    this.wars.delete(key);
    this._setRelation(playerCode, targetCode, -10);

    // Stability recovery
    if (this.economy[playerCode]) {
      this.economy[playerCode].stability = Math.min(100, this.economy[playerCode].stability + 5);
    }

    return { type: "diplomacy", message: `Peace treaty signed with ${MILITARY_DATA[targetCode]?.name || targetCode}!` };
  }

  isAtWar(codeA, codeB) {
    return this.wars.has(this._relKey(codeA, codeB));
  }

  getWarsForFaction(factionCode, ownership) {
    const wars = [];
    for (const w of this.wars) {
      const [a, b] = w.split("-");
      if (a === factionCode || b === factionCode) {
        wars.push(a === factionCode ? b : a);
      }
    }
    return wars;
  }

  /* =========== Military Production =========== */

  /**
   * Production costs (in billions USD from budget)
   */
  static PRODUCTION_COSTS = {
    troops:   { cost: 0.5, activeMilitary: 10000, label: "10K Troops" },
    tanks:    { cost: 2,   tanks: 50,              label: "50 Tanks" },
    aircraft: { cost: 5,   aircraft: 20,           label: "20 Aircraft" },
    fighters: { cost: 8,   fighters: 10,           label: "10 Fighters" },
    naval:    { cost: 10,  navalVessels: 5,         label: "5 Naval Vessels" },
    subs:     { cost: 15,  submarines: 2,           label: "2 Submarines" },
    artillery:{ cost: 1.5, artillery: 30,           label: "30 Artillery" },
    helicopters:{ cost: 3, helicopters: 15,         label: "15 Helicopters" }
  };

  /**
   * Build military units using budget
   * Cost: 1 AP
   */
  produce(code, productionType, forces) {
    const prod = Geopolitics.PRODUCTION_COSTS[productionType];
    if (!prod) return { success: false, message: "Invalid production type." };

    const eco = this.economy[code];
    if (!eco || eco.budget < prod.cost) {
      return { success: false, message: `Insufficient budget! Need $${prod.cost}B, have $${eco?.budget?.toFixed(1) || 0}B.` };
    }

    eco.budget = Math.round((eco.budget - prod.cost) * 10) / 10;

    // Add units to forces
    const f = forces[code];
    if (!f) return { success: false, message: "Country not found." };

    for (const [key, val] of Object.entries(prod)) {
      if (key === "cost" || key === "label") continue;
      f[key] = (f[key] || 0) + val;
    }

    return { success: true, message: `Produced ${prod.label} for $${prod.cost}B.` };
  }

  /* =========== Nuclear System =========== */

  /**
   * Launch nuclear strike
   * Massive damage + global reputation hit + MAD retaliation
   * Cost: 2 AP
   */
  launchNuke(attackerCode, targetCode, forces, ownership) {
    const attackerForces = forces[Object.keys(ownership).find(c => ownership[c] === attackerCode)] || forces[attackerCode];
    if (!attackerForces || (attackerForces.nuclearWeapons || 0) <= 0) {
      return { success: false, message: "No nuclear weapons available!" };
    }

    // Spend nukes — forces are keyed by country code, not territory ID
    if (attackerForces.nuclearWeapons > 0) {
      attackerForces.nuclearWeapons--;
    }

    // Devastate target
    const tf = forces[targetCode];
    if (tf) {
      tf.activeMilitary = Math.round(tf.activeMilitary * 0.3);
      tf.reserveMilitary = Math.round(tf.reserveMilitary * 0.2);
      tf.tanks = Math.round(tf.tanks * 0.25);
      tf.aircraft = Math.round(tf.aircraft * 0.3);
      tf.artillery = Math.round(tf.artillery * 0.2);
      tf.navalVessels = Math.round((tf.navalVessels || 0) * 0.5);
    }

    // Nuclear wasteland
    this.nuclearWasteland[targetCode] = 10;

    // Stability devastation
    if (this.economy[targetCode]) {
      this.economy[targetCode].stability = Math.max(5, this.economy[targetCode].stability - 40);
      this.economy[targetCode].foodSecurity = Math.max(10, this.economy[targetCode].foodSecurity - 30);
    }

    // Global reputation hit: -50 relations with everyone
    for (const code of Object.keys(MILITARY_DATA)) {
      if (code === attackerCode) continue;
      this.modifyRelation(attackerCode, code, -50);
    }

    // MAD: if target has nukes, retaliatory strike
    let retaliation = false;
    const defenderForces = forces[targetCode];
    if (defenderForces && (defenderForces.nuclearWeapons || 0) > 0) {
      retaliation = true;
      defenderForces.nuclearWeapons--;

      // Retaliate against attacker's forces
      if (attackerForces) {
        attackerForces.activeMilitary = Math.round(attackerForces.activeMilitary * 0.35);
        attackerForces.tanks = Math.round(attackerForces.tanks * 0.3);
        attackerForces.aircraft = Math.round(attackerForces.aircraft * 0.35);
      }
      this.nuclearWasteland[attackerCode] = 8;
      if (this.economy[attackerCode]) {
        this.economy[attackerCode].stability = Math.max(5, this.economy[attackerCode].stability - 35);
      }
    }

    // Auto declare war
    const defOwner = ownership[targetCode];
    if (defOwner && defOwner !== attackerCode) {
      this.declareWar(attackerCode, defOwner, ownership);
    }

    return {
      success: true,
      retaliation,
      message: `Nuclear strike on ${forces[targetCode]?.name || targetCode}!${retaliation ? " RETALIATORY STRIKE received!" : ""}`,
      targetDestroyed: true
    };
  }

  /* =========== AI Diplomacy =========== */

  /**
   * Run AI diplomatic actions for a single faction
   */
  runAIDiplomacy(aiCode, playerCode, ownership, forces) {
    const events = [];

    // AI evaluates threats
    const aiPower = this._getFactionGDP(aiCode, ownership);
    const playerPower = this._getFactionGDP(playerCode, ownership);

    // If player is very powerful, AI sanctions/denounces
    if (playerPower > aiPower * 2 && this.getRelation(aiCode, playerCode) > -50) {
      if (Math.random() < 0.3 && !this.sanctions[playerCode]?.has(aiCode)) {
        const r = this.imposeSanction(aiCode, playerCode);
        events.push(r);
      }
    }

    // AI trades with friendly nations
    const codes = Object.keys(MILITARY_DATA);
    for (const other of codes) {
      if (other === aiCode || other === playerCode) continue;
      const rel = this.getRelation(aiCode, other);
      if (rel > 30 && Math.random() < 0.1) {
        const key = this._relKey(aiCode, other);
        if (!this.tradeDeals.has(key)) {
          this.tradeDeals.add(key);
          this.modifyRelation(aiCode, other, 5);
        }
      }
    }

    // AI may declare war on weak hostile neighbors
    const aiTerritories = Object.keys(ownership).filter(c => ownership[c] === aiCode);
    for (const t of aiTerritories) {
      for (const neighbor of getNeighbors(t)) {
        const neighborOwner = ownership[neighbor];
        if (neighborOwner && neighborOwner !== aiCode) {
          const rel = this.getRelation(aiCode, neighborOwner);
          if (rel < -40 && !this.isAtWar(aiCode, neighborOwner) && Math.random() < 0.15) {
            const r = this.declareWar(aiCode, neighborOwner, ownership);
            events.push(r);
          }
        }
      }
    }

    // AI may propose peace if losing
    for (const w of this.wars) {
      const [a, b] = w.split("-");
      const enemy = a === aiCode ? b : (b === aiCode ? a : null);
      if (!enemy) continue;
      const enemyPower = this._getFactionGDP(enemy, ownership);
      if (enemyPower > aiPower * 1.5 && Math.random() < 0.2) {
        const r = this.proposePeace(aiCode, enemy);
        events.push(r);
      }
    }

    // Natural relation drift toward 0
    for (const other of codes) {
      if (other === aiCode) continue;
      const rel = this.getRelation(aiCode, other);
      if (Math.abs(rel) > 5) {
        this.modifyRelation(aiCode, other, rel > 0 ? -1 : 1);
      }
    }

    return events;
  }

  /* =========== Helpers =========== */

  _relKey(a, b) {
    return [a, b].sort().join("-");
  }

  /**
   * Get a summary of a faction's economy across all territories
   */
  getFactionEconomySummary(factionCode, ownership) {
    let totalGdp = 0, totalRevenue = 0, totalUpkeep = 0, totalBudget = 0;
    let totalPop = 0, avgStability = 0, count = 0;
    const territories = [];

    for (const [code, owner] of Object.entries(ownership)) {
      if (owner === factionCode && this.economy[code]) {
        const eco = this.economy[code];
        totalGdp += eco.gdp;
        totalRevenue += eco.revenue;
        totalUpkeep += eco.upkeep;
        totalBudget += eco.budget;
        totalPop += eco.population;
        avgStability += eco.stability;
        count++;
        territories.push(code);
      }
    }

    return {
      gdp: Math.round(totalGdp),
      revenue: Math.round(totalRevenue * 10) / 10,
      upkeep: Math.round(totalUpkeep * 10) / 10,
      budget: Math.round(totalBudget * 10) / 10,
      population: totalPop,
      stability: count > 0 ? Math.round(avgStability / count) : 0,
      territories
    };
  }

  /**
   * Get trade partners for a faction
   */
  getTradePartners(factionCode) {
    const partners = [];
    for (const deal of this.tradeDeals) {
      const [a, b] = deal.split("-");
      if (a === factionCode) partners.push(b);
      else if (b === factionCode) partners.push(a);
    }
    return partners;
  }

  /**
   * Get sanctions against a country
   */
  getSanctionsAgainst(code) {
    return [...(this.sanctions[code] || [])];
  }

  /**
   * Get all sanction targets imposed by a faction
   */
  getSanctionsBy(factionCode) {
    const targets = [];
    for (const [target, imposers] of Object.entries(this.sanctions)) {
      if (imposers.has(factionCode)) targets.push(target);
    }
    return targets;
  }
}
