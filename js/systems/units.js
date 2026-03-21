/* ============================================================
   WORLD CONQUEST — Units & Missiles Module
   Granular unit deployment, movement, and missile arsenal
   ============================================================ */

/* ---------- Capital Coordinates ---------- */
const CAPITAL_COORDS = {
  USA: { lat: 38.90, lng: -77.04, name: "Washington D.C." },
  RUS: { lat: 55.75, lng: 37.62, name: "Moscow" },
  CHN: { lat: 39.90, lng: 116.40, name: "Beijing" },
  IND: { lat: 28.61, lng: 77.21, name: "New Delhi" },
  KOR: { lat: 37.57, lng: 126.98, name: "Seoul" },
  GBR: { lat: 51.51, lng: -0.13, name: "London" },
  JPN: { lat: 35.68, lng: 139.69, name: "Tokyo" },
  TUR: { lat: 39.93, lng: 32.86, name: "Ankara" },
  PAK: { lat: 33.69, lng: 73.04, name: "Islamabad" },
  ITA: { lat: 41.90, lng: 12.50, name: "Rome" },
  FRA: { lat: 48.86, lng: 2.35, name: "Paris" },
  DEU: { lat: 52.52, lng: 13.41, name: "Berlin" },
  BRA: { lat: -15.79, lng: -47.88, name: "Brasília" },
  EGY: { lat: 30.04, lng: 31.24, name: "Cairo" },
  AUS: { lat: -35.28, lng: 149.13, name: "Canberra" },
  ISR: { lat: 31.77, lng: 35.23, name: "Jerusalem" },
  IRN: { lat: 35.69, lng: 51.39, name: "Tehran" },
  SAU: { lat: 24.71, lng: 46.68, name: "Riyadh" },
  UKR: { lat: 50.45, lng: 30.52, name: "Kyiv" },
  POL: { lat: 52.23, lng: 21.01, name: "Warsaw" },
  TWN: { lat: 25.03, lng: 121.57, name: "Taipei" },
  IDN: { lat: -6.21, lng: 106.85, name: "Jakarta" },
  THA: { lat: 13.76, lng: 100.50, name: "Bangkok" },
  VNM: { lat: 21.03, lng: 105.85, name: "Hanoi" },
  MYS: { lat: 3.14, lng: 101.69, name: "Kuala Lumpur" },
  PHL: { lat: 14.60, lng: 120.98, name: "Manila" },
  MEX: { lat: 19.43, lng: -99.13, name: "Mexico City" },
  CAN: { lat: 45.42, lng: -75.70, name: "Ottawa" },
  COL: { lat: 4.71, lng: -74.07, name: "Bogotá" },
  ARG: { lat: -34.60, lng: -58.38, name: "Buenos Aires" },
  CHL: { lat: -33.45, lng: -70.67, name: "Santiago" },
  NGA: { lat: 9.06, lng: 7.49, name: "Abuja" },
  ZAF: { lat: -25.75, lng: 28.19, name: "Pretoria" },
  ETH: { lat: 9.02, lng: 38.75, name: "Addis Ababa" },
  KEN: { lat: -1.29, lng: 36.82, name: "Nairobi" },
  GRC: { lat: 37.98, lng: 23.73, name: "Athens" },
  ESP: { lat: 40.42, lng: -3.70, name: "Madrid" },
  PRT: { lat: 38.72, lng: -9.14, name: "Lisbon" },
  NOR: { lat: 59.91, lng: 10.75, name: "Oslo" },
  SWE: { lat: 59.33, lng: 18.07, name: "Stockholm" },
  NLD: { lat: 52.37, lng: 4.90, name: "Amsterdam" },
  BEL: { lat: 50.85, lng: 4.35, name: "Brussels" },
  ARE: { lat: 24.45, lng: 54.65, name: "Abu Dhabi" },
  IRQ: { lat: 33.31, lng: 44.37, name: "Baghdad" },
  PRK: { lat: 39.02, lng: 125.75, name: "Pyongyang" },
  MMR: { lat: 19.76, lng: 96.07, name: "Naypyidaw" },
  NZL: { lat: -41.29, lng: 174.78, name: "Wellington" },
  CUB: { lat: 23.11, lng: -82.37, name: "Havana" },
  PER: { lat: -12.05, lng: -77.04, name: "Lima" },
  KAZ: { lat: 51.17, lng: 71.43, name: "Astana" },
  ROU: { lat: 44.43, lng: 26.10, name: "Bucharest" },
  CZE: { lat: 50.08, lng: 14.42, name: "Prague" },
  HUN: { lat: 47.50, lng: 19.04, name: "Budapest" }
};

