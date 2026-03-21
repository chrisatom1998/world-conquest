# Test Coverage Analysis — World Conquest

## Current Test Infrastructure

- **Unit Tests**: Custom HTML-based framework in `tests/unit-tests.html` (~22 test sections, ~120+ assertions)
- **E2E Test**: Single Puppeteer test in `test_attack.js` (country selection + basic attack)
- **No CI/CD**: No automated test runner, no GitHub Actions
- **No package.json**: No `npm test` script

## Coverage Summary by Module

| Module | File | Lines | Test Coverage | Gap Severity |
|--------|------|-------|---------------|--------------|
| GameEngine | `game-engine.js` | 1,948 | Partial — init, attack, save/load, espionage, trade, diplomacy tested | **High** |
| EconomySystem | `economy-system.js` | 488 | Minimal — only `getEconomy()` used as helper in other tests | **Critical** |
| Geopolitics | `geopolitics.js` | 773 | Minimal — `isAtWar`, `declareWar`, `getRelation` used indirectly | **Critical** |
| BattleResolver | `battle-resolver.js` | 436 | Good — resolve(), commands, terrain, naval, edge cases | Low |
| UnitManager | `units.js` | 530 | None | **Critical** |
| MissileManager | `units.js` | 190 | None | **Critical** |
| UnitDesigner | `unit-designer.js` | 471 | None | **High** |
| GameClock | `game-clock.js` | 189 | None (used internally but never directly tested) | **Medium** |
| ResearchTree | `research-tree.js` | 164 | Good — init, available nodes, start, process tick, auto-research | Low |
| GameConfig | `game-config.js` | 92 | None (constants only, low risk) | Low |
| Data files | `territory-data.js`, `military-data.js`, `cities-data.js` | 1,687 | None (static data, low risk) | Low |

## Detailed Gap Analysis

### 1. CRITICAL: EconomySystem — Zero Direct Tests

**File**: `js/systems/economy-system.js` (488 lines)

The economy is a core game loop driver, yet none of its methods are directly tested:

- `init(forces)` — initializes all country economies
- `setTaxRate(code, taxType, rate)` — tax rate validation and stability effects
- `setSpendingAllocation(code, newSpending)` — budget allocation normalization
- `toggleSectorNationalization(code, sectorKey)` — sector control toggling
- `processTurn(forces, ownership, geopolitics, facilities)` — the main economy tick
- `_processCountryTurn()` — GDP calculation, revenue, expenses, inflation, debt, stability
- `getFactionSummary(factionCode, ownership)` — aggregated economic data
- `getFactionGDPPercent(factionCode, ownership)` — victory condition metric
- `getResearchProgress(code)` — research speed calculation

**Recommended tests**:
- Tax rate boundaries (0%, max cap, negative values)
- Spending allocation normalization (ensure percentages sum to 100)
- Sector nationalization effects on output
- Economy turn processing: GDP growth/contraction, inflation, debt accumulation
- Stability effects from high taxes, low food security, war, nuclear wasteland
- Military upkeep calculation correctness
- Facility bonuses (factories, mines, farms, oil)

### 2. CRITICAL: Geopolitics — Only Indirectly Tested

**File**: `js/systems/geopolitics.js` (773 lines)

The diplomacy system has ~30 public methods, nearly all untested:

- `setGovernment(code, govKey)` — government type changes and modifiers
- `togglePolicy(code, policyKey)` — policy effects on stability/GDP/military
- `getGovernmentModifiers(code)` — aggregated modifier calculation
- `improveRelations(playerCode, targetCode)` — relation score changes
- `denounce(playerCode, targetCode, ownership)` — denouncement and cascading effects
- `proposeTrade(playerCode, targetCode)` — trade deal creation with relation checks
- `imposeSanction(playerCode, targetCode)` — sanction mechanics
- `declareWar(attackerCode, defenderCode, ownership)` — war declaration with ally reactions
- `proposePeace(playerCode, targetCode)` — peace mechanics
- `produce(code, productionType, forces)` — military production
- `launchNuke(attackerCode, targetCode, forces, ownership)` — nuclear strike + retaliation
- `runAIDiplomacy(aiCode, playerCode, ownership, forces)` — AI decision-making
- `getFactionEconomySummary(factionCode, ownership)` — economic aggregation
- `getTradePartners(factionCode)` — trade partner listing

