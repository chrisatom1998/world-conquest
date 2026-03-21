/* ============================================================
   WORLD CONQUEST — Research Tree System
   4-branch technology progression with node graph
   ============================================================ */

class ResearchTree {
  constructor() {
    // Current research levels per faction
    this.factionResearch = {};
    // Active research projects: { faction, branch, nodeId, startDay, durationDays }
    this.activeResearch = {};
  }

  init(factionCodes) {
    for (const code of factionCodes) {
      this.factionResearch[code] = {
        military:   { level: 1, nodes: new Set(["mil_1"]) },
        aerospace:  { level: 1, nodes: new Set(["aero_1"]) },
        naval:      { level: 1, nodes: new Set(["nav_1"]) },
        cyber:      { level: 1, nodes: new Set(["cyber_1"]) }
      };
    }
  }

  /** Get research state for a faction */
  getResearchState(factionCode) {
    return this.factionResearch[factionCode] || null;
  }

  /** Check if a faction has researched a specific node */
  hasResearched(factionCode, nodeId) {
    const state = this.factionResearch[factionCode];
    if (!state) return false;
    for (const branch of Object.values(state)) {
      if (branch.nodes.has(nodeId)) return true;
    }
    return false;
  }

  /** Get available research nodes for a faction */
  getAvailableNodes(factionCode) {
    const state = this.factionResearch[factionCode];
    if (!state) return [];

    const available = [];
    for (const [branchKey, branchState] of Object.entries(state)) {
      const branchNodes = ResearchTree.NODES[branchKey] || [];
      for (const node of branchNodes) {
        if (branchState.nodes.has(node.id)) continue; // Already researched
        // Check prerequisites
        const prereqsMet = (node.requires || []).every(req => branchState.nodes.has(req));
        if (prereqsMet) {
          available.push({ ...node, branch: branchKey });
        }
      }
    }
    return available;
  }

  /** Start researching a node */
  startResearch(factionCode, branchKey, nodeId, currentDay) {
    const state = this.factionResearch[factionCode];
    if (!state || !state[branchKey]) return null;

    const node = ResearchTree.NODES[branchKey]?.find(n => n.id === nodeId);
    if (!node) return null;

    // Check already being researched
    if (this.activeResearch[factionCode]) return null;

    // Check prerequisites
    const prereqsMet = (node.requires || []).every(req => state[branchKey].nodes.has(req));
    if (!prereqsMet) return null;

    this.activeResearch[factionCode] = {
      branch: branchKey,
      nodeId,
      startDay: currentDay,
      durationDays: node.duration || 90,
      nodeName: node.name
    };

    return this.activeResearch[factionCode];
  }

  /** Process a day tick — check for completed research */
  processTick(currentDay) {
    const completed = [];
    for (const [faction, research] of Object.entries(this.activeResearch)) {
      if (!research) continue;
      const elapsed = currentDay - research.startDay;
      if (elapsed >= research.durationDays) {
        // Complete the research
        const state = this.factionResearch[faction];
        if (state?.[research.branch]) {
          state[research.branch].nodes.add(research.nodeId);
          state[research.branch].level = state[research.branch].nodes.size;
        }
        completed.push({
          faction,
          branch: research.branch,
          nodeId: research.nodeId,
          nodeName: research.nodeName
        });
        delete this.activeResearch[faction];
      }
    }
    return completed;
  }

  /** Get research progress for a faction */
  getProgress(factionCode) {
    const active = this.activeResearch[factionCode];
    if (!active) return null;
    return active;
  }

  /** AI auto-research: pick a random available node */
  autoResearch(factionCode, currentDay) {
    if (this.activeResearch[factionCode]) return null;
    const available = this.getAvailableNodes(factionCode);
    if (available.length === 0) return null;

    const pick = available[Math.floor(Math.random() * available.length)];
    return this.startResearch(factionCode, pick.branch, pick.id, currentDay);
  }

  /* =========== Research Node Definitions =========== */

