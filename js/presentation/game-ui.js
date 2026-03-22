/* ============================================================
   WORLD CONQUEST — UI Controller (SuperPower 2-Style)
   Panels, modals, tabs, and all DOM interactions
   ============================================================ */

class GameUI {
  constructor() {
    this.els = {};
    this.currentInfoCode = null;
    this.currentTab = "military";
    this.selectedUnitId = null;
  }

  init() {
    this.els = {
      startScreen:    document.getElementById("start-screen"),
      startSearch:    document.getElementById("start-search"),
      countryList:    document.getElementById("country-list"),
      btnStart:       document.getElementById("btn-start"),

      hudDate:        document.getElementById("hud-date"),
      hudTerritories: document.getElementById("hud-territories"),
      hudPower:       document.getElementById("hud-power"),
      hudGdp:         document.getElementById("hud-gdp"),
      hudBudget:      document.getElementById("hud-budget"),
      powerBarFill:   document.getElementById("power-bar-fill"),

      sidePanel:      document.getElementById("side-panel"),
      panelClose:     document.getElementById("panel-close"),
      panelBody:      document.getElementById("panel-body"),
      panelTabs:      document.getElementById("panel-tabs"),

      militaryActions: document.getElementById("military-actions"),
      diplomacyActions:document.getElementById("diplomacy-actions"),

      btnAttack:      document.getElementById("btn-attack"),
      btnFortify:     document.getElementById("btn-fortify"),
      btnNuke:        document.getElementById("btn-nuke"),

      btnImprove:     document.getElementById("btn-improve"),
      btnDenounce:    document.getElementById("btn-denounce"),
      btnTrade:       document.getElementById("btn-trade"),
      btnSanction:    document.getElementById("btn-sanction"),
      btnWar:         document.getElementById("btn-war"),
      btnPeace:       document.getElementById("btn-peace"),
      btnSpySteal:    document.getElementById("btn-spy-steal"),
      btnSpySabotage: document.getElementById("btn-spy-sabotage"),
      btnSpyRebel:    document.getElementById("btn-spy-rebel"),
      btnCouncil:     document.getElementById("btn-council"),

      battleModal:    document.getElementById("battle-modal"),
      battleContent:  document.getElementById("battle-content"),
      btnBattleClose: document.getElementById("btn-battle-close"),

      nukeModal:      document.getElementById("nuke-modal"),
      nukeTargetName: document.getElementById("nuke-target-name"),
      btnNukeConfirm: document.getElementById("btn-nuke-confirm"),
      btnNukeCancel:  document.getElementById("btn-nuke-cancel"),

      logBody:        document.getElementById("log-body"),

      victoryScreen:  document.getElementById("victory-screen"),
      victoryTitle:   document.getElementById("victory-title"),
      victorySubtitle:document.getElementById("victory-subtitle"),
      btnPlayAgain:   document.getElementById("btn-play-again"),

      loadingOverlay: document.getElementById("loading-overlay"),

      // Enhancement #8: Tutorial
      tutorialOverlay:  document.getElementById("tutorial-overlay"),
      tutorialCard:     document.getElementById("tutorial-card"),
      tutorialContent:  document.getElementById("tutorial-content"),
      tutorialSteps:    document.getElementById("tutorial-steps"),
      btnTutorialSkip:  document.getElementById("btn-tutorial-skip"),
      btnTutorialNext:  document.getElementById("btn-tutorial-next"),

      // Enhancement #9: Production Queue Widget
      productionQueue:  document.getElementById("production-queue"),
      pqBody:           document.getElementById("pq-body"),
      pqToggle:         document.getElementById("pq-toggle"),

      // Enhancement #1: Command Selector Modal
      commandModal:     document.getElementById("command-select-modal"),
      commandGrid:      document.getElementById("command-grid"),
      commandTargetInfo:document.getElementById("command-target-info"),
      btnCommandCancel: document.getElementById("btn-command-cancel"),

      // Enhancement #13: Research Tree
      researchModal:    document.getElementById("research-modal"),
      researchBranches: document.getElementById("research-branches"),
      researchActive:   document.getElementById("research-active"),
      btnResearchClose: document.getElementById("btn-research-close"),

      // Enhancement #12: Unit Templates
      templatesModal:   document.getElementById("templates-modal"),
      templatesGrid:    document.getElementById("templates-grid"),
      btnTemplatesClose:document.getElementById("btn-templates-close"),

      // Enhancement #19: Peace Treaty
      peaceTreatyModal: document.getElementById("peace-treaty-modal"),
      treatyTargetName: document.getElementById("treaty-target-name"),
      treatyTerritory:  document.getElementById("treaty-territory"),
      treatyReparations:document.getElementById("treaty-reparations"),
      treatyRepValue:   document.getElementById("treaty-rep-value"),
      treatyDmz:        document.getElementById("treaty-dmz"),
      btnTreatyNegotiate:document.getElementById("btn-treaty-negotiate"),
      btnTreatyCancel:  document.getElementById("btn-treaty-cancel"),
      btnTreatyClose:   document.getElementById("btn-treaty-close"),

      // HUD controls
      btnMapOverlay:    document.getElementById("btn-map-overlay"),
      btnSaveGame:      document.getElementById("btn-save-game")
    };

    this._pqCollapsed = false;
    this._tutorialStep = 0;
    this._bindEvents();
  }

