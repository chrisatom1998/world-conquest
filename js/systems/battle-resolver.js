/* ============================================================
   WORLD CONQUEST — Battle Resolver (SuperPower 2-Style)
   Phased combat: Air → Bombardment → Ground → Naval
   ============================================================ */

/* ---------- Battle Commands ---------- */
const BATTLE_COMMANDS = {
  full_assault: {
    name: "Full Assault",
    icon: "⚔️",
    description: "Maximum aggression. High damage output but heavy casualties.",
    attackMod: 1.4,
    defenseMod: 0.6,
    moraleCost: 8,
    color: "#ef4444"
  },
  defensive_hold: {
    name: "Defensive Hold",
    icon: "🛡️",
    description: "Dig in and defend. Low damage output but minimal casualties.",
    attackMod: 0.5,
    defenseMod: 1.5,
    moraleCost: 3,
    color: "#3b82f6"
  },
  flanking: {
    name: "Flanking Maneuver",
    icon: "🔄",
    description: "Attempt to outflank. Bonus if speed advantage; risky otherwise.",
    attackMod: 1.2,
    defenseMod: 0.9,
    moraleCost: 5,
    speedRequirement: true,
    color: "#f59e0b"
  },
  retreat: {
    name: "Strategic Retreat",
    icon: "🏃",
    description: "Fall back to minimize losses. Cedes ground to enemy.",
    attackMod: 0.1,
    defenseMod: 1.8,
    moraleCost: 2,
    autoRetreat: true,
    color: "#8b5cf6"
  },
  bombardment: {
    name: "Bombardment Only",
    icon: "💥",
    description: "Artillery and air strikes only. Softens targets before assault.",
    attackMod: 0.8,
    defenseMod: 1.1,
    moraleCost: 4,
    bombardmentOnly: true,
    color: "#06b6d4"
  }
};

/* ---------- Terrain Types ---------- */
const TERRAIN_TYPES = {
  plains:   { name: "Plains",    icon: "🌾", defenseBonus: 0,    attackBonus: 0.1,  armorBonus: 0.2 },
  urban:    { name: "Urban",     icon: "🏙️", defenseBonus: 0.4,  attackBonus: -0.1, armorBonus: -0.3, infantryBonus: 0.4 },
  forest:   { name: "Forest",    icon: "🌲", defenseBonus: 0.25, attackBonus: 0,    armorBonus: -0.2, infantryBonus: 0.3, stealthBonus: 0.3 },
  desert:   { name: "Desert",    icon: "🏜️", defenseBonus: -0.1, attackBonus: 0.1,  armorBonus: 0.3 },
  mountain: { name: "Mountain",  icon: "⛰️", defenseBonus: 0.5,  attackBonus: -0.2, armorBonus: -0.5, infantryBonus: 0.3 },
  coastal:  { name: "Coastal",   icon: "🏖️", defenseBonus: 0.1,  attackBonus: 0,    navalBonus: 0.4 },
  arctic:   { name: "Arctic",    icon: "❄️", defenseBonus: 0.2,  attackBonus: -0.15, speedPenalty: -0.3 }
};

/* ---------- Morale thresholds ---------- */
const MORALE_ROUT_THRESHOLD = 20;    // Below this, units rout
const MORALE_SHAKEN_THRESHOLD = 40;  // Below this, units fight at reduced effectiveness

class BattleResolver {
  constructor() {
    // Nothing to initialize — stateless resolver
  }

