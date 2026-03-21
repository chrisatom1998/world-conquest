/* ============================================================
   WORLD CONQUEST — Unit Designer (SuperPower 2-Style)
   Design custom military units with tech-level gating
   ============================================================ */

/* ---------- Unit Branches & Base Types ---------- */
const UNIT_BRANCHES = {
  ground: {
    name: "Ground Forces",
    icon: "🏔️",
    types: ["infantry", "mech_infantry", "armor", "mobile_artillery", "sp_aa", "mlrs", "recon", "special_forces"]
  },
  air: {
    name: "Air Forces",
    icon: "✈️",
    types: ["fighter", "bomber", "attack_heli", "transport_heli", "stealth", "drone"]
  },
  naval: {
    name: "Naval Forces",
    icon: "⚓",
    types: ["destroyer", "frigate", "submarine", "carrier", "missile_cruiser", "patrol_boat"]
  }
};

/**
 * Base unit type definitions with stats, SVG icon names, and cost curves.
 * Each stat ranges 0–100 at tech level 5. Real effective stat = baseStat * techMultiplier.
 */
const UNIT_TYPE_DEFS = {
  // ─── GROUND ───
  infantry: {
    name: "Infantry",
    branch: "ground",
    icon: "infantry",
    svgPath: "M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 13c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z",
    baseCost: 0.3,
    baseStats: { attack: 35, defense: 40, speed: 30, stealth: 25, range: 15 },
    crewSize: 10000,
    description: "Versatile foot soldiers. Cheap, high defense in urban/forest terrain.",
    terrainBonus: { urban: 1.4, forest: 1.3, mountain: 1.2 }
  },
  mech_infantry: {
    name: "Mechanized Infantry",
    branch: "ground",
    icon: "mech_infantry",
    svgPath: "M3 6h18v8H3V6zm2 10h2v2H5v-2zm10 0h2v2h-2v-2zm-6-8h6v4H9V8z",
    baseCost: 1.2,
    baseStats: { attack: 50, defense: 55, speed: 55, stealth: 15, range: 25 },
    crewSize: 5000,
    description: "Armored transport infantry. Fast, moderate protection.",
    terrainBonus: { plains: 1.3, desert: 1.2 }
  },
  armor: {
    name: "Armor (Tank)",
    branch: "ground",
    icon: "armor",
    svgPath: "M2 13h2l1-3h14l1 3h2v3H2v-3zm4-4h12l1 3H5l1-3zm3 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    baseCost: 3.0,
    baseStats: { attack: 80, defense: 85, speed: 40, stealth: 5, range: 30 },
    crewSize: 50,
    description: "Heavy armored vehicles. Devastating firepower, slow in rough terrain.",
    terrainBonus: { plains: 1.3, desert: 1.4 },
    terrainPenalty: { forest: 0.7, mountain: 0.5, urban: 0.8 }
  },
  mobile_artillery: {
    name: "Mobile Artillery",
    branch: "ground",
    icon: "artillery",
    svgPath: "M4 17h16v2H4v-2zm2-4l2-8h8l2 8H6zm5-6v4h2V7h-2z",
    baseCost: 2.0,
    baseStats: { attack: 70, defense: 20, speed: 25, stealth: 10, range: 85 },
    crewSize: 30,
    description: "Long-range bombardment. Weak in close combat, devastating at range.",
    terrainBonus: { plains: 1.2 },
    terrainPenalty: { mountain: 0.6 }
  },
  sp_aa: {
    name: "Self-Propelled AA",
    branch: "ground",
    icon: "sp_aa",
    svgPath: "M6 16h12v2H6v-2zm2-10l4-2 4 2v8H8V6zm3 2v4h2V8h-2z",
    baseCost: 2.5,
    baseStats: { attack: 60, defense: 35, speed: 35, stealth: 10, range: 50 },
    crewSize: 25,
    description: "Anti-aircraft systems. Crucial for air defense of ground formations.",
    antiAir: true
  },
  mlrs: {
    name: "MLRS",
    branch: "ground",
    icon: "mlrs",
    svgPath: "M3 16h18v2H3v-2zm2-8h14l-1 7H6l-1-7zm4 2v3h2v-3H9zm4 0v3h2v-3h-2z",
    baseCost: 3.5,
    baseStats: { attack: 90, defense: 15, speed: 20, stealth: 5, range: 90 },
    crewSize: 20,
    description: "Multiple Launch Rocket System. Area saturation bombardment.",
    areaEffect: true
  },
  recon: {
    name: "Reconnaissance",
    branch: "ground",
    icon: "recon",
    svgPath: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z",
    baseCost: 1.0,
    baseStats: { attack: 20, defense: 15, speed: 80, stealth: 75, range: 20 },
    crewSize: 500,
    description: "Fast scouts. Reveals fog of war; provides intelligence bonuses.",
    intelBonus: true
  },
  special_forces: {
    name: "Special Forces",
    branch: "ground",
    icon: "special_forces",
    svgPath: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.87-2.14 7.42-5 8.88-2.86-1.46-5-5.01-5-8.88V7.18L12 5z",
    baseCost: 5.0,
    baseStats: { attack: 75, defense: 45, speed: 70, stealth: 90, range: 25 },
    crewSize: 200,
    description: "Elite covert units. High stealth, surgical strike capability.",
    firstStrikeBonus: 1.5
  },

  // ─── AIR ───
  fighter: {
    name: "Fighter",
    branch: "air",
    icon: "fighter",
    svgPath: "M12 2l-4 8H3l2 4-3 6h4l6-8 6 8h4l-3-6 2-4h-5L12 2z",
    baseCost: 4.0,
    baseStats: { attack: 75, defense: 50, speed: 95, stealth: 30, range: 60 },
    crewSize: 10,
    description: "Air superiority fighter. Controls the skies; intercepts bombers.",
    airSuperiority: true
  },
  bomber: {
    name: "Bomber",
    branch: "air",
    icon: "bomber",
    svgPath: "M2 12l4-3h4l2-5 2 5h4l4 3-4 3h-4l-2 5-2-5H6l-4-3z",
    baseCost: 6.0,
    baseStats: { attack: 90, defense: 30, speed: 60, stealth: 15, range: 80 },
    crewSize: 5,
    description: "Strategic bomber. Massive ground attack damage from altitude.",
    groundAttackBonus: 1.8
  },
  attack_heli: {
    name: "Attack Helicopter",
    branch: "air",
    icon: "attack_heli",
    svgPath: "M1 11h3l2-3h3V6l3-2 3 2v2h3l2 3h3v2H1v-2zm7 4h8v2H8v-2z",
    baseCost: 3.0,
    baseStats: { attack: 70, defense: 35, speed: 65, stealth: 20, range: 35 },
    crewSize: 15,
    description: "Close air support. Devastating vs armor; vulnerable to AA.",
    antiArmorBonus: 2.0
  },
  transport_heli: {
    name: "Transport Helicopter",
    branch: "air",
    icon: "transport_heli",
    svgPath: "M2 11h3l2-3h10l2 3h3v3H2v-3zm5 5h10v1H7v-1z",
    baseCost: 1.5,
    baseStats: { attack: 5, defense: 25, speed: 70, stealth: 10, range: 45 },
    crewSize: 5,
    description: "Troop transport. Enables rapid deployment behind enemy lines.",
    transportCapacity: 2000
  },
  stealth: {
    name: "Stealth Fighter",
    branch: "air",
    icon: "stealth",
    svgPath: "M12 2L2 12h4l6-4 6 4h4L12 2zm-4 12l4 6 4-6H8z",
    baseCost: 12.0,
    baseStats: { attack: 80, defense: 40, speed: 85, stealth: 95, range: 70 },
    crewSize: 2,
    description: "5th-gen stealth. Near-invisible to radar; precision strikes.",
    stealthStrike: true,
    minTechLevel: 4
  },
  drone: {
    name: "Combat Drone",
    branch: "air",
    icon: "drone",
    svgPath: "M4 8h4V4h8v4h4v8h-4v4H8v-4H4V8zm6 2v4h4v-4h-4z",
    baseCost: 1.0,
    baseStats: { attack: 45, defense: 10, speed: 55, stealth: 50, range: 65 },
    crewSize: 0,
    description: "Unmanned combat aerial vehicle. Cheap, expendable, precise.",
    noCrewRisk: true,
    minTechLevel: 2
  },

  // ─── NAVAL ───
  destroyer: {
    name: "Destroyer",
    branch: "naval",
    icon: "destroyer",
    svgPath: "M2 14l3-4h14l3 4v2H2v-2zm6-6h8l1 2H7l1-2z",
    baseCost: 8.0,
    baseStats: { attack: 70, defense: 60, speed: 55, stealth: 15, range: 55 },
    crewSize: 300,
    description: "Fast, versatile warship. Anti-sub and anti-air capable."
  },
  frigate: {
    name: "Frigate",
    branch: "naval",
    icon: "frigate",
    svgPath: "M3 14l2-3h14l2 3v2H3v-2zm5-5h8l1 2H7l1-2z",
    baseCost: 5.0,
    baseStats: { attack: 50, defense: 50, speed: 60, stealth: 20, range: 45 },
    crewSize: 200,
    description: "Escort warship. Affordable fleet backbone with ASW capability."
  },
  submarine: {
    name: "Submarine",
    branch: "naval",
    icon: "submarine",
    svgPath: "M4 13c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1zm8-6a2 2 0 100-4 2 2 0 000 4zm0 12l-2-2h4l-2 2z",
    baseCost: 12.0,
    baseStats: { attack: 80, defense: 45, speed: 35, stealth: 85, range: 70 },
    crewSize: 120,
    description: "Silent hunter. Stealth attacks on ships; can launch missiles.",
    canLaunchMissiles: true
  },
  carrier: {
    name: "Aircraft Carrier",
    branch: "naval",
    icon: "carrier",
    svgPath: "M1 14l2-4h18l2 4v3H1v-3zm4-6h14l1 2H4l1-2zm3-3h8v2H8V5z",
    baseCost: 25.0,
    baseStats: { attack: 40, defense: 70, speed: 30, stealth: 5, range: 95 },
    crewSize: 5000,
    description: "Mobile airbase. Projects air power across oceans.",
    airGroupCapacity: 80,
    minTechLevel: 3
  },
  missile_cruiser: {
    name: "Missile Cruiser",
    branch: "naval",
    icon: "missile_cruiser",
    svgPath: "M2 14l2-3h16l2 3v2H2v-2zm4-5h12l1 2H5l1-2zm3-3h6l1 1H8l1-1z",
    baseCost: 15.0,
    baseStats: { attack: 85, defense: 55, speed: 45, stealth: 10, range: 80 },
    crewSize: 400,
    description: "Heavy missile platform. Long-range ship-to-ship and land attack.",
    canLaunchMissiles: true
  },
  patrol_boat: {
    name: "Patrol Boat",
    branch: "naval",
    icon: "patrol_boat",
    svgPath: "M4 14l2-2h12l2 2v1H4v-1zm5-4h6l1 2H8l1-2z",
    baseCost: 1.5,
    baseStats: { attack: 25, defense: 20, speed: 75, stealth: 35, range: 20 },
    crewSize: 40,
    description: "Fast coastal defense. Cheap and numerous for littoral warfare."
  }
};