/* ---------- Secondary Deployment Points ---------- */
const SECONDARY_CITIES = {
  USA: [
    { lat: 34.05, lng: -118.24, name: "Los Angeles" },
    { lat: 32.78, lng: -96.80,  name: "Dallas" }
  ],
  RUS: [
    { lat: 59.93, lng: 30.32, name: "St. Petersburg" },
    { lat: 56.84, lng: 60.60, name: "Yekaterinburg" }
  ],
  CHN: [
    { lat: 31.23, lng: 121.47, name: "Shanghai" },
    { lat: 23.13, lng: 113.26, name: "Guangzhou" }
  ],
  IND: [
    { lat: 19.08, lng: 72.88, name: "Mumbai" },
    { lat: 12.97, lng: 77.59, name: "Bangalore" }
  ],
  BRA: [
    { lat: -23.55, lng: -46.63, name: "São Paulo" },
    { lat: -22.91, lng: -43.17, name: "Rio de Janeiro" }
  ],
  GBR: [{ lat: 53.48, lng: -2.24, name: "Manchester" }],
  FRA: [{ lat: 43.30, lng: 5.37,  name: "Marseille" }],
  DEU: [{ lat: 48.14, lng: 11.58, name: "Munich" }],
  JPN: [{ lat: 34.69, lng: 135.50, name: "Osaka" }],
  AUS: [{ lat: -33.87, lng: 151.21, name: "Sydney" }]
};

/* ---------- Missile Types ---------- */
const MISSILE_TYPES = {
  icbm: {
    name: "ICBM",
    fullName: "Intercontinental Ballistic Missile",
    icon: "🚀",
    range: Infinity,       // Global
    damage: 0.70,          // 70% of target forces destroyed
    blastRadius: 2.0,      // degrees
    speed: 1200,           // animation ms
    cost: 8.0,             // $B
    apCost: 2,
    interceptChance: 0.15, // 15% chance of interception
    color: "#ef4444",
    trailColor: "rgba(239,68,68,0.6)",
    description: "Global range. Devastates entire regions. Risk of MAD retaliation."
  },
  cruise: {
    name: "Cruise",
    fullName: "Cruise Missile (Tomahawk-class)",
    icon: "💨",
    range: 2500,
    damage: 0.35,
    blastRadius: 0.5,
    speed: 2000,
    cost: 3.0,
    apCost: 1,
    interceptChance: 0.30,
    color: "#3b82f6",
    trailColor: "rgba(59,130,246,0.6)",
    description: "Precision strike. Moderate damage, low cost. Good for tactical targets."
  },
  ballistic: {
    name: "Ballistic",
    fullName: "Short-Range Ballistic Missile",
    icon: "☄️",
    range: 5000,
    damage: 0.50,
    blastRadius: 1.0,
    speed: 1500,
    cost: 5.0,
    apCost: 2,
    interceptChance: 0.20,
    color: "#f59e0b",
    trailColor: "rgba(245,158,11,0.6)",
    description: "High damage, medium range. The backbone of missile arsenals."
  },
  tactical: {
    name: "Tactical",
    fullName: "Tactical Missile (Iskander-class)",
    icon: "🎯",
    range: 500,
    damage: 0.20,
    blastRadius: 0.3,
    speed: 800,
    cost: 1.5,
    apCost: 1,
    interceptChance: 0.40,
    color: "#10b981",
    trailColor: "rgba(16,185,129,0.6)",
    description: "Short range, precise. Cheap and fast for frontline support."
  },
  hypersonic: {
    name: "Hypersonic",
    fullName: "Hypersonic Glide Vehicle",
    icon: "⚡",
    range: 3000,
    damage: 0.45,
    blastRadius: 0.8,
    speed: 600,
    cost: 6.0,
    apCost: 2,
    interceptChance: 0.05, // Very hard to intercept
    color: "#8b5cf6",
    trailColor: "rgba(139,92,246,0.6)",
    description: "Mach 10+. Nearly impossible to intercept. Premium weapon."
  },
  antiship: {
    name: "Anti-Ship",
    fullName: "Anti-Ship Missile (Harpoon-class)",
    icon: "🌊",
    range: 1000,
    damage: 0.40,
    blastRadius: 0.2,
    speed: 1000,
    cost: 2.0,
    apCost: 1,
    interceptChance: 0.25,
    color: "#06b6d4",
    trailColor: "rgba(6,182,212,0.6)",
    description: "Designed for naval targets. Extra damage to ships and subs."
  }
};

