/* ============================================================
   WORLD CONQUEST — Game Engine (Real-Time)
   Continuous simulation with economy, diplomacy, and war
   Integrates UnitDesigner, EconomySystem, BattleResolver, GameClock
   ============================================================ */

class GameEngine {
  constructor() {
    /** @type {'setup'|'playing'|'gameover'} */
    this.phase = "setup";
    this.playerCode = null;

    // Map territoryId → faction owner code (e.g. "USA-CA" → "USA")
    this.ownership = {};
    // Map countryCode → current military data (mutable copy)
    this.forces = {};
    // Reverse lookup cache: countryCode → array of territory IDs currently owned
    this._factionTerritoryCache = {};
    // Alliances: Set of "CODE1-CODE2" strings (sorted)
    this.alliances = new Set();
    // Fortification levels per territory (0–3)
    this.fortifications = {};
    // SR2030 Territory Facilities { factory, mine, farm, oil, military }
    this.facilities = {};
    // Active fortification builds: { code, startDay, targetLevel }
    this.fortifyQueue = [];
    // Active facility builds: { territoryId, owner, type, startDay, durationDays }
    this.facilityQueue = [];
    // Production queues: { code, type, startDay, durationDays, category }
    this.productionQueue = [];

    // ─── SP2 Systems ───
    this.clock = new GameClock();
    this.geo = new Geopolitics();
    this.unitManager = new UnitManager();
    this.missileManager = new MissileManager();
    this.unitDesigner = new UnitDesigner();
    this.economySystem = new EconomySystem();
    this.battleResolver = new BattleResolver();
    this.researchTree = new ResearchTree();

    // Timing trackers
    this._lastMonthProcessed = -1;
    this._lastWeekProcessed = -1;
    this._lastDayProcessed = -1;

    // Event log entries
    this.log = [];
    this.victoryType = null;

    // Callbacks
    this.onUpdate = null;
    this.onBattle = null;
    this.onLog = null;
    this.onVictory = null;
    this.onMissileLaunch = null;
  }

  /**
   * Initialize a new game with the player's chosen country
   */
  init(playerCode) {
    this.playerCode = playerCode;
    this.phase = "playing";
    this.alliances.clear();
    this.log = [];
    this.ownership = {};
    this.forces = {};
    this.fortifications = {};
    this.facilities = {};
    this.fortifyQueue = [];
    this.facilityQueue = [];
    this.productionQueue = [];
    this.victoryType = null;
    this._factionTerritoryCache = {};

    // Deep-copy military data (country-level)
    for (const [code, data] of Object.entries(MILITARY_DATA)) {
      this.forces[code] = { ...data };
    }

    // Create territory-level ownership
    for (const [countryCode, territories] of Object.entries(TERRITORY_DATA)) {
      if (!this.forces[countryCode]) continue; // Skip countries not in MILITARY_DATA
      for (const territory of territories) {
        this.ownership[territory.id] = countryCode;
        this.fortifications[territory.id] = 0;
        this.facilities[territory.id] = { factory: 0, mine: 0, farm: 0, oil: 0, military: 0 };
      }
    }
    // For countries in MILITARY_DATA but not in TERRITORY_DATA, create a single virtual territory
    for (const code of Object.keys(MILITARY_DATA)) {
      if (!TERRITORY_DATA[code]) {
        this.ownership[code] = code;
        this.fortifications[code] = 0;
        this.facilities[code] = { factory: 0, mine: 0, farm: 0, oil: 0, military: 0 };
      }
    }
    this._rebuildFactionCache();

    // Init geopolitics (diplomacy, wars, basic economy bridge)
    this.geo.init(this.forces);

    // Init SP2 Economy System
    this.economySystem = new EconomySystem();
    this.economySystem.init(this.forces);

    // Init Unit Designer with tech levels
    this.unitDesigner = new UnitDesigner();
    this.unitDesigner.initTechLevels(this.forces);
    for (const code of Object.keys(this.forces)) {
      this.unitDesigner.createDefaultDesigns(code, this.forces);
    }

    // Init unit deployment
    this.unitManager = new UnitManager();
    this.unitManager.autoDeploy(this.forces, this.ownership);

    // Init missile arsenal
    this.missileManager = new MissileManager();
    this.missileManager.init(this.forces);

    // Battle resolver (stateless)
    this.battleResolver = new BattleResolver();

    // Init research tree (#13)
    this.researchTree = new ResearchTree();
    this.researchTree.init(Object.keys(this.forces));

    // Sync economy budgets with geopolitics
    this._syncEconomyToGeo();

    // Wire game clock events
    this.clock = new GameClock();
    this.clock.onTick = (deltaDays) => this._onTick(deltaDays);
    this.clock.onDayChange = (d, m, y) => this._onDayChange(d, m, y);
    this.clock.onWeekChange = (totalDays) => this._onWeekChange(totalDays);
    this.clock.onMonthChange = (m, y) => this._onMonthChange(m, y);

    const playerTerritoryCount = this.getPlayerTerritories().length;
    this._addLog("info", `You are now commanding ${MILITARY_DATA[playerCode].name} (${playerTerritoryCount} territories). Good luck, Commander.`);
    const eco = this.economySystem.getEconomy(playerCode);
    this._addLog("info", `GDP: $${eco?.gdp || 0}B | Budget: $${eco?.budget?.toFixed(1) || 0}B | Tech Level: ${this.unitDesigner.getMaxTechLevel(playerCode)}`);
    this._emit();
  }

  /**
   * Start the real-time clock
   */
  startClock() {
    this.clock.start();
  }

  /**
   * Set game speed (0=paused, 1–5)
   */
  setSpeed(index) {
    this.clock.setSpeed(index);
    this._emit();
  }

  /* =========== Real-Time Event Handlers =========== */

  /**
   * Called every animation frame with fractional game days elapsed.
   * Handles smooth unit movement and UI refresh.
   */
  _onTick(deltaDays) {
    if (this.phase !== "playing") return;

    try {
      // Move units smoothly
      if (this.unitManager && typeof this.unitManager.updateMovement === "function") {
        this.unitManager.updateMovement(deltaDays);
      }
    } catch (err) {
      console.error("[GameEngine] Error in _onTick movement:", err);
    }

    // Throttle UI updates (~10fps max)
    this._emit();
  }

  /**
   * Called when a new game day begins. Process daily events.
   */
  _onDayChange(day, month, year) {
    if (this.phase !== "playing") return;

    try {
      // Process production queue
      this._processProductionQueue();

      // Process fortification builds
      this._processFortificationQueue();

      // Process SR2030 facilities builds
      this._processFacilityQueue(this.clock.totalDays);

      // Enhancement #13: Process research tree
      const researchCompleted = this.researchTree.processTick(this.clock.totalDays);
      for (const rc of researchCompleted) {
        const factionName = MILITARY_DATA[rc.faction]?.name || rc.faction;
        if (rc.faction === this.playerCode) {
          this._addLog("info", `🔬 Research complete: ${rc.nodeName}! New capabilities unlocked.`);
        } else {
          this._addLog("info", `🔬 ${factionName} completed research: ${rc.nodeName}`);
        }
      }

      // Slight daily military recovery (0.05% per day ≈ 1.5% per month)
      if (this.clock.totalDays % 5 === 0) {
        for (const code of Object.keys(this.forces)) {
          const f = this.forces[code];
          f.activeMilitary = Math.round(f.activeMilitary * 1.001);
        }
      }
    } catch (err) {
      console.error("[GameEngine] Error in _onDayChange:", err);
    }
  }

  /**
   * Called every 7 game days. Run AI actions.
   */
  _onWeekChange(totalDays) {
    if (this.phase !== "playing") return;

    try {
      this._runAI();
      this._checkVictory();

      // Enhancement #13: AI auto-research
      for (const code of Object.keys(this.forces)) {
        if (code === this.playerCode) continue;
        this.researchTree.autoResearch(code, this.clock.totalDays);
      }
    } catch (err) {
      console.error("[GameEngine] Error in _onWeekChange:", err);
    }
  }

  /**
   * Called when a new game month begins. Process economy.
   */
  _onMonthChange(month, year) {
    if (this.phase !== "playing") return;

    try {
      // Process SP2 economy
      this.economySystem.processTurn(this.forces, this._getCountryOwnership(), this.geo, this.facilities);
      this._syncEconomyToGeo();

      // Tech advancement check
      for (const code of Object.keys(this.forces)) {
        const progress = this.economySystem.getResearchProgress(code);
        if (progress > 0.7 && Math.random() < progress * 0.15) {
          const advanced = this.unitDesigner.advanceTech(code);
          if (advanced && code === this.playerCode) {
            this._addLog("info", `🔬 TECH BREAKTHROUGH! Your tech level is now ${this.unitDesigner.getMaxTechLevel(code)}!`);
          }
        }
      }

      // Economy summary for player
      const summary = this.economySystem.getFactionSummary(this.playerCode, this._getCountryOwnership());
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      this._addLog("economy", `${months[month - 1]} ${year} | GDP: $${summary.gdp}B | Budget: $${summary.budget}B | Revenue: +$${summary.revenue}B`);

      // Enhancement #15: Record economic history
      this._recordEconomicSnapshot();

      // Enhancement #16: Fluctuate resource market
      this.fluctuateMarket();

      // Enhancement #20: Autosave every 3 months
      if (month % 3 === 0) this.autoSave();

      // Check for defeat
      if (this.getPlayerTerritories().length === 0) {
        this.phase = "gameover";
        this.clock.setSpeed(0);
        this._addLog("attack", "DEFEAT! You have lost all your territories.");
      }

      this._checkVictory();
    } catch (err) {
      console.error("[GameEngine] Error in _onMonthChange:", err);
    }
  }

