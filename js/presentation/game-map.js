/* ============================================================
   WORLD CONQUEST — Map Module
   Leaflet.js setup with GeoJSON country rendering
   ============================================================ */

class GameMap {
  constructor(mapElementId) {
    this.mapElementId = mapElementId;
    this.map = null;
    this.geoLayer = null;
    this.countryLayers = {};  // code → Leaflet layer
    this.selectedCode = null;

    // Unit markers
    this.unitMarkers = {};    // unitId → Leaflet marker
    this.selectedUnitId = null;
    this.unitMarkerLayer = null; // L.layerGroup
    this.missileLayer = null;    // SVG overlay for missile trails

    // Territory markers
    this.territoryMarkerLayer = null;  // L.layerGroup
    this.territoryMarkers = {};        // territoryId → Leaflet circleMarker
    this.selectedTerritoryId = null;
    this.selectedTerritoryRing = null; // pulsing ring marker

    // Callbacks
    this.onCountryClick = null;
    this.onCountryHover = null;
    this.onUnitClick = null;      // (unitId) => void
    this.onMapRightClick = null;  // (latlng) => void
    this.onMissileTargetClick = null; // (latlng) => void
    this.onTerritoryClick = null;     // (territoryId, countryCode) => void

    // Modes
    this.missileTargetMode = false; // When true, next click sets missile target
  }