/* ---------- Unit Icon Mapping ---------- */
const UNIT_ICONS = {
  troops:   { emoji: "🪖", label: "Infantry" },
  tanks:    { emoji: "🛡️", label: "Armor" },
  aircraft: { emoji: "✈️", label: "Air Force" },
  artillery:{ emoji: "💥", label: "Artillery" },
  naval:    { emoji: "🚢", label: "Navy" },
  mixed:    { emoji: "⚔️", label: "Combined Arms" }
};

/* ============================================================
   UnitManager — Manages all deployed unit groups
   ============================================================ */
class UnitManager {
  constructor() {
    /** @type {Map<string, UnitGroup>} */
    this.units = new Map();
    this._idCounter = 0;
  }

  /**
   * Generate a unique unit ID
   */
  _nextId(owner) {
    return `ug_${owner}_${++this._idCounter}`;
  }

  /**
   * Deploy a new unit group at a location
   * @returns {UnitGroup}
   */
  deployUnit(owner, lat, lng, composition, locationName = "") {
    const id = this._nextId(owner);
    const unit = {
      id,
      owner,
      lat,
      lng,
      locationName,
      composition: { ...composition },
      status: "idle",       // idle | moving | engaged
      moveTarget: null,     // { lat, lng } if moving
      createdTurn: 0
    };
    this.units.set(id, unit);
    return unit;
  }

  /**
   * Move a unit to a new location
   */
  moveUnit(unitId, newLat, newLng) {
    const unit = this.units.get(unitId);
    if (!unit) return false;
    unit.lat = newLat;
    unit.lng = newLng;
    unit.status = "idle";
    unit.moveTarget = null;
    return true;
  }

  /**
   * Start moving (sets target, animation handled by map)
   */
  startMove(unitId, targetLat, targetLng) {
    const unit = this.units.get(unitId);
    if (!unit) return false;
    unit.status = "moving";
    unit.moveTarget = { lat: targetLat, lng: targetLng };
    return true;
  }

  /**
   * Complete a pending move
   */
  completeMove(unitId) {
    const unit = this.units.get(unitId);
    if (!unit || !unit.moveTarget) return false;
    unit.lat = unit.moveTarget.lat;
    unit.lng = unit.moveTarget.lng;
    unit.status = "idle";
    unit.moveTarget = null;
    return true;
  }