**Recommended tests**:
- Government type switching and modifier application
- Policy toggle effects (stability, GDP, military modifiers)
- Relation changes: improve, denounce, trade deals, sanctions
- War declaration: relation prerequisites, ally reactions, duplicate prevention
- Nuclear launch: inventory depletion, retaliation logic, wasteland creation
- AI diplomacy: behavioral boundaries (doesn't crash, makes valid decisions)
- Trade deal creation: relation threshold, duplicate prevention

### 3. CRITICAL: UnitManager — Completely Untested

**File**: `js/systems/units.js` (lines 200-530)

The tactical unit layer has zero test coverage:

- `deployUnit(owner, lat, lng, composition, locationName)` — unit creation
- `moveUnit(unitId, newLat, newLng)` — instant movement
- `startMove(unitId, targetLat, targetLng)` / `completeMove(unitId)` — async movement
- `updateMovement(deltaDays)` — continuous movement processing
- `mergeUnits(unitIdA, unitIdB)` — unit combination
- `splitUnit(unitId, splitComposition)` — unit splitting
- `removeUnit(unitId)` — unit deletion
- `getUnitsForOwner(ownerCode)` — ownership query
- `getUnitsNear(lat, lng, radiusDeg)` — spatial query
- `getPrimaryType(unit)` — unit classification
- `getUnitStrength(unit)` — strength calculation
- `autoDeploy(forces, ownership)` — initial unit placement
- `applyDamage(unitId, damageFraction)` — damage application

**Recommended tests**:
- Deploy a unit and verify it exists with correct properties
- Move a unit and verify position update
- Merge two units and verify combined composition
- Split a unit and verify both halves have correct composition
- Split validation (can't split more than you have)
- `getUnitsNear` spatial filtering
- `applyDamage` — verify damage fractions, minimum unit survival
- `autoDeploy` — verify all countries get units at capitals

### 4. CRITICAL: MissileManager — Completely Untested

**File**: `js/systems/units.js` (lines 534-700)

- `init(forces)` — missile inventory initialization
- `getInventory(ownerCode)` — inventory retrieval
- `hasMissile(ownerCode, type)` — availability check
- `consumeMissile(ownerCode, type)` — inventory depletion
- `addMissile(ownerCode, type, amount)` — inventory addition
- `produceMissile(ownerCode, type, economy)` — production with budget deduction
- `canReach(type, fromLat, fromLng, toLat, toLng)` — range calculation
- `launch(ownerCode, type, targetLat, targetLng, unitManager)` — launch with interception

**Recommended tests**:
- Missile inventory CRUD (add, consume, check)
- Production with budget validation
- Range calculation for different missile types (ICBM = Infinity, others = limited)
- Launch mechanics: interception chance, damage to nearby units
- Edge cases: launching with empty inventory, unknown missile type

### 5. HIGH: UnitDesigner — Completely Untested

**File**: `js/systems/unit-designer.js` (471 lines)

- `initTechLevels(forces)` — tech level assignment based on GDP/power index
- `createDesign(ownerCode, baseType, name, weaponTech, armorTech, engineTech, electronicsTech)` — custom unit design
- `calcDesignCost(design)` — cost calculation
- `getDesignStats(design)` — stat computation with tech multipliers
- `getProductionCost(designId, quantity)` — production pricing
- `getDesignsForOwner(ownerCode)` — design listing
- `createDefaultDesigns(countryCode, forces)` — default design generation
- `getAvailableTypes(countryCode)` — tech-gated unit types

**Recommended tests**:
- Tech level initialization from GDP/power index
- Design creation with valid and invalid base types
- Tech-level gating (can't create stealth at tech level 1)
- Cost calculation correctness
- Stat computation with tech multipliers
- Default design generation for various countries

### 6. MEDIUM: GameClock — No Direct Tests

**File**: `js/systems/game-clock.js` (189 lines)

- `start()` / `stop()` — clock lifecycle
- `setSpeed(index)` — speed multiplier changes
- `togglePause()` — pause/resume
- `hasDaysPassed(referenceTotalDays, requiredDays)` — time comparison
- Day/month/year rollover logic

**Recommended tests**:
- Day advancement and month/year rollover (day 31 → next month)
- `hasDaysPassed` arithmetic correctness
- Speed multiplier values at each index
- Pause/resume state transitions

### 7. HIGH: GameEngine — Many Untested Methods

While the engine has the most test coverage, many important methods lack tests:

**Untested engine methods**:
- `queueProduction()` / `queueMissileProduction()` — production queue management
- `_processProductionQueue()` — queue completion logic
- `fortify(territoryId)` — fortification building
- `buildFacility(territoryId, type)` — facility construction
- `diplomacyAction(action, targetCode)` — diplomacy dispatch
- `setTaxRate()` / `setSpendingAllocation()` / `toggleSectorNationalization()` — economy controls
- `launchNuke(targetCode)` — nuclear strike flow
- `launchMissile(missileType, targetLat, targetLng)` — missile launch flow
- `movePlayerUnit(unitId, targetLat, targetLng)` — unit movement
- `splitAndMoveUnit(unitId, fraction, targetLat, targetLng)` — unit splitting
- `toggleAlliance(targetCode)` — alliance management
- `_checkVictory()` — victory condition evaluation
- `_runAI()` — AI turn processing
- `getFactionPower()` / `getFactionPowerPercent()` — power calculations
- `getCountryConquestProgress()` / `isCountryFullyConquered()` — conquest tracking

## Infrastructure Recommendations

### 1. Add a package.json with test scripts
```json
{
  "scripts": {
    "test": "node test-runner.js",
    "test:e2e": "node test_attack.js"
  }
}
```

### 2. Create a Node.js-compatible test runner
The current HTML-based tests require a browser. A headless runner (using Puppeteer or migrating to a Node-compatible framework) would enable CI integration.

### 3. Add GitHub Actions CI
```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### 4. Priority Order for New Tests

1. **EconomySystem** — Core game loop, affects everything, complex calculations
2. **UnitManager** — Player-facing tactical layer, many state mutations
3. **Geopolitics** — Diplomacy affects game balance, AI behavior, victory conditions
4. **MissileManager** — Destructive actions need correctness guarantees
5. **UnitDesigner** — Tech gating and cost calculations affect game balance
6. **GameEngine untested methods** — Production queues, fortification, victory checks
7. **GameClock** — Time rollover bugs could cascade everywhere