  /* =========== Production Queue =========== */

  /**
   * Queue a production order. Takes game-days to complete.
   */
  queueProduction(code, productionType) {
    if (this.phase !== "playing") return null;
    // Check if player controls at least one territory of this country
    const progress = this.getCountryConquestProgress(code, this.playerCode);
    if (progress.owned === 0) return null;

    const info = getUnitProductionRule(productionType);
    if (!info) return null;

    const eco = this.economySystem.getEconomy(code);
    if (!eco || eco.budget < info.cost) {
      this._addLog("info", `Insufficient budget for ${info.label} ($${info.cost}B needed).`);
      this._emit();
      return null;
    }

    // Deduct cost
    eco.budget -= info.cost;
    if (this.geo.economy[code]) this.geo.economy[code].budget = eco.budget;

    this.productionQueue.push({
      code,
      type: productionType,
      startDay: this.clock.totalDays,
      durationDays: info.days,
      category: "military",
      label: info.label
    });

    this._addLog("defense", `🏭 Production started: ${info.label} in ${MILITARY_DATA[code]?.name || code} (${info.days} days)`);
    this._emit();
    return { success: true, days: info.days };
  }

  /**
   * Queue missile production.
   */
  queueMissileProduction(missileType) {
    if (this.phase !== "playing") return null;

    const typeData = MISSILE_TYPES[missileType];
    if (!typeData) return null;

    const eco = this.economySystem.getFactionSummary(this.playerCode, this._getCountryOwnership());
    if (eco.budget < typeData.cost) {
      this._addLog("info", `Insufficient budget for ${typeData.name} ($${typeData.cost}B needed).`);
      this._emit();
      return null;
    }

    // Find main territory to deduct budget from (resolve to country code for economy)
    const mainTerritory = this.getPlayerTerritories()[0];
    if (!mainTerritory) return null;
    const mainCountry = this.getTerritoryCountryCode(mainTerritory);

    const ecoData = this.economySystem.getEconomy(mainCountry);
    if (ecoData) {
      ecoData.budget -= typeData.cost;
      if (this.geo.economy[mainCountry]) this.geo.economy[mainCountry].budget = ecoData.budget;
    }

    this.productionQueue.push({
      code: mainTerritory,
      type: missileType,
      startDay: this.clock.totalDays,
      durationDays: typeData.buildDays || 21,
      category: "missile",
      label: typeData.name
    });

    this._addLog("defense", `🚀 Missile production started: ${typeData.name} (${typeData.buildDays || 21} days)`);
    this._emit();
    return { success: true };
  }

  /**
   * Process and complete production orders.
   */
  _processProductionQueue() {
    const completed = [];
    const remaining = [];

    for (const order of this.productionQueue) {
      if (this.clock.hasDaysPassed(order.startDay, order.durationDays)) {
        completed.push(order);
      } else {
        remaining.push(order);
      }
    }

    this.productionQueue = remaining;

    for (const order of completed) {
      if (order.category === "military") {
        const adds = getUnitProductionRule(order.type)?.rewards;
        const f = this.forces[order.code];
        if (adds && f) {
          for (const [key, amount] of Object.entries(adds)) {
            f[key] = (f[key] || 0) + amount;
          }
        }
        this._addLog("defense", `✅ Production complete: ${order.label} in ${MILITARY_DATA[order.code]?.name || order.code}`);
      } else if (order.category === "missile") {
        this.missileManager.addMissile(this.playerCode, order.type);
        this._addLog("defense", `✅ Missile ready: ${order.label}`);
      }
    }

    if (completed.length > 0) {
      this.unitManager.autoDeploy(this.forces, this.ownership);
    }
  }

  /* =========== Fortification System =========== */

  /**
   * Start fortifying a territory (takes 14 game-days per level).
   */
  fortify(territoryId) {
    if (this.phase !== "playing") return null;
    if (!territoryId) territoryId = this.getPlayerTerritories()[0];
    if (this.ownership[territoryId] !== this.playerCode) return null;

    const countryCode = this.getTerritoryCountryCode(territoryId);
    const territory = getTerritoryById(territoryId);
    const territoryName = territory?.name || MILITARY_DATA[countryCode]?.name || territoryId;

    const currentLevel = this.fortifications[territoryId] || 0;
    if (currentLevel >= 3) {
      this._addLog("info", `${territoryName} is already at maximum fortification (Level 3).`);
      this._emit();
      return null;
    }

    // Check if already building here
    if (this.fortifyQueue.some(q => q.code === territoryId)) {
      this._addLog("info", `Fortification already under construction in ${territoryName}.`);
      this._emit();
      return null;
    }

    const cost = 5 * (currentLevel + 1);
    const eco = this.economySystem.getEconomy(countryCode);
    if (!eco || eco.budget < cost) {
      this._addLog("info", `Insufficient budget to fortify ($${cost}B needed).`);
      this._emit();
      return null;
    }

    eco.budget -= cost;
    if (this.geo.economy[countryCode]) this.geo.economy[countryCode].budget = eco.budget;

    this.fortifyQueue.push({
      code: territoryId,
      startDay: this.clock.totalDays,
      targetLevel: currentLevel + 1,
      durationDays: 14
    });

    this._addLog("defense", `🏗️ Fortification construction started in ${territoryName} (Level ${currentLevel + 1}, 14 days)`);
    this._emit();
    return { success: true, targetLevel: currentLevel + 1 };
  }

  /**
   * Process fortification build queue.
   */
  _processFortificationQueue() {
    const completed = [];
    const remaining = [];

    for (const order of this.fortifyQueue) {
      if (this.clock.hasDaysPassed(order.startDay, order.durationDays)) {
        completed.push(order);
      } else {
        remaining.push(order);
      }
    }

    this.fortifyQueue = remaining;

    for (const order of completed) {
      this.fortifications[order.code] = order.targetLevel;
      const t = getTerritoryById(order.code);
      const tName = t?.name || MILITARY_DATA[this.getTerritoryCountryCode(order.code)]?.name || order.code;
      this._addLog("defense", `🏰 Fortification complete! ${tName} is now Level ${order.targetLevel}`);
    }
  }

  /* =========== SR2030 Facility Construction =========== */
  buildFacility(territoryId, type) {
    if (this.phase !== "playing") return false;
    const owner = this.ownership[territoryId];
    if (!owner || owner !== this.playerCode) return false;
    
    // Check if player has enough budget
    const eco = this.economySystem.getEconomy(owner);
    if (!eco) return false;

    // Define costs (in Billions)
    const costs = {
      factory: 15.0,  // Industrial Complex
      mine: 8.0,      // Mining Complex
      farm: 5.0,      // Agricultural Hub
      oil: 12.0,      // Oil Derrick
      military: 20.0  // Military Base
    };
    
    const cost = costs[type];
    if (!cost || eco.budget < cost) {
       this._addLog("economy", `Insufficient budget to build ${type} ($${cost}B needed).`);
       return false;
    }

    // Check if already building a facility in this territory
    if (this.facilityQueue.some(q => q.territoryId === territoryId)) {
      this._addLog("info", `A facility is already under construction in ${getTerritoryById(territoryId)?.name || territoryId}.`);
      return false;
    }
    
    eco.budget -= cost;
    if (this.geo.economy[owner]) this.geo.economy[owner].budget = eco.budget;
    
    this.facilityQueue.push({
      territoryId,
      owner,
      type,
      startDay: this.clock.totalDays,
      durationDays: 60 // 2 months to build
    });
    
    this._addLog("economy", `🏗️ ${MILITARY_DATA[owner]?.name || owner} began constructing a ${type} in ${getTerritoryById(territoryId)?.name || territoryId}.`);
    this._emit();
    return true;
  }

  _processFacilityQueue(currentDay) {
    const remaining = [];
    for (const task of this.facilityQueue) {
      if (currentDay - task.startDay >= task.durationDays) {
        // Complete
        if (!this.facilities[task.territoryId]) {
             this.facilities[task.territoryId] = { factory: 0, mine: 0, farm: 0, oil: 0, military: 0 };
        }
        
        // Only assign if they STILL own the territory
        if (this.ownership[task.territoryId] === task.owner) {
             this.facilities[task.territoryId][task.type] = (this.facilities[task.territoryId][task.type] || 0) + 1;
             this._addLog("economy", `🏗️ ${MILITARY_DATA[task.owner]?.name || task.owner} completed a ${task.type} in ${getTerritoryById(task.territoryId)?.name || task.territoryId}.`);
        } else {
             this._addLog("economy", `⚠️ Construction of ${task.type} in ${getTerritoryById(task.territoryId)?.name || task.territoryId} was abandoned due to occupation.`);
        }
      } else {
        remaining.push(task);
      }
    }
    if (this.facilityQueue.length !== remaining.length) {
       this.facilityQueue = remaining;
       this._emit();
    }
  }