  static NODES = {
    military: [
      { id: "mil_1", name: "Basic Training",      icon: "🎖️", tier: 1, duration: 30,  requires: [],         effect: "troops_boost", value: 1.1, description: "Improved basic infantry training. +10% troop effectiveness." },
      { id: "mil_2", name: "Advanced Tactics",     icon: "📋", tier: 2, duration: 60,  requires: ["mil_1"],  effect: "attack_boost", value: 1.15, description: "Modern tactical doctrine. +15% attack in all phases." },
      { id: "mil_3", name: "Composite Armor",      icon: "🛡️", tier: 2, duration: 75,  requires: ["mil_1"],  effect: "defense_boost", value: 1.2, description: "Next-gen reactive armor plating. +20% vehicle defense." },
      { id: "mil_4", name: "Precision Munitions",  icon: "🎯", tier: 3, duration: 90,  requires: ["mil_2"],  effect: "accuracy_boost", value: 1.25, description: "GPS-guided munitions. +25% artillery accuracy." },
      { id: "mil_5", name: "Hypersonic Missiles",  icon: "🚀", tier: 4, duration: 120, requires: ["mil_4"],  effect: "missile_boost", value: 1.3, description: "Mach 5+ delivery systems. +30% missile damage." },
      { id: "mil_6", name: "Exoskeleton Infantry", icon: "🦾", tier: 4, duration: 120, requires: ["mil_3"],  effect: "infantry_boost", value: 1.35, description: "Powered combat suits. +35% infantry combat effectiveness." }
    ],
    aerospace: [
      { id: "aero_1", name: "Jet Propulsion",      icon: "✈️", tier: 1, duration: 30,  requires: [],           effect: "air_speed", value: 1.1, description: "Improved jet engines. +10% aircraft speed." },
      { id: "aero_2", name: "Stealth Coating",      icon: "👻", tier: 2, duration: 60,  requires: ["aero_1"],   effect: "stealth_boost", value: 1.2, description: "Radar-absorbing materials. +20% stealth rating." },
      { id: "aero_3", name: "AESA Radar",           icon: "📡", tier: 2, duration: 60,  requires: ["aero_1"],   effect: "detection_boost", value: 1.15, description: "Active electronically scanned array. +15% air detection." },
      { id: "aero_4", name: "Drone Swarms",         icon: "🤖", tier: 3, duration: 90,  requires: ["aero_2"],   effect: "drone_boost", value: 1.3, description: "Autonomous combat drones. +30% drone effectiveness." },
      { id: "aero_5", name: "Orbital Strike",       icon: "🛰️", tier: 4, duration: 150, requires: ["aero_4"],   effect: "orbital_strike", value: 1.0, description: "Space-based kinetic bombardment capability." },
      { id: "aero_6", name: "6th Gen Fighters",     icon: "⚡", tier: 4, duration: 120, requires: ["aero_3"],   effect: "fighter_boost", value: 1.35, description: "AI-assisted unmanned combat air vehicles. +35% air combat." }
    ],
    naval: [
      { id: "nav_1", name: "Submarine Warfare",    icon: "🐋", tier: 1, duration: 30,  requires: [],          effect: "sub_boost", value: 1.1, description: "Improved torpedo systems. +10% submarine effectiveness." },
      { id: "nav_2", name: "Carrier Operations",   icon: "🚢", tier: 2, duration: 60,  requires: ["nav_1"],   effect: "carrier_boost", value: 1.15, description: "Expanded carrier air wings. +15% carrier strike range." },
      { id: "nav_3", name: "Aegis Systems",        icon: "🔰", tier: 2, duration: 60,  requires: ["nav_1"],   effect: "naval_defense", value: 1.2, description: "Integrated air defense destroyers. +20% fleet defense." },
      { id: "nav_4", name: "Nuclear Submarines",   icon: "☢️", tier: 3, duration: 90,  requires: ["nav_2"],   effect: "nuclear_sub", value: 1.25, description: "Ballistic missile submarines. Strategic deterrence capability." },
      { id: "nav_5", name: "Railgun Cruisers",     icon: "🔧", tier: 4, duration: 120, requires: ["nav_3"],   effect: "railgun", value: 1.3, description: "Electromagnetic railgun systems. +30% naval bombardment." },
      { id: "nav_6", name: "Autonomous Fleet",     icon: "🤖", tier: 4, duration: 150, requires: ["nav_4", "nav_5"], effect: "fleet_ai", value: 1.4, description: "AI-controlled autonomous warships. +40% fleet efficiency." }
    ],
    cyber: [
      { id: "cyber_1", name: "Network Defense",    icon: "🔒", tier: 1, duration: 30,  requires: [],            effect: "cyber_defense", value: 1.1, description: "Hardened military networks. +10% sabotage resistance." },
      { id: "cyber_2", name: "Electronic Warfare", icon: "📶", tier: 2, duration: 60,  requires: ["cyber_1"],   effect: "ew_boost", value: 1.15, description: "Signal jamming and interception. +15% intel gathering." },
      { id: "cyber_3", name: "AI Command",         icon: "🧠", tier: 2, duration: 75,  requires: ["cyber_1"],   effect: "ai_command", value: 1.2, description: "AI-assisted battlefield management. +20% coordination." },
      { id: "cyber_4", name: "Cyber Weapons",      icon: "💻", tier: 3, duration: 90,  requires: ["cyber_2"],   effect: "cyber_attack", value: 1.25, description: "Offensive cyber operations. Can disable enemy infrastructure." },
      { id: "cyber_5", name: "Quantum Computing",  icon: "⚛️", tier: 4, duration: 120, requires: ["cyber_3"],   effect: "quantum", value: 1.3, description: "Quantum encryption & code-breaking. Superior intelligence." },
      { id: "cyber_6", name: "Skynet Protocol",    icon: "🌐", tier: 4, duration: 150, requires: ["cyber_4", "cyber_5"], effect: "full_spectrum", value: 1.5, description: "Full-spectrum dominance. +50% all combat modifiers." }
    ]
  };
}