  /**
   * Update all moving units by interpolating toward their targets.
   * Called every tick by the game clock.
   * @param {number} deltaDays - Fractional game-days elapsed since last tick
   */
  updateMovement(deltaDays) {
    const speed = 5; // degrees per game-day
    for (const unit of this.units.values()) {
      if (unit.status !== "moving" || !unit.moveTarget) continue;

      const dx = unit.moveTarget.lng - unit.lng;
      const dy = unit.moveTarget.lat - unit.lat;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.5) {
        // Close enough — snap to target
        this.completeMove(unit.id);
      } else {
        // Move toward target
        const step = Math.min(speed * deltaDays, dist);
        unit.lat += (dy / dist) * step;
        unit.lng += (dx / dist) * step;
      }
    }
  }

  /**
   * Merge two friendly units into one
   */
  mergeUnits(unitIdA, unitIdB) {
    const a = this.units.get(unitIdA);
    const b = this.units.get(unitIdB);
    if (!a || !b || a.owner !== b.owner) return null;

    // Merge B into A
    for (const [type, count] of Object.entries(b.composition)) {
      a.composition[type] = (a.composition[type] || 0) + count;
    }
    this.units.delete(unitIdB);
    return a;
  }

  /**
   * Split a portion off a unit into a new unit
   */
  splitUnit(unitId, splitComposition) {
    const unit = this.units.get(unitId);
    if (!unit) return null;

    // Validate we have enough
    for (const [type, count] of Object.entries(splitComposition)) {
      if ((unit.composition[type] || 0) < count) return null;
    }

    // Remove from original
    for (const [type, count] of Object.entries(splitComposition)) {
      unit.composition[type] -= count;
      if (unit.composition[type] <= 0) delete unit.composition[type];
    }

    // Create new unit slightly offset
    const offset = 0.3 + Math.random() * 0.2;
    return this.deployUnit(
      unit.owner,
      unit.lat + offset,
      unit.lng + offset,
      splitComposition,
      unit.locationName + " (split)"
    );
  }

  /**
   * Remove a unit (destroyed)
   */
  removeUnit(unitId) {
    return this.units.delete(unitId);
  }

  /**
   * Get all units for an owner
   */
  getUnitsForOwner(ownerCode) {
    const result = [];
    for (const unit of this.units.values()) {
      if (unit.owner === ownerCode) result.push(unit);
    }
    return result;
  }

  /**
   * Get units within a radius (degrees) of a point
   */
  getUnitsNear(lat, lng, radiusDeg = 2.0) {
    const result = [];
    for (const unit of this.units.values()) {
      const dist = Math.sqrt((unit.lat - lat) ** 2 + (unit.lng - lng) ** 2);
      if (dist <= radiusDeg) result.push({ unit, dist });
    }
    return result.sort((a, b) => a.dist - b.dist);
  }

  /**
   * Get the primary type of a unit (for icon selection)
   */
  getPrimaryType(unit) {
    const comp = unit.composition;
    let maxType = "troops";
    let maxCount = 0;
    const weights = { troops: 1, tanks: 50, aircraft: 100, artillery: 20, naval: 200 };

    for (const [type, count] of Object.entries(comp)) {
      const weighted = count * (weights[type] || 1);
      if (weighted > maxCount) {
        maxCount = weighted;
        maxType = type;
      }
    }

    // If has multiple combat types, label as "mixed"
    const combatTypes = Object.entries(comp).filter(
      ([t, c]) => c > 0 && ["troops", "tanks", "aircraft", "artillery"].includes(t)
    );
    if (combatTypes.length >= 3) return "mixed";

    return maxType;
  }

  /**
   * Get total strength of a unit group
   */
  getUnitStrength(unit) {
    const c = unit.composition;
    return (
      (c.troops || 0) * 0.5 +
      (c.tanks || 0) * 8 +
      (c.aircraft || 0) * 15 +
      (c.artillery || 0) * 6 +
      (c.naval || 0) * 25 +
      (c.helicopters || 0) * 10 +
      (c.fighters || 0) * 20
    );
  }

  /**
   * Get a human-readable size label
   */
  getUnitSizeLabel(unit) {
    const totalTroops = unit.composition.troops || 0;
    const totalVehicles = (unit.composition.tanks || 0) + (unit.composition.aircraft || 0) +
                          (unit.composition.artillery || 0) + (unit.composition.naval || 0);
    if (totalTroops >= 100000) return `${Math.round(totalTroops / 1000)}K`;
    if (totalTroops >= 10000) return `${Math.round(totalTroops / 1000)}K`;
    if (totalTroops >= 1000) return `${(totalTroops / 1000).toFixed(1)}K`;
    if (totalVehicles > 0) return `${totalVehicles}`;
    return `${totalTroops}`;
  }

  /**
   * Auto-deploy all country forces as unit groups spread across their territories.
   * Each territory gets a share of forces proportional to its population fraction.
   * Countries without TERRITORY_DATA entries get a single unit at their capital.
   */
  autoDeploy(forces, ownership) {
    const codes = Object.keys(forces);

    for (const code of codes) {
      const f = forces[code];
      if (!f || !CAPITAL_COORDS[code]) continue;

      // Skip if this faction already has deployed units
      if (this.getUnitsForOwner(ownership[code] || code).length > 0) continue;

      const territories = typeof TERRITORY_DATA !== "undefined" ? TERRITORY_DATA[code] : null;
      const owner = ownership[code] || code;

      if (territories && territories.length > 0) {
        // Distribute across all territories using pop fractions
        for (const t of territories) {
          const frac = t.pop || (1 / territories.length);

          const composition = {};
          if (f.activeMilitary) composition.troops = Math.round(f.activeMilitary * frac);
          if (f.tanks) composition.tanks = Math.round(f.tanks * frac);
          if (f.aircraft) composition.aircraft = Math.round(f.aircraft * frac);
          if (f.artillery) composition.artillery = Math.round(f.artillery * frac);
          if (f.navalVessels) composition.naval = Math.round(f.navalVessels * frac);
          if (f.helicopters) composition.helicopters = Math.round(f.helicopters * frac);
          if (f.fighters) composition.fighters = Math.round(f.fighters * frac);

          // Remove zero-value entries
          for (const key of Object.keys(composition)) {
            if (composition[key] <= 0) delete composition[key];
          }

          // Skip territories with negligible forces
          const totalForce = Object.values(composition).reduce((s, v) => s + v, 0);
          if (totalForce < 10 || Object.keys(composition).length === 0) continue;

          const unit = this.deployUnit(
            owner,
            t.lat + (Math.random() - 0.5) * 0.2,
            t.lng + (Math.random() - 0.5) * 0.2,
            composition,
            t.name
          );
          unit.createdTurn = 0;
        }
      } else {
        // Fallback: single unit at capital
        const cap = CAPITAL_COORDS[code];
        const composition = {};
        if (f.activeMilitary) composition.troops = f.activeMilitary;
        if (f.tanks) composition.tanks = f.tanks;
        if (f.aircraft) composition.aircraft = f.aircraft;
        if (f.artillery) composition.artillery = f.artillery;
        if (f.navalVessels) composition.naval = f.navalVessels;
        if (f.helicopters) composition.helicopters = f.helicopters;
        if (f.fighters) composition.fighters = f.fighters;

        for (const key of Object.keys(composition)) {
          if (composition[key] <= 0) delete composition[key];
        }

        if (Object.keys(composition).length > 0) {
          const unit = this.deployUnit(
            owner,
            cap.lat + (Math.random() - 0.5) * 0.3,
            cap.lng + (Math.random() - 0.5) * 0.3,
            composition,
            cap.name
          );
          unit.createdTurn = 0;
        }
      }
    }
  }

  /**
   * Apply damage to a unit group (returns true if unit survived)
   */
  applyDamage(unitId, damageFraction) {
    const unit = this.units.get(unitId);
    if (!unit) return false;

    const remaining = 1 - damageFraction;
    for (const type of Object.keys(unit.composition)) {
      unit.composition[type] = Math.max(1, Math.round(unit.composition[type] * remaining));
    }

    // Remove if all components basically zero
    const totalForce = Object.values(unit.composition).reduce((s, v) => s + v, 0);
    if (totalForce <= 5) {
      this.units.delete(unitId);
      return false; // Unit destroyed
    }
    return true; // Unit survived
  }
}