  _bindEvents() {
    this.els.panelClose?.addEventListener("click", () => this.closePanel());
    this.els.btnBattleClose?.addEventListener("click", () => this.closeBattleModal());
    this.els.btnNukeCancel?.addEventListener("click", () => this.closeNukeModal());
    this.els.btnResearchClose?.addEventListener("click", () => this.closeResearchModal());
    this.els.btnTemplatesClose?.addEventListener("click", () => this.closeTemplatesModal());
    this.els.btnTreatyClose?.addEventListener("click", () => this.closePeaceTreatyModal());
    this.els.btnTreatyCancel?.addEventListener("click", () => this.closePeaceTreatyModal());

    this.els.panelTabs?.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => this._switchTab(btn.dataset.tab));
    });

    // Enhancement #8: Tutorial
    this.els.btnTutorialSkip?.addEventListener("click", () => this.closeTutorial());
    this.els.btnTutorialNext?.addEventListener("click", () => this._advanceTutorial());

    // Enhancement #9: Production Queue toggle
    this.els.pqToggle?.addEventListener("click", () => {
      this._pqCollapsed = !this._pqCollapsed;
      this.els.pqBody?.classList.toggle("collapsed", this._pqCollapsed);
      if (this.els.pqToggle) this.els.pqToggle.textContent = this._pqCollapsed ? "▶" : "▼";
    });

    // Enhancement #1: Command cancel
    this.els.btnCommandCancel?.addEventListener("click", () => this.closeCommandSelector());
  }

  _switchTab(tab) {
    this.currentTab = tab;
    this.els.panelTabs?.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = this.els.panelTabs?.querySelector(`[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    if (this.els.militaryActions && this.els.diplomacyActions) {
      if (tab === "diplomacy") {
        this.els.militaryActions.classList.add("hidden");
        this.els.diplomacyActions.classList.remove("hidden");
      } else {
        this.els.militaryActions.classList.remove("hidden");
        this.els.diplomacyActions.classList.add("hidden");
      }
    }

    if (this.currentInfoCode && this._lastRenderArgs) {
      const { code, forces, ownership, playerCode, engine } = this._lastRenderArgs;
      this._renderTabContent(code, forces, ownership, playerCode, engine);
    }
  }

  /* =========== Loading =========== */

  showLoading() {
    if (this.els.loadingOverlay) this.els.loadingOverlay.style.display = "flex";
  }

  hideLoading() {
    if (this.els.loadingOverlay) {
      this.els.loadingOverlay.style.opacity = "0";
      this.els.loadingOverlay.style.transition = "opacity 500ms ease";
      setTimeout(() => {
        this.els.loadingOverlay.style.display = "none";
        this.els.loadingOverlay.style.opacity = "1";
      }, 500);
    }
  }

  /* =========== Start Screen =========== */

  showStartScreen(onSelect) {
    if (!this.els.startScreen) return;
    this.els.startScreen.style.display = "flex";

    let selectedCode = null;
    const countries = Object.entries(MILITARY_DATA)
      .sort((a, b) => a[1].powerIndex - b[1].powerIndex);
    // Pre-compute rank index to avoid O(n^2) findIndex calls
    const rankMap = new Map(countries.map(([code], i) => [code, i + 1]));

    const renderList = (filter = "") => {
      if (!this.els.countryList) return;
      this.els.countryList.innerHTML = "";

      const filtered = filter
        ? countries.filter(([, d]) => d.name.toLowerCase().includes(filter.toLowerCase()))
        : countries;

      for (const [code, data] of filtered) {
        const el = document.createElement("div");
        el.className = "country-option";
        el.dataset.code = code;
        el.innerHTML = `
          <span class="co-flag">${data.flag}</span>
          <div class="co-info">
            <div class="co-name">${data.name}</div>
            <div class="co-stats">${formatNumber(data.activeMilitary)} troops · $${data.gdp || 0}B GDP · ${data.nuclearWeapons > 0 ? "☢️" : ""}</div>
          </div>
          <span class="co-power">#${rankMap.get(code) || "?"}</span>
        `;

        el.addEventListener("click", () => {
          this.els.countryList.querySelectorAll(".country-option.selected").forEach(e => e.classList.remove("selected"));
          el.classList.add("selected");
          selectedCode = code;
          if (this.els.btnStart) this.els.btnStart.disabled = false;
        });

        this.els.countryList.appendChild(el);
      }
    };

    renderList();

    this.els.startSearch?.addEventListener("input", (e) => {
      renderList(e.target.value);
    });

    if (this.els.btnStart) {
      this.els.btnStart.disabled = true;
      this.els.btnStart.onclick = () => {
        if (selectedCode) {
          this.els.startScreen.style.display = "none";
          onSelect(selectedCode);
        }
      };
    }
  }

  /* =========== HUD (Real-Time) =========== */

  updateHUD(territories, powerPercent, engine) {
    // Dirty-check to avoid unnecessary DOM writes on every tick
    const dateStr = engine?.clock?.dateString || "";
    const powerStr = powerPercent.toFixed(1) + "%";
    const powerWidth = Math.min(powerPercent, 100) + "%";

    if (this.els.hudDate && this.els.hudDate.textContent !== dateStr) {
      this.els.hudDate.textContent = dateStr;
    }
    if (this.els.hudTerritories && this.els.hudTerritories.textContent !== String(territories)) {
      this.els.hudTerritories.textContent = territories;
    }
    if (this.els.hudPower && this.els.hudPower.textContent !== powerStr) {
      this.els.hudPower.textContent = powerStr;
    }
    if (this.els.powerBarFill && this.els.powerBarFill.style.width !== powerWidth) {
      this.els.powerBarFill.style.width = powerWidth;
    }

    if (engine?.economySystem) {
      const summary = engine.economySystem.getFactionSummary(engine.playerCode, engine._getCountryOwnership());
      const gdpStr = `$${summary.gdp}B`;
      const budgetStr = `$${summary.budget}B`;
      if (this.els.hudGdp && this.els.hudGdp.textContent !== gdpStr) {
        this.els.hudGdp.textContent = gdpStr;
      }
      if (this.els.hudBudget) {
        if (this.els.hudBudget.textContent !== budgetStr) {
          this.els.hudBudget.textContent = budgetStr;
        }
        this.els.hudBudget.classList.toggle("negative", summary.budget < 0);
      }
    }
  }

  /* =========== Side Panel =========== */

  openPanel() { this.els.sidePanel?.classList.add("open"); }
  closePanel() { this.els.sidePanel?.classList.remove("open"); this.currentInfoCode = null; }

  showCountryInfo(code, forces, ownership, playerCode, engine) {
    this.currentInfoCode = code;
    this._lastRenderArgs = { code, forces, ownership, playerCode, engine };
    this._renderTabContent(code, forces, ownership, playerCode, engine);
    this._updateActionButtons(code, forces, ownership, playerCode, engine);
    this.openPanel();
  }

  /**
   * Show territory-specific info in the side panel when a territory marker is clicked.
   */
  showTerritoryInfo(territoryId, countryCode, engine) {
    this.currentInfoCode = countryCode;
    const territory = getTerritoryById(territoryId);
    if (!territory) return;

    const owner = engine.ownership[territoryId] || countryCode;
    const isPlayerOwned = owner === engine.playerCode;
    const countryForces = engine.forces[countryCode];
    const ownerName = MILITARY_DATA[owner]?.name || owner;
    const ownerFlag = MILITARY_DATA[owner]?.flag || "";
    const countryName = MILITARY_DATA[countryCode]?.name || countryCode;
    const countryFlag = MILITARY_DATA[countryCode]?.flag || "";

    // Calculate territory-specific forces
    const tForces = engine.getTerritoryForces(territoryId);
    const tStrength = tForces ? calcStrength(tForces) : 0;
    const fortLevel = engine.fortifications[territoryId] || 0;
    const canAttack = engine.canAttack(territoryId);

    // Territory conquest progress for this country
    const progress = engine.getCountryConquestProgress(countryCode, engine.playerCode);
    const progressPct = Math.round((progress.owned / progress.total) * 100);

    const canNavalInvade = !isPlayerOwned && engine.canNavalInvade?.(territoryId);
    
    // SR2030 Facilities
    const facilities = engine.facilities[territoryId] || { factory: 0, mine: 0, farm: 0, oil: 0, military: 0 };
    const queuedFacility = engine.facilityQueue.find(q => q.territoryId === territoryId);
    let queueStatus = "";
    if (queuedFacility) {
      const remainingDays = queuedFacility.durationDays - (engine.clock.totalDays - queuedFacility.startDay);
      queueStatus = `<div class="facility-queue-alert">🏗️ Building ${queuedFacility.type} (${remainingDays} days left)</div>`;
    }

    const html = `
      <div class="country-header">
        <div class="country-flag">${countryFlag}</div>
        <div class="country-name">${territory.name}</div>
        <div class="country-status">
          ${isPlayerOwned ? '<span class="status-badge player">YOUR TERRITORY</span>' : ''}
          ${!isPlayerOwned ? `<span class="status-badge controlled">${ownerFlag} ${ownerName}</span>` : ''}
          ${canNavalInvade ? '<span class="status-badge naval">⚓ NAVAL INVASION</span>' : ''}
        </div>
      </div>

      <div class="territory-info-card">
        <div class="territory-detail-row">
          <span class="detail-label">📍 Country</span>
          <span class="detail-value">${countryFlag} ${countryName}</span>
        </div>
        <div class="territory-detail-row">
          <span class="detail-label">📊 Population Share</span>
          <span class="detail-value">${(territory.pop * 100).toFixed(1)}%</span>
        </div>
        <div class="territory-detail-row">
          <span class="detail-label">⚔️ Military Strength</span>
          <span class="detail-value">${Math.round(tStrength).toLocaleString()}</span>
        </div>
        <div class="territory-detail-row">
          <span class="detail-label">👥 Active Troops</span>
          <span class="detail-value">${tForces ? Math.round(tForces.activeMilitary).toLocaleString() : "N/A"}</span>
        </div>
        <div class="territory-detail-row">
          <span class="detail-label">🏗️ Fortification</span>
          <span class="detail-value">${fortLevel > 0 ? `Level ${fortLevel}` : "None"}</span>
        </div>
      </div>

      <div class="territory-info-card">
        <h4>🏭 Infrastructure</h4>
        ${queueStatus}
        <div class="territory-detail-row">
          <span class="detail-label">Factories</span>
          <span class="detail-value">${facilities.factory || 0}</span>
        </div>
        <div class="territory-detail-row">
           <span class="detail-label">Mines</span>
           <span class="detail-value">${facilities.mine || 0}</span>
        </div>
        <div class="territory-detail-row">
           <span class="detail-label">Farms</span>
           <span class="detail-value">${facilities.farm || 0}</span>
        </div>
        <div class="territory-detail-row">
           <span class="detail-label">Oil Derricks</span>
           <span class="detail-value">${facilities.oil || 0}</span>
        </div>
        <div class="territory-detail-row">
           <span class="detail-label">Military Bases</span>
           <span class="detail-value">${facilities.military || 0}</span>
        </div>
      </div>

      ${isPlayerOwned ? `
      <div class="territory-build-card">
        <h4>🏗️ Construct Facility</h4>
        <div class="build-buttons">
          <button data-build="factory" data-tid="${territoryId}" class="btn-build">Factory ($15B)</button>
          <button data-build="mine" data-tid="${territoryId}" class="btn-build">Mine ($8B)</button>
          <button data-build="farm" data-tid="${territoryId}" class="btn-build">Farm ($5B)</button>
          <button data-build="oil" data-tid="${territoryId}" class="btn-build">Oil Derrick ($12B)</button>
          <button data-build="military" data-tid="${territoryId}" class="btn-build">Military Base ($20B)</button>
        </div>
      </div>
      ` : ""}

      <div class="territory-progress">
        <div class="progress-label">
          <span>🗺️ ${countryName}: ${progress.owned} / ${progress.total}</span>
          <span>${progressPct}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${progressPct}%"></div>
        </div>
      </div>
    `;

    if (this.els.panelBody) {
      this.els.panelBody.innerHTML = html;
      
      const buildBtns = this.els.panelBody.querySelectorAll("[data-build]");
      buildBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.dataset.build;
          const tid = btn.dataset.tid;
          if (engine.buildFacility(tid, type)) {
             this.showTerritoryInfo(tid, countryCode, engine);
          }
        });
      });
    }

    // Update action buttons
    if (this.els.btnAttack) this.els.btnAttack.disabled = !canAttack || isPlayerOwned;
    if (this.els.btnFortify) this.els.btnFortify.disabled = !isPlayerOwned;

    this.openPanel();
  }

  _renderTabContent(code, forces, ownership, playerCode, engine) {
    if (!this.els.panelBody) return;
    const data = forces[code];
    if (!data) return;

    // Compute majority owner for this country from territory ownership
    const countryProgress = engine.getCountryConquestProgress(code, playerCode);
    const territories = TERRITORY_DATA[code];
    let owner = code;
    if (territories && territories.length > 0) {
      const ownerCounts = {};
      for (const t of territories) {
        const o = ownership[t.id] || code;
        ownerCounts[o] = (ownerCounts[o] || 0) + 1;
      }
      let maxCount = 0;
      for (const [o, c] of Object.entries(ownerCounts)) {
        if (c > maxCount) { maxCount = c; owner = o; }
      }
    } else {
      owner = ownership[code] || code;
    }

    const isOwned = countryProgress.owned > 0;
    const isFullyOwned = countryProgress.owned === countryProgress.total;
    const ownerName = owner !== code ? (MILITARY_DATA[owner]?.name || owner) : null;
    const isAllied = engine.isAllied(playerCode, owner);

    // Territory conquest progress bar
    const progressPct = Math.round((countryProgress.owned / countryProgress.total) * 100);
    const progressHTML = countryProgress.total > 1 ? `
      <div class="territory-progress">
        <div class="progress-label">
          <span>🗺️ Territories: ${countryProgress.owned} / ${countryProgress.total}</span>
          <span>${progressPct}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${progressPct}%"></div>
        </div>
      </div>
    ` : "";

    const headerHTML = `
      <div class="country-header">
        <div class="country-flag">${data.flag || "🏳️"}</div>
        <div class="country-name">${data.name || code}</div>
        <div class="country-status">
          ${isFullyOwned ? '<span class="status-badge player">YOUR TERRITORY</span>' : ""}
          ${isOwned && !isFullyOwned ? '<span class="status-badge player">PARTIALLY CONTROLLED</span>' : ""}
          ${isAllied ? '<span class="status-badge allied">ALLIED</span>' : ""}
          ${engine.geo.isAtWar(playerCode, owner) ? '<span class="status-badge war">AT WAR</span>' : ""}
          ${engine.geo.nuclearWasteland[code] ? '<span class="status-badge nuclear">☢️ WASTELAND</span>' : ""}
          ${ownerName && !isOwned ? `<span class="status-badge controlled">${MILITARY_DATA[owner]?.flag || ""} ${ownerName}</span>` : ""}
        </div>
      </div>
      ${progressHTML}
    `;

    let contentHTML = "";
    switch (this.currentTab) {
      case "military":
        contentHTML = this._renderMilitaryTab(code, data, forces, ownership, playerCode, engine);
        break;
      case "economy":
        contentHTML = this._renderEconomyTab(code, data, ownership, playerCode, engine);
        break;
      case "diplomacy":
        contentHTML = this._renderDiplomacyTab(code, data, ownership, playerCode, engine);
        break;
    }

    this.els.panelBody.innerHTML = headerHTML + contentHTML;
    this._bindPanelEvents(code, forces, ownership, playerCode, engine);
  }

  _bindPanelEvents(code, forces, ownership, playerCode, engine) {
    // Compute isOwned from territory progress (player controls at least one territory)
    const countryProgress = engine.getCountryConquestProgress(code, playerCode);
    const isOwned = countryProgress.owned > 0;

    // Production buttons
    if (this.currentTab === "military" && isOwned) {
      this.els.panelBody.querySelectorAll("[data-produce]").forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.dataset.produce;
          if (engine && typeof engine.queueProduction === "function") {
            engine.queueProduction(code, type);
            this.showCountryInfo(code, forces, ownership, playerCode, engine);
          }
        });
      });

      this.els.panelBody.querySelectorAll("[data-missile-produce]").forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.dataset.missileProduce;
          if (this._onMissileProduceRequest) this._onMissileProduceRequest(type);
        });
      });

      // Unit Designer branch tab switching
      this.els.panelBody.querySelectorAll("[data-ud-branch]").forEach(tab => {
        tab.addEventListener("click", () => {
          const branch = tab.dataset.udBranch;
          // Toggle active tab styling
          this.els.panelBody.querySelectorAll("[data-ud-branch]").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          // Show/hide unit cards
          this.els.panelBody.querySelectorAll("[data-branch]").forEach(card => {
            card.style.display = card.dataset.branch === branch ? "flex" : "none";
          });
        });
      });
      // Activate ground tab by default
      const groundTab = this.els.panelBody.querySelector('[data-ud-branch="ground"]');
      if (groundTab) groundTab.classList.add("active");
    }

    // Economy controls (spending sliders)
    if (this.currentTab === "economy" && isOwned) {
      this.els.panelBody.querySelectorAll("[data-spending-cat]").forEach(slider => {
        slider.addEventListener("input", () => {
          const spending = {};
          this.els.panelBody.querySelectorAll("[data-spending-cat]").forEach(s => {
            spending[s.dataset.spendingCat] = parseInt(s.value, 10);
          });
          engine.setSpendingAllocation(code, spending);

          // Update displayed values
          for (const [cat, val] of Object.entries(spending)) {
            const valEl = this.els.panelBody.querySelector(`.spending-val-${cat}`);
            if (valEl) valEl.textContent = `${val}%`;
          }
        });
      });

      // Tax rate sliders
      this.els.panelBody.querySelectorAll("[data-tax-type]").forEach(slider => {
        slider.addEventListener("input", () => {
          const taxType = slider.dataset.taxType;
          const rate = parseInt(slider.value, 10);
          engine.setTaxRate(code, taxType, rate);
          const valEl = this.els.panelBody.querySelector(`.tax-val-${taxType}`);
          if (valEl) valEl.textContent = `${rate}%`;
        });
      });

      // Sector nationalization toggles
      this.els.panelBody.querySelectorAll("[data-sector-toggle]").forEach(btn => {
        btn.addEventListener("click", () => {
          const sector = btn.dataset.sectorToggle;
          engine.toggleSectorNationalization(code, sector);
          this.showCountryInfo(code, forces, ownership, playerCode, engine);
        });
      });

      // Enhancement #16: Resource market buy/sell
      this.els.panelBody.querySelectorAll(".btn-market-buy").forEach(btn => {
        btn.addEventListener("click", () => {
          engine.buyResource(btn.dataset.resource, 10);
          this.showCountryInfo(code, forces, ownership, playerCode, engine);
        });
      });
      this.els.panelBody.querySelectorAll(".btn-market-sell").forEach(btn => {
        btn.addEventListener("click", () => {
          engine.sellResource(btn.dataset.resource, 10);
          this.showCountryInfo(code, forces, ownership, playerCode, engine);
        });
      });
    }

    // Diplomacy tab: Government & Policy controls
    if (this.currentTab === "diplomacy" && code === playerCode) {
      const govSelect = this.els.panelBody.querySelector("#gov-select");
      if (govSelect) {
        govSelect.addEventListener("change", () => {
          const result = engine.geo.setGovernment(code, govSelect.value);
          if (result.success) {
            engine._addLog("politics", result.message);
          }
          this.showCountryInfo(code, forces, ownership, playerCode, engine);
        });
      }

      this.els.panelBody.querySelectorAll("[data-policy]").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
          const policyKey = checkbox.dataset.policy;
          const result = engine.geo.togglePolicy(code, policyKey);
          if (result.success) {
            engine._addLog("politics", result.message);
          }
          this.showCountryInfo(code, forces, ownership, playerCode, engine);
        });
      });
    }
  }

  /* =========== Military Tab =========== */

  _renderMilitaryTab(code, data, forces, ownership, playerCode, engine) {
    const countryProgress = engine.getCountryConquestProgress(code, playerCode);
    const isOwned = countryProgress.owned > 0;

    // Tech level display — use majority owner of the country's territories
    const countryOwner = engine._getCountryOwnership()[code] || code;
    const techLevel = engine.unitDesigner.getMaxTechLevel(countryOwner);
    const techDef = TECH_LEVELS[techLevel];

    let html = `
      <div class="tech-badge" style="border-color:${techDef?.color || '#64748b'}">
        <span class="tech-icon">🔬</span>
        <span>Tech Level <strong style="color:${techDef?.color}">${techLevel}</strong></span>
        <span class="tech-name">${techDef?.name || 'Basic'}</span>
      </div>
      <div class="stat-grid">
        ${this._statCard("🎖️", formatNumber(data.activeMilitary), "Active Military")}
        ${this._statCard("👥", formatNumber(data.reserveMilitary), "Reserves")}
        ${this._statCard("🛡️", formatNumber(data.tanks), "Tanks")}
        ${this._statCard("💥", formatNumber(data.artillery), "Artillery")}
        ${this._statCard("✈️", formatNumber(data.aircraft), "Aircraft")}
        ${this._statCard("🔥", formatNumber(data.fighters), "Fighters")}
        ${this._statCard("🚁", formatNumber(data.helicopters), "Helicopters")}
        ${this._statCard("🚢", formatNumber(data.navalVessels || 0), "Naval")}
        ${this._statCard("🦈", formatNumber(data.submarines), "Submarines")}
        ${this._statCard("⚓", formatNumber(data.aircraftCarriers), "Carriers")}
        ${this._statCard("☢️", formatNumber(data.nuclearWeapons), "Nukes")}
        ${this._statCard("💰", "$" + data.defenseBudget + "B", "Def. Budget")}
      </div>
    `;

    if (isOwned) {
      const eco = engine.economySystem.getEconomy(code);
      const budget = eco?.budget || 0;
      const maxTech = engine.unitDesigner.getMaxTechLevel(engine.playerCode);

      // Active production queue
      const activeProduction = engine.productionQueue.filter(o => o.code === code && o.category === "military");
      let queueHtml = "";
      if (activeProduction.length > 0) {
        queueHtml = `<div class="ud-queue"><div class="ud-queue-title">🔄 In Production</div>`;
        for (const order of activeProduction) {
          const elapsed = engine.clock.totalDays - order.startDay;
          const pct = Math.min(100, Math.round((elapsed / order.durationDays) * 100));
          const daysLeft = Math.max(0, order.durationDays - elapsed);
          queueHtml += `
            <div class="ud-queue-item">
              <div class="ud-queue-label">${order.label}</div>
              <div class="ud-queue-bar"><div class="ud-queue-fill" style="width:${pct}%"></div></div>
              <div class="ud-queue-time">${daysLeft}d</div>
            </div>`;
        }
        queueHtml += `</div>`;
      }

      // Unit type cards organized by branch
      let designerHtml = `
        <div class="unit-designer-panel">
          <h3 class="section-title">⚙️ Unit Designer</h3>
          <div class="ud-budget">💰 Budget: <strong>$${budget.toFixed(1)}B</strong></div>
          ${queueHtml}
          <div class="ud-branch-tabs">`;

      for (const [branchKey, branch] of Object.entries(UNIT_BRANCHES)) {
        designerHtml += `<button class="ud-tab" data-ud-branch="${branchKey}">${branch.icon} ${branch.name}</button>`;
      }
      designerHtml += `</div><div class="ud-units-grid">`;

      // Render all unit types with details
      for (const [typeKey, typeDef] of Object.entries(UNIT_TYPE_DEFS)) {
        const locked = typeDef.minTechLevel && maxTech < typeDef.minTechLevel;
        const techColor = TECH_LEVELS[Math.min(maxTech, 5)]?.color || "#64748b";
        const stats = typeDef.baseStats;
        const cost = typeDef.baseCost;
        const techMult = TECH_LEVELS[maxTech]?.costMult || 1;
        const realCost = Math.round(cost * techMult * 10) / 10;
        const canAfford = budget >= realCost;

        // Map type to old production key
        const prodMapping = {
          infantry: "troops", armor: "tanks", mobile_artillery: "artillery",
          fighter: "fighters", bomber: "aircraft", attack_heli: "helicopters",
          destroyer: "naval", submarine: "subs"
        };
        const prodKey = prodMapping[typeKey];

        designerHtml += `
          <div class="ud-card ${locked ? 'ud-locked' : ''}" data-branch="${typeDef.branch}" style="display:${typeDef.branch === 'ground' ? 'flex' : 'none'}">
            <div class="ud-card-header">
              <svg class="ud-icon" viewBox="0 0 24 24" width="28" height="28">
                <path d="${typeDef.svgPath}" fill="${locked ? '#475569' : techColor}"/>
              </svg>
              <div class="ud-card-title">
                <div class="ud-name">${typeDef.name}</div>
                <div class="ud-branch-label">${UNIT_BRANCHES[typeDef.branch]?.icon || ""} ${typeDef.branch}</div>
              </div>
              ${locked ? `<span class="ud-lock">🔒 Tech ${typeDef.minTechLevel}</span>` : ''}
            </div>
            <div class="ud-desc">${typeDef.description}</div>
            <div class="ud-stats">
              ${this._udStatBar("ATK", stats.attack, locked)}
              ${this._udStatBar("DEF", stats.defense, locked)}
              ${this._udStatBar("SPD", stats.speed, locked)}
              ${this._udStatBar("STL", stats.stealth, locked)}
              ${this._udStatBar("RNG", stats.range, locked)}
            </div>
            <div class="ud-footer">
              <span class="ud-cost ${canAfford && !locked ? '' : 'ud-cost-red'}">$${realCost}B</span>
              ${prodKey && !locked ? `<button class="ud-produce-btn ${canAfford ? '' : 'disabled'}" data-produce="${prodKey}" ${canAfford ? '' : 'disabled'}>Produce</button>` : ''}
              ${!prodKey && !locked ? `<span class="ud-no-prod">Research Only</span>` : ''}
            </div>
          </div>`;
      }

      designerHtml += `</div></div>`;
      html += designerHtml;
      html += this._renderMissileProduction(engine);
    }

    if (!isOwned) {
      html += `
        <h3 class="section-title">Your Forces vs. Theirs</h3>
        ${this._renderComparisonBars(engine, playerCode, code)}
      `;
    }

    return html;
  }

  /* =========== Economy Tab (SP2-Style) =========== */

  _renderEconomyTab(code, data, ownership, playerCode, engine) {
    const eco = engine.economySystem.getEconomy(code);
    if (!eco) return "<p>No economic data available.</p>";

    // ownership is keyed by territory IDs, not country codes.
    // Check if this country IS the player's country directly.
    const isOwned = code === playerCode;
    const isWasteland = engine.geo.nuclearWasteland[code];

    let html = `<div class="eco-overview">`;

    // Main economy stats
    html += `
      <div class="eco-card">
        <div class="eco-card-title">📊 Economy Overview</div>
        <div class="eco-stats">
          ${this._ecoStat("GDP", `$${eco.gdp}B`, eco.gdp > eco.baseGdp ? "positive" : (eco.gdp < eco.baseGdp ? "negative" : ""))}
          ${this._ecoStat("Revenue/Turn", `+$${eco.revenue}B`, "positive")}
          ${this._ecoStat("Expenses/Turn", `-$${eco.expenses}B`, "negative")}
          ${this._ecoStat("Budget", `$${eco.budget.toFixed(1)}B`, eco.budget >= 0 ? "positive" : "negative")}
          ${this._ecoStat("Debt", `$${eco.debt.toFixed(1)}B`, eco.debt > 0 ? "negative" : "")}
          ${this._ecoStat("Inflation", `${eco.inflation.toFixed(1)}%`, eco.inflation > 5 ? "negative" : "")}
          ${this._ecoStat("Trade Balance", `$${eco.tradeBalance.toFixed(1)}B`, eco.tradeBalance >= 0 ? "positive" : "negative")}
        </div>
      </div>
    `;

    // Indicators
    html += `
      <div class="eco-card">
        <div class="eco-card-title">📈 Indicators</div>
        <div class="eco-bars">
          ${this._ecoBar("Stability", eco.stability, 100, eco.stability >= 60 ? "green" : (eco.stability >= 40 ? "orange" : "red"))}
          ${this._ecoBar("Food Security", eco.foodSecurity, 100, eco.foodSecurity >= 60 ? "green" : (eco.foodSecurity >= 40 ? "orange" : "red"))}
          ${this._ecoBar("Oil (M bbl/d)", eco.oilProduction, 12, "blue")}
        </div>
        ${isWasteland ? `<div class="wasteland-warning">☢️ Nuclear wasteland — ${engine.geo.nuclearWasteland[code]} turns remaining</div>` : ""}
      </div>
    `;

    // Taxation controls (only for player territories)
    if (isOwned) {
      html += `
        <div class="eco-card highlight">
          <div class="eco-card-title">💵 Taxation</div>
          <div class="slider-group">
            <div class="slider-row">
              <span class="slider-label">Income Tax</span>
              <input type="range" min="0" max="60" value="${eco.incomeTaxRate}" data-tax-type="income" class="sp2-slider" />
              <span class="slider-value tax-val-income">${eco.incomeTaxRate}%</span>
            </div>
            <div class="slider-row">
              <span class="slider-label">Corporate Tax</span>
              <input type="range" min="0" max="50" value="${eco.corporateTaxRate}" data-tax-type="corporate" class="sp2-slider" />
              <span class="slider-value tax-val-corporate">${eco.corporateTaxRate}%</span>
            </div>
            <div class="slider-row">
              <span class="slider-label">Tariffs</span>
              <input type="range" min="0" max="40" value="${eco.tariffRate}" data-tax-type="tariff" class="sp2-slider" />
              <span class="slider-value tax-val-tariff">${eco.tariffRate}%</span>
            </div>
          </div>
        </div>
      `;

      // Spending allocation
      html += `
        <div class="eco-card highlight">
          <div class="eco-card-title">🏛️ Budget Allocation</div>
          <div class="slider-group">
      `;
      for (const [cat, info] of Object.entries(SPENDING_CATEGORIES)) {
        html += `
            <div class="slider-row">
              <span class="slider-label">${info.icon} ${info.name}</span>
              <input type="range" min="0" max="60" value="${eco.spending[cat]}" data-spending-cat="${cat}" class="sp2-slider" />
              <span class="slider-value spending-val-${cat}">${eco.spending[cat]}%</span>
            </div>
        `;
      }
      html += `</div></div>`;

      // Sector Management
      html += `
        <div class="eco-card">
          <div class="eco-card-title">🏢 Economic Sectors</div>
          <div class="sector-grid">
      `;
      for (const [key, def] of Object.entries(ECONOMIC_SECTORS)) {
        const sector = eco.sectors[key];
        if (!sector) continue;
        html += `
            <div class="sector-item ${sector.nationalized ? 'nationalized' : 'private'}">
              <div class="sector-icon">${def.icon}</div>
              <div class="sector-info">
                <div class="sector-name">${def.name}</div>
                <div class="sector-output">$${sector.output}B</div>
              </div>
              <button class="sector-toggle-btn" data-sector-toggle="${key}">
                ${sector.nationalized ? '🏛️ Gov' : '🏢 Pvt'}
              </button>
            </div>
        `;
      }
      html += `</div></div>`;

      // Resources with surplus/deficit indicators
      html += `
        <div class="eco-card">
          <div class="eco-card-title">📦 Resources & Trade</div>
          <div class="eco-stats">
      `;
      // Calculate consumption for comparison
      const popMillions = eco.population / 1000000;
      const foodNeeded = popMillions * 0.03;
      const oilNeeded = ((engine.forces[code]?.activeMilitary || 0) / 500000) + popMillions * 0.005;
      
      for (const [key, def] of Object.entries(RESOURCE_TYPES)) {
        const amount = eco.resources[key] || 0;
        let needed = 0;
        if (key === "food") needed = foodNeeded;
        if (key === "oil") needed = oilNeeded;
        
        const surplus = amount - needed;
        let statusClass = "";
        let statusIcon = "";
        if (needed > 0) {
          statusClass = surplus >= 0 ? "positive" : "negative";
          statusIcon = surplus >= 0 ? "📈" : "📉";
        }
        
        html += `
          <div class="eco-stat-row ${statusClass}">
            <span class="eco-stat-label">${def.icon} ${def.name}</span>
            <span class="eco-stat-value">${amount.toFixed(1)} ${def.unit} ${statusIcon}</span>
          </div>
        `;
        
        if (needed > 0) {
          html += `
            <div class="eco-stat-row sub-row ${statusClass}">
              <span class="eco-stat-label" style="padding-left:20px;font-size:0.8rem;opacity:0.7">Consumption</span>
              <span class="eco-stat-value" style="font-size:0.8rem">${needed.toFixed(1)} ${def.unit} (${surplus >= 0 ? '+' : ''}${surplus.toFixed(1)})</span>
            </div>
          `;
        }
      }
      html += `</div></div>`;

      // National Facility Summary — use cached territory list for O(territories) instead of O(all)
      let totalFac = 0, totalMin = 0, totalFrm = 0, totalOilFac = 0, totalMil = 0;
      if (engine.facilities) {
        const ownedTerritories = engine.getFactionsOwnerTerritories(code);
        for (const tid of ownedTerritories) {
          const fac = engine.facilities[tid];
          if (!fac) continue;
          totalFac += fac.factory || 0;
          totalMin += fac.mine || 0;
          totalFrm += fac.farm || 0;
          totalOilFac += fac.oil || 0;
          totalMil += fac.military || 0;
        }
      }
      const totalAll = totalFac + totalMin + totalFrm + totalOilFac + totalMil;
      if (totalAll > 0) {
        html += `
          <div class="eco-card">
            <div class="eco-card-title">🏭 National Facilities (${totalAll})</div>
            <div class="eco-stats">
              ${this._ecoStat("🏭 Factories", totalFac, "")}
              ${this._ecoStat("⛏️ Mines", totalMin, "")}
              ${this._ecoStat("🌾 Farms", totalFrm, "")}
              ${this._ecoStat("🛢️ Oil Derricks", totalOilFac, "")}
              ${this._ecoStat("🎖️ Military Bases", totalMil, "")}
            </div>
          </div>
        `;
      }
    }

    // Population
    html += `
      <div class="eco-card">
        <div class="eco-card-title">👤 Population</div>
        <div class="eco-pop">${formatNumber(eco.population)}</div>
      </div>
    `;

    // Trade partners
    const tradePartners = engine.geo.getTradePartners(code);
    if (tradePartners.length > 0) {
      html += `
        <div class="eco-card">
          <div class="eco-card-title">📦 Trade Partners</div>
          <div class="partner-list">
            ${tradePartners.map(p => `<span class="partner-tag">${MILITARY_DATA[p]?.flag || ""} ${MILITARY_DATA[p]?.name || p}</span>`).join("")}
          </div>
        </div>
      `;
    }

    // Empire totals
    if (isOwned) {
      const summary = engine.economySystem.getFactionSummary(playerCode, engine._getCountryOwnership());
      const gdpPct = engine.economySystem.getFactionGDPPercent(playerCode, engine._getCountryOwnership());
      html += `
        <div class="eco-card highlight">
          <div class="eco-card-title">🌐 Empire Totals</div>
          <div class="eco-stats">
            ${this._ecoStat("Total GDP", `$${summary.gdp}B`, "")}
            ${this._ecoStat("Total Revenue", `+$${summary.revenue}B`, "positive")}
            ${this._ecoStat("Total Expenses", `-$${summary.expenses}B`, "negative")}
            ${this._ecoStat("Total Budget", `$${summary.budget}B`, summary.budget >= 0 ? "positive" : "negative")}
            ${this._ecoStat("Total Debt", `$${summary.debt}B`, summary.debt > 0 ? "negative" : "")}
            ${this._ecoStat("GDP % of World", `${gdpPct.toFixed(1)}%`, "")}
          </div>
        </div>
      `;
    }

    // Enhancement #15: Economic History Sparkline
    const history = engine.getEconomicHistory(code);
    if (history.length >= 2) {
      const gdps = history.map(h => h.gdp);
      const budgets = history.map(h => h.budget);
      const maxVal = Math.max(...gdps, ...budgets, 1);
      const minVal = Math.min(...gdps, ...budgets, 0);
      const range = maxVal - minVal || 1;
      const w = 260, h2 = 60;

      const toPoints = (arr) => arr.map((v, i) => {
        const x = (i / (arr.length - 1)) * w;
        const y = h2 - ((v - minVal) / range) * h2;
        return `${x},${y}`;
      }).join(" ");

      html += `
        <div class="eco-card">
          <div class="eco-card-title">📈 Economic Trends (${history.length} months)</div>
          <svg class="sparkline-chart" viewBox="0 0 ${w} ${h2 + 10}" width="100%" height="80">
            <polyline points="${toPoints(gdps)}" fill="none" stroke="#10b981" stroke-width="2" />
            <polyline points="${toPoints(budgets)}" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3" />
          </svg>
          <div class="sparkline-legend">
            <span style="color:#10b981">● GDP</span>
            <span style="color:#3b82f6">● Budget</span>
          </div>
        </div>
      `;
    }

    // Enhancement #16: Resource Market
    if (isOwned) {
      const market = engine.getResourceMarket();
      const RESOURCE_META = {
        oil:        { icon: "🛢️", name: "Oil" },
        steel:      { icon: "⚙️", name: "Steel" },
        tech:       { icon: "💻", name: "Tech" },
        food:       { icon: "🌾", name: "Food" },
        rare_earth: { icon: "💎", name: "Rare Earth" }
      };

      html += `
        <div class="eco-card highlight">
          <div class="eco-card-title">🏪 Global Resource Market</div>
          <div class="market-grid">
      `;
      for (const [key, res] of Object.entries(market)) {
        const meta = RESOURCE_META[key] || { icon: "📦", name: key };
        const trendIcon = res.trend > 0 ? "↑" : res.trend < 0 ? "↓" : "→";
        const trendColor = res.trend > 0 ? "#ef4444" : res.trend < 0 ? "#10b981" : "#6b7280";

        html += `
          <div class="market-item">
            <div class="market-icon">${meta.icon}</div>
            <div class="market-info">
              <div class="market-name">${meta.name}</div>
              <div class="market-price">$${res.price} <span style="color:${trendColor}">${trendIcon}</span></div>
            </div>
            <div class="market-supply" title="Supply">S: ${res.supply}</div>
            <button class="btn-market-buy" data-resource="${key}">Buy</button>
            <button class="btn-market-sell" data-resource="${key}">Sell</button>
          </div>
        `;
      }
      html += `</div></div>`;
    }

    html += `</div>`;
    return html;
  }

  /* =========== Diplomacy Tab =========== */

  _renderDiplomacyTab(code, data, ownership, playerCode, engine) {
    const isOwned = code === playerCode;
    const owner = code;
    const relation = engine.geo.getRelation(playerCode, owner);
    const atWar = engine.geo.isAtWar(playerCode, owner);
    const tradeKey = engine.geo._relKey(playerCode, owner);
    const hasTradeWith = engine.geo.tradeDeals.has(tradeKey);
    const hasSanctionOn = engine.geo.sanctions[owner]?.has(playerCode) || false;

    let html = "";

    if (!isOwned) {
      const relColor = relation > 30 ? "var(--accent-green)" :
                        relation > 0 ? "var(--accent-cyan)" :
                        relation > -30 ? "var(--accent-orange)" : "var(--accent-red)";
      const relLabel = relation > 50 ? "Friendly" :
                       relation > 20 ? "Warm" :
                       relation > -20 ? "Neutral" :
                       relation > -50 ? "Hostile" : "Sworn Enemy";

      html += `
        <div class="diplo-relation">
          <div class="diplo-rel-header">
            <span class="diplo-rel-label">${relLabel}</span>
            <span class="diplo-rel-score" style="color:${relColor}">${relation > 0 ? "+" : ""}${relation}</span>
          </div>
          <div class="diplo-rel-bar">
            <div class="diplo-rel-track">
              <div class="diplo-rel-fill" style="left:${Math.max(0, (relation + 100) / 2)}%;"></div>
              <div class="diplo-rel-center"></div>
            </div>
            <div class="diplo-rel-labels">
              <span>-100</span><span>0</span><span>+100</span>
            </div>
          </div>
        </div>
        <div class="diplo-status-list">
          ${atWar ? '<div class="diplo-status war">⚔️ AT WAR</div>' : ""}
          ${hasTradeWith ? '<div class="diplo-status trade">📦 TRADE DEAL ACTIVE</div>' : ""}
          ${hasSanctionOn ? '<div class="diplo-status sanction">🚫 SANCTIONS IMPOSED</div>' : ""}
          ${engine.isAllied(playerCode, owner) ? '<div class="diplo-status allied">🤝 MILITARY ALLIANCE</div>' : ""}
        </div>
      `;
    }

    // Wars overview
    const playerWars = engine.geo.getWarsForFaction(playerCode, ownership);
    if (playerWars.length > 0) {
      html += `
        <div class="eco-card warning">
          <div class="eco-card-title">⚔️ Active Wars</div>
          <div class="partner-list">
            ${playerWars.map(w => `<span class="partner-tag danger">${MILITARY_DATA[w]?.flag || ""} ${MILITARY_DATA[w]?.name || w}</span>`).join("")}
          </div>
        </div>
      `;
    }

    // Trade partners
    const tradePartners = engine.geo.getTradePartners(playerCode);
    if (tradePartners.length > 0) {
      html += `
        <div class="eco-card">
          <div class="eco-card-title">📦 Your Trade Partners</div>
          <div class="partner-list">
            ${tradePartners.map(p => `<span class="partner-tag">${MILITARY_DATA[p]?.flag || ""} ${MILITARY_DATA[p]?.name || p}</span>`).join("")}
          </div>
        </div>
      `;
    }

    // Sanctions
    const sanctionTargets = engine.geo.getSanctionsBy(playerCode);
    if (sanctionTargets.length > 0) {
      html += `
        <div class="eco-card">
          <div class="eco-card-title">🚫 Your Sanctions</div>
          <div class="partner-list">
            ${sanctionTargets.map(t => `<span class="partner-tag danger">${MILITARY_DATA[t]?.flag || ""} ${MILITARY_DATA[t]?.name || t}</span>`).join("")}
          </div>
        </div>
      `;
    }

    // Relations overview
    html += `
      <div class="eco-card">
        <div class="eco-card-title">🌐 Relations Overview</div>
        <div class="relations-list">
          ${this._renderRelationsOverview(playerCode, ownership, engine)}
        </div>
      </div>
    `;

    // ── Government & Policies (Player only) ──
    if (isOwned) {
      const govKey = engine.geo.governmentTypes[code] || "democracy";
      const gov = GOVERNMENT_TYPES[govKey] || GOVERNMENT_TYPES.democracy;
      const countryPolicies = engine.geo.policies[code] || {};
      const mods = engine.geo.getGovernmentModifiers(code);

      html += `
        <div class="eco-card highlight">
          <div class="eco-card-title">🏛️ Government</div>
          <div class="gov-current">
            <span class="gov-icon">${gov.icon}</span>
            <span class="gov-name">${gov.name}</span>
          </div>
          <select id="gov-select" class="gov-select">
            ${Object.entries(GOVERNMENT_TYPES).map(([k, g]) =>
              `<option value="${k}" ${k === govKey ? 'selected' : ''}>${g.icon} ${g.name}</option>`
            ).join("")}
          </select>
          <div class="gov-modifiers">
            <span class="mod-tag ${mods.gdpMod >= 0 ? 'positive' : 'negative'}">GDP ${mods.gdpMod >= 0 ? '+' : ''}${(mods.gdpMod * 100).toFixed(0)}%</span>
            <span class="mod-tag ${mods.stabilityMod >= 0 ? 'positive' : 'negative'}">Stability ${mods.stabilityMod >= 0 ? '+' : ''}${mods.stabilityMod}</span>
            <span class="mod-tag ${mods.militaryMod >= 0 ? 'positive' : 'negative'}">Military ${mods.militaryMod >= 0 ? '+' : ''}${(mods.militaryMod * 100).toFixed(0)}%</span>
            <span class="mod-tag ${mods.taxMod >= 0 ? 'positive' : 'negative'}">Tax ${mods.taxMod >= 0 ? '+' : ''}${(mods.taxMod * 100).toFixed(0)}%</span>
          </div>
        </div>
      `;

      html += `
        <div class="eco-card highlight">
          <div class="eco-card-title">📜 Policies & Laws</div>
          <div class="policy-grid">
      `;
      for (const [pKey, p] of Object.entries(POLICIES)) {
        const isOn = countryPolicies[pKey] || false;
        html += `
          <div class="policy-card ${isOn ? 'active' : ''}">
            <div class="policy-header">
              <span class="policy-icon">${p.icon}</span>
              <span class="policy-name">${p.name}</span>
              <label class="policy-toggle">
                <input type="checkbox" data-policy="${pKey}" ${isOn ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="policy-desc">${p.desc}</div>
          </div>
        `;
      }
      html += `</div></div>`;
    }

    return html;
  }

  _renderRelationsOverview(playerCode, ownership, engine) {
    // Use MILITARY_DATA keys instead of scanning all ownership values
    const items = [];
    for (const f of Object.keys(MILITARY_DATA)) {
      if (f === playerCode) continue;
      const rel = engine.geo.getRelation(playerCode, f);
      const atWar = engine.geo.isAtWar(playerCode, f);
      items.push({ code: f, rel, atWar });
    }
    items.sort((a, b) => b.rel - a.rel);

    return items.slice(0, 15).map(item => {
      const relColor = item.rel > 30 ? "var(--accent-green)" :
                        item.rel > 0 ? "var(--accent-cyan)" :
                        item.rel > -30 ? "var(--accent-orange)" : "var(--accent-red)";
      const pct = (item.rel + 100) / 2;
      return `
        <div class="rel-row ${item.atWar ? 'at-war' : ''}">
          <span class="rel-flag">${MILITARY_DATA[item.code]?.flag || ""}</span>
          <span class="rel-name">${MILITARY_DATA[item.code]?.name || item.code}</span>
          <div class="rel-bar-mini">
            <div class="rel-bar-fill-mini" style="width:${pct}%;background:${relColor}"></div>
          </div>
          <span class="rel-score" style="color:${relColor}">${item.rel > 0 ? "+" : ""}${item.rel}</span>
          ${item.atWar ? '<span class="rel-war">⚔️</span>' : ""}
        </div>
      `;
    }).join("");
  }

  _updateActionButtons(code, forces, ownership, playerCode, engine) {
    // Compute territory-aware ownership
    const countryProgress = engine.getCountryConquestProgress(code, playerCode);
    const isOwned = countryProgress.owned === countryProgress.total;
    const hasAnyOwned = countryProgress.owned > 0;

    // Find majority owner for diplomacy purposes
    const territories = TERRITORY_DATA[code];
    let owner = code;
    if (territories && territories.length > 0) {
      const ownerCounts = {};
      for (const t of territories) {
        const o = ownership[t.id] || code;
        ownerCounts[o] = (ownerCounts[o] || 0) + 1;
      }
      let maxCount = 0;
      for (const [o, c] of Object.entries(ownerCounts)) {
        if (c > maxCount) { maxCount = c; owner = o; }
      }
    } else {
      owner = ownership[code] || code;
    }

    // Check if any territory of this country can be attacked
    let canAttackAny = false;
    if (territories && territories.length > 0) {
      for (const t of territories) {
        if (engine.canAttack(t.id)) { canAttackAny = true; break; }
      }
    } else {
      canAttackAny = engine.canAttack(code);
    }

    const atWar = engine.geo.isAtWar(playerCode, owner);

    if (this.els.btnAttack) {
      this.els.btnAttack.disabled = !canAttackAny || isOwned;
      console.log(`[DEBUG UI] btnAttack state for ${owner} / ${code}: canAttackAny=${canAttackAny}, isOwned=${isOwned}, disabled=${this.els.btnAttack.disabled}`);
    }
    if (this.els.btnFortify) this.els.btnFortify.disabled = engine.phase !== "playing" || !hasAnyOwned;
    if (this.els.btnNuke) {
      const hasNukes = engine._getAggregatedForces(playerCode).nuclearWeapons > 0;
      this.els.btnNuke.disabled = isOwned || !hasNukes;
    }

    if (!isOwned && owner) {
      if (this.els.btnImprove) this.els.btnImprove.disabled = false;
      if (this.els.btnDenounce) this.els.btnDenounce.disabled = false;
      if (this.els.btnTrade) {
        const rel = engine.geo.getRelation(playerCode, owner);
        this.els.btnTrade.disabled = rel < 0;
        const tradeKey = engine.geo._relKey(playerCode, owner);
        this.els.btnTrade.innerHTML = engine.geo.tradeDeals.has(tradeKey)
          ? '📦 Cancel Trade'
          : '📦 Trade';
      }
      if (this.els.btnSanction) {
        this.els.btnSanction.disabled = false;
        const hasSanction = engine.geo.sanctions[owner]?.has(playerCode);
        this.els.btnSanction.innerHTML = hasSanction
          ? '🚫 Lift Sanction'
          : '🚫 Sanction';
      }
      if (this.els.btnWar) { this.els.btnWar.disabled = atWar; this.els.btnWar.classList.toggle("hidden", atWar); }
      if (this.els.btnPeace) { this.els.btnPeace.disabled = !atWar; this.els.btnPeace.classList.toggle("hidden", !atWar); }
      // Enhancement #4: Espionage buttons
      if (this.els.btnSpySteal) this.els.btnSpySteal.disabled = false;
      if (this.els.btnSpySabotage) this.els.btnSpySabotage.disabled = false;
      if (this.els.btnSpyRebel) this.els.btnSpyRebel.disabled = false;
      if (this.els.btnCouncil) this.els.btnCouncil.disabled = false;
    } else {
      [this.els.btnImprove, this.els.btnDenounce, this.els.btnTrade, this.els.btnSanction, this.els.btnWar, this.els.btnPeace, this.els.btnSpySteal, this.els.btnSpySabotage, this.els.btnSpyRebel, this.els.btnCouncil].forEach(b => { if (b) b.disabled = true; });
    }
  }

  /* =========== Helpers =========== */

  _statCard(icon, value, label) {
    return `<div class="stat-card"><div class="stat-icon">${icon}</div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
  }

  _productionButton(type, label, cost, budget) {
    const info = getUnitProductionRule(type);
    const days = info ? info.days : 14;
    const disabled = budget < cost;
    return `<button class="prod-btn ${disabled ? 'disabled' : ''}" data-produce="${type}" ${disabled ? "disabled" : ""}>
      <span class="prod-label">${label}</span>
      <span class="prod-cost">$${cost}B · ${days}d</span>
    </button>`;
  }

  _ecoStat(label, value, cls) {
    return `<div class="eco-stat-row"><span class="eco-label">${label}</span><span class="eco-value ${cls}">${value}</span></div>`;
  }

  _ecoBar(label, value, max, color) {
    const pct = Math.min(100, (value / max) * 100);
    return `
      <div class="eco-bar-row">
        <span class="eco-bar-label">${label}</span>
        <div class="eco-bar-track"><div class="eco-bar-fill ${color}" style="width:${pct}%"></div></div>
        <span class="eco-bar-value">${typeof value === "number" ? value.toFixed(value < 10 ? 1 : 0) : value}</span>
      </div>
    `;
  }

  _renderComparisonBars(engine, playerCode, targetCode) {
    const playerForces = engine._getAggregatedForces(playerCode);
    const targetForces = engine.forces[targetCode];

    const categories = [
      { label: "Troops",   pVal: playerForces.activeMilitary, tVal: targetForces.activeMilitary },
      { label: "Tanks",    pVal: playerForces.tanks,          tVal: targetForces.tanks },
      { label: "Aircraft", pVal: playerForces.aircraft,       tVal: targetForces.aircraft },
      { label: "Fighters", pVal: playerForces.fighters,       tVal: targetForces.fighters },
      { label: "Naval",    pVal: playerForces.navalVessels,   tVal: (targetForces.navalVessels || 0) },
      { label: "Subs",     pVal: playerForces.submarines,     tVal: targetForces.submarines },
      { label: "Nukes",    pVal: playerForces.nuclearWeapons,  tVal: targetForces.nuclearWeapons },
    ];

    return categories.map(cat => {
      const max = Math.max(cat.pVal, cat.tVal, 1);
      const pPct = (cat.pVal / max) * 100;
      const tPct = (cat.tVal / max) * 100;
      return `
        <div class="compare-row">
          <div class="compare-header"><span>${cat.label}</span><span>${formatNumber(cat.pVal)} vs ${formatNumber(cat.tVal)}</span></div>
          <div class="compare-bars">
            <div class="compare-track"><div class="compare-fill blue" style="width:${pPct}%"></div></div>
            <div class="compare-track rtl"><div class="compare-fill red" style="width:${tPct}%"></div></div>
          </div>
        </div>
      `;
    }).join("");
  }

  /* =========== SP2-Style Battle Modal =========== */

  showBattleResult(result) {
    if (!this.els.battleModal || !this.els.battleContent) return;

    const isVictory = result.attackerWins;
    const hasPhases = result.phases && result.phases.length > 0;

    // Enhancement #10: Staggered phase card animations
    let phasesHTML = "";
    if (hasPhases) {
      phasesHTML = `<div class="battle-phases">`;
      result.phases.forEach((phase, idx) => {
        const advClass = phase.attackerAdvantage ? "attacker-adv" : "defender-adv";
        phasesHTML += `
          <div class="battle-phase ${advClass} phase-animate" style="--phase-delay: ${idx * 0.2}s">
            <div class="phase-header">
              <span class="phase-icon phase-icon-bounce">${phase.icon}</span>
              <span class="phase-name">${phase.name}</span>
              <span class="phase-result">${phase.attackerAdvantage ? "✅ Attacker" : "🛡️ Defender"}</span>
            </div>
            <div class="phase-summary">${phase.summary}</div>
            <div class="phase-casualties">
              <span class="cas-attacker">⚔️ <span class="counter-animate" data-target="${Math.round(phase.attackerCasualties * 100)}">0</span>%</span>
              <span class="cas-defender">🛡️ <span class="counter-animate" data-target="${Math.round(phase.defenderCasualties * 100)}">0</span>%</span>
            </div>
          </div>
        `;
      });
      phasesHTML += `</div>`;
    }

    // Terrain and command info
    let battleInfo = "";
    if (result.terrain || result.attackerCommand || result.defenderCommand) {
      battleInfo = `
        <div class="battle-info-bar">
          ${result.terrain ? `<span class="battle-info-tag">${result.terrain.icon || "🗺️"} ${result.terrain.name || "Unknown"}</span>` : ""}
          ${result.attackerCommand ? `<span class="battle-info-tag" style="background:${result.attackerCommand.color || '#3b82f6'}22;color:${result.attackerCommand.color || '#3b82f6'}">${result.attackerCommand.icon || "⚔️"} ${result.attackerCommand.name || ""}</span>` : ""}
          ${result.defenderCommand ? `<span class="battle-info-tag" style="background:${result.defenderCommand.color || '#ef4444'}22;color:${result.defenderCommand.color || '#ef4444'}">${result.defenderCommand.icon || "🛡️"} ${result.defenderCommand.name || ""}</span>` : ""}
        </div>
      `;
    }

    // Morale display with animated bars
    let moraleHTML = "";
    if (result.attackerMorale !== undefined) {
      moraleHTML = `
        <div class="battle-morale morale-animate">
          <div class="morale-side">
            <span>Attacker Morale</span>
            <div class="morale-bar"><div class="morale-fill morale-fill-animate ${result.attackerRouted ? 'routed' : ''}" style="--morale-width:${result.attackerMorale}%"></div></div>
            <span>${result.attackerMorale}% ${result.attackerRouted ? "ROUTED!" : ""}</span>
          </div>
          <div class="morale-side">
            <span>Defender Morale</span>
            <div class="morale-bar"><div class="morale-fill morale-fill-animate ${result.defenderRouted ? 'routed' : ''}" style="--morale-width:${result.defenderMorale}%"></div></div>
            <span>${result.defenderMorale}% ${result.defenderRouted ? "ROUTED!" : ""}</span>
          </div>
        </div>
      `;
    }

    this.els.battleContent.innerHTML = `
      <div class="battle-title ${isVictory ? 'victory' : 'defeat'} title-animate">
        ${isVictory ? "⚔️ VICTORY" : "🛡️ DEFEATED"}
      </div>
      <div class="battle-matchup matchup-animate">
        <div class="battle-side attacker">
          <div class="bs-flag">${result.attackerFlag}</div>
          <div class="bs-name">${result.attackerName}</div>
          <div class="bs-loss">Casualties: <span class="counter-animate" data-target="${result.losses?.attackerPercent || 0}">0</span>%</div>
        </div>
        <div class="battle-vs">VS</div>
        <div class="battle-side defender">
          <div class="bs-flag">${result.defenderFlag}</div>
          <div class="bs-name">${result.defenderName}</div>
          <div class="bs-loss">Casualties: <span class="counter-animate" data-target="${result.losses?.defenderPercent || 0}">0</span>%</div>
        </div>
      </div>
      ${battleInfo}
      ${phasesHTML}
      ${moraleHTML}
      <div class="battle-result result-animate">
        ${isVictory
          ? `<strong>${result.attackerName}</strong> has conquered the territory!`
          : `The attack was <strong>repelled</strong>! The defender holds.`}
      </div>
    `;

    this.els.battleModal.classList.add("visible");

    // Enhancement #10: Animate counter numbers
    this._animateCounters();
  }

  closeBattleModal() {
    this.els.battleModal?.classList.remove("visible");
  }

  /* =========== Nuclear Modal =========== */

  showNukeModal(targetCode, onConfirm) {
    if (!this.els.nukeModal) return;
    const targetName = MILITARY_DATA[targetCode]?.name || targetCode;
    const targetFlag = MILITARY_DATA[targetCode]?.flag || "";
    if (this.els.nukeTargetName) this.els.nukeTargetName.textContent = `${targetFlag} ${targetName}`;
    this.els.nukeModal.classList.add("visible");
    this.els.btnNukeConfirm.onclick = () => { this.closeNukeModal(); onConfirm(); };
  }

  closeNukeModal() { this.els.nukeModal?.classList.remove("visible"); }

  /* =========== Unit Detail Panel =========== */

  showUnitPanel(unit, unitManager, engine) {
    if (!this.els.panelBody || !unit) return;
    this.selectedUnitId = unit.id;

    // Save the unit's owner code so tab switching can render economy/diplomacy for that country
    const ownerCode = unit.owner;
    this.currentInfoCode = ownerCode;
    this._lastRenderArgs = {
      code: ownerCode,
      forces: engine.forces,
      ownership: engine.ownership,
      playerCode: engine.playerCode,
      engine
    };

    // If current tab is not military, render that tab's country content instead
    if (this.currentTab !== "military") {
      this._renderTabContent(ownerCode, engine.forces, engine.ownership, engine.playerCode, engine);
      this._updateActionButtons(ownerCode, engine.forces, engine.ownership, engine.playerCode, engine);
      this.openPanel();
      return;
    }

    const primaryType = unitManager.getPrimaryType(unit);
    const iconData = UNIT_ICONS[primaryType] || UNIT_ICONS.mixed;
    const str = unitManager.getUnitStrength(unit);
    const isPlayer = unit.owner === engine.playerCode;

    let html = `
      <div class="country-header">
        <div class="country-flag">${iconData.emoji}</div>
        <div class="country-name">${iconData.label} Group</div>
        <div class="country-status">
          <span class="status-badge ${isPlayer ? 'player' : 'war'}">${isPlayer ? 'YOUR UNIT' : (MILITARY_DATA[unit.owner]?.name || unit.owner)}</span>
          <span class="status-badge ${unit.status}">${unit.status.toUpperCase()}</span>
        </div>
      </div>
      <div class="unit-detail-section">
        <div class="eco-card">
          <div class="eco-card-title">📋 Composition</div>
          <div class="eco-stats">
    `;

    const compLabels = {
      troops: "🎖️ Troops", tanks: "🛡️ Tanks", aircraft: "✈️ Aircraft",
      artillery: "💥 Artillery", naval: "🚢 Naval", helicopters: "🚁 Helicopters",
      fighters: "🔥 Fighters"
    };

    for (const [type, count] of Object.entries(unit.composition)) {
      if (count > 0) html += this._ecoStat(compLabels[type] || type, formatNumber(count), "");
    }

    html += `
          </div>
        </div>
        <div class="eco-card">
          <div class="eco-card-title">⚔️ Combat Strength</div>
          <div class="eco-pop">${formatNumber(Math.round(str))}</div>
        </div>
        <div class="eco-card">
          <div class="eco-card-title">📍 Location</div>
          <div class="eco-stats">
            ${this._ecoStat("Position", `${unit.lat.toFixed(1)}°, ${unit.lng.toFixed(1)}°`, "")}
            ${unit.locationName ? this._ecoStat("Near", unit.locationName, "") : ""}
          </div>
        </div>
    `;

    // Unit Designer info (tech level and design)
    if (isPlayer && engine.unitDesigner) {
      const techLevel = engine.unitDesigner.getMaxTechLevel(engine.playerCode);
      html += `
        <div class="eco-card">
          <div class="eco-card-title">🔬 Unit Design (Tech Level ${techLevel})</div>
          <div class="eco-stats">
            ${this._ecoStat("Tech Level", `Level ${techLevel}/5`, "")}
            ${this._ecoStat("Research", engine.economySystem.getResearchProgress(engine.playerCode) > 0.5 ? "Active" : "Moderate", "")}
          </div>
        </div>
      `;
    }

    if (isPlayer) html += this._renderMissileInventory(engine);
    html += '</div>';

    if (isPlayer) {
      html += this._renderUnitProduction(engine);
      html += this._renderMissileProduction(engine);
    }

    if (isPlayer) {
      html += `
        <div class="unit-actions-bar">
          <button class="btn btn-fortify-unit" id="btn-fortify-unit">🏗️ Fortify Territory</button>
          <div class="unit-action-hint">💡 Right-click on the map to move this unit</div>
          <div class="unit-action-hint">💡 Ctrl+click a unit marker to select country underneath</div>
        </div>
      `;
    }

    this.els.panelBody.innerHTML = html;

    // Bind buttons
    this.els.panelBody.querySelectorAll("[data-missile-launch]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.missileLaunch;
        if (this._onMissileLaunchRequest) this._onMissileLaunchRequest(type);
      });
    });

    this.els.panelBody.querySelectorAll("[data-missile-produce]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.missileProduce;
        if (this._onMissileProduceRequest) this._onMissileProduceRequest(type);
      });
    });

    this.els.panelBody.querySelectorAll("[data-produce]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.produce;
        if (this._onUnitProduceRequest) this._onUnitProduceRequest(type);
      });
    });

    // Enhancement #7: Fortify from unit panel
    const fortifyBtn = this.els.panelBody.querySelector("#btn-fortify-unit");
    if (fortifyBtn) {
      fortifyBtn.addEventListener("click", () => {
        if (this._onUnitFortifyRequest) this._onUnitFortifyRequest(unit);
      });
    }

    if (this.els.militaryActions) this.els.militaryActions.classList.add("hidden");
    if (this.els.diplomacyActions) this.els.diplomacyActions.classList.add("hidden");
    this.openPanel();
  }

  _renderUnitProduction(engine) {
    const summary = engine.economySystem.getFactionSummary(engine.playerCode, engine._getCountryOwnership());
    const budget = summary.budget;
    const buttons = getUnitProductionRules().map((rule) =>
      this._productionButton(rule.key, rule.uiLabel || rule.label, rule.cost, budget)
    ).join("");

    return `
      <div class="production-section">
        <h3 class="section-title">🏭 Military Production</h3>
        <div class="section-subtitle">Budget: $${budget.toFixed(1)}B available</div>
        <div class="production-grid">
          ${buttons}
        </div>
      </div>
    `;
  }

  _renderMissileInventory(engine) {
    const inv = engine.missileManager.getInventory(engine.playerCode);

    let html = `
      <div class="eco-card missile-card">
        <div class="eco-card-title">🚀 Missile Arsenal</div>
        <div class="missile-grid">
    `;

    for (const [type, data] of Object.entries(MISSILE_TYPES)) {
      const count = inv[type] || 0;
      const canLaunch = count > 0;
      html += `
        <div class="missile-item">
          <div class="missile-header">
            <span class="missile-icon">${data.icon}</span>
            <span class="missile-name">${data.name}</span>
            <span class="missile-count">${count}</span>
          </div>
          <div class="missile-desc">${data.description}</div>
          <button class="missile-launch-btn ${canLaunch ? '' : 'disabled'}" data-missile-launch="${type}" ${canLaunch ? '' : 'disabled'}>
            🎯 Launch
          </button>
        </div>
      `;
    }

    html += '</div></div>';
    return html;
  }

  _renderMissileProduction(engine) {
    const summary = engine.economySystem.getFactionSummary(engine.playerCode, engine._getCountryOwnership());
    const budget = summary.budget;

    let html = `
      <div class="production-section">
        <h3 class="section-title">🚀 Missile Production</h3>
        <div class="production-grid">
    `;

    for (const [type, data] of Object.entries(MISSILE_TYPES)) {
      const buildDays = data.buildDays || 21;
      const disabled = budget < data.cost;
      html += `
        <button class="prod-btn ${disabled ? 'disabled' : ''}" data-missile-produce="${type}" ${disabled ? 'disabled' : ''}>
          <span class="prod-label">${data.icon} ${data.name}</span>
          <span class="prod-cost">$${data.cost}B · ${buildDays}d</span>
        </button>
      `;
    }

    html += '</div></div>';
    return html;
  }

  /* =========== Event Log =========== */

  addLogEntry(entry) {
    if (!this.els.logBody) return;
    const el = document.createElement("div");
    el.className = `log-entry ${entry.type}`;
    el.innerHTML = `<span class="log-turn">[T${entry.turn}]</span> ${entry.message}`;
    this.els.logBody.prepend(el);
    // Batch-remove excess entries to avoid per-element reflow
    const children = this.els.logBody.children;
    if (children.length > 60) {
      while (children.length > 50) this.els.logBody.removeChild(children[children.length - 1]);
    }
  }

  /* =========== Victory Screen =========== */

  showVictory(playerCode, victoryType) {
    if (!this.els.victoryScreen) return;
    const name = MILITARY_DATA[playerCode]?.name || playerCode;
    if (this.els.victoryTitle) {
      this.els.victoryTitle.textContent = victoryType === "economic" ? "💰 Economic Hegemony" : "🏆 World Conquered";
    }
    if (this.els.victorySubtitle) {
      this.els.victorySubtitle.textContent = victoryType === "economic"
        ? `${name} now controls over 50% of the world's GDP.`
        : `${name} has achieved global military dominance.`;
    }
    this.els.victoryScreen.classList.add("visible");
  }

  /* =========== Unit Designer Helpers =========== */

  _udStatBar(label, value, locked) {
    const pct = Math.min(100, value);
    const hue = locked ? 210 : (value < 30 ? 0 : value < 60 ? 40 : 120);
    return `
      <div class="ud-stat-row">
        <span class="ud-stat-label">${label}</span>
        <div class="ud-stat-track">
          <div class="ud-stat-fill" style="width:${pct}%;background:hsl(${hue},60%,${locked ? '25' : '50'}%)"></div>
        </div>
        <span class="ud-stat-val">${locked ? '?' : value}</span>
      </div>`;
  }

  /* =========== Enhancement #10: Counter Animation =========== */

  _animateCounters() {
    const counters = document.querySelectorAll(".counter-animate");
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10) || 0;
      if (target <= 0) { el.textContent = "0"; return; }
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 30);
    });
  }

  /* =========== Enhancement #8: Tutorial System =========== */

  static TUTORIAL_STEPS = [
    {
      target: "#hud-top",
      title: "📊 HUD Bar",
      text: "Your empire stats at a glance — date, territories controlled, military power, GDP, and budget. GDP and Budget update monthly."
    },
    {
      target: "#speed-controls",
      title: "⏱️ Speed Controls",
      text: "Control time flow: Pause (Space), Normal (1), Fast (2-3), Ultra (4), Max (5). Use keyboard shortcuts for quick access."
    },
    {
      target: "#map",
      title: "🗺️ World Map",
      text: "Click countries to view their details. Zoom in (level 4+) to see individual states/territories. Blue = yours, Red = enemy. Click territories to build infrastructure."
    },
    {
      target: "#side-panel",
      title: "🏗️ Territory Facilities (SR2030)",
      text: "Zoom into your country and click a territory to build: Factories (boost manufacturing), Mines (boost minerals), Farms (boost food), Oil Derricks (boost energy), and Military Bases (reduce upkeep)."
    },
    {
      target: "#side-panel",
      title: "💰 Economy Tab",
      text: "Click ECONOMY tab to manage: Tax rates (Income, Corporate, Tariffs), budget allocation (Military, Education, Healthcare, Infrastructure, Research), and view resource production vs consumption with surplus/deficit indicators."
    },
    {
      target: "#side-panel",
      title: "🏛️ Government & Policies",
      text: "In the DIPLOMACY tab, change your government type (Democracy, Communist, Authoritarian, etc.) and toggle 8 policies like Conscription, Free Press, and Open Borders. Each affects GDP, stability, tax revenue, and military strength."
    },
    {
      target: ".unit-marker-container-3d",
      title: "⭐ Military Units",
      text: "Click unit markers to inspect troops. Right-click map to move units. Press 'T' for unit templates, 'R' for research tree. Build troops in the Military tab."
    },
    {
      target: "#side-panel",
      title: "🤝 Diplomacy Tab",
      text: "Manage relations: Improve Relations, Denounce enemies, propose Trade Deals, impose Sanctions, or Declare War. Each costs action points that regenerate monthly."
    },
    {
      target: "#btn-attack",
      title: "⚔️ Combat",
      text: "Select an enemy territory, then click ATTACK to launch multi-phase battles (Air, Naval, Ground). Choose your Command Style: Frontal Assault, Flanking Maneuver, Defensive Siege, or Blitzkrieg."
    },
    {
      target: "#event-log",
      title: "📋 Event Log",
      text: "Track all events — battles, diplomacy, AI actions, facility completions, and policy changes. Color-coded by type."
    },
    {
      target: "#hud-top",
      title: "🏆 Victory Conditions",
      text: "Win by controlling 60%+ of world territories (Domination), 50%+ of world GDP (Economic), or negotiating a UN resolution (Diplomatic). Good luck, Commander!"
    }
  ];

  showTutorial() {
    if (localStorage.getItem("wc_tutorial_seen") === "true") return;
    if (!this.els.tutorialOverlay) return;

    this._tutorialStep = 0;
    this.els.tutorialOverlay.classList.remove("hidden");
    this._renderTutorialStep();
  }

  _renderTutorialStep() {
    const steps = GameUI.TUTORIAL_STEPS;
    const step = steps[this._tutorialStep];
    if (!step) { this.closeTutorial(); return; }

    // Step indicators
    if (this.els.tutorialSteps) {
      this.els.tutorialSteps.innerHTML = steps.map((_, i) =>
        `<div class="tutorial-dot ${i === this._tutorialStep ? 'active' : ''} ${i < this._tutorialStep ? 'done' : ''}"></div>`
      ).join("");
    }

    // Content
    if (this.els.tutorialContent) {
      this.els.tutorialContent.innerHTML = `
        <div class="tutorial-title">${step.title}</div>
        <div class="tutorial-text">${step.text}</div>
        <div class="tutorial-counter">Step ${this._tutorialStep + 1} of ${steps.length}</div>
      `;
    }

    // Button text
    if (this.els.btnTutorialNext) {
      this.els.btnTutorialNext.textContent = this._tutorialStep === steps.length - 1 ? "Got it! ✓" : "Next →";
    }

    // Spotlight target element
    const targetEl = document.querySelector(step.target);
    if (targetEl && this.els.tutorialCard) {
      const rect = targetEl.getBoundingClientRect();
      const spotlight = document.getElementById("tutorial-spotlight");
      if (spotlight) {
        spotlight.style.top = `${rect.top - 4}px`;
        spotlight.style.left = `${rect.left - 4}px`;
        spotlight.style.width = `${rect.width + 8}px`;
        spotlight.style.height = `${rect.height + 8}px`;
        spotlight.style.display = "block";
      }
      // Position card near spot
      const cardTop = rect.bottom + 16;
      const cardLeft = Math.min(Math.max(16, rect.left), window.innerWidth - 380);
      this.els.tutorialCard.style.top = `${Math.min(cardTop, window.innerHeight - 200)}px`;
      this.els.tutorialCard.style.left = `${cardLeft}px`;
    }
  }

  _advanceTutorial() {
    this._tutorialStep++;
    if (this._tutorialStep >= GameUI.TUTORIAL_STEPS.length) {
      this.closeTutorial();
    } else {
      this._renderTutorialStep();
    }
  }

  closeTutorial() {
    if (this.els.tutorialOverlay) this.els.tutorialOverlay.classList.add("hidden");
    localStorage.setItem("wc_tutorial_seen", "true");
  }

  /* =========== Enhancement #9: Production Queue Widget =========== */

  updateProductionQueue(queue, clock) {
    if (!this.els.productionQueue || !this.els.pqBody) return;

    if (!queue || queue.length === 0) {
      this.els.productionQueue.classList.add("hidden");
      return;
    }

    this.els.productionQueue.classList.remove("hidden");
    const totalDays = clock?.totalDays || 0;

    // Update existing items in-place instead of rebuilding innerHTML every tick
    const items = queue.slice(0, 6);
    const existing = this.els.pqBody.children;

    // Rebuild only if item count changed
    if (existing.length !== items.length) {
      this.els.pqBody.innerHTML = items.map(order => {
        const icon = order.category === "missile" ? "🚀" : "🎖️";
        return `
          <div class="pq-item">
            <div class="pq-item-info">
              <span class="pq-item-icon">${icon}</span>
              <span class="pq-item-name">${order.label || order.type}</span>
              <span class="pq-item-time"></span>
            </div>
            <div class="pq-item-bar"><div class="pq-item-fill"></div></div>
          </div>
        `;
      }).join("");
    }

    // Update progress values in-place (avoids full re-parse)
    for (let i = 0; i < items.length && i < this.els.pqBody.children.length; i++) {
      const order = items[i];
      const el = this.els.pqBody.children[i];
      const elapsed = totalDays - order.startDay;
      const pct = Math.min(100, Math.round((elapsed / order.durationDays) * 100));
      const daysLeft = Math.max(0, order.durationDays - elapsed);
      const timeEl = el.querySelector(".pq-item-time");
      const fillEl = el.querySelector(".pq-item-fill");
      if (timeEl) timeEl.textContent = `${daysLeft}d`;
      if (fillEl) fillEl.style.width = `${pct}%`;
    }
  }

  /* =========== Enhancement #1: Command Selector Modal =========== */

  showCommandSelector(targetName, targetFlag, onSelect) {
    if (!this.els.commandModal || !this.els.commandGrid) return;

    if (this.els.commandTargetInfo) {
      this.els.commandTargetInfo.innerHTML = `Attacking <strong>${targetFlag} ${targetName}</strong>`;
    }

    this.els.commandGrid.innerHTML = "";
    for (const [key, cmd] of Object.entries(BATTLE_COMMANDS)) {
      const card = document.createElement("div");
      card.className = "command-card";
      card.style.setProperty("--cmd-color", cmd.color);
      card.innerHTML = `
        <div class="cmd-icon">${cmd.icon}</div>
        <div class="cmd-name">${cmd.name}</div>
        <div class="cmd-desc">${cmd.description}</div>
        <div class="cmd-mods">
          <span class="cmd-mod">⚔️ ${(cmd.attackMod * 100).toFixed(0)}%</span>
          <span class="cmd-mod">🛡️ ${(cmd.defenseMod * 100).toFixed(0)}%</span>
        </div>
      `;
      card.addEventListener("click", () => {
        this.closeCommandSelector();
        onSelect(key);
      });
      this.els.commandGrid.appendChild(card);
    }

    this.els.commandModal.classList.add("visible");
  }

  closeCommandSelector() {
    this.els.commandModal?.classList.remove("visible");
  }

  /* =========== Enhancement #13: Research Tree Modal =========== */

  showResearchModal(engine) {
    if (!this.els.researchModal || !this.els.researchBranches) return;

    const playerCode = engine.playerCode;
    const state = engine.researchTree.getResearchState(playerCode);
    const available = engine.researchTree.getAvailableNodes(playerCode);
    const active = engine.researchTree.getProgress(playerCode);

    const branchMeta = {
      military:  { icon: "⚔️", name: "Military", color: "#ef4444" },
      aerospace: { icon: "✈️", name: "Aerospace", color: "#3b82f6" },
      naval:     { icon: "⚓", name: "Naval", color: "#06b6d4" },
      cyber:     { icon: "💻", name: "Cyber", color: "#8b5cf6" }
    };

    let html = "";
    for (const [branchKey, meta] of Object.entries(branchMeta)) {
      const nodes = ResearchTree.NODES[branchKey] || [];
      const branchState = state?.[branchKey];

      html += `<div class="rt-branch" style="--branch-color: ${meta.color}">
        <div class="rt-branch-header">
          <span class="rt-branch-icon">${meta.icon}</span>
          <span class="rt-branch-name">${meta.name}</span>
          <span class="rt-branch-level">Lv ${branchState?.level || 1}</span>
        </div>
        <div class="rt-nodes">`;

      for (const node of nodes) {
        const researched = branchState?.nodes?.has(node.id);
        const isAvailable = available.some(a => a.id === node.id);
        const isActive = active?.nodeId === node.id;
        const statusClass = researched ? "researched" : isActive ? "active" : isAvailable ? "available" : "locked";

        html += `<div class="rt-node ${statusClass}" data-branch="${branchKey}" data-node="${node.id}" style="--node-tier: ${node.tier}">
          <div class="rt-node-icon">${node.icon}</div>
          <div class="rt-node-name">${node.name}</div>
          <div class="rt-node-tier">T${node.tier}</div>
          ${researched ? '<div class="rt-node-check">✓</div>' : ''}
          ${isActive ? `<div class="rt-node-progress">⏳ ${node.duration}d</div>` : ''}
        </div>`;
      }

      html += `</div></div>`;
    }

    this.els.researchBranches.innerHTML = html;

    // Active research display
    if (active) {
      const elapsed = engine.clock.totalDays - active.startDay;
      const pct = Math.min(100, Math.round((elapsed / active.durationDays) * 100));
      this.els.researchActive.innerHTML = `
        <div class="rt-active-card">
          <span class="rt-active-label">🔬 Researching:</span>
          <span class="rt-active-name">${active.nodeName}</span>
          <div class="rt-active-bar"><div class="rt-active-fill" style="width:${pct}%"></div></div>
          <span class="rt-active-pct">${pct}% (${active.durationDays - elapsed}d remaining)</span>
        </div>`;
    } else {
      this.els.researchActive.innerHTML = '<div class="rt-active-card"><span class="rt-active-label">No active research — click an available node to begin.</span></div>';
    }

    // Click handling for available nodes
    this.els.researchBranches.querySelectorAll(".rt-node.available").forEach(nodeEl => {
      nodeEl.addEventListener("click", () => {
        const branch = nodeEl.dataset.branch;
        const nodeId = nodeEl.dataset.node;
        engine.researchTree.startResearch(playerCode, branch, nodeId, engine.clock.totalDays);
        this.showResearchModal(engine); // Re-render
      });
    });

    this.els.researchModal.classList.remove("hidden");
  }

  closeResearchModal() {
    this.els.researchModal?.classList.add("hidden");
  }

  /* =========== Enhancement #12: Unit Templates Modal =========== */

  showTemplatesModal(engine, onApply) {
    if (!this.els.templatesModal || !this.els.templatesGrid) return;

    const TEMPLATES = [
      { name: "Blitzkrieg", icon: "⚡", desc: "Fast armor strike force", composition: { armor: 40, mech_infantry: 30, recon: 15, sp_aa: 15 } },
      { name: "Fortress",   icon: "🏰", desc: "Deep defense formation",  composition: { infantry: 40, mobile_artillery: 25, sp_aa: 20, mlrs: 15 } },
      { name: "Airborne",   icon: "🪂", desc: "Rapid deployment strike",    composition: { special_forces: 35, attack_heli: 30, transport_heli: 20, fighter: 15 } },
      { name: "Naval Task Force", icon: "🚢", desc: "Carrier battle group",  composition: { carrier: 20, destroyer: 30, submarine: 25, missile_cruiser: 25 } },
      { name: "Guerrilla",  icon: "🌿", desc: "Asymmetric warfare",       composition: { infantry: 35, special_forces: 30, recon: 20, drone: 15 } },
      { name: "Superpower",  icon: "👑", desc: "Full spectrum dominance",   composition: { armor: 20, fighter: 20, bomber: 15, carrier: 10, missile_cruiser: 10, infantry: 15, special_forces: 10 } }
    ];

    let html = "";
    for (const tpl of TEMPLATES) {
      const compList = Object.entries(tpl.composition).map(([type, pct]) => {
        const def = UNIT_TYPE_DEFS?.[type];
        return `<span class="tpl-unit">${def?.name || type}: ${pct}%</span>`;
      }).join(", ");

      html += `<div class="tpl-card" data-template="${tpl.name}">
        <div class="tpl-icon">${tpl.icon}</div>
        <div class="tpl-name">${tpl.name}</div>
        <div class="tpl-desc">${tpl.desc}</div>
        <div class="tpl-comp">${compList}</div>
        <button class="btn-tpl-apply">Apply Template</button>
      </div>`;
    }

    this.els.templatesGrid.innerHTML = html;

    // Wire apply buttons
    this.els.templatesGrid.querySelectorAll(".btn-tpl-apply").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".tpl-card");
        const tplName = card?.dataset.template;
        const tpl = TEMPLATES.find(t => t.name === tplName);
        if (tpl && onApply) {
          onApply(tpl);
          this.closeTemplatesModal();
        }
      });
    });

    this.els.templatesModal.classList.remove("hidden");
  }

  closeTemplatesModal() {
    this.els.templatesModal?.classList.add("hidden");
  }

  /* =========== Enhancement #19: Peace Treaty Modal =========== */

  showPeaceTreatyModal(targetCode, engine) {
    if (!this.els.peaceTreatyModal) return;

    const targetName = MILITARY_DATA[targetCode]?.name || targetCode;
    this.els.treatyTargetName.textContent = `Negotiating with ${targetName}`;
    this.els.treatyTerritory.checked = false;
    this.els.treatyReparations.value = 0;
    this.els.treatyRepValue.textContent = "$0B";
    this.els.treatyDmz.checked = false;

    // Live update reparations display
    this.els.treatyReparations.oninput = () => {
      this.els.treatyRepValue.textContent = `$${this.els.treatyReparations.value}B`;
    };

    // Wire negotiate button
    this.els.btnTreatyNegotiate.onclick = () => {
      const terms = {
        territory: this.els.treatyTerritory.checked ? engine.getPlayerTerritories(targetCode).slice(0, 2).map(t => t.id) : [],
        reparations: parseInt(this.els.treatyReparations.value, 10),
        dmz: this.els.treatyDmz.checked
      };
      engine.proposePeaceTreaty(targetCode, terms);
      this.closePeaceTreatyModal();
    };

    this.els.peaceTreatyModal.classList.remove("hidden");
  }

  closePeaceTreatyModal() {
    this.els.peaceTreatyModal?.classList.add("hidden");
  }
}