  /**
   * Resolve a full battle between two unit groups.
   *
   * @param {Object} attackerUnit - Attacker unit group from UnitManager
   * @param {Object} defenderUnit - Defender unit group from UnitManager
   * @param {string} attackerCommand - Key from BATTLE_COMMANDS
   * @param {string} defenderCommand - AI-selected command for defender
   * @param {string} terrainType - Key from TERRAIN_TYPES
   * @param {UnitDesigner} unitDesigner - For tech-level bonuses
   * @returns {BattleResult}
   */
  resolve(attackerUnit, defenderUnit, attackerCommand = "full_assault", defenderCommand = "defensive_hold", terrainType = "plains", unitDesigner = null, fortLevel = 0, researchTree = null) {
    const cmd = BATTLE_COMMANDS[attackerCommand] || BATTLE_COMMANDS.full_assault;
    const defCmd = BATTLE_COMMANDS[defenderCommand] || BATTLE_COMMANDS.defensive_hold;
    const terrain = TERRAIN_TYPES[terrainType] || TERRAIN_TYPES.plains;

    // Calculate effective strength for each side
    const attackerStr = this._calcEffectiveStrength(attackerUnit, "attacker", cmd, terrain, unitDesigner, researchTree);
    let defenderStr = this._calcEffectiveStrength(defenderUnit, "defender", defCmd, terrain, unitDesigner, researchTree);

    // Apply fortification bonus to defender
    if (fortLevel > 0) {
      defenderStr *= (1 + fortLevel * 0.15);
    }

    // Initialize morale (100 = fresh, 0 = routed)
    let attackerMorale = 100;
    let defenderMorale = 100;

    // Track phase results
    const phases = [];

    // ═══════ PHASE 1: Air Superiority ═══════
    const airPhase = this._resolveAirPhase(attackerUnit, defenderUnit, attackerStr, defenderStr, terrain);
    phases.push(airPhase);
    attackerMorale -= airPhase.attackerMoraleLoss;
    defenderMorale -= airPhase.defenderMoraleLoss;

    // ═══════ PHASE 2: Bombardment ═══════
    const bombPhase = this._resolveBombardmentPhase(attackerUnit, defenderUnit, cmd, defCmd, terrain);
    phases.push(bombPhase);
    attackerMorale -= bombPhase.attackerMoraleLoss;
    defenderMorale -= bombPhase.defenderMoraleLoss;

    // ═══════ PHASE 3: Ground Assault ═══════
    if (!cmd.bombardmentOnly && !cmd.autoRetreat) {
      const groundPhase = this._resolveGroundPhase(attackerUnit, defenderUnit, cmd, defCmd, terrain, attackerMorale, defenderMorale);
      phases.push(groundPhase);
      attackerMorale -= groundPhase.attackerMoraleLoss;
      defenderMorale -= groundPhase.defenderMoraleLoss;
    }

    // ═══════ PHASE 4: Naval Support ═══════
    const hasNaval = (attackerUnit.composition.naval > 0 || attackerUnit.composition.submarines > 0 || 
                      defenderUnit.composition.naval > 0 || defenderUnit.composition.submarines > 0);
                      
    if (terrain.navalBonus) {
      const navalPhase = this._resolveNavalPhase(attackerUnit, defenderUnit, terrain);
      phases.push(navalPhase);
      attackerMorale -= navalPhase.attackerMoraleLoss;
      defenderMorale -= navalPhase.defenderMoraleLoss;
    } else if (hasNaval) {
      phases.push({
        name: "Naval Support",
        icon: "🚢",
        attackerAdvantage: false,
        attackerMoraleLoss: 0,
        defenderMoraleLoss: 0,
        attackerCasualties: 0,
        defenderCasualties: 0,
        summary: "Inland territory. Naval assets cannot engage."
      });
    }

    // ═══════ Determine Winner ═══════
    const attackerRouted = attackerMorale <= MORALE_ROUT_THRESHOLD;
    const defenderRouted = defenderMorale <= MORALE_ROUT_THRESHOLD;

    let attackerWins;
    if (cmd.autoRetreat) {
      attackerWins = false; // Retreat = give up ground
    } else if (attackerRouted && !defenderRouted) {
      attackerWins = false;
    } else if (defenderRouted && !attackerRouted) {
      attackerWins = true;
    } else {
      // Neither routed — compare remaining strength
      const aRemaining = this._getRemainingStrength(attackerUnit);
      const dRemaining = this._getRemainingStrength(defenderUnit);
      const ratio = aRemaining / Math.max(1, aRemaining + dRemaining);
      attackerWins = ratio > (0.40 + Math.random() * 0.20);
    }

    // Apply total casualties
    const attackerLossPct = this._calcTotalLoss(phases, "attacker", cmd);
    const defenderLossPct = this._calcTotalLoss(phases, "defender", defCmd);

    // Apply losses to units — use each side's own loss calculation
    this._applyLossesToUnit(attackerUnit, attackerWins ? attackerLossPct * 0.3 : attackerLossPct);
    this._applyLossesToUnit(defenderUnit, attackerWins ? defenderLossPct : attackerLossPct * 0.4);

    return {
      attackerWins,
      attackerCommand: cmd,
      defenderCommand: defCmd,
      terrain,
      phases,
      attackerMorale: Math.max(0, attackerMorale),
      defenderMorale: Math.max(0, defenderMorale),
      attackerLossPct: Math.round(attackerLossPct * 100),
      defenderLossPct: Math.round(defenderLossPct * 100),
      attackerRouted,
      defenderRouted,
      attackerUnit,
      defenderUnit
    };
  }