/* ============================================================
   MissileManager — Missile inventory and launches
   ============================================================ */
class MissileManager {
  constructor() {
    /** @type {Map<string, Object>} owner → { icbm: N, cruise: N, ... } */
    this.inventory = new Map();
  }

  /**
   * Init missile inventory from country military data
   */
  init(forces) {
    this.inventory.clear();
    for (const [code, f] of Object.entries(forces)) {
      const nukes = f.nuclearWeapons || 0;
      const power = f.powerIndex || 0;

      // Base inventory: scaled by power
      const inv = {
        icbm: nukes > 0 ? Math.max(1, Math.round(nukes * 0.3)) : 0,
        cruise: Math.round(power * 0.3),
        ballistic: Math.round(power * 0.15),
        tactical: Math.round(power * 0.5),
        hypersonic: power >= 80 ? Math.round(power * 0.05) : 0,
        antiship: Math.round(power * 0.1)
      };

      this.inventory.set(code, inv);
    }
  }

  /**
   * Get missile count for an owner
   */
  getInventory(ownerCode) {
    return this.inventory.get(ownerCode) || {};
  }

  /**
   * Check if owner has a missile of given type
   */
  hasMissile(ownerCode, type) {
    const inv = this.inventory.get(ownerCode);
    return inv && (inv[type] || 0) > 0;
  }

