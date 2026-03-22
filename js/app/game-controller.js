/* ============================================================
   WORLD CONQUEST - Game Controller
   Coordinates the engine, map, and UI layers
   ============================================================ */

class GameController {
  constructor(mapElementId = "map") {
    this.gameMap = new GameMap(mapElementId);
    this.engine = new GameEngine();
    this.ui = new GameUI();
    this.pendingMissileType = null;
    this.selectedTerritoryId = null;

    this._lastRefresh = 0;
    this._refreshInterval = APP_CONFIG.uiRefreshIntervalMs;
    this._keyboardShortcutsBound = false;
    this._dipOverlayOn = false;
    this._tradeRoutesOn = false;
  }

  async init() {
    this.ui.init();
    this._wireEngineEvents();
    this._wireMapEvents();
    this._wireUiEvents();
    this._wireSpeedControls();
    this._wireKeyboardShortcuts();

    this.ui.showLoading();
    this.gameMap.init();

    try {
      await this.gameMap.loadCountries();
    } catch (err) {
      console.error(err);
      alert("Failed to load map data. Please check your internet connection and reload.");
      return;
    }

    this.ui.hideLoading();
    this.ui.showStartScreen((selectedCode) => this.startGame(selectedCode));

    // Global error handler — show crash overlay instead of silent failure
    this._wireCrashRecovery();
  }

  startGame(playerCode) {
    this.engine.init(playerCode);
    this.gameMap.flyTo(playerCode);
    this.gameMap.renderCities(this.engine.ownership, this.engine.playerCode);
    this.gameMap.renderTerritoryMarkers(
      this.engine.ownership,
      this.engine.playerCode,
      this.engine.geo?.alliances
    );
    this.refreshAll();
    this.engine.startClock();

    setTimeout(() => this.ui.showTutorial(), APP_CONFIG.tutorialDelayMs);
  }

  _wireEngineEvents() {
    this.engine.onUpdate = () => {
      try {
        const now = performance.now();
        if (now - this._lastRefresh < this._refreshInterval) return;

        this._lastRefresh = now;
        this.refreshAll();
      } catch (err) {
        console.error("Error in onUpdate:", err);
        this._showCrashOverlay(err);
      }
    };

    this.engine.onBattle = (result) => {
      try {
        this.ui.showBattleResult(result);
        // Force full re-render of units after battle to reflect casualties
        this.gameMap.forceRenderUnits(this.engine.unitManager, this.engine.playerCode);
      } catch (err) {
        console.error("Error in onBattle:", err);
        this._showCrashOverlay(err);
      }
    };
    this.engine.onLog = (entry) => this.ui.addLogEntry(entry);
    this.engine.onVictory = (playerCode, victoryType) => {
      this.ui.showVictory(playerCode, victoryType);
    };
    this.engine.onMissileLaunch = (fromLat, fromLng, toLat, toLng, type) => {
      this.gameMap.animateMissile(fromLat, fromLng, toLat, toLng, type).then(() => {
        this.gameMap.forceRenderUnits(this.engine.unitManager, this.engine.playerCode);
      });
    };
  }