  /* ═══════ PHASE RESOLVERS ═══════ */

  _resolveAirPhase(attacker, defender, aStr, dStr, terrain) {
    const aAir = (attacker.composition.aircraft || 0) + (attacker.composition.fighters || 0) * 2;
    const dAir = (defender.composition.aircraft || 0) + (defender.composition.fighters || 0) * 2;

    // AA defense
    const dAA = this._hasUnitType(defender, "sp_aa") ? 1.5 : 1.0;
    const aAA = this._hasUnitType(attacker, "sp_aa") ? 1.5 : 1.0;

    const aAirPower = aAir * 15 + (attacker.composition.helicopters || 0) * 8;
    const dAirPower = (dAir * 15 + (defender.composition.helicopters || 0) * 8) * dAA;

    const airRatio = aAirPower / Math.max(1, aAirPower + dAirPower);
    const airWin = airRatio > 0.5;

    let aCasualties = 0, dCasualties = 0;
    if (aAirPower > 0 || dAirPower > 0) {
      aCasualties = airWin ? 0.02 + Math.random() * 0.03 : 0.05 + Math.random() * 0.05;
      dCasualties = airWin ? 0.06 + Math.random() * 0.06 : 0.02 + Math.random() * 0.03;
    }

    return {
      name: "Air Superiority",
      icon: "✈️",
      attackerAdvantage: airWin,
      attackerMoraleLoss: airWin ? 3 : 10,
      defenderMoraleLoss: airWin ? 12 : 3,
      attackerCasualties: aCasualties,
      defenderCasualties: dCasualties,
      summary: airWin
        ? `Attacker achieved air superiority (${aAirPower} vs ${dAirPower} air power)`
        : `Defender maintained air control (${dAirPower} vs ${aAirPower} air power)`
    };
  }

  _resolveBombardmentPhase(attacker, defender, cmd, defCmd, terrain) {
    const aArt = (attacker.composition.artillery || 0) * 6;
    const dArt = (defender.composition.artillery || 0) * 6;

    // MLRS bonus
    const aMLRS = this._hasUnitType(attacker, "mlrs") ? 1.8 : 1.0;
    const dMLRS = this._hasUnitType(defender, "mlrs") ? 1.8 : 1.0;

    // Bomber contribution
    const aAirBomb = (attacker.composition.aircraft || 0) * 8;
    const dAirBomb = (defender.composition.aircraft || 0) * 3; // Defenders bomb less

    const aBombPower = (aArt * aMLRS + aAirBomb) * cmd.attackMod;
    const dBombPower = (dArt * dMLRS + dAirBomb) * defCmd.attackMod * 0.6;

    const terrainDefBonus = 1 + (terrain.defenseBonus || 0);

    let aCasualties = Math.min(0.15, dBombPower * 0.00005 / terrainDefBonus);
    let dCasualties = Math.min(0.15, aBombPower * 0.00005 / terrainDefBonus);

    return {
      name: "Bombardment",
      icon: "💥",
      attackerAdvantage: aBombPower > dBombPower,
      attackerMoraleLoss: Math.round(aCasualties * 80),
      defenderMoraleLoss: Math.round(dCasualties * 80),
      attackerCasualties: aCasualties,
      defenderCasualties: dCasualties,
      summary: `Artillery exchange — Attacker: ${Math.round(aBombPower)} firepower, Defender: ${Math.round(dBombPower)} firepower`
    };
  }