  /**
   * Consume a missile from inventory
   */
  consumeMissile(ownerCode, type) {
    const inv = this.inventory.get(ownerCode);
    if (!inv || (inv[type] || 0) <= 0) return false;
    inv[type]--;
    return true;
  }

  /**
   * Add missiles to inventory without charging budget.
   */
  addMissile(ownerCode, type, amount = 1) {
    const missileData = MISSILE_TYPES[type];
    if (!missileData || amount <= 0) return false;

    const inv = this.inventory.get(ownerCode) || {};
    inv[type] = (inv[type] || 0) + amount;
    this.inventory.set(ownerCode, inv);
    return true;
  }

  /**
   * Produce a missile (adds to inventory, costs budget)
   */
  produceMissile(ownerCode, type, economy) {
    const missileData = MISSILE_TYPES[type];
    if (!missileData) return { success: false, message: "Unknown missile type." };

    const eco = economy[ownerCode];
    if (!eco || eco.budget < missileData.cost) {
      return { success: false, message: `Insufficient budget! Need $${missileData.cost}B.` };
    }

    eco.budget = Math.round((eco.budget - missileData.cost) * 10) / 10;

    const inv = this.inventory.get(ownerCode) || {};
    inv[type] = (inv[type] || 0) + 1;
    this.inventory.set(ownerCode, inv);

    return {
      success: true,
      message: `Produced 1x ${missileData.name} missile for $${missileData.cost}B.`
    };
  }

  /**
   * Calculate distance between two points (rough degrees)
   */
  static calcDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /**
   * Check if a missile can reach from source to target
   */
  canReach(type, fromLat, fromLng, toLat, toLng) {
    const missileData = MISSILE_TYPES[type];
    if (!missileData) return false;
    if (missileData.range === Infinity) return true;
    const dist = MissileManager.calcDistance(fromLat, fromLng, toLat, toLng);
    return dist <= missileData.range;
  }

  /**
   * Launch a missile and calculate damage to nearby units
   * Returns { hit, intercepted, damagedUnits[] }
   */
  launch(ownerCode, type, targetLat, targetLng, unitManager) {
    const missileData = MISSILE_TYPES[type];
    if (!missileData) return { hit: false, message: "Unknown missile type." };

    if (!this.consumeMissile(ownerCode, type)) {
      return { hit: false, message: `No ${missileData.name} missiles in stock!` };
    }

    // Interception chance
    if (Math.random() < missileData.interceptChance) {
      return {
        hit: false,
        intercepted: true,
        message: `${missileData.name} missile was intercepted by enemy air defense!`
      };
    }

    // Find all enemy units in blast radius
    const nearby = unitManager.getUnitsNear(targetLat, targetLng, missileData.blastRadius);
    const damagedUnits = [];

    for (const { unit, dist } of nearby) {
      if (unit.owner === ownerCode) continue; // Don't hit yourself

      // Damage falls off with distance
      const falloff = 1 - (dist / missileData.blastRadius);
      const actualDamage = missileData.damage * Math.max(0.2, falloff);

      // Anti-ship bonus vs naval units
      let finalDamage = actualDamage;
      if (type === "antiship" && (unit.composition.naval || 0) > 0) {
        finalDamage *= 1.5;
      }

      const survived = unitManager.applyDamage(unit.id, Math.min(0.95, finalDamage));
      damagedUnits.push({
        unitId: unit.id,
        owner: unit.owner,
        damage: Math.round(finalDamage * 100),
        survived
      });
    }

    return {
      hit: true,
      intercepted: false,
      type,
      targetLat,
      targetLng,
      damagedUnits,
      message: damagedUnits.length > 0
        ? `${missileData.icon} ${missileData.name} struck! ${damagedUnits.length} unit(s) hit.`
        : `${missileData.icon} ${missileData.name} struck but no enemy units in blast zone.`
    };
  }
}