/* ---------- Tech Level System ---------- */
const TECH_LEVELS = {
  1: { name: "Basic",      multiplier: 0.6,  costMult: 1.0, color: "#64748b" },
  2: { name: "Standard",   multiplier: 0.8,  costMult: 1.5, color: "#3b82f6" },
  3: { name: "Advanced",   multiplier: 1.0,  costMult: 2.5, color: "#10b981" },
  4: { name: "Cutting Edge",multiplier: 1.25, costMult: 4.0, color: "#f59e0b" },
  5: { name: "Next Gen",   multiplier: 1.5,  costMult: 7.0, color: "#ef4444" }
};

/* ---------- Design Specification ---------- */
/**
 * A UnitDesign represents a customized version of a base unit type.
 * @typedef {Object} UnitDesign
 * @property {string} id - Unique design ID
 * @property {string} baseType - Key from UNIT_TYPE_DEFS
 * @property {string} name - Custom name given by player
 * @property {number} weaponTech - 1–5
 * @property {number} armorTech - 1–5
 * @property {number} engineTech - 1–5
 * @property {number} electronicsTech - 1–5
 * @property {string} owner - Country code
 */

class UnitDesigner {
  constructor() {
    /** @type {Map<string, UnitDesign>} designId → design */
    this.designs = new Map();
    this._idCounter = 0;

    /** @type {Map<string, number>} countryCode → max tech level available */
    this.techLevels = new Map();
  }