  _wireMapEvents() {
    this.gameMap.onCountryClick = (code) => {
      if (!this._isPlaying()) return;

      this._clearUnitSelection();
      this.selectedTerritoryId = this._resolveSelectedTerritory(code);

      if (MILITARY_DATA[code] || this.engine.forces[code]) {
        this._showCountryPanel(code);
      }
    };

    this.gameMap.onTerritoryClick = (territoryId, countryCode) => {
      if (!this._isPlaying()) return;

      this._clearUnitSelection();
      this.selectedTerritoryId = territoryId;
      this.gameMap.selectCountry(countryCode);

      // Always show territory-level info (with infrastructure/build for player, stats for enemy)
      this.ui.showTerritoryInfo(territoryId, countryCode, this.engine);
    };

    this.gameMap.onUnitClick = (unitId) => {
      if (!this._isPlaying()) return;

      const unit = this.engine.unitManager.units.get(unitId);
      if (!unit) return;

      this.gameMap.selectUnit(unitId);
      this.gameMap.renderUnits(this.engine.unitManager, this.engine.playerCode);
      this.ui.showUnitPanel(unit, this.engine.unitManager, this.engine);
    };

    this.gameMap.onMapRightClick = (latlng) => {
      if (!this._isPlaying()) return;

      const selectedId = this.gameMap.selectedUnitId;
      if (!selectedId) return;

      const unit = this.engine.unitManager.units.get(selectedId);
      if (!unit || unit.owner !== this.engine.playerCode) return;

      // Show the troop movement modal
      this._showTroopMoveModal(unit, selectedId, latlng);
    };

    this.gameMap.onMissileTargetClick = (latlng) => {
      if (!this.pendingMissileType) return;

      const type = this.pendingMissileType;
      this.pendingMissileType = null;
      this.engine.launchMissile(type, latlng.lat, latlng.lng);
      this._refreshSelectedUnitPanel();
    };
  }

  _wireUiEvents() {
    this.ui._onMissileLaunchRequest = (type) => {
      this.pendingMissileType = type;
      this.gameMap.enterMissileTargetMode();
    };

    this.ui._onMissileProduceRequest = (type) => {
      this.engine.queueMissileProduction(type);
      this._refreshSelectedUnitPanel();
      this._refreshCurrentCountryPanel();
    };

    this.ui._onUnitProduceRequest = (type) => {
      const playerTerritories = this.engine.getPlayerTerritories();
      if (playerTerritories.length === 0) return;

      const countryCode =
        this.engine.getTerritoryCountryCode(playerTerritories[0]) || playerTerritories[0];

      this.engine.queueProduction(countryCode, type);
      this._refreshSelectedUnitPanel();
    };

    this.ui._onUnitFortifyRequest = (unit) => {
      if (!unit || unit.owner !== this.engine.playerCode) return;

      const territoryId = this.engine.findTerritoryAt(unit.lat, unit.lng);
      if (!territoryId) return;

      this.engine.fortify(territoryId);
      this._refreshSelectedUnitPanel();
    };

    this.ui.els.btnAttack?.addEventListener("click", () => this._handleAttackRequest());
    this.ui.els.btnFortify?.addEventListener("click", () => this._handleFortifyRequest());
    this.ui.els.btnNuke?.addEventListener("click", () => this._handleNukeRequest());
    this.ui.els.btnBattleClose?.addEventListener("click", () => this.engine.resumeAfterBattle());
    this.ui.els.btnCouncil?.addEventListener("click", () => this._handleCouncilRequest());
    this.ui.els.btnPeace?.addEventListener("click", () => this._handlePeaceRequest());
    this.ui.els.btnPlayAgain?.addEventListener("click", () => window.location.reload());

    const diplomacyButtons = [
      { button: this.ui.els.btnImprove, action: "improve" },
      { button: this.ui.els.btnDenounce, action: "denounce" },
      { button: this.ui.els.btnTrade, action: "trade" },
      { button: this.ui.els.btnSanction, action: "sanction" },
      { button: this.ui.els.btnWar, action: "war" }
    ];

    diplomacyButtons.forEach(({ button, action }) => {
      button?.addEventListener("click", () => this._handleDiplomacyAction(action));
    });

    const espionageButtons = [
      { button: this.ui.els.btnSpySteal, operation: "steal_tech" },
      { button: this.ui.els.btnSpySabotage, operation: "sabotage" },
      { button: this.ui.els.btnSpyRebel, operation: "rebellion" }
    ];

    espionageButtons.forEach(({ button, operation }) => {
      button?.addEventListener("click", () => this._handleEspionageAction(operation));
    });
  }

