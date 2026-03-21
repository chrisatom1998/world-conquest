/* ============================================================
   WORLD CONQUEST - Shared App Configuration
   Keeps cross-layer rules in one place so engine and UI stay aligned
   ============================================================ */

const APP_CONFIG = Object.freeze({
  uiRefreshIntervalMs: 100,
  tutorialDelayMs: 500
});

const UNIT_PRODUCTION_RULES = Object.freeze({
  troops: Object.freeze({
    key: "troops",
    label: "10K Troops",
    uiLabel: "🎖️ 10K Troops",
    cost: 0.5,
    days: 7,
    category: "military",
    rewards: Object.freeze({ activeMilitary: 10000 })
  }),
  tanks: Object.freeze({
    key: "tanks",
    label: "50 Tanks",
    uiLabel: "🛡️ 50 Tanks",
    cost: 2,
    days: 14,
    category: "military",
    rewards: Object.freeze({ tanks: 50 })
  }),
  artillery: Object.freeze({
    key: "artillery",
    label: "30 Artillery",
    uiLabel: "💥 30 Artillery",
    cost: 1.5,
    days: 10,
    category: "military",
    rewards: Object.freeze({ artillery: 30 })
  }),
  aircraft: Object.freeze({
    key: "aircraft",
    label: "20 Aircraft",
    uiLabel: "✈️ 20 Aircraft",
    cost: 5,
    days: 21,
    category: "military",
    rewards: Object.freeze({ aircraft: 20 })
  }),
  fighters: Object.freeze({
    key: "fighters",
    label: "10 Fighters",
    uiLabel: "🔥 10 Fighters",
    cost: 8,
    days: 28,
    category: "military",
    rewards: Object.freeze({ fighters: 10 })
  }),
  helicopters: Object.freeze({
    key: "helicopters",
    label: "15 Helicopters",
    uiLabel: "🚁 15 Helicopters",
    cost: 3,
    days: 14,
    category: "military",
    rewards: Object.freeze({ helicopters: 15 })
  }),
  naval: Object.freeze({
    key: "naval",
    label: "5 Ships",
    uiLabel: "🚢 5 Ships",
    cost: 10,
    days: 30,
    category: "military",
    rewards: Object.freeze({ navalVessels: 5 })
  }),
  subs: Object.freeze({
    key: "subs",
    label: "2 Subs",
    uiLabel: "🦈 2 Subs",
    cost: 15,
    days: 35,
    category: "military",
    rewards: Object.freeze({ submarines: 2 })
  })
});

function getUnitProductionRule(type) {
  return UNIT_PRODUCTION_RULES[type] || null;
}

function getUnitProductionRules() {
  return Object.values(UNIT_PRODUCTION_RULES);
}