  _resolveGroundPhase(attacker, defender, cmd, defCmd, terrain, aMorale, dMorale) {
    // Ground forces
    const aTroops = (attacker.composition.troops || 0) * 0.5;
    const aTanks = (attacker.composition.tanks || 0) * 8;
    const dTroops = (defender.composition.troops || 0) * 0.5;
    const dTanks = (defender.composition.tanks || 0) * 8;

    // Terrain modifiers
    const terrainArmorMod = 1 + (terrain.armorBonus || 0);
    const terrainInfMod = 1 + (terrain.infantryBonus || 0);

    const aGround = (aTroops * terrainInfMod + aTanks * terrainArmorMod) * cmd.attackMod;
    const dGround = (dTroops * terrainInfMod + dTanks * terrainArmorMod) * defCmd.defenseMod * (1 + (terrain.defenseBonus || 0));

    // Morale effectiveness
    const aMoraleEff = aMorale > MORALE_SHAKEN_THRESHOLD ? 1.0 : 0.65;
    const dMoraleEff = dMorale > MORALE_SHAKEN_THRESHOLD ? 1.0 : 0.65;

    const aEffective = aGround * aMoraleEff;
    const dEffective = dGround * dMoraleEff;

    const ratio = aEffective / Math.max(1, aEffective + dEffective);
    const groundWin = ratio > (0.45 + Math.random() * 0.1);

    // Flanking bonus
    let flankBonus = 0;
    if (cmd.speedRequirement) {
      const aSpeed = (attacker.composition.tanks || 0) * 3 + (attacker.composition.troops || 0) * 0.1;
      const dSpeed = (defender.composition.tanks || 0) * 3 + (defender.composition.troops || 0) * 0.1;
      if (aSpeed > dSpeed * 1.2) flankBonus = 0.05;
      else flankBonus = -0.03; // Flanking failed
    }

    const baseLoss = 0.08 + Math.random() * 0.12;
    const aCasualties = groundWin ? baseLoss * 0.5 - flankBonus : baseLoss + 0.05;
    const dCasualties = groundWin ? baseLoss + 0.03 + flankBonus : baseLoss * 0.4;

    return {
      name: "Ground Assault",
      icon: "🛡️",
      attackerAdvantage: groundWin,
      attackerMoraleLoss: groundWin ? 5 : 15,
      defenderMoraleLoss: groundWin ? 18 : 5,
      attackerCasualties: Math.max(0.02, aCasualties),
      defenderCasualties: Math.max(0.02, dCasualties),
      summary: groundWin
        ? `Attacker broke through defensive lines (${Math.round(aEffective)} vs ${Math.round(dEffective)} ground power)`
        : `Defender held the line (${Math.round(dEffective)} vs ${Math.round(aEffective)} ground power)`
    };
  }

  _resolveNavalPhase(attacker, defender, terrain) {
    const aNaVal = (attacker.composition.naval || 0) * 25;
    const dNaval = (defender.composition.naval || 0) * 25;
    const navalBonus = terrain.navalBonus || 0;

    const aNavPower = aNaVal * (1 + navalBonus);
    const dNavPower = dNaval * (1 + navalBonus);

    const navalWin = aNavPower > dNavPower;

    return {
      name: "Naval Support",
      icon: "🚢",
      attackerAdvantage: navalWin,
      attackerMoraleLoss: navalWin ? 2 : 6,
      defenderMoraleLoss: navalWin ? 8 : 2,
      attackerCasualties: navalWin ? 0.01 : 0.04,
      defenderCasualties: navalWin ? 0.05 : 0.01,
      summary: navalWin
        ? `Attacker's navy provided shore bombardment support`
        : `Defender's coastal fleet repelled naval assault`
    };
  }

  /* ═══════ HELPERS ═══════ */