  /**
   * Initialize tech levels for all countries based on their power index & GDP.
   */
  initTechLevels(forces) {
    for (const [code, data] of Object.entries(forces)) {
      const pi = data.powerIndex || 1;
      const gdp = data.gdp || 100;

      let techLevel = 1;
      if (pi <= 0.10 && gdp > 5000) techLevel = 5;
      else if (pi <= 0.15 && gdp > 2000) techLevel = 4;
      else if (pi <= 0.25 && gdp > 1000) techLevel = 3;
      else if (pi <= 0.40) techLevel = 2;

      this.techLevels.set(code, techLevel);
    }
  }

  /**
   * Get available tech level for a country.
   */
  getMaxTechLevel(countryCode) {
    return this.techLevels.get(countryCode) || 1;
  }

  /**
   * Increase tech level for a country (via research investment).
   */
  advanceTech(countryCode) {
    const current = this.getMaxTechLevel(countryCode);
    if (current < 5) {
      this.techLevels.set(countryCode, current + 1);
      return true;
    }
    return false;
  }

  /**
   * Create a new unit design.
   * @returns {UnitDesign|null} The created design, or null if invalid
   */
  createDesign(ownerCode, baseType, name, weaponTech, armorTech, engineTech, electronicsTech) {
    const typeDef = UNIT_TYPE_DEFS[baseType];
    if (!typeDef) return null;

    const maxTech = this.getMaxTechLevel(ownerCode);

    // Clamp tech levels to available max
    weaponTech = Math.min(Math.max(1, weaponTech), maxTech);
    armorTech = Math.min(Math.max(1, armorTech), maxTech);
    engineTech = Math.min(Math.max(1, engineTech), maxTech);
    electronicsTech = Math.min(Math.max(1, electronicsTech), maxTech);

    // Check minimum tech level requirement
    if (typeDef.minTechLevel && maxTech < typeDef.minTechLevel) {
      return null;
    }

    const id = `design_${ownerCode}_${++this._idCounter}`;
    const design = {
      id,
      baseType,
      name: name || `${typeDef.name} Mk.${this._idCounter}`,
      weaponTech,
      armorTech,
      engineTech,
      electronicsTech,
      owner: ownerCode
    };

    this.designs.set(id, design);
    return design;
  }