  _wireSpeedControls() {
    const controls = document.getElementById("speed-controls");
    if (!controls) return;

    controls.querySelectorAll(".speed-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const speed = parseInt(btn.dataset.speed, 10);
        this.engine.setSpeed(speed);
        this._updateSpeedButtons();
      });
    });

    this.ui.els.btnSaveGame?.addEventListener("click", () => {
      this.engine.saveGame(0);
    });
  }

  _wireKeyboardShortcuts() {
    if (this._keyboardShortcutsBound) return;
    this._keyboardShortcutsBound = true;

    document.addEventListener("keydown", (event) => {
      if (!this._isPlaying()) return;
      if (this._isTypingTarget(event.target)) return;
      if (this._handleSpeedShortcut(event)) return;

      switch (event.key.toLowerCase()) {
        case "r":
          event.preventDefault();
          this.ui.showResearchModal(this.engine);
          return;
        case "t":
          event.preventDefault();
          this.ui.showTemplatesModal(this.engine, (template) => {
            this.engine._addLog("info", `📋 Applied template: ${template.name}`);
          });
          return;
        case "s":
          if (event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          this.engine.saveGame(0);
          return;
        case "l":
          event.preventDefault();
          this.engine.loadGame(0);
          this.refreshAll();
          return;
        case "d":
          event.preventDefault();
          this._toggleDiplomaticOverlay();
          return;
        case "m":
          event.preventDefault();
          this._toggleTradeRoutes();
          return;
      }
    });
  }

  _handleSpeedShortcut(event) {
    if (event.key === " ") {
      event.preventDefault();
      this.engine.clock.togglePause();
      this._updateSpeedButtons();
      return true;
    }

    if (/^[0-5]$/.test(event.key)) {
      event.preventDefault();
      this.engine.setSpeed(parseInt(event.key, 10));
      this._updateSpeedButtons();
      return true;
    }

    return false;
  }

  _handleAttackRequest() {
    try {
      const territoryId = this.selectedTerritoryId || this.ui.currentInfoCode;
      if (!territoryId || !this.engine.canAttack(territoryId)) return;

      const ownerCode = this.engine.ownership[territoryId] || territoryId;
      const targetName = MILITARY_DATA[ownerCode]?.name || ownerCode;
      const targetFlag = MILITARY_DATA[ownerCode]?.flag || "";

      this.ui.showCommandSelector(targetName, targetFlag, (commandKey) => {
        this.engine.attack(territoryId, commandKey);
        this._refreshCurrentCountryPanel();
      });
    } catch (e) {
      console.error(e);
      if (this.engine && this.engine._addLog) {
        this.engine._addLog("error", "Error opening attack modal: " + e.message);
      }
    }
  }

  _handleFortifyRequest() {
    const territoryId = this.selectedTerritoryId || this.ui.currentInfoCode;
    this.engine.fortify(territoryId);
    this._refreshCurrentCountryPanel();
  }

  _handleNukeRequest() {
    if (!this.ui.currentInfoCode) return;

    this.ui.showNukeModal(this.ui.currentInfoCode, () => {
      this.engine.launchNuke(this.ui.currentInfoCode);
      this._refreshCurrentCountryPanel();
    });
  }

  _handleDiplomacyAction(action) {
    if (!this.ui.currentInfoCode) return;

    this.engine.diplomacyAction(action, this.ui.currentInfoCode);
    this._refreshCurrentCountryPanel();
  }

  _handleEspionageAction(operation) {
    if (!this.ui.currentInfoCode) return;

    this.engine.performEspionage(this.ui.currentInfoCode, operation);
    this._refreshCurrentCountryPanel();
  }

  _handleCouncilRequest() {
    if (!this.ui.currentInfoCode) return;

    this.engine.proposeResolution("sanctions", this.ui.currentInfoCode);
    this._refreshCurrentCountryPanel();
  }

  _handlePeaceRequest() {
    if (!this.ui.currentInfoCode) return;
    this.ui.showPeaceTreatyModal(this.ui.currentInfoCode, this.engine);
  }

  _isTypingTarget(target) {
    if (!target) return false;
    return (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      Boolean(target.isContentEditable)
    );
  }

  _isPlaying() {
    return this.engine.phase === "playing";
  }

  _clearUnitSelection() {
    this.gameMap.deselectUnit();
    this.ui.selectedUnitId = null;
  }

  _resolveSelectedTerritory(countryCode) {
    const territories = TERRITORY_DATA[countryCode];
    if (!territories || territories.length === 0) {
      return countryCode;
    }

    const attackableTerritory = territories.find((territory) =>
      this.engine.canAttack(territory.id)
    );

    return attackableTerritory?.id || territories[0].id;
  }

  _showCountryPanel(code) {
    this.ui.showCountryInfo(
      code,
      this.engine.forces,
      this.engine.ownership,
      this.engine.playerCode,
      this.engine
    );
  }

  _updateSpeedButtons() {
    document.querySelectorAll(".speed-btn").forEach((btn) => {
      const speed = parseInt(btn.dataset.speed, 10);
      btn.classList.toggle("active", speed === this.engine.clock.speedIndex);
    });
  }

  _refreshCurrentCountryPanel() {
    if (!this.ui.currentInfoCode) return;
    this._showCountryPanel(this.ui.currentInfoCode);
  }

  _refreshSelectedUnitPanel() {
    const selectedId = this.gameMap.selectedUnitId;
    if (!selectedId) return;

    const unit = this.engine.unitManager.units.get(selectedId);
    if (!unit) return;

    this.ui.showUnitPanel(unit, this.engine.unitManager, this.engine);
  }

  refreshAll() {
    if (this.engine.phase !== "playing" && this.engine.phase !== "gameover") return;

    const territories = this.engine.getPlayerTerritories().length;
    const powerPercent = this.engine.getFactionPowerPercent(this.engine.playerCode);

    this.ui.updateHUD(territories, powerPercent, this.engine);
    this.gameMap.updateOwnership(
      this.engine.ownership,
      this.engine.playerCode,
      this.engine.alliances
    );
    this.gameMap.updateTerritoryMarkers(
      this.engine.ownership,
      this.engine.playerCode,
      this.engine.alliances
    );
    this.gameMap.renderUnits(this.engine.unitManager, this.engine.playerCode);
    this.gameMap.renderFortifications(
      this.engine.fortifications,
      this.engine.ownership,
      this.engine.playerCode
    );
    this.ui.updateProductionQueue(
      this.engine.productionQueue,
      this.engine.fortifyQueue,
      this.engine.facilityQueue,
      this.engine.clock
    );
    this._updateSpeedButtons();

    if (this.ui.els.btnFortify) {
      this.ui.els.btnFortify.disabled = this.engine.phase !== "playing";
    }
  }

  _toggleDiplomaticOverlay() {
    if (this._dipOverlayOn) {
      this.gameMap.clearDiplomaticOverlay(this.engine.ownership, this.engine.playerCode);
      this._dipOverlayOn = false;
      this.engine._addLog("info", "🗺️ Diplomatic overlay OFF");
      return;
    }

    const dipData = this.engine.getDiplomaticMapData();
    this.gameMap.setDiplomaticOverlay(dipData);
    this._dipOverlayOn = true;
    this.engine._addLog(
      "info",
      "🗺️ Diplomatic overlay ON - Green=Allied, Yellow=Neutral, Red=Enemy"
    );
  }

  _toggleTradeRoutes() {
    if (this._tradeRoutesOn) {
      this.gameMap.clearTradeRoutes();
      this._tradeRoutesOn = false;
      this.engine._addLog("info", "📦 Trade routes hidden");
      return;
    }

    const routes = this.engine.getTradeRoutes(this.engine.playerCode);
    this.gameMap.renderTradeRoutes(routes);
    this._tradeRoutesOn = true;
    this.engine._addLog("info", `📦 Trade routes visible (${routes.length} routes)`);
  }

  /* =========== Troop Movement Modal =========== */

  _showTroopMoveModal(unit, unitId, targetLatLng) {
    const modal = document.getElementById("troop-move-modal");
    const slider = document.getElementById("troop-move-slider");
    const preview = document.getElementById("troop-move-preview");
    const unitInfo = document.getElementById("troop-move-unit-info");
    const confirmBtn = document.getElementById("btn-troop-move-confirm");
    const cancelBtn = document.getElementById("btn-troop-move-cancel");
    if (!modal || !slider) return;

    // Build unit info string
    const comp = unit.composition;
    const parts = [];
    if (comp.troops) parts.push(`🪖 ${comp.troops.toLocaleString()} troops`);
    if (comp.tanks) parts.push(`🛡️ ${comp.tanks.toLocaleString()} tanks`);
    if (comp.aircraft) parts.push(`✈️ ${comp.aircraft.toLocaleString()} aircraft`);
    if (comp.artillery) parts.push(`💥 ${comp.artillery.toLocaleString()} artillery`);
    if (comp.naval) parts.push(`🚢 ${comp.naval.toLocaleString()} naval`);
    if (comp.helicopters) parts.push(`🚁 ${comp.helicopters.toLocaleString()} helicopters`);
    if (comp.fighters) parts.push(`🛩️ ${comp.fighters.toLocaleString()} fighters`);
    unitInfo.innerHTML = `<strong>${unit.locationName || "Unit"}</strong><br>${parts.join(" · ")}`;

    // Reset slider
    slider.value = 100;

    // Update preview function
    const updatePreview = () => {
      const pct = parseInt(slider.value, 10);
      const moveParts = [];
      for (const [type, count] of Object.entries(comp)) {
        const moveCount = Math.round(count * pct / 100);
        if (moveCount > 0) moveParts.push(`${moveCount.toLocaleString()} ${type}`);
      }
      preview.textContent = `Moving ${pct}%: ${moveParts.join(", ")}`;
    };
    updatePreview();

    // Use AbortController for clean event listener removal
    const ac = new AbortController();

    slider.addEventListener("input", updatePreview, { signal: ac.signal });

    const closeModal = () => {
      modal.classList.add("hidden");
      ac.abort();
    };

    confirmBtn.addEventListener("click", () => {
      const fraction = parseInt(slider.value, 10) / 100;
      closeModal();

      const moveResult = this.engine.splitAndMoveUnit(
        unitId, fraction, targetLatLng.lat, targetLatLng.lng
      );
      if (!moveResult) return;

      this.gameMap.animateUnitMove(
        moveResult.movedUnitId,
        moveResult.fromLat,
        moveResult.fromLng,
        moveResult.toLat,
        moveResult.toLng
      ).then(() => {
        this.gameMap.renderUnits(this.engine.unitManager, this.engine.playerCode);
        this._refreshSelectedUnitPanel();
      });
    }, { signal: ac.signal });

    cancelBtn.addEventListener("click", closeModal, { signal: ac.signal });

    // Click on backdrop (outside container) → cancel
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    }, { signal: ac.signal });

    // Show modal
    modal.classList.remove("hidden");
  }

  /* =========== Crash Recovery =========== */

  _wireCrashRecovery() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error("Global error caught:", message, source, lineno, error);
      this._showCrashOverlay(error || new Error(String(message)));
    };

    window.onunhandledrejection = (event) => {
      console.error("Unhandled rejection:", event.reason);
      this._showCrashOverlay(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };
  }

  _showCrashOverlay(error) {
    const overlay = document.getElementById("crash-overlay");
    const msgEl = document.getElementById("crash-message");
    const resumeBtn = document.getElementById("crash-resume");
    if (!overlay) return;

    const errMsg = error?.message || String(error);
    msgEl.textContent = `Error: ${errMsg.slice(0, 200)}`;
    overlay.style.display = "flex";

    // Pause the game clock during crash
    if (this.engine?.clock) {
      this._prevSpeedBeforeCrash = this.engine.clock.speedIndex;
      this.engine.clock.setSpeed(0);
    }

    // Wire resume button
    resumeBtn.onclick = () => {
      overlay.style.display = "none";
      // Restore previous speed
      if (this._prevSpeedBeforeCrash && this.engine?.clock) {
        this.engine.clock.setSpeed(this._prevSpeedBeforeCrash);
        this._prevSpeedBeforeCrash = null;
      }
    };
  }
}