  _calcEffectiveStrength(unit, role, cmd, terrain, designer, researchTree) {
    const c = unit.composition;
    
    // Base strength
    let troopsStr = (c.troops || 0) * 0.5 * (1 + (terrain.infantryBonus || 0));
    let tanksStr = (c.tanks || 0) * 8 * (1 + (terrain.armorBonus || 0));
    let artilleryStr = (c.artillery || 0) * 6;
    let aircraftStr = (c.aircraft || 0) * 15;
    let fightersStr = (c.fighters || 0) * 20;
    let helicoptersStr = (c.helicopters || 0) * 10;
    let navalStr = (c.naval || 0) * 25;

    // Apply research modifiers
    if (researchTree && unit.owner) {
      if (researchTree.hasResearched(unit.owner, "mil_1")) troopsStr *= 1.1; // Basic Training
      if (researchTree.hasResearched(unit.owner, "mil_3")) tanksStr *= 1.2;  // Composite Armor
      if (researchTree.hasResearched(unit.owner, "mil_4")) artilleryStr *= 1.25; // Precision Munitions
      if (researchTree.hasResearched(unit.owner, "mil_6")) troopsStr *= 1.35; // Exoskeleton
      if (researchTree.hasResearched(unit.owner, "aero_6")) fightersStr *= 1.35; // 6th Gen Fighters
      if (researchTree.hasResearched(unit.owner, "nav_4")) navalStr *= 1.3; // Advanced Naval
    }

    let str = troopsStr + tanksStr + artilleryStr + aircraftStr + fightersStr + helicoptersStr + navalStr;

    // Apply command modifier
    if (role === "attacker") str *= cmd.attackMod;
    else str *= cmd.defenseMod;

    // General attack/defense research
    if (researchTree && unit.owner) {
      if (role === "attacker" && researchTree.hasResearched(unit.owner, "mil_2")) str *= 1.15; // Advanced Tactics
    }

    return str;
  }

  _getRemainingStrength(unit) {
    return calcStrength(unit.composition);
  }

  _calcTotalLoss(phases, side, cmd) {
    let total = 0;
    for (const p of phases) {
      total += side === "attacker" ? p.attackerCasualties : p.defenderCasualties;
    }
    return Math.min(0.85, Math.max(0.05, total));
  }

  _applyLossesToUnit(unit, lossFraction) {
    const lossMult = 1 - Math.min(0.85, lossFraction);
    for (const type of Object.keys(unit.composition)) {
      unit.composition[type] = Math.max(1, Math.round(unit.composition[type] * lossMult));
    }
  }

  _hasUnitType(unit, typeName) {
    // Check if unit has a specific type (simplified — checks composition keys)
    if (typeName === "sp_aa") return (unit.composition.fighters || 0) > 10;
    if (typeName === "mlrs") return (unit.composition.artillery || 0) > 100;
    return false;
  }

  /**
   * AI chooses a battle command based on situation.
   */
  chooseAICommand(defenderUnit, attackerUnit) {
    const dStr = this._getRemainingStrength(defenderUnit);
    const aStr = this._getRemainingStrength(attackerUnit);
    const ratio = dStr / Math.max(1, aStr);

    if (ratio > 1.5) return "full_assault";      // Much stronger — attack
    if (ratio > 0.8) return "defensive_hold";     // Even — hold
    if (ratio > 0.4) return "bombardment";        // Weaker — bombard at range
    return "retreat";                              // Much weaker — retreat
  }

  /**
   * Determine terrain type based on coordinates (simplified approximation).
   */
  static getTerrainForLocation(lat, lng) {
    // Arctic
    if (Math.abs(lat) > 60) return "arctic";
    // Desert belt
    if (lat > 15 && lat < 35 && (lng > -20 && lng < 70)) return "desert";
    // Mountain regions (rough approximation)
    if ((lat > 25 && lat < 40 && lng > 65 && lng < 105) || // Himalayas
        (lat > 35 && lat < 48 && lng > 5 && lng < 20)) return "mountain"; // Alps
    // Coastal (simplified — checks if close to known coast lat/long patterns)
    if (Math.abs(lat) < 5 || (lng < -60 && lat < 0) || (lng > 100 && lat < 0)) return "coastal";
    // Urban (major city proximity)
    // Forest (temperate zones)
    if (lat > 45 && lat < 65 && (lng > 20 && lng < 140)) return "forest";
    // Default
    return "plains";
  }
}