  /**
   * Initialize the Leaflet map
   */
  init() {
    this.map = L.map(this.mapElementId, {
      center: [25, 10],
      zoom: 3,
      minZoom: 2,
      maxZoom: 7,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true
    });

    // Dark CartoDB basemap — no labels for clean look
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: "abcd",
      maxZoom: 19,
      className: "map-tiles-base"
    }).addTo(this.map);

    // Labels layer on top (cities, regions)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
      pane: "shadowPane" // render above polygons but below markers
    }).addTo(this.map);

    // Move zoom control to bottom-right
    this.map.zoomControl.setPosition("bottomright");

    // Custom pane for territory markers — z-index above overlayPane (400)
    // so country polygon bringToFront() can never cover them
    this.map.createPane("territoryPane");
    this.map.getPane("territoryPane").style.zIndex = 450;

    // Create layer group for unit markers (renders above country polygons)
    this.unitMarkerLayer = L.layerGroup().addTo(this.map);

    // Create layer group for territory markers (rendered in the custom territoryPane)
    this.territoryMarkerLayer = L.layerGroup().addTo(this.map);

    // Zoom-dependent territory marker visibility — show at zoom >= 3
    this.map.on("zoomend", () => {
      const zoom = this.map.getZoom();
      if (zoom >= 3 && !this.map.hasLayer(this.territoryMarkerLayer)) {
        this.map.addLayer(this.territoryMarkerLayer);
      } else if (zoom < 3 && this.map.hasLayer(this.territoryMarkerLayer)) {
        this.map.removeLayer(this.territoryMarkerLayer);
      }

      // Scale territory marker sizes with zoom
      this._scaleTerritoryMarkers(zoom);
    });
    // Start hidden at default zoom
    if (this.map.getZoom() < 3) {
      this.map.removeLayer(this.territoryMarkerLayer);
    }

    // Right-click handler for unit movement
    this.map.on("contextmenu", (e) => {
      e.originalEvent.preventDefault();
      if (this.onMapRightClick) this.onMapRightClick(e.latlng);
    });

    // Click handler for missile targeting mode
    this.map.on("click", (e) => {
      if (this.missileTargetMode && this.onMissileTargetClick) {
        this.missileTargetMode = false;
        document.getElementById("map").classList.remove("missile-target-mode");
        this.onMissileTargetClick(e.latlng);
      }
    });
  }

  /**
   * Load GeoJSON country data and render polygons
   */
  async loadCountries() {
    const GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

    try {
      const resp = await fetch(GEOJSON_URL);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const geojson = await resp.json();
      this._renderGeoJSON(geojson);
    } catch (err) {
      console.error("GeoJSON fetch failed, trying fallback...", err);
      // Try a simpler/smaller fallback
      try {
        const resp2 = await fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json");
        if (!resp2.ok) throw new Error(`Fallback HTTP ${resp2.status}`);
        const geojson2 = await resp2.json();
        this._renderGeoJSON(geojson2);
      } catch (err2) {
        console.error("All GeoJSON sources failed", err2);
        throw new Error("Could not load country borders. Please check your internet connection.");
      }
    }
  }

  _renderGeoJSON(geojson) {
    this.geoLayer = L.geoJSON(geojson, {
      style: (feature) => this._getStyle(feature),
      onEachFeature: (feature, layer) => this._bindFeature(feature, layer)
    }).addTo(this.map);
  }

  /**
   * Get the ISO A3 code from a GeoJSON feature
   */
  _getCode(feature) {
    const props = feature.properties || {};
    // Different GeoJSON sources use different property names
    // The primary dataset (datasets/geo-countries) uses "ISO3166-1-Alpha-3"
    // Fallback (johan/world.geo.json) uses feature.id
    const code = props["ISO3166-1-Alpha-3"] || props.ISO_A3 || props.iso_a3 || props.ISO3 || props.ADM0_A3 || props.id || feature.id || null;
    return code;
  }

  /**
   * Default style for a country polygon
   */
  _getStyle(feature) {
    const code = this._getCode(feature);
    const hasMilData = code && MILITARY_DATA[code];

    return {
      fillColor: hasMilData ? "rgba(100, 150, 200, 0.22)" : "rgba(60, 80, 100, 0.10)",
      fillOpacity: 1,
      weight: hasMilData ? 1.5 : 0.6,
      color: hasMilData ? "rgba(120, 180, 240, 0.45)" : "rgba(80, 100, 120, 0.15)",
      opacity: 1
    };
  }

  /**
   * Bind hover/click events to a feature
   */
  _bindFeature(feature, layer) {
    const code = this._getCode(feature);
    if (!code) return;

    // Store reference
    this.countryLayers[code] = layer;

    // Tooltip
    const name = (MILITARY_DATA[code]?.name) ||
                 feature.properties?.ADMIN ||
                 feature.properties?.name ||
                 code;

    const powerStr = MILITARY_DATA[code]
      ? ` | Power: ${MILITARY_DATA[code].powerIndex}`
      : "";

    layer.bindTooltip(`${MILITARY_DATA[code]?.flag || ""} ${name}${powerStr}`, {
      className: "country-tooltip",
      sticky: true,
      direction: "top",
      offset: [0, -10]
    });

    // Hover
    layer.on("mouseover", () => {
      if (code !== this.selectedCode) {
        layer.setStyle({
          fillColor: "rgba(200, 220, 255, 0.28)",
          weight: 2.5,
          color: "rgba(200, 220, 255, 0.65)"
        });
      }
      if (this.onCountryHover) this.onCountryHover(code, true);
    });

    layer.on("mouseout", () => {
      if (code !== this.selectedCode) {
        this._resetCountryStyle(code);
      }
      if (this.onCountryHover) this.onCountryHover(code, false);
    });

    // Click — fires for country polygon
    layer.on("click", (e) => {
      this.selectCountry(code);
      
      // At higher zoom levels, resolve click to the nearest territory within this country
      const zoom = this.map.getZoom();
      const territories = TERRITORY_DATA[code];
      if (zoom >= 4 && territories && territories.length > 0 && this.onTerritoryClick) {
        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;
        let closestT = null;
        let closestDist = Infinity;
        for (const t of territories) {
          const d = Math.sqrt((t.lat - clickLat) ** 2 + (t.lng - clickLng) ** 2);
          if (d < closestDist) { closestDist = d; closestT = t; }
        }
        if (closestT) {
          this.selectTerritory(closestT.id, closestT.lat, closestT.lng);
          this.onTerritoryClick(closestT.id, code);
          return;
        }
      }
      
      if (this.onCountryClick) this.onCountryClick(code);
    });
  }

  /**
   * Select a country visually
   */
  selectCountry(code) {
    // Deselect previous
    if (this.selectedCode && this.countryLayers[this.selectedCode]) {
      this._resetCountryStyle(this.selectedCode);
    }

    this.selectedCode = code;

    if (this.countryLayers[code]) {
      this.countryLayers[code].setStyle({
        fillColor: "rgba(59, 130, 246, 0.45)",
        weight: 3,
        color: "rgba(100, 180, 255, 0.85)"
      });
      this.countryLayers[code].bringToFront();
    }
  }

  /**
   * Update all country colors based on territory ownership.
   * ownership is keyed by territory ID (e.g. "USA-CA"), not country code.
   * We compute the majority owner per country polygon for coloring.
   */
  updateOwnership(ownership, playerCode, alliances) {
    // Build per-country majority owner from territory ownership
    const countryOwners = {};
    for (const code of Object.keys(this.countryLayers)) {
      const territories = TERRITORY_DATA[code];
      if (territories && territories.length > 0) {
        const ownerCounts = {};
        for (const t of territories) {
          const owner = ownership[t.id] || code;
          ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
        }
        let maxOwner = code, maxCount = 0;
        for (const [o, c] of Object.entries(ownerCounts)) {
          if (c > maxCount) { maxCount = c; maxOwner = o; }
        }
        countryOwners[code] = { owner: maxOwner, contested: Object.keys(ownerCounts).length > 1 };
      } else {
        // Fallback: if the country code itself is in ownership (virtual territory)
        countryOwners[code] = { owner: ownership[code] || code, contested: false };
      }
    }

    for (const [code, layer] of Object.entries(this.countryLayers)) {
      const { owner, contested } = countryOwners[code] || { owner: code, contested: false };

      if (code === this.selectedCode) {
        let fill, borderColor;
        if (owner === playerCode) {
          fill = contested ? "rgba(59, 130, 246, 0.40)" : "rgba(59, 130, 246, 0.50)";
          borderColor = "rgba(100, 180, 255, 0.85)";
        } else if (alliances && alliances.has(this._allianceKey(playerCode, owner))) {
          fill = "rgba(139, 92, 246, 0.45)";
          borderColor = "rgba(160, 120, 255, 0.85)";
        } else if (owner && owner !== code) {
          fill = "rgba(239, 68, 68, 0.40)";
          borderColor = "rgba(255, 100, 100, 0.85)";
        } else {
          fill = "rgba(59, 130, 246, 0.40)";
          borderColor = "rgba(100, 180, 255, 0.85)";
        }
        layer.setStyle({ fillColor: fill, color: borderColor, weight: 3 });
        continue;
      }

      if (owner === playerCode) {
        layer.setStyle({
          fillColor: contested ? "rgba(59, 130, 246, 0.30)" : "rgba(59, 130, 246, 0.40)",
          weight: 1.8,
          color: "rgba(80, 160, 255, 0.70)"
        });
      } else if (alliances && alliances.has(this._allianceKey(playerCode, owner))) {
        layer.setStyle({
          fillColor: "rgba(139, 92, 246, 0.30)",
          weight: 1.5,
          color: "rgba(160, 120, 255, 0.60)"
        });
      } else if (owner && owner !== code) {
        layer.setStyle({
          fillColor: contested ? "rgba(239, 68, 68, 0.22)" : "rgba(239, 68, 68, 0.32)",
          weight: 1.2,
          color: "rgba(255, 80, 80, 0.55)"
        });
      } else {
        this._resetCountryStyle(code);
      }
    }
  }

  _resetCountryStyle(code) {
    const layer = this.countryLayers[code];
    if (!layer) return;
    const hasMilData = MILITARY_DATA[code];
    layer.setStyle({
      fillColor: hasMilData ? "rgba(100, 150, 200, 0.22)" : "rgba(60, 80, 100, 0.10)",
      weight: hasMilData ? 1.5 : 0.6,
      color: hasMilData ? "rgba(120, 180, 240, 0.45)" : "rgba(80, 100, 120, 0.15)"
    });
  }

  _allianceKey(a, b) {
    return [a, b].sort().join("-");
  }

  /* =========== Territory Markers =========== */

  /**
   * Create territory markers for all countries. Call once after game init.
   */
  renderTerritoryMarkers(ownership, playerCode, alliances) {
    this.territoryMarkerLayer.clearLayers();
    this.territoryMarkers = {};

    for (const [countryCode, territories] of Object.entries(TERRITORY_DATA)) {
      if (!territories || territories.length === 0) continue;

      for (const t of territories) {
        const owner = ownership[t.id] || countryCode;
        const color = this._getTerritoryColor(owner, countryCode, playerCode, alliances);
        const baseRadius = 6;

        const marker = L.circleMarker([t.lat, t.lng], {
          radius: baseRadius,
          fillColor: color,
          fillOpacity: 0.9,
          color: "rgba(255,255,255,0.3)",
          weight: 1.5,
          pane: "territoryPane",
          className: "territory-marker"
        });

        // Tooltip with state/territory name
        const ownerName = MILITARY_DATA[owner]?.name || owner;
        const ownerFlag = MILITARY_DATA[owner]?.flag || "";
        marker.bindTooltip(
          `<strong>${t.name}</strong><br>${ownerFlag} ${ownerName}<br><em>${(t.pop * 100).toFixed(1)}% of ${MILITARY_DATA[countryCode]?.name || countryCode}</em>`,
          { className: "territory-tooltip", direction: "top", offset: [0, -8] }
        );

        // Click handler — opens side panel and changes color
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          this.selectTerritory(t.id, t.lat, t.lng);
          // Also visually select the parent country polygon
          this.selectCountry(countryCode);
          if (this.onTerritoryClick) this.onTerritoryClick(t.id, countryCode);
        });

        // Hover effects — enlarge and brighten on hover
        marker.on("mouseover", () => {
          if (t.id !== this.selectedTerritoryId) {
            marker.setStyle({
              radius: baseRadius + 3,
              fillOpacity: 1,
              weight: 2.5,
              color: "rgba(6, 182, 212, 0.8)"
            });
          }
        });
        marker.on("mouseout", () => {
          if (t.id !== this.selectedTerritoryId) {
            marker.setStyle({
              radius: baseRadius,
              fillOpacity: 0.9,
              weight: 1.5,
              color: "rgba(255,255,255,0.3)"
            });
          }
        });

        this.territoryMarkerLayer.addLayer(marker);
        this.territoryMarkers[t.id] = marker;
      }
    }
  }

  /**
   * Update territory marker colors without recreating them.
   */
  updateTerritoryMarkers(ownership, playerCode, alliances) {
    for (const [countryCode, territories] of Object.entries(TERRITORY_DATA)) {
      if (!territories) continue;
      for (const t of territories) {
        const marker = this.territoryMarkers[t.id];
        if (!marker) continue;
        const owner = ownership[t.id] || countryCode;
        const color = this._getTerritoryColor(owner, countryCode, playerCode, alliances);
        marker.setStyle({ fillColor: color });
      }
    }
  }

  /**
   * Select a territory and show a pulsing ring around it.
   */
  selectTerritory(territoryId, lat, lng) {
    // Remove previous selection ring
    if (this.selectedTerritoryRing) {
      this.territoryMarkerLayer.removeLayer(this.selectedTerritoryRing);
      this.selectedTerritoryRing = null;
    }

    // Reset previous marker style back to normal
    if (this.selectedTerritoryId && this.territoryMarkers[this.selectedTerritoryId]) {
      this.territoryMarkers[this.selectedTerritoryId].setStyle({
        radius: 6, fillOpacity: 0.9, weight: 1.5, color: "rgba(255,255,255,0.3)"
      });
    }

    this.selectedTerritoryId = territoryId;

    // Highlight new marker — bright cyan with glow
    const marker = this.territoryMarkers[territoryId];
    if (marker) {
      marker.setStyle({
        radius: 10,
        fillColor: "#06b6d4",  // Bright cyan to clearly show selection
        fillOpacity: 1,
        weight: 3,
        color: "#fff"
      });
      marker.bringToFront();
    }

    // Add pulsing ring around selected territory
    if (lat != null && lng != null) {
      this.selectedTerritoryRing = L.circleMarker([lat, lng], {
        radius: 18,
        fillColor: "transparent",
        fillOpacity: 0,
        color: "rgba(6, 182, 212, 0.9)",
        weight: 2.5,
        pane: "territoryPane",
        className: "territory-select-ring",
        dashArray: "4 4"
      });
      this.territoryMarkerLayer.addLayer(this.selectedTerritoryRing);
    }
  }

  /**
   * Get color for a territory marker based on ownership.
   */
  _getTerritoryColor(owner, originalCountry, playerCode, alliances) {
    if (owner === playerCode) return "#60a5fa"; // Bright blue for player
    if (alliances && alliances.has(this._allianceKey(playerCode, owner))) return "#a78bfa"; // Brighter purple for allies
    if (owner !== originalCountry) return "#f87171"; // Brighter red for conquered by enemy
    return "#cbd5e1"; // Lighter gray for neutral/self-owned — more visible
  }

  /**
   * Scale territory marker sizes based on zoom level.
   */
  _scaleTerritoryMarkers(zoom) {
    const baseRadius = zoom >= 5 ? 8 : zoom >= 4 ? 7 : 6;
    for (const [id, marker] of Object.entries(this.territoryMarkers)) {
      if (id === this.selectedTerritoryId) continue; // Don't resize selected
      marker.setStyle({ radius: baseRadius });
    }
  }

  /**
   * Fly to a country
   */
  flyTo(code) {
    const layer = this.countryLayers[code];
    if (layer) {
      this.map.flyToBounds(layer.getBounds(), { duration: 1.2, padding: [50, 50] });
    }
  }

  /* =========== SVG Icon System (3D-Style Military Silhouettes) =========== */

  static SVG_ICONS = {
    infantry: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 4a4 4 0 100 8 4 4 0 000-8z" fill="currentColor"/><path d="M8 28V18a8 8 0 0116 0v10" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M6 22h20" stroke="currentColor" stroke-width="2"/></svg>`,
    tank: `<svg viewBox="0 0 36 24" fill="none"><rect x="4" y="10" width="28" height="10" rx="3" fill="currentColor" opacity="0.85"/><rect x="8" y="14" width="20" height="6" rx="2" fill="currentColor"/><circle cx="10" cy="22" r="3" fill="currentColor" opacity="0.7"/><circle cx="18" cy="22" r="3" fill="currentColor" opacity="0.7"/><circle cx="26" cy="22" r="3" fill="currentColor" opacity="0.7"/><rect x="18" y="6" width="12" height="4" rx="1" fill="currentColor" opacity="0.9"/><rect x="26" y="3" width="8" height="3" rx="1" fill="currentColor" opacity="0.6"/></svg>`,
    aircraft: `<svg viewBox="0 0 36 36" fill="none"><path d="M18 2L22 14H34L24 20L28 32L18 24L8 32L12 20L2 14H14L18 2Z" fill="currentColor" opacity="0.9"/></svg>`,
    naval: `<svg viewBox="0 0 36 24" fill="none"><path d="M2 16C6 20 12 20 18 18C24 16 30 16 34 20" stroke="currentColor" stroke-width="2" opacity="0.5"/><path d="M6 14L18 6L30 14H6Z" fill="currentColor" opacity="0.85"/><rect x="16" y="2" width="4" height="6" rx="1" fill="currentColor"/><rect x="8" y="14" width="20" height="4" rx="1" fill="currentColor" opacity="0.7"/></svg>`,
    mixed: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 2l4 8H28l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8z" fill="currentColor" opacity="0.9"/></svg>`
  };

  /**
   * Get the SVG icon for a unit type
   */
  _getSvgIcon(primaryType) {
    if (primaryType === 'troops' || primaryType === 'infantry') return GameMap.SVG_ICONS.infantry;
    if (primaryType === 'tanks' || primaryType === 'armor') return GameMap.SVG_ICONS.tank;
    if (primaryType === 'aircraft' || primaryType === 'fighters' || primaryType === 'helicopters') return GameMap.SVG_ICONS.aircraft;
    if (primaryType === 'naval' || primaryType === 'ships') return GameMap.SVG_ICONS.naval;
    return GameMap.SVG_ICONS.mixed;
  }

  /* =========== 3D Unit Marker System (Diff-Based) =========== */

  /**
   * Build a lightweight hash for a unit to detect changes.
   */
  _unitHash(unit, playerCode) {
    const isSelected = unit.id === this.selectedUnitId;
    const totalForce = Object.values(unit.composition).reduce((s, v) => s + v, 0);
    return `${unit.lat.toFixed(2)},${unit.lng.toFixed(2)},${unit.owner},${unit.status},${totalForce},${isSelected}`;
  }

  /**
   * Diff-based render: only add/remove/update markers that changed.
   * Avoids clearing + rebuilding 100+ DOM nodes every 500ms.
   */
  renderUnits(unitManager, playerCode) {
    const currentIds = new Set();

    for (const unit of unitManager.units.values()) {
      currentIds.add(unit.id);
      const newHash = this._unitHash(unit, playerCode);
      const existingHash = this._unitHashes?.[unit.id];

      if (existingHash === newHash && this.unitMarkers[unit.id]) {
        // No change — skip
        continue;
      }

      // Remove old marker if exists
      if (this.unitMarkers[unit.id]) {
        this.unitMarkerLayer.removeLayer(this.unitMarkers[unit.id]);
        delete this.unitMarkers[unit.id];
      }

      // Add new marker
      this._addUnitMarker(unit, unitManager, playerCode);

      // Cache hash
      if (!this._unitHashes) this._unitHashes = {};
      this._unitHashes[unit.id] = newHash;
    }

    // Remove markers for units that no longer exist
    for (const id of Object.keys(this.unitMarkers)) {
      if (!currentIds.has(id)) {
        this.unitMarkerLayer.removeLayer(this.unitMarkers[id]);
        delete this.unitMarkers[id];
        if (this._unitHashes) delete this._unitHashes[id];
      }
    }
  }

  /**
   * Force a full re-render of all units (used after battles/major events).
   */
  forceRenderUnits(unitManager, playerCode) {
    this.unitMarkerLayer.clearLayers();
    this.unitMarkers = {};
    this._unitHashes = {};
    for (const unit of unitManager.units.values()) {
      this._addUnitMarker(unit, unitManager, playerCode);
      this._unitHashes[unit.id] = this._unitHash(unit, playerCode);
    }
  }

  _addUnitMarker(unit, unitManager, playerCode) {
    const primaryType = unitManager.getPrimaryType(unit);
    const svgIcon = this._getSvgIcon(primaryType);
    const sizeLabel = unitManager.getUnitSizeLabel(unit);
    const isPlayer = unit.owner === playerCode;
    const isSelected = unit.id === this.selectedUnitId;

    const color = isPlayer ? "#3b82f6" : "#ef4444";
    const bgAlpha = isSelected ? 0.55 : 0.25;
    const glowSize = isSelected ? 10 : 4;
    const statusClass = unit.status === "moving" ? "moving" : unit.status === "engaged" ? "engaged" : "";

    const html = `
      <div class="unit-marker-3d ${isSelected ? 'selected' : ''} ${isPlayer ? 'player' : 'enemy'} ${statusClass}"
           data-unit-id="${unit.id}">
        <div class="unit-shadow"></div>
        <div class="unit-body" style="
          --unit-color: ${color};
          --bg-alpha: ${bgAlpha};
          --glow-size: ${glowSize}px;
        ">
          <div class="unit-svg-icon" style="color: ${color};">${svgIcon}</div>
          <span class="unit-count-3d">${sizeLabel}</span>
        </div>
        ${isSelected ? '<div class="unit-select-ring"></div>' : ''}
      </div>
    `;

    const icon = L.divIcon({
      html,
      className: "unit-marker-container-3d",
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([unit.lat, unit.lng], {
      icon,
      zIndexOffset: isSelected ? 1000 : (isPlayer ? 500 : 100)
    });

    marker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      // Enhancement #6: Ctrl+click passes through to country polygon
      if (e.originalEvent?.ctrlKey || e.originalEvent?.metaKey) {
        const unitLatLng = L.latLng(unit.lat, unit.lng);
        for (const [code, layer] of Object.entries(this.countryLayers)) {
          if (layer.getBounds && layer.getBounds().contains(unitLatLng)) {
            this.selectCountry(code);
            if (this.onCountryClick) this.onCountryClick(code);
            return;
          }
        }
        return;
      }
      this.selectUnit(unit.id);
      if (this.onUnitClick) this.onUnitClick(unit.id);
    });

    marker.addTo(this.unitMarkerLayer);
    this.unitMarkers[unit.id] = marker;
  }

  selectUnit(unitId) {
    this.selectedUnitId = unitId;
  }

  deselectUnit() {
    this.selectedUnitId = null;
  }

  /* =========== City Rendering (Zoom-Gated) =========== */

  renderCities(ownership, playerCode) {
    if (this.cityLayer) {
      this.cityLayer.clearLayers();
    } else {
      this.cityLayer = L.layerGroup();
    }

    this._cityOwnership = ownership;
    this._cityPlayerCode = playerCode;

    this._buildCityMarkers(ownership, playerCode);

    // Zoom-gate: only show cities at zoom >= 5
    const zoom = this.map.getZoom();
    if (zoom >= 5) {
      if (!this.map.hasLayer(this.cityLayer)) this.map.addLayer(this.cityLayer);
    } else {
      if (this.map.hasLayer(this.cityLayer)) this.map.removeLayer(this.cityLayer);
    }

    // Listen for zoom changes to toggle city visibility
    if (!this._cityZoomBound) {
      this._cityZoomBound = true;
      this.map.on("zoomend", () => {
        const z = this.map.getZoom();
        if (z >= 5 && !this.map.hasLayer(this.cityLayer)) {
          this.map.addLayer(this.cityLayer);
        } else if (z < 5 && this.map.hasLayer(this.cityLayer)) {
          this.map.removeLayer(this.cityLayer);
        }
      });
    }
  }

  _buildCityMarkers(ownership, playerCode) {
    for (const city of WORLD_CITIES) {
      const owner = ownership[city.country];
      const isPlayer = owner === playerCode;

      const popLabel = city.population >= 1000000
        ? `${(city.population / 1000000).toFixed(1)}M`
        : `${Math.round(city.population / 1000)}K`;

      const cityClass = city.isCapital ? "city-capital" : "city-major";
      const starIcon = city.isCapital ? '<div class="capital-star">★</div>' : '';

      const html = `
        <div class="city-marker ${cityClass} ${isPlayer ? 'player' : ''}">
          ${starIcon}
          <div class="city-buildings">
            <div class="building b1"></div>
            <div class="building b2"></div>
            <div class="building b3"></div>
          </div>
          <div class="city-label">${city.name}</div>
          <div class="city-pop">${popLabel}</div>
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: "city-marker-container",
        iconSize: [60, 40],
        iconAnchor: [30, 35]
      });

      const marker = L.marker([city.lat, city.lng], {
        icon,
        zIndexOffset: city.isCapital ? 50 : 10,
        interactive: false
      });

      marker.addTo(this.cityLayer);
    }
  }

  /* =========== Fortification Indicators (Diff-Based) =========== */

  renderFortifications(fortifications, ownership, playerCode) {
    if (!this.fortLayer) {
      this.fortLayer = L.layerGroup().addTo(this.map);
    }
    if (!this._fortMarkers) this._fortMarkers = {};
    if (!this._fortHashes) this._fortHashes = {};

    const activeCodes = new Set();

    for (const [code, level] of Object.entries(fortifications)) {
      if (level <= 0) {
        // Remove if previously existed
        if (this._fortMarkers[code]) {
          this.fortLayer.removeLayer(this._fortMarkers[code]);
          delete this._fortMarkers[code];
          delete this._fortHashes[code];
        }
        continue;
      }

      activeCodes.add(code);
      const coords = CAPITAL_COORDS[code];
      if (!coords) continue;

      const isPlayer = ownership[code] === playerCode;
      const hash = `${level},${isPlayer}`;
      if (this._fortHashes[code] === hash) continue; // No change

      // Remove old marker
      if (this._fortMarkers[code]) {
        this.fortLayer.removeLayer(this._fortMarkers[code]);
      }

      const color = isPlayer ? "#3b82f6" : "#ef4444";
      const html = `
        <div class="fort-indicator fort-level-${level}" style="--fort-color: ${color}">
          <div class="fort-shield">🛡️</div>
          <div class="fort-level">Lv${level}</div>
          ${'<div class="fort-ring"></div>'.repeat(level)}
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: "fort-marker-container",
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([coords.lat + 1.5, coords.lng + 1.5], {
        icon,
        zIndexOffset: 30,
        interactive: false
      });

      marker.addTo(this.fortLayer);
      this._fortMarkers[code] = marker;
      this._fortHashes[code] = hash;
    }

    // Remove markers for forts that no longer exist
    for (const code of Object.keys(this._fortMarkers)) {
      if (!activeCodes.has(code)) {
        this.fortLayer.removeLayer(this._fortMarkers[code]);
        delete this._fortMarkers[code];
        delete this._fortHashes[code];
      }
    }
  }

  /* =========== Unit Movement Animation =========== */

  animateUnitMove(unitId, fromLat, fromLng, toLat, toLng, duration = 800) {
    const marker = this.unitMarkers[unitId];
    if (!marker) return Promise.resolve();

    return new Promise((resolve) => {
      const startTime = performance.now();
      const startLatLng = L.latLng(fromLat, fromLng);
      const endLatLng = L.latLng(toLat, toLng);

      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - (1 - t) ** 3;

        const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * eased;
        const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * eased;
        marker.setLatLng([lat, lng]);

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  /* =========== Missile Animation System =========== */

  enterMissileTargetMode() {
    this.missileTargetMode = true;
    document.getElementById("map").classList.add("missile-target-mode");
  }

  cancelMissileTargetMode() {
    this.missileTargetMode = false;
    document.getElementById("map").classList.remove("missile-target-mode");
  }

  animateMissile(fromLat, fromLng, toLat, toLng, missileType) {
    const typeData = MISSILE_TYPES[missileType] || MISSILE_TYPES.cruise;
    const duration = typeData.speed;

    return new Promise((resolve) => {
      const dist = Math.sqrt((fromLat - toLat) ** 2 + (fromLng - toLng) ** 2);
      const arcHeight = Math.min(20, dist * 0.3);

      const arcPoints = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = fromLat + (toLat - fromLat) * t + Math.sin(t * Math.PI) * arcHeight;
        const lng = fromLng + (toLng - fromLng) * t;
        arcPoints.push([lat, lng]);
      }

      const trail = L.polyline([], {
        color: typeData.color,
        weight: 3,
        opacity: 0.8,
        dashArray: "8 4",
        className: "missile-trail"
      }).addTo(this.map);

      const missileHead = L.circleMarker([fromLat, fromLng], {
        radius: 5,
        color: typeData.color,
        fillColor: typeData.color,
        fillOpacity: 1,
        weight: 0,
        className: "missile-head"
      }).addTo(this.map);

      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const idx = Math.floor(t * steps);

        trail.setLatLngs(arcPoints.slice(0, idx + 1));
        if (arcPoints[idx]) missileHead.setLatLng(arcPoints[idx]);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this._showExplosion(toLat, toLng, typeData);
          setTimeout(() => {
            this.map.removeLayer(trail);
            this.map.removeLayer(missileHead);
          }, 1500);
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  _showExplosion(lat, lng, typeData) {
    const explosion = L.circle([lat, lng], {
      radius: typeData.blastRadius * 50000,
      color: typeData.color,
      fillColor: typeData.color,
      fillOpacity: 0.4,
      weight: 2,
      className: "explosion-circle"
    }).addTo(this.map);

    const el = explosion.getElement();
    if (el) el.classList.add("exploding");

    const ring = L.circle([lat, lng], {
      radius: 10000,
      color: "white",
      fillOpacity: 0,
      weight: 3,
      opacity: 0.7,
      className: "shockwave-ring"
    }).addTo(this.map);

    let ringRadius = 10000;
    const expandRing = setInterval(() => {
      ringRadius += 30000;
      ring.setRadius(ringRadius);
      const el = ring.getElement();
      if (el) {
        const opacity = Math.max(0, 0.7 - (ringRadius / 500000));
        el.style.opacity = String(opacity);
      }
      if (ringRadius > 400000) {
        clearInterval(expandRing);
        this.map.removeLayer(ring);
      }
    }, 50);

    setTimeout(() => {
      this.map.removeLayer(explosion);
    }, 2500);
  }

  /* =========== Enhancement #14: Trade Route Visualization =========== */

  renderTradeRoutes(routes) {
    // Clear existing trade route lines
    if (this._tradeRouteLayer) {
      this.map.removeLayer(this._tradeRouteLayer);
    }
    this._tradeRouteLayer = L.layerGroup().addTo(this.map);

    for (const route of routes) {
      const fromData = MILITARY_DATA[route.from];
      const toData = MILITARY_DATA[route.to];
      if (!fromData || !toData) continue;

      // Use capital coordinates if available, otherwise approximate from territories
      const fromCoords = this._getCountryCenter(route.from);
      const toCoords = this._getCountryCenter(route.to);
      if (!fromCoords || !toCoords) continue;

      const line = L.polyline([fromCoords, toCoords], {
        color: "#10b981",
        weight: 2,
        opacity: 0.5,
        dashArray: "8, 6",
        className: "trade-route-line"
      });

      line.bindTooltip(`📦 ${route.fromName} ↔ ${route.toName}: $${route.volume}B`, {
        className: "trade-tooltip"
      });

      this._tradeRouteLayer.addLayer(line);
    }
  }

  clearTradeRoutes() {
    if (this._tradeRouteLayer) {
      this.map.removeLayer(this._tradeRouteLayer);
      this._tradeRouteLayer = null;
    }
  }

  _getCountryCenter(code) {
    const territories = TERRITORY_DATA[code];
    if (!territories || territories.length === 0) return null;
    // Average lat/lng of all territories
    let lat = 0, lng = 0;
    for (const t of territories) { lat += t.lat; lng += t.lng; }
    return [lat / territories.length, lng / territories.length];
  }

  /* =========== Enhancement #18: Diplomatic Map Overlay =========== */

  setDiplomaticOverlay(dipData) {
    if (!this.geoLayer) return;

    const STATUS_COLORS = {
      player:  "#3b82f6",
      allied:  "#10b981",
      neutral: "#eab308",
      enemy:   "#ef4444"
    };

    this.geoLayer.eachLayer(layer => {
      const code = layer.feature?.properties?.code || layer.feature?.properties?.ISO_A3;
      if (!code) return;
      const info = dipData[code];
      const color = info ? (STATUS_COLORS[info.status] || "#6b7280") : "#374151";

      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.45,
        weight: 1,
        color: "rgba(255,255,255,0.15)"
      });
    });

    this._diplomaticOverlayActive = true;
  }

  clearDiplomaticOverlay(ownership, playerCode) {
    if (!this._diplomaticOverlayActive) return;
    this._diplomaticOverlayActive = false;

    // Restore default ownership colors
    if (this.geoLayer) {
      this.geoLayer.eachLayer(layer => {
        const code = layer.feature?.properties?.code || layer.feature?.properties?.ISO_A3;
        if (!code) return;
        const isPlayer = Object.values(ownership).some(
          ownerId => this._getCountryFromTerritory(ownerId) === code
        ) && code === playerCode;

        layer.setStyle({
          fillColor: isPlayer ? "#3b82f6" : "#1e293b",
          fillOpacity: isPlayer ? 0.35 : 0.2,
          weight: 1,
          color: "rgba(255,255,255,0.08)"
        });
      });
    }
  }

  _getCountryFromTerritory(ownerId) {
    return ownerId; // Owner codes are already country codes
  }
}