  /**
   * Calculate unit cost based on design specs.
   */
  calcDesignCost(design) {
    const typeDef = UNIT_TYPE_DEFS[design.baseType];
    if (!typeDef) return Infinity;

    const avgTech = (design.weaponTech + design.armorTech + design.engineTech + design.electronicsTech) / 4;
    const techMult = TECH_LEVELS[Math.ceil(avgTech)]?.costMult || 1;

    return Math.round(typeDef.baseCost * techMult * 10) / 10;
  }

  /**
   * Get effective stats for a design (base * tech multiplier).
   */
  getDesignStats(design) {
    const typeDef = UNIT_TYPE_DEFS[design.baseType];
    if (!typeDef) return null;

    const wMult = TECH_LEVELS[design.weaponTech]?.multiplier || 0.6;
    const aMult = TECH_LEVELS[design.armorTech]?.multiplier || 0.6;
    const eMult = TECH_LEVELS[design.engineTech]?.multiplier || 0.6;
    const elMult = TECH_LEVELS[design.electronicsTech]?.multiplier || 0.6;

    return {
      attack: Math.round(typeDef.baseStats.attack * wMult),
      defense: Math.round(typeDef.baseStats.defense * aMult),
      speed: Math.round(typeDef.baseStats.speed * eMult),
      stealth: Math.round(typeDef.baseStats.stealth * elMult),
      range: Math.round(typeDef.baseStats.range * ((wMult + elMult) / 2)),
      // Composite combat power
      combatPower: Math.round(
        (typeDef.baseStats.attack * wMult * 2 +
         typeDef.baseStats.defense * aMult * 1.5 +
         typeDef.baseStats.speed * eMult * 0.5 +
         typeDef.baseStats.stealth * elMult * 0.8 +
         typeDef.baseStats.range * ((wMult + elMult) / 2) * 0.7) / 5.5
      )
    };
  }

  /**
   * Get production cost for building N units of a design.
   */
  getProductionCost(designId, quantity = 1) {
    const design = this.designs.get(designId);
    if (!design) return Infinity;
    return Math.round(this.calcDesignCost(design) * quantity * 10) / 10;
  }

  /**
   * Get all designs for an owner.
   */
  getDesignsForOwner(ownerCode) {
    const result = [];
    for (const design of this.designs.values()) {
      if (design.owner === ownerCode) result.push(design);
    }
    return result;
  }

  /**
   * Create default designs for a country based on their existing forces.
   * Maps existing force categories to SP2-style unit designs.
   */
  createDefaultDesigns(countryCode, forces) {
    const maxTech = this.getMaxTechLevel(countryCode);
    const f = forces[countryCode];
    if (!f) return;

    const defaultTech = Math.min(maxTech, 3);

    // Create standard designs for main force types this country has
    const mappings = [
      { check: "activeMilitary", type: "infantry",   name: "Standard Infantry" },
      { check: "tanks",          type: "armor",       name: "Main Battle Tank" },
      { check: "artillery",      type: "mobile_artillery", name: "Field Artillery" },
      { check: "aircraft",       type: "bomber",      name: "Multi-Role Aircraft" },
      { check: "fighters",       type: "fighter",     name: "Air Superiority Fighter" },
      { check: "helicopters",    type: "attack_heli", name: "Attack Helicopter" },
      { check: "navalVessels",   type: "destroyer",   name: "Fleet Destroyer" },
      { check: "submarines",     type: "submarine",   name: "Attack Submarine" }
    ];

    for (const m of mappings) {
      if ((f[m.check] || 0) > 0) {
        this.createDesign(countryCode, m.type, m.name, defaultTech, defaultTech, defaultTech, defaultTech);
      }
    }
  }

  /**
   * Get available unit types that a country can design (based on tech level).
   */
  getAvailableTypes(countryCode) {
    const maxTech = this.getMaxTechLevel(countryCode);
    const available = [];
    for (const [key, def] of Object.entries(UNIT_TYPE_DEFS)) {
      if (!def.minTechLevel || maxTech >= def.minTechLevel) {
        available.push({ key, ...def });
      }
    }
    return available;
  }
}