  /**
   * Get fortification level for a territory.
   */
  getFortLevel(code) {
    return this.fortifications[code] || 0;
  }

  /* =========== Sync Economy =========== */

  _syncEconomyToGeo() {
    for (const [code, eco] of this.economySystem.economies) {
      if (this.geo.economy[code]) {
        this.geo.economy[code].gdp = eco.gdp;
        this.geo.economy[code].budget = eco.budget;
        this.geo.economy[code].revenue = eco.revenue;
        this.geo.economy[code].upkeep = eco.expenses;
        this.geo.economy[code].stability = eco.stability;
        this.geo.economy[code].population = eco.population;
        this.geo.economy[code].oilProduction = eco.oilProduction;
        this.geo.economy[code].foodSecurity = eco.foodSecurity;
      }
    }
  }

  /* =========== Territory & Power =========== */

  getPlayerTerritories() {
    return this._factionTerritoryCache[this.playerCode] || [];
  }

  getFactionsOwnerTerritories(factionCode) {
    return this._factionTerritoryCache[factionCode] || [];
  }

  /** Get the country code that a territory belongs to */
  getTerritoryCountryCode(territoryId) {
    return getTerritoryCountry(territoryId) || territoryId;
  }

  /** Find the closest owned territory to a lat/lng coordinate */
  findTerritoryAt(lat, lng) {
    let closestId = null;
    let closestDist = Infinity;
    for (const [countryCode, territories] of Object.entries(TERRITORY_DATA)) {
      for (const t of territories) {
        if (this.ownership[t.id] !== this.playerCode) continue;
        const dist = Math.sqrt((t.lat - lat) ** 2 + (t.lng - lng) ** 2);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = t.id;
        }
      }
    }
    // Fallback: try country-level ownership
    if (!closestId) {
      for (const [tid, owner] of Object.entries(this.ownership)) {
        if (owner === this.playerCode) return tid;
      }
    }
    return closestId;
  }

  /** Get conquest progress for a country: how many territories does factionCode own? */
  getCountryConquestProgress(countryCode, factionCode) {
    const territories = TERRITORY_DATA[countryCode];
    if (!territories) return { owned: this.ownership[countryCode] === factionCode ? 1 : 0, total: 1 };
    let owned = 0;
    for (const t of territories) {
      if (this.ownership[t.id] === factionCode) owned++;
    }
    return { owned, total: territories.length };
  }

  /** Check if ALL territories of a country are owned by factionCode */
  isCountryFullyConquered(countryCode, factionCode) {
    const prog = this.getCountryConquestProgress(countryCode, factionCode);
    return prog.owned === prog.total;
  }

  /** Get the territory's effective forces (country forces × pop fraction) */
  getTerritoryForces(territoryId) {
    const countryCode = this.getTerritoryCountryCode(territoryId);
    const countryForces = this.forces[countryCode];
    if (!countryForces) return null;
    const territory = getTerritoryById(territoryId);
    const pop = territory ? territory.pop : 1;
    const result = {};
    for (const [key, val] of Object.entries(countryForces)) {
      result[key] = typeof val === 'number' ? Math.round(val * pop) : val;
    }
    result.name = territory ? territory.name : countryForces.name;
    return result;
  }

  /** Rebuild the faction territory cache */
  _rebuildFactionCache() {
    this._factionTerritoryCache = {};
    this._countryOwnershipCache = null; // Invalidate country ownership cache
    for (const [tid, owner] of Object.entries(this.ownership)) {
      if (!this._factionTerritoryCache[owner]) this._factionTerritoryCache[owner] = [];
      this._factionTerritoryCache[owner].push(tid);
    }
  }

  getFactionPower(factionCode) {
    let total = 0;
    for (const [tid, owner] of Object.entries(this.ownership)) {
      if (owner === factionCode) {
        const tForces = this.getTerritoryForces(tid);
        if (tForces) total += calcStrength(tForces);
      }
    }
    return total;
  }

  getFactionPowerPercent(factionCode) {
    const factionPow = this.getFactionPower(factionCode);
    let totalPow = 0;
    for (const code of Object.keys(this.forces)) {
      totalPow += calcStrength(this.forces[code]);
    }
    return totalPow > 0 ? (factionPow / totalPow) * 100 : 0;
  }

  /* =========== Attack System =========== */

  /**
   * Check if the player can attack a territory.
   * Target can be a territory ID (e.g. "CAN-ON") or a country code.
   */
  canAttack(targetId) {
    if (this.phase !== "playing") return false;
    if (this.ownership[targetId] === this.playerCode) return false;
    if (this.ownership[targetId] === undefined) return false;

    const playerTerritories = this.getPlayerTerritories();
    for (const ownedTid of playerTerritories) {
      const neighbors = getTerritoryNeighbors(ownedTid);
      if (neighbors.includes(targetId)) return true;
    }
    // Fallback: country-level adjacency for territories without TERRITORY_DATA
    const targetCountry = this.getTerritoryCountryCode(targetId);
    for (const ownedTid of playerTerritories) {
      const ownedCountry = this.getTerritoryCountryCode(ownedTid);
      const countryNeighbors = NEIGHBORS[ownedCountry] || [];
      if (countryNeighbors.includes(targetCountry)) return true;
    }

    // Enhancement #3: Naval invasion fallback
    if (this.canNavalInvade(targetId)) return true;

    return false;
  }

  attack(targetTerritoryId, playerCommand = "full_assault") {
    if (!this.canAttack(targetTerritoryId)) return null;

    const attacker = this.playerCode;
    const defender = this.ownership[targetTerritoryId];
    const defenderCountry = this.getTerritoryCountryCode(targetTerritoryId);
    const territory = getTerritoryById(targetTerritoryId);
    const territoryName = territory?.name || this.forces[defenderCountry]?.name || targetTerritoryId;

    // Auto-declare war against the defending faction
    if (defender && !this.geo.isAtWar(attacker, defender)) {
      const warResult = this.geo.declareWar(attacker, defender, this._getCountryOwnership());
      this._addLog("war", warResult.message);
      // Enhancement #5: Alliance co-belligerence
      this.processAllianceCoBelligerence(attacker, defender);
    }

    // Pause during combat
    const prevSpeed = this.clock.speedIndex;
    this.clock.setSpeed(0);

    // Get unit groups
    const attackerUnits = this.unitManager.getUnitsForOwner(attacker);
    const defenderUnits = this.unitManager.getUnitsForOwner(defender);
    const targetCoords = territory ? { lat: territory.lat, lng: territory.lng } : (CAPITAL_COORDS[defenderCountry] || { lat: 0, lng: 0 });
    const attackerUnit = this._getClosestUnit(attackerUnits, targetCoords.lat, targetCoords.lng);
    const defenderUnit = this._getClosestUnit(defenderUnits, targetCoords.lat, targetCoords.lng);

    if (!attackerUnit || !defenderUnit) {
      return this._legacyAttack(targetTerritoryId, prevSpeed);
    }

    // Terrain and fortification bonus
    const terrainType = BattleResolver.getTerrainForLocation(targetCoords.lat, targetCoords.lng);
    const fortLevel = this.fortifications[targetTerritoryId] || 0;
    const defenderCommand = this.battleResolver.chooseAICommand(defenderUnit, attackerUnit);

    const result = this.battleResolver.resolve(
      attackerUnit, defenderUnit,
      playerCommand, defenderCommand,
      terrainType, this.unitDesigner,
      fortLevel, this.researchTree
    );

    const battleResult = {
      attacker, defender, target: targetTerritoryId,
      attackerName: MILITARY_DATA[attacker]?.name || attacker,
      defenderName: `${MILITARY_DATA[defender]?.name || defender} (${territoryName})`,
      attackerFlag: MILITARY_DATA[attacker]?.flag || "⚔️",
      defenderFlag: MILITARY_DATA[defender]?.flag || "🛡️",
      attackerWins: result.attackerWins,
      phases: result.phases,
      terrain: result.terrain,
      attackerCommand: result.attackerCommand,
      defenderCommand: result.defenderCommand,
      attackerMorale: result.attackerMorale,
      defenderMorale: result.defenderMorale,
      attackerRouted: result.attackerRouted,
      defenderRouted: result.defenderRouted,
      fortLevel,
      losses: {
        attackerPercent: result.attackerLossPct,
        defenderPercent: result.defenderLossPct
      }
    };

    if (result.attackerWins) {
      this.ownership[targetTerritoryId] = attacker;
      this._rebuildFactionCache();
      this.fortifications[targetTerritoryId] = Math.max(0, fortLevel - 1);
      const eco = this.economySystem.getEconomy(defenderCountry);
      if (eco) eco.stability = Math.max(10, eco.stability - 15);
      this._addLog("victory", `${battleResult.attackerName} conquered ${territoryName}!`);
      // Check if entire country was conquered
      if (this.isCountryFullyConquered(defenderCountry, attacker)) {
        this._addLog("victory", `🏴 ${MILITARY_DATA[attacker]?.name || attacker} has fully conquered ${MILITARY_DATA[defenderCountry]?.name || defenderCountry}!`);
      }
    } else {
      this._addLog("attack", `${battleResult.attackerName} failed to conquer ${territoryName}. Repelled!`);
      // Enhancement: Actual Unit Retreat Movement
      if (playerCommand === "withdraw" || result.attackerCommand?.autoRetreat) {
         const unit = this.unitManager.units.get(attackerUnit.id);
         if (unit) {
           // Move unit safely away from battle (approx ~100-200km)
           this.unitManager.moveUnit(unit.id, unit.lat + 1.5, unit.lng + 1.5);
           this._addLog("info", `🏳️ ${battleResult.attackerName} forces retreated and fell back from ${territoryName}.`);
         }
      }
    }

    this.unitManager.autoDeploy(this.forces, this.ownership);
    this._checkVictory();
    if (this.onBattle) this.onBattle(battleResult);
    this._emit();

    this._prevSpeedBeforeBattle = prevSpeed;
    return battleResult;
  }

  /** Restore speed after battle modal dismissed */
  resumeAfterBattle() {
    if (this._prevSpeedBeforeBattle) {
      this.clock.setSpeed(this._prevSpeedBeforeBattle);
      this._prevSpeedBeforeBattle = null;
    }
  }

  /* =========== Enhancement #3: Naval Invasion =========== */

  /**
   * Check if a naval invasion path exists between player and target.
   * Returns true if player has naval units and the territories are coastal.
   */
  canNavalInvade(targetId) {
    if (this.phase !== "playing") return false;
    if (this.ownership[targetId] === this.playerCode) return false;

    // Check if player has naval forces
    const playerForces = this._getAggregatedForces(this.playerCode);
    const navalPower = (playerForces?.naval || 0) + (playerForces?.submarines || 0) + (playerForces?.carriers || 0);
    if (navalPower <= 0) return false;

    // Check if target is on a coast (use terrain detection)
    const targetTerritory = getTerritoryById(targetId);
    if (!targetTerritory) {
      // Country-level: assume coastal if NEIGHBORS has sea crossings
      return true;
    }

    const terrain = BattleResolver.getTerrainForLocation(targetTerritory.lat, targetTerritory.lng);
    return terrain === "coastal" || this._isNearCoast(targetTerritory.lat, targetTerritory.lng);
  }

  _isNearCoast(lat, lng) {
    // Simple heuristic: territories near large bodies of water (ocean edges)
    if (Math.abs(lat) > 60) return true;  // Arctic/Antarctic coastal
    if (lng > 120 || lng < -120) return true;  // Pacific
    if (lng > -10 && lng < 5 && lat > 35 && lat < 48) return true;  // Mediterranean
    if (lng > -80 && lng < -60 && lat > 10 && lat < 30) return true; // Caribbean
    return false;
  }

  /* =========== Enhancement #2: Multi-Territory Campaigns =========== */

  /**
   * Plan a campaign route from a source territory to a target territory.
   * Returns an array of territory IDs forming the attack path.
   */
  planCampaign(startTerritoryId, endTerritoryId) {
    if (this.ownership[startTerritoryId] !== this.playerCode) return null;
    if (this.ownership[endTerritoryId] === this.playerCode) return null;

    // BFS to find shortest path through enemy territories
    const visited = new Set([startTerritoryId]);
    const queue = [[startTerritoryId]];

    while (queue.length > 0) {
      const path = queue.shift();
      const currentId = path[path.length - 1];

      const neighbors = getTerritoryNeighbors(currentId);
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);

        const newPath = [...path, neighbor];
        if (neighbor === endTerritoryId) {
          // Return only enemy territories (skip friendly ones)
          return newPath.filter(tid => this.ownership[tid] !== this.playerCode);
        }
        queue.push(newPath);
      }

      // Limit search depth to prevent performance issues
      if (visited.size > 200) break;
    }
    return null;
  }

  /**
   * Execute a campaign: attack each territory in sequence.
   * Stops on first defeat. Returns array of battle results.
   */
  executeCampaign(route, playerCommand = "full_assault") {
    if (!route || route.length === 0) return [];

    const results = [];
    for (const territoryId of route) {
      if (this.ownership[territoryId] === this.playerCode) continue; // Already taken
      if (!this.canAttack(territoryId) && !this.canNavalInvade(territoryId)) break;

      const result = this.attack(territoryId, playerCommand);
      if (result) results.push(result);

      // Stop campaign if attack failed
      if (!result || !result.attackerWins) break;
    }

    if (results.length > 0) {
      this._addLog("campaign", `📋 Campaign completed: ${results.length} battle(s), ${results.filter(r => r.attackerWins).length} victory(ies).`);
    }
    return results;
  }

  /* =========== Enhancement #5: Alliance Co-belligerence =========== */

  /**
   * When player declares war, check if any allies should join.
   * Allied AI will contribute forces and join the war.
   */
  processAllianceCoBelligerence(attackerCode, defenderCode) {
    const joinedAllies = [];

    // Check attacker's allies
    for (const allyKey of this.alliances) {
      const [a, b] = allyKey.split("-");
      const ally = (a === attackerCode) ? b : (b === attackerCode) ? a : null;
      if (!ally || ally === defenderCode) continue;

      // Ally joins if: strong enough and not already at war with attacker
      if (this.geo.isAtWar(ally, defenderCode)) continue; // Already fighting

      const allyPower = this.getFactionPower(ally);
      const defenderPower = this.getFactionPower(defenderCode);

      // 70% chance to join if ally has > 30% of defender's power
      if (allyPower > defenderPower * 0.3 && Math.random() < 0.7) {
        this.geo.declareWar(ally, defenderCode, this._getCountryOwnership());
        joinedAllies.push(ally);
        this._addLog("alliance", `🤝 ${MILITARY_DATA[ally]?.name || ally} joined the war against ${MILITARY_DATA[defenderCode]?.name || defenderCode} as an ally!`);
      }
    }

    // Check defender's allies (they join in defense)
    for (const allyKey of this.alliances) {
      const [a, b] = allyKey.split("-");
      const ally = (a === defenderCode) ? b : (b === defenderCode) ? a : null;
      if (!ally || ally === attackerCode) continue;

      if (this.geo.isAtWar(ally, attackerCode)) continue;

      const allyPower = this.getFactionPower(ally);
      // 50% chance to join defense
      if (allyPower > 0 && Math.random() < 0.5) {
        this.geo.declareWar(ally, attackerCode, this._getCountryOwnership());
        joinedAllies.push(ally);
        this._addLog("alliance", `🛡️ ${MILITARY_DATA[ally]?.name || ally} joined the defense of ${MILITARY_DATA[defenderCode]?.name || defenderCode}!`);
      }
    }

    return joinedAllies;
  }

  _getClosestUnit(units, lat, lng) {
    if (units.length === 0) return null;
    let closest = units[0];
    let minDist = Infinity;
    for (const u of units) {
      const d = Math.sqrt((u.lat - lat) ** 2 + (u.lng - lng) ** 2);
      if (d < minDist) { minDist = d; closest = u; }
    }
    return closest;
  }

  _legacyAttack(targetTerritoryId, prevSpeed) {
    const attacker = this.playerCode;
    const defender = this.ownership[targetTerritoryId];
    const defenderCountry = this.getTerritoryCountryCode(targetTerritoryId);
    const territory = getTerritoryById(targetTerritoryId);
    const territoryName = territory?.name || this.forces[defenderCountry]?.name || targetTerritoryId;
    const attackerData = this._getAggregatedForces(attacker);
    const defenderData = this.getTerritoryForces(targetTerritoryId) || this.forces[defenderCountry];

    const aStr = calcStrength(attackerData);
    const dStr = calcStrength(defenderData);
    const fortBonus = 1 + (this.fortifications[targetTerritoryId] || 0) * 0.15;

    const ratio = aStr / (aStr + dStr * fortBonus);
    const roll = 0.35 + Math.random() * 0.30;
    const attackerWins = ratio > roll;

    const loserLossFactor = 0.10 + Math.random() * 0.20;
    const winnerLossFactor = 0.05 + Math.random() * 0.10;

    const result = {
      attacker, defender, target: targetTerritoryId,
      attackerName: MILITARY_DATA[attacker]?.name || attacker,
      defenderName: `${MILITARY_DATA[defender]?.name || defender} (${territoryName})`,
      attackerFlag: MILITARY_DATA[attacker]?.flag || "⚔️",
      defenderFlag: MILITARY_DATA[defender]?.flag || "🛡️",
      attackerWins, phases: [],
      fortLevel: this.fortifications[targetTerritoryId] || 0,
      losses: { attackerPercent: 0, defenderPercent: 0 }
    };

    if (attackerWins) {
      this._applyLossesCountry(defenderCountry, loserLossFactor);
      this._applyLossesAggregated(attacker, winnerLossFactor);
      this.ownership[targetTerritoryId] = attacker;
      this._rebuildFactionCache();
      this.fortifications[targetTerritoryId] = 0;
      result.losses = { attackerPercent: Math.round(winnerLossFactor * 100), defenderPercent: Math.round(loserLossFactor * 100) };
      this._addLog("victory", `${result.attackerName} conquered ${territoryName}!`);
      if (this.isCountryFullyConquered(defenderCountry, attacker)) {
        this._addLog("victory", `🏴 ${MILITARY_DATA[attacker]?.name || attacker} has fully conquered ${MILITARY_DATA[defenderCountry]?.name || defenderCountry}!`);
      }
    } else {
      this._applyLossesAggregated(attacker, loserLossFactor);
      this._applyLossesCountry(defenderCountry, winnerLossFactor);
      result.losses = { attackerPercent: Math.round(loserLossFactor * 100), defenderPercent: Math.round(winnerLossFactor * 100) };
      this._addLog("attack", `${result.attackerName} failed to conquer ${territoryName}.`);
    }

    this._checkVictory();
    if (this.onBattle) this.onBattle(result);
    this._emit();
    this._prevSpeedBeforeBattle = prevSpeed;
    return result;
  }

  /* =========== Diplomacy =========== */

  diplomacyAction(action, targetCode) {
    if (this.phase !== "playing") return null;
    // Diplomacy operates at country level; resolve territory to country owner
    const targetOwner = this.ownership[targetCode] || getTerritoryCountry(targetCode) || targetCode;
    let result;

    switch (action) {
      case "improve":
        result = this.geo.improveRelations(this.playerCode, targetOwner);
        break;
      case "denounce":
        result = this.geo.denounce(this.playerCode, targetOwner, this.ownership);
        break;
      case "trade":
        result = this.geo.proposeTrade(this.playerCode, targetOwner);
        break;
      case "sanction":
        result = this.geo.imposeSanction(this.playerCode, targetOwner);
        break;
      case "war":
        result = this.geo.declareWar(this.playerCode, targetOwner, this.ownership);
        break;
      case "peace":
        result = this.geo.proposePeace(this.playerCode, targetOwner);
        break;
      default:
        return null;
    }

    if (result) this._addLog(result.type, result.message);
    this._emit();
    return result;
  }

  /* =========== Economy Controls (SP2) =========== */

  setTaxRate(code, taxType, rate) {
    if (this.phase !== "playing") return false;
    if (this.ownership[code] !== this.playerCode) return false;
    return this.economySystem.setTaxRate(code, taxType, rate);
  }

  setSpendingAllocation(code, spending) {
    if (this.phase !== "playing") return false;
    if (this.ownership[code] !== this.playerCode) return false;
    return this.economySystem.setSpendingAllocation(code, spending);
  }

  toggleSectorNationalization(code, sector) {
    if (this.phase !== "playing") return false;
    if (this.ownership[code] !== this.playerCode) return false;
    return this.economySystem.toggleSectorNationalization(code, sector);
  }

  /* =========== Nukes & Missiles =========== */

  launchNuke(targetCode) {
    if (this.phase !== "playing") return null;
    const result = this.geo.launchNuke(this.playerCode, targetCode, this.forces, this.ownership);
    if (result.success) {
      this._addLog("nuclear", `☢️ NUCLEAR STRIKE: ${result.message}`);
      if (result.retaliation) {
        this._addLog("nuclear", "☢️ RETALIATORY NUCLEAR STRIKE received!");
      }
      // Destroy fortifications
      this.fortifications[targetCode] = 0;
    } else {
      this._addLog("info", result.message);
    }
    this._checkVictory();
    this._emit();
    return result;
  }

  launchMissile(missileType, targetLat, targetLng) {
    if (this.phase !== "playing") return null;
    const typeData = MISSILE_TYPES[missileType];
    if (!typeData) return null;

    const playerUnits = this.unitManager.getUnitsForOwner(this.playerCode);
    if (playerUnits.length === 0) {
      this._addLog("info", "No units available to launch missile from!");
      this._emit();
      return null;
    }

    let launchUnit = null, launchDist = Infinity;
    for (const u of playerUnits) {
      if (this.missileManager.canReach(missileType, u.lat, u.lng, targetLat, targetLng)) {
        const d = Math.sqrt((u.lat - targetLat) ** 2 + (u.lng - targetLng) ** 2);
        if (d < launchDist) { launchDist = d; launchUnit = u; }
      }
    }

    if (!launchUnit) {
      this._addLog("info", `No units in range to launch ${typeData.name}!`);
      this._emit();
      return null;
    }

    const result = this.missileManager.launch(this.playerCode, missileType, targetLat, targetLng, this.unitManager);
    this._addLog(result.hit ? "war" : "info", `${typeData.icon} ${result.message}`);

    if (this.onMissileLaunch) {
      this.onMissileLaunch(launchUnit.lat, launchUnit.lng, targetLat, targetLng, missileType, result);
    }

    this._emit();
    return result;
  }

  /* =========== Unit Movement =========== */

  movePlayerUnit(unitId, targetLat, targetLng) {
    if (this.phase !== "playing") return false;
    const unit = this.unitManager.units.get(unitId);
    if (!unit || unit.owner !== this.playerCode) return false;

    const fromLat = unit.lat;
    const fromLng = unit.lng;

    // Immediately update the unit's position so that any renderUnits() call
    // (e.g. from a game tick during the animation) places the marker at the
    // destination rather than snapping it back to the origin.
    unit.lat = targetLat;
    unit.lng = targetLng;
    unit.status = "idle";
    unit.moveTarget = null;

    return { fromLat, fromLng, toLat: targetLat, toLng: targetLng };
  }

  /**
   * Split a fraction (0–1) of a unit and move the split portion to a target.
   * Returns { movedUnitId, fromLat, fromLng, toLat, toLng } or null.
   */
  splitAndMoveUnit(unitId, fraction, targetLat, targetLng) {
    if (this.phase !== "playing") return null;
    const unit = this.unitManager.units.get(unitId);
    if (!unit || unit.owner !== this.playerCode) return null;
    if (fraction <= 0 || fraction > 1) return null;

    const fromLat = unit.lat;
    const fromLng = unit.lng;

    // If moving 100%, just move the whole unit
    if (fraction >= 1) {
      unit.lat = targetLat;
      unit.lng = targetLng;
      unit.status = "idle";
      unit.moveTarget = null;
      return { movedUnitId: unitId, fromLat, fromLng, toLat: targetLat, toLng: targetLng };
    }

    // Build split composition
    const splitComp = {};
    for (const [type, count] of Object.entries(unit.composition)) {
      const splitCount = Math.round(count * fraction);
      if (splitCount > 0) splitComp[type] = splitCount;
    }

    if (Object.keys(splitComp).length === 0) return null;

    // Remove split portion from original unit
    for (const [type, count] of Object.entries(splitComp)) {
      unit.composition[type] = (unit.composition[type] || 0) - count;
      if (unit.composition[type] <= 0) delete unit.composition[type];
    }

    // Create new unit at destination
    const newUnit = this.unitManager.deployUnit(
      unit.owner,
      targetLat,
      targetLng,
      splitComp,
      unit.locationName + " (detachment)"
    );
    newUnit.status = "idle";

    // Remove original if it's now empty
    const remaining = Object.values(unit.composition).reduce((s, v) => s + v, 0);
    if (remaining <= 0) {
      this.unitManager.removeUnit(unitId);
    }

    return { movedUnitId: newUnit.id, fromLat, fromLng, toLat: targetLat, toLng: targetLng };
  }

  /* =========== Alliances =========== */

  toggleAlliance(targetCode) {
    if (this.phase !== "playing") return;
    if (this.ownership[targetCode] === this.playerCode) return;

    const key = this._allianceKey(this.playerCode, targetCode);
    if (this.alliances.has(key)) {
      this.alliances.delete(key);
      this.geo.modifyRelation(this.playerCode, targetCode, -10);
      this._addLog("alliance", `Alliance broken with ${MILITARY_DATA[targetCode]?.name || targetCode}.`);
    } else {
      this.alliances.add(key);
      this.geo.modifyRelation(this.playerCode, targetCode, 15);
      this._addLog("alliance", `Alliance formed with ${MILITARY_DATA[targetCode]?.name || targetCode}!`);
    }
    this._emit();
  }

  isAllied(codeA, codeB) {
    return this.alliances.has(this._allianceKey(codeA, codeB));
  }

  /* =========== Victory =========== */

  _checkVictory() {
    if (this.phase !== "playing") return;

    const powerPct = this.getFactionPowerPercent(this.playerCode);
    if (powerPct >= 50) {
      this.phase = "gameover";
      this.clock.setSpeed(0);
      this.victoryType = "military";
      this._addLog("victory", "🏆 MILITARY VICTORY! You control over 50% of the world's military power!");
      if (this.onVictory) this.onVictory(this.playerCode, "military");
      return;
    }

    const gdpPct = this.economySystem.getFactionGDPPercent(this.playerCode, this._getCountryOwnership());
    if (gdpPct >= 50) {
      this.phase = "gameover";
      this.clock.setSpeed(0);
      this.victoryType = "economic";
      this._addLog("victory", "🏆 ECONOMIC HEGEMONY! You control over 50% of the world's GDP!");
      if (this.onVictory) this.onVictory(this.playerCode, "economic");
      return;
    }
  }

  /* =========== AI Logic =========== */

  _runAI() {
    const aiFactions = new Set();
    for (const owner of Object.values(this.ownership)) {
      if (owner && owner !== this.playerCode) aiFactions.add(owner);
    }

    for (const aiCode of aiFactions) {
      if (this.isAllied(this.playerCode, aiCode) && Math.random() > 0.15) continue;

      // AI Diplomacy (country-level)
      const dipEvents = this.geo.runAIDiplomacy(aiCode, this.playerCode, this._getCountryOwnership(), this.forces);
      for (const evt of dipEvents) {
        this._addLog(evt.type, `[AI] ${MILITARY_DATA[aiCode]?.name || aiCode}: ${evt.message}`);
      }

      const aiTerritories = Object.keys(this.ownership).filter(t => this.ownership[t] === aiCode);
      if (aiTerritories.length === 0) continue;

      const roll = Math.random();
      if (roll < 0.50) {
        // Attack — find enemy territories adjacent to AI territories
        const targets = new Set();
        for (const t of aiTerritories) {
          const neighbors = getTerritoryNeighbors(t);
          for (const n of neighbors) {
            if (this.ownership[n] && this.ownership[n] !== aiCode && !this.isAllied(aiCode, this.ownership[n])) {
              const nOwner = this.ownership[n];
              if (this.geo.isAtWar(aiCode, nOwner) || this.geo.getRelation(aiCode, nOwner) < -20) {
                targets.add(n);
              }
            }
          }
        }

        if (targets.size === 0) {
          for (const t of aiTerritories) {
            const neighbors = getTerritoryNeighbors(t);
            for (const n of neighbors) {
              if (this.ownership[n] && this.ownership[n] !== aiCode && !this.isAllied(aiCode, this.ownership[n])) {
                targets.add(n);
              }
            }
          }
        }

        if (targets.size > 0) {
          const targetArr = [...targets];
          // Sort by weakness (attack weakest territory)
          targetArr.sort((a, b) => {
            const aF = this.getTerritoryForces(a);
            const bF = this.getTerritoryForces(b);
            return (aF ? calcStrength(aF) : 0) - (bF ? calcStrength(bF) : 0);
          });
          this._aiAttack(aiCode, targetArr[0]);
        }
      } else if (roll < 0.70) {
        // AI Fortify — pick a border territory
        const borderTerritories = aiTerritories.filter(t => {
          const neighbors = getTerritoryNeighbors(t);
          return neighbors.some(n => this.ownership[n] && this.ownership[n] !== aiCode);
        });
        const toFortify = borderTerritories[0] || aiTerritories[0];
        if ((this.fortifications[toFortify] || 0) < 2) {
          this.fortifications[toFortify] = (this.fortifications[toFortify] || 0) + 1;
        }
      } else {
        // Build — budget-gated force growth at country level
        const countriesBoosted = new Set();
        for (const tid of aiTerritories) {
          const cc = this.getTerritoryCountryCode(tid);
          if (!countriesBoosted.has(cc) && this.forces[cc]) {
            countriesBoosted.add(cc);
            const eco = this.economySystem.getEconomy(cc);
            // Only grow if economy has positive budget
            const budgetAvailable = eco ? eco.budget : 0;
            if (budgetAvailable <= 0) continue;

            const f = this.forces[cc];
            // Spend up to 10% of budget on military growth, capped at 1% force increase
            const spendAmount = Math.min(budgetAvailable * 0.10, f.defenseBudget * 0.02);
            const boost = Math.min(0.01, spendAmount / Math.max(1, f.defenseBudget));
            f.activeMilitary = Math.round(f.activeMilitary * (1 + boost));
            f.tanks = Math.round(f.tanks * (1 + boost));
            // Deduct from economy budget
            if (eco) eco.budget -= spendAmount;
          }
        }
      }
    }
  }

  _aiAttack(aiCode, targetTerritoryId) {
    const defender = this.ownership[targetTerritoryId];
    const defenderCountry = this.getTerritoryCountryCode(targetTerritoryId);
    const territory = getTerritoryById(targetTerritoryId);
    const territoryName = territory?.name || this.forces[defenderCountry]?.name || targetTerritoryId;

    if (defender && !this.geo.isAtWar(aiCode, defender)) {
      const warResult = this.geo.declareWar(aiCode, defender, this._getCountryOwnership());
      this._addLog("war", `[AI] ${MILITARY_DATA[aiCode]?.name || aiCode}: ${warResult.message}`);
    }

    const aStr = this._getAggregatedStrength(aiCode);
    const dForces = this.getTerritoryForces(targetTerritoryId) || this.forces[defenderCountry];
    const dStr = dForces ? calcStrength(dForces) : 0;
    const fortBonus = 1 + (this.fortifications[targetTerritoryId] || 0) * 0.15;

    const ratio = aStr / (aStr + dStr * fortBonus);
    const roll = 0.35 + Math.random() * 0.30;
    const wins = ratio > roll;

    const aiName = MILITARY_DATA[aiCode]?.name || aiCode;

    if (wins) {
      this._applyLossesCountry(defenderCountry, 0.15 + Math.random() * 0.15);
      this.ownership[targetTerritoryId] = aiCode;
      this._rebuildFactionCache();
      this.fortifications[targetTerritoryId] = 0;
      this._addLog("attack", `${aiName} conquered ${territoryName}!`);
      const eco = this.economySystem.getEconomy(defenderCountry);
      if (eco) eco.stability = Math.max(10, eco.stability - 10);
      if (this.isCountryFullyConquered(defenderCountry, aiCode)) {
        this._addLog("attack", `🏴 ${aiName} has fully conquered ${MILITARY_DATA[defenderCountry]?.name || defenderCountry}!`);
      }
    } else {
      this._addLog("defense", `${territoryName} repelled an attack from ${aiName}.`);
    }

    // Apply losses to AI too
    const aiCountries = new Set(Object.keys(this.ownership).filter(t => this.ownership[t] === aiCode).map(t => this.getTerritoryCountryCode(t)));
    for (const cc of aiCountries) {
      if (this.forces[cc]) {
        this._applyLossesCountry(cc, (0.03 + Math.random() * 0.05) / aiCountries.size);
        break;
      }
    }
  }

  /* =========== Helpers =========== */

  _getAggregatedForces(factionCode) {
    const agg = {
      activeMilitary: 0, reserveMilitary: 0, tanks: 0, artillery: 0,
      aircraft: 0, fighters: 0, helicopters: 0,
      navalVessels: 0, submarines: 0, aircraftCarriers: 0,
      nuclearWeapons: 0, defenseBudget: 0
    };
    // Collect unique country codes owned by this faction (avoid double-counting)
    const ownedCountries = new Set();
    for (const [tid, owner] of Object.entries(this.ownership)) {
      if (owner === factionCode) {
        const cc = this.getTerritoryCountryCode(tid);
        ownedCountries.add(cc);
      }
    }
    for (const cc of ownedCountries) {
      const f = this.forces[cc];
      if (!f) continue;
      agg.activeMilitary += f.activeMilitary || 0;
      agg.reserveMilitary += f.reserveMilitary || 0;
      agg.tanks += f.tanks || 0;
      agg.artillery += f.artillery || 0;
      agg.aircraft += f.aircraft || 0;
      agg.fighters += f.fighters || 0;
      agg.helicopters += f.helicopters || 0;
      agg.navalVessels += (f.navalVessels || 0);
      agg.submarines += f.submarines || 0;
      agg.aircraftCarriers += f.aircraftCarriers || 0;
      agg.nuclearWeapons += f.nuclearWeapons || 0;
      agg.defenseBudget += f.defenseBudget || 0;
    }
    return agg;
  }

  _getAggregatedStrength(factionCode) {
    return calcStrength(this._getAggregatedForces(factionCode));
  }

  /** Apply losses to a country's forces */
  _applyLossesCountry(countryCode, factor) {
    const f = this.forces[countryCode];
    if (!f) return;
    f.activeMilitary = Math.round(f.activeMilitary * (1 - factor));
    f.reserveMilitary = Math.round(f.reserveMilitary * (1 - factor));
    f.tanks = Math.round(f.tanks * (1 - factor));
    f.artillery = Math.round(f.artillery * (1 - factor));
    f.aircraft = Math.round(f.aircraft * (1 - factor));
    f.fighters = Math.round(f.fighters * (1 - factor));
    f.helicopters = Math.round(f.helicopters * (1 - factor));
    f.navalVessels = Math.round((f.navalVessels || 0) * (1 - factor));
    f.submarines = Math.round(f.submarines * (1 - factor));
    f.aircraftCarriers = Math.round(f.aircraftCarriers * (1 - factor));
  }

  _applyLossesAggregated(factionCode, factor) {
    const countries = new Set();
    for (const [tid, owner] of Object.entries(this.ownership)) {
      if (owner === factionCode) countries.add(this.getTerritoryCountryCode(tid));
    }
    for (const cc of countries) {
      this._applyLossesCountry(cc, factor * 0.5);
    }
  }

  /** Get a country-level ownership map for backward compatibility with geopolitics.
   *  Result is cached and invalidated when _rebuildFactionCache is called. */
  _getCountryOwnership() {
    if (this._countryOwnershipCache) return this._countryOwnershipCache;
    const countryOwnership = {};
    for (const code of Object.keys(MILITARY_DATA)) {
      const territories = TERRITORY_DATA[code];
      if (!territories) {
        countryOwnership[code] = this.ownership[code] || code;
        continue;
      }
      const ownerCounts = {};
      for (const t of territories) {
        const owner = this.ownership[t.id] || code;
        ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
      }
      let maxOwner = code, maxCount = 0;
      for (const [o, c] of Object.entries(ownerCounts)) {
        if (c > maxCount) { maxCount = c; maxOwner = o; }
      }
      countryOwnership[code] = maxOwner;
    }
    this._countryOwnershipCache = countryOwnership;
    return countryOwnership;
  }

  /* =========== Enhancement #4: Espionage System =========== */

  performEspionage(targetCode, operation) {
    if (this.phase !== "playing") return { success: false, message: "Game not active", operation, target: targetCode };
    const cost = { steal_tech: 50, sabotage: 80, rebellion: 120 };
    const operationCost = cost[operation];
    if (!operationCost) return { success: false, message: `Unknown operation: ${operation}`, operation, target: targetCode };

    const eco = this.economySystem.getEconomy(this.playerCode);
    if (!eco || eco.budget < operationCost) {
      this._addLog("espionage", `❌ Insufficient budget for ${operation} ($${operationCost}B needed).`);
      return { success: false, message: `Insufficient budget ($${operationCost}B needed)`, operation, target: targetCode };
    }
    eco.budget -= operationCost;

    const successChance = { steal_tech: 0.4, sabotage: 0.5, rebellion: 0.25 };
    const success = Math.random() < (successChance[operation] || 0.3);
    const targetName = MILITARY_DATA[targetCode]?.name || targetCode;

    if (!success) {
      this._addLog("espionage", `🕵️ ${operation} operation against ${targetName} FAILED! Agents exposed.`);
      // Diplomatic penalty
      this.geo.modifyRelation(this.playerCode, targetCode, -20);
      return { success: false, message: `${operation} FAILED — agents exposed`, operation, target: targetCode };
    }

    switch (operation) {
      case "steal_tech": {
        const advanced = this.unitDesigner.advanceTech(this.playerCode);
        this._addLog("espionage", `🕵️ Stole technology from ${targetName}! ${advanced ? "Tech level advanced!" : "Intel gathered."}`);
        break;
      }
      case "sabotage": {
        const targetForces = this.forces[targetCode];
        if (targetForces) {
          const reduction = Math.round(targetForces.activeMilitary * 0.05);
          targetForces.activeMilitary -= reduction;
          this._addLog("espionage", `🕵️ Sabotage in ${targetName}! ${reduction.toLocaleString()} troops affected.`);
        }
        break;
      }
      case "rebellion": {
        // Cause -30 stability in target
        const targetEco = this.economySystem.getEconomy(targetCode);
        if (targetEco) {
          targetEco.stability = Math.max(5, targetEco.stability - 30);
          this._addLog("espionage", `🕵️ Incited rebellion in ${targetName}! Stability plummeted.`);
        }
        break;
      }
    }
    return { success: true, message: `${operation} SUCCESS`, operation, target: targetCode };
  }

  /* =========== Enhancement #14: Trade Routes =========== */

  getTradeRoutes(code) {
    const eco = this.economySystem.getEconomy(code);
    if (!eco) return [];
    const routes = [];
    const partners = this.geo.getAlliances?.(code) || [];

    // Generate trade routes based on alliances and proximity
    for (const partner of partners) {
      const partnerEco = this.economySystem.getEconomy(partner);
      if (!partnerEco) continue;
      const tradeVolume = Math.min(eco.gdp, partnerEco.gdp) * 0.05;
      routes.push({
        from: code, to: partner,
        volume: Math.round(tradeVolume * 10) / 10,
        fromName: MILITARY_DATA[code]?.name || code,
        toName: MILITARY_DATA[partner]?.name || partner
      });
    }

    // Also trade with neighbors not at war
    const neighbors = NEIGHBORS[code] || [];
    for (const n of neighbors) {
      if (this.geo.isAtWar(code, n)) continue;
      if (routes.some(r => r.to === n)) continue;
      const nEco = this.economySystem.getEconomy(n);
      if (!nEco) continue;
      const tradeVolume = Math.min(eco.gdp, nEco.gdp) * 0.02;
      if (tradeVolume > 1) {
        routes.push({
          from: code, to: n,
          volume: Math.round(tradeVolume * 10) / 10,
          fromName: MILITARY_DATA[code]?.name || code,
          toName: MILITARY_DATA[n]?.name || n
        });
      }
    }
    return routes.slice(0, 10); // Limit to 10 routes
  }

  /* =========== Enhancement #15: Economic History =========== */

  getEconomicHistory(code) {
    if (!this._economicHistory) this._economicHistory = {};
    return this._economicHistory[code] || [];
  }

  _recordEconomicSnapshot() {
    if (!this._economicHistory) this._economicHistory = {};
    for (const code of Object.keys(this.forces)) {
      const eco = this.economySystem.getEconomy(code);
      if (!eco) continue;
      if (!this._economicHistory[code]) this._economicHistory[code] = [];
      this._economicHistory[code].push({
        day: this.clock.totalDays,
        gdp: eco.gdp,
        budget: eco.budget,
        stability: eco.stability,
        revenue: eco.revenue || 0
      });
      // Keep last 24 snapshots (2 years)
      if (this._economicHistory[code].length > 24) {
        this._economicHistory[code].shift();
      }
    }
  }

  /* =========== Enhancement #16: Resource Market =========== */

  getResourceMarket() {
    if (!this._resourceMarket) {
      this._resourceMarket = {
        oil:    { price: 80, trend: 0, supply: 100 },
        steel:  { price: 45, trend: 0, supply: 100 },
        tech:   { price: 120, trend: 0, supply: 80 },
        food:   { price: 25, trend: 0, supply: 120 },
        rare_earth: { price: 200, trend: 0, supply: 60 }
      };
    }
    return this._resourceMarket;
  }

  fluctuateMarket() {
    const market = this.getResourceMarket();
    for (const [key, resource] of Object.entries(market)) {
      const change = (Math.random() - 0.5) * 10;
      resource.trend = Math.round(change);
      resource.price = Math.max(5, Math.round(resource.price + change));
      resource.supply = Math.max(20, Math.min(200, resource.supply + Math.round((Math.random() - 0.5) * 15)));
    }
  }

  buyResource(resourceKey, amount) {
    const market = this.getResourceMarket();
    const res = market[resourceKey];
    if (!res) return false;
    const totalCost = res.price * amount * 0.01;
    const eco = this.economySystem.getEconomy(this.playerCode);
    if (!eco || eco.budget < totalCost) return false;
    eco.budget -= totalCost;
    this._addLog("economy", `💰 Purchased ${amount} units of ${resourceKey} for $${totalCost.toFixed(1)}B`);
    return true;
  }

  sellResource(resourceKey, amount) {
    const market = this.getResourceMarket();
    const res = market[resourceKey];
    if (!res) return false;
    const revenue = res.price * amount * 0.008; // Slight loss on sell
    const eco = this.economySystem.getEconomy(this.playerCode);
    if (!eco) return false;
    eco.budget += revenue;
    this._addLog("economy", `💰 Sold ${amount} units of ${resourceKey} for $${revenue.toFixed(1)}B`);
    return true;
  }

  /* =========== Enhancement #17: World Council / UN =========== */

  getWorldCouncilResolutions() {
    if (!this._councilResolutions) this._councilResolutions = [];
    return this._councilResolutions;
  }

  proposeResolution(type, targetCode) {
    const RESOLUTION_TYPES = {
      sanctions:   { name: "Economic Sanctions", icon: "🚫", effect: "sanctions" },
      ceasefire:   { name: "Global Ceasefire",    icon: "🕊️", effect: "ceasefire" },
      arms_embargo: { name: "Arms Embargo",       icon: "🔒", effect: "embargo" },
      aid_package:  { name: "Humanitarian Aid",    icon: "🏥", effect: "aid" }
    };

    const resType = RESOLUTION_TYPES[type];
    if (!resType) return null;

    // Count votes
    let votesFor = 0, votesAgainst = 0;
    const factions = Object.keys(this.forces);
    for (const code of factions) {
      if (code === targetCode) { votesAgainst++; continue; }
      // Allies of target vote against, enemies vote for
      if (this.geo.isAtWar(code, targetCode)) votesFor++;
      else if (this.alliances.has(this._allianceKey(code, targetCode))) votesAgainst++;
      else votesFor += Math.random() > 0.5 ? 1 : 0; // Neutral: 50/50
    }

    const passed = votesFor > votesAgainst;
    const resolution = {
      type, targetCode,
      name: resType.name,
      icon: resType.icon,
      proposedBy: this.playerCode,
      votesFor, votesAgainst,
      passed,
      day: this.clock.totalDays,
      date: this.clock.dateString
    };

    if (!this._councilResolutions) this._councilResolutions = [];
    this._councilResolutions.push(resolution);

    const targetName = MILITARY_DATA[targetCode]?.name || targetCode;
    if (passed) {
      this._addLog("diplomacy", `🏛️ UN Resolution PASSED: ${resType.name} against ${targetName} (${votesFor}-${votesAgainst})`);
    } else {
      this._addLog("diplomacy", `🏛️ UN Resolution FAILED: ${resType.name} against ${targetName} (${votesFor}-${votesAgainst})`);
    }

    return resolution;
  }

  /* =========== Enhancement #18: Diplomatic Map Overlay =========== */

  getDiplomaticMapData() {
    const data = {};
    for (const code of Object.keys(this.forces)) {
      let status = "neutral";
      if (code === this.playerCode) status = "player";
      else if (this.alliances.has(this._allianceKey(this.playerCode, code))) status = "allied";
      else if (this.geo.isAtWar(this.playerCode, code)) status = "enemy";
      data[code] = {
        code,
        name: MILITARY_DATA[code]?.name || code,
        flag: MILITARY_DATA[code]?.flag || "",
        status,
        territories: this.getPlayerTerritories(code)?.length || 0,
        power: this.getFactionPower(code)
      };
    }
    return data;
  }

  /* =========== Enhancement #19: Peace Treaty Terms =========== */

  proposePeaceTreaty(targetCode, terms) {
    if (!this.geo.isAtWar(this.playerCode, targetCode)) {
      this._addLog("diplomacy", `❌ Cannot propose peace — not at war with ${MILITARY_DATA[targetCode]?.name || targetCode}.`);
      return { accepted: false, message: "Not at war", terms: {}, target: targetCode };
    }

    const defaults = { territory: [], reparations: 0, dmz: false };
    const finalTerms = { ...defaults, ...terms };
    const targetName = MILITARY_DATA[targetCode]?.name || targetCode;

    // AI acceptance based on power balance
    const playerPower = this.getFactionPower(this.playerCode);
    const targetPower = this.getFactionPower(targetCode);
    const powerRatio = playerPower / (playerPower + targetPower);

    // More favorable terms = lower acceptance
    const termPenalty = finalTerms.reparations * 0.01 + finalTerms.territory.length * 0.1;
    const acceptChance = Math.max(0.1, powerRatio - termPenalty + (finalTerms.dmz ? 0.1 : 0));

    const accepted = Math.random() < acceptChance;

    if (accepted) {
      this.geo.proposePeace(this.playerCode, targetCode);

      // Transfer territories
      for (const tid of finalTerms.territory) {
        if (this.ownership[tid]) {
          this.ownership[tid] = this.playerCode;
        }
      }
      this._rebuildFactionCache();

      // Reparations
      if (finalTerms.reparations > 0) {
        const targetEco = this.economySystem.getEconomy(targetCode);
        const playerEco = this.economySystem.getEconomy(this.playerCode);
        if (targetEco && playerEco) {
          const amt = Math.min(finalTerms.reparations, targetEco.budget);
          targetEco.budget -= amt;
          playerEco.budget += amt;
        }
      }

      this._addLog("peace", `🕊️ Peace treaty with ${targetName} ACCEPTED! ${finalTerms.territory.length > 0 ? `${finalTerms.territory.length} territories ceded.` : ""} ${finalTerms.reparations > 0 ? `$${finalTerms.reparations}B reparations.` : ""}`);
    } else {
      this._addLog("peace", `❌ ${targetName} REJECTED peace terms. The war continues.`);
    }

    return { accepted, message: accepted ? "Treaty accepted" : "Treaty rejected", terms: finalTerms, target: targetCode };
  }

  _allianceKey(a, b) { return [a, b].sort().join("-"); }

  _addLog(type, message) {
    const entry = { turn: this.clock.totalDays, type, message, time: Date.now(), date: this.clock.dateString };
    this.log.unshift(entry);
    if (this.log.length > 100) this.log.length = 100;
    if (this.onLog) this.onLog(entry);
  }

  _emit() {
    if (this.onUpdate) this.onUpdate();
  }

  /* =========== Enhancement #20: Save / Load Game =========== */

  saveGame(slotIndex = 0) {
    try {
      const saveData = {
        version: 2,
        timestamp: Date.now(),
        dateString: this.clock.dateString,
        playerCode: this.playerCode,
        totalDays: this.clock.totalDays,
        speed: this.clock.speed,
        ownership: this.ownership,
        forces: JSON.parse(JSON.stringify(this.forces)),
        fortifications: this.fortifications,
        alliances: Array.from(this.alliances),
        log: this.log.slice(0, 50),
        productionQueue: this.productionQueue,
        fortifyQueue: this.fortifyQueue,
        economicHistory: this._economicHistory || {},
        resourceMarket: this._resourceMarket || null,
        councilResolutions: this._councilResolutions || [],
        researchActive: this.researchTree.activeResearch || {},
        researchFactions: {}
      };

      // Serialize research tree (Sets → Arrays)
      for (const [faction, branches] of Object.entries(this.researchTree.factionResearch)) {
        saveData.researchFactions[faction] = {};
        for (const [branch, state] of Object.entries(branches)) {
          saveData.researchFactions[faction][branch] = {
            level: state.level,
            nodes: Array.from(state.nodes)
          };
        }
      }

      const key = `world_conquest_save_${slotIndex}`;
      localStorage.setItem(key, JSON.stringify(saveData));

      this._addLog("info", `💾 Game saved to slot ${slotIndex + 1} (${this.clock.dateString})`);
      return true;
    } catch (err) {
      console.error("[GameEngine] Save failed:", err);
      this._addLog("info", `❌ Save failed: ${err.message}`);
      return false;
    }
  }

  loadGame(slotIndex = 0) {
    try {
      const key = `world_conquest_save_${slotIndex}`;
      const raw = localStorage.getItem(key);
      if (!raw) {
        this._addLog("info", `❌ No save data in slot ${slotIndex + 1}.`);
        return false;
      }

      const data = JSON.parse(raw);
      if (!data || data.version < 2) {
        this._addLog("info", `❌ Incompatible save version.`);
        return false;
      }

      // Restore state
      this.playerCode = data.playerCode;
      this.phase = "playing";
      this.ownership = data.ownership;
      this.forces = data.forces;
      this.fortifications = data.fortifications;
      this.alliances = new Set(data.alliances || []);
      this.log = data.log || [];
      this.productionQueue = data.productionQueue || [];
      this.fortifyQueue = data.fortifyQueue || [];
      this._economicHistory = data.economicHistory || {};
      this._resourceMarket = data.resourceMarket || null;
      this._councilResolutions = data.councilResolutions || [];

      // Rebuild caches
      this._rebuildFactionCache();

      // Restore research tree
      if (data.researchFactions) {
        for (const [faction, branches] of Object.entries(data.researchFactions)) {
          if (!this.researchTree.factionResearch[faction]) continue;
          for (const [branch, state] of Object.entries(branches)) {
            if (!this.researchTree.factionResearch[faction][branch]) continue;
            this.researchTree.factionResearch[faction][branch].level = state.level;
            this.researchTree.factionResearch[faction][branch].nodes = new Set(state.nodes);
          }
        }
      }
      this.researchTree.activeResearch = data.researchActive || {};

      // Restore clock
      this.clock.totalDays = data.totalDays || 0;
      this.clock.setSpeed(data.speed || 1);

      this._addLog("info", `💾 Game loaded from slot ${slotIndex + 1} (${data.dateString})`);
      return true;
    } catch (err) {
      console.error("[GameEngine] Load failed:", err);
      this._addLog("info", `❌ Load failed: ${err.message}`);
      return false;
    }
  }

  getSaveSlots() {
    const slots = [];
    for (let i = 0; i < 4; i++) { // 0-2 = manual, 3 = autosave
      const key = `world_conquest_save_${i}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          slots.push({
            index: i,
            label: i === 3 ? "Autosave" : `Slot ${i + 1}`,
            playerCode: data.playerCode,
            dateString: data.dateString,
            timestamp: data.timestamp,
            hasData: true
          });
        } catch {
          slots.push({ index: i, label: i === 3 ? "Autosave" : `Slot ${i + 1}`, hasData: false });
        }
      } else {
        slots.push({ index: i, label: i === 3 ? "Autosave" : `Slot ${i + 1}`, hasData: false });
      }
    }
    return slots;
  }

  autoSave() {
    this.saveGame(3); // Slot index 3 = autosave
  }
}
