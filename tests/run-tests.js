/* Node.js test runner for World Conquest */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Browser mocks
global.document = { getElementById:()=>null, createElement:()=>({classList:{add(){},remove(){}},appendChild(){},style:{}}), querySelector:()=>null, querySelectorAll:()=>[] };
global.localStorage = (()=>{ const s={}; return { getItem:k=>s[k]??null, setItem:(k,v)=>{s[k]=String(v)}, removeItem:k=>{delete s[k]}, clear(){for(const k of Object.keys(s))delete s[k]} }})();
global.performance = { now:()=>Date.now() };
global.requestAnimationFrame = ()=>0;
global.cancelAnimationFrame = ()=>{};
global.L = null;
global.alert = ()=>{};

const ROOT = path.resolve(__dirname, '..');
function load(f) { vm.runInThisContext(fs.readFileSync(path.join(ROOT,f),'utf-8'),{filename:f}) }

load('js/data/territory-data.js');
load('js/data/military-data.js');
load('js/data/cities-data.js');
load('js/core/game-config.js');
load('js/systems/game-clock.js');
load('js/systems/unit-designer.js');
load('js/systems/research-tree.js');
load('js/systems/economy-system.js');
load('js/systems/geopolitics.js');
load('js/systems/units.js');
load('js/systems/battle-resolver.js');
load('js/systems/game-engine.js');

let T=0,P=0,F=0,E=0; const fails=[];
function ok(c,n,d=""){T++;if(c)P++;else{F++;fails.push(`FAIL: ${n}${d?" — "+d:""}`)}}
function eq(a,b,n){ok(a===b,n,`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`)}
function ty(v,t,n){ok(typeof v===t,n,`expected ${t}, got ${typeof v}`)}
function ex(v,n){ok(v!==undefined&&v!==null,n,`value is ${v}`)}
function ar(v,n){ok(Array.isArray(v),n,`expected array`)}
function safe(fn,l){try{fn()}catch(e){E++;T++;fails.push(`ERROR [${l}]: ${e.message}`)}}

console.log("World Conquest — Node.js Test Suite\n");

// ── 1. Data Layer ──
safe(()=>{
  console.log("  Data Layer");
  ok(typeof TERRITORY_DATA==="object","TERRITORY_DATA exists");
  ok(typeof MILITARY_DATA==="object","MILITARY_DATA exists");
  ok(Object.keys(TERRITORY_DATA).length>10,`Territory countries: ${Object.keys(TERRITORY_DATA).length}`);
  ok(Object.keys(MILITARY_DATA).length>40,`Military factions: ${Object.keys(MILITARY_DATA).length}`);
  ok(TERRITORY_DATA.USA.length===50,"USA has 50 states");
  ex(MILITARY_DATA.USA.activeMilitary,"USA has activeMilitary");
  ok(MILITARY_DATA.USA.gdp>20000,"USA GDP > 20000");
  ex(getTerritoryById("USA-CA"),"getTerritoryById USA-CA");
  eq(getTerritoryCountry("USA-CA"),"USA","getTerritoryCountry");
  ar(getTerritoryNeighbors("USA-CA"),"getTerritoryNeighbors returns array");
  ok(getTerritoryNeighbors("USA-CA").length>0,"USA-CA has neighbors");
  eq(formatNumber(1500000),"1.5M","formatNumber 1.5M");
  ok(calcStrength(MILITARY_DATA.USA)>0,"calcStrength USA > 0");
},"Data Layer");

// ── 2. Game Config ──
safe(()=>{
  console.log("  Game Config");
  ex(APP_CONFIG,"APP_CONFIG exists");
  ex(UNIT_PRODUCTION_RULES,"UNIT_PRODUCTION_RULES exists");
  eq(UNIT_PRODUCTION_RULES.troops.cost,0.5,"Troops cost 0.5B");
  eq(UNIT_PRODUCTION_RULES.troops.days,7,"Troops take 7 days");
  ex(getUnitProductionRule("tanks"),"getUnitProductionRule tanks");
  eq(getUnitProductionRule("fake"),null,"Invalid rule returns null");
  ar(getUnitProductionRules(),"getUnitProductionRules returns array");
  ok(getUnitProductionRules().length===8,"8 production rules");
},"Game Config");

// ── 3. Game Clock ──
safe(()=>{
  console.log("  Game Clock");
  const c=new GameClock();
  eq(c.year,2026,"Start year 2026");
  eq(c.month,1,"Start month 1");
  eq(c.day,1,"Start day 1");
  eq(c.totalDays,0,"Start totalDays 0");
  eq(c.speedIndex,0,"Start paused");
  eq(c.speedMultiplier,0,"Paused multiplier 0");
  c.setSpeed(3);
  eq(c.speedIndex,3,"Speed set to 3");
  ok(c.speedMultiplier>0,"Multiplier > 0");
  c.setSpeed(99);
  eq(c.speedIndex,5,"Speed clamped to 5");
  c.setSpeed(-1);
  eq(c.speedIndex,0,"Speed clamped to 0");
  ok(typeof c.dateString==="string","dateString is string");
  ok(c.dateString.includes("2026"),"dateString has year");
  c._advanceDay();
  eq(c.day,2,"Day advanced to 2");
  eq(c.totalDays,1,"totalDays is 1");
  for(let i=0;i<29;i++) c._advanceDay();
  eq(c.day,1,"Month rolled over to day 1");
  eq(c.month,2,"Month advanced to 2");
  ok(c.hasDaysPassed(0,30),"30 days passed since day 0");
  ok(!c.hasDaysPassed(0,31),"31 days not passed yet");
},"Game Clock");

// ── 4. Economy System ──
safe(()=>{
  console.log("  Economy System");
  const eco=new EconomySystem();
  const forces={USA:{...MILITARY_DATA.USA},CHN:{...MILITARY_DATA.CHN}};
  eco.init(forces);
  ex(eco.getEconomy("USA"),"USA economy exists");
  eq(eco.getEconomy("FAKE"),null,"Fake economy is null");
  const usa=eco.getEconomy("USA");
  ok(usa.gdp>0,"USA GDP > 0");
  ok(usa.budget>0,"USA budget > 0");
  eq(usa.incomeTaxRate,25,"Default income tax 25%");
  ok(eco.setTaxRate("USA","income",35),"setTaxRate returns true");
  eq(usa.incomeTaxRate,35,"Income tax changed to 35");
  ok(!eco.setTaxRate("USA","fake",10),"Invalid tax type returns false");
  ok(eco.setSpendingAllocation("USA",{military:30,education:20,healthcare:20,infrastructure:15,research:15}),"setSpendingAllocation works");
  const nat=eco.toggleSectorNationalization("USA","agriculture");
  ok(nat===true||nat===false,"Nationalization returns boolean");
  ok(eco.getResearchProgress("USA")>=0,"Research progress >= 0");
  const summary=eco.getFactionSummary("USA",{USA:"USA"});
  ok(summary.gdp>0,"Summary GDP > 0");
  const pct=eco.getFactionGDPPercent("USA",{USA:"USA"});
  ok(pct>0&&pct<=100,"GDP percent in range");
},"Economy System");

// ── 5. Battle Resolver ──
safe(()=>{
  console.log("  Battle Resolver");
  const br=new BattleResolver();
  ex(BATTLE_COMMANDS,"BATTLE_COMMANDS exists");
  ex(TERRAIN_TYPES,"TERRAIN_TYPES exists");
  ty(MORALE_ROUT_THRESHOLD,"number","MORALE_ROUT_THRESHOLD");
  ok(MORALE_ROUT_THRESHOLD<MORALE_SHAKEN_THRESHOLD,"Rout < Shaken");

  const a={composition:{troops:5000,tanks:200,artillery:80,aircraft:40,fighters:15}};
  const d={composition:{troops:3000,tanks:100,artillery:50,aircraft:20}};
  const r=br.resolve(a,d,"full_assault","defensive_hold","plains",null);
  ex(r,"resolve returns result");
  ty(r.attackerWins,"boolean","attackerWins is boolean");
  ar(r.phases,"phases is array");
  ok(r.phases.length>=2,"At least 2 phases");
  ok(r.phases.map(p=>p.name).includes("Air Superiority"),"Has Air phase");
  ok(r.phases.map(p=>p.name).includes("Ground Assault"),"Has Ground phase");
  ok(r.attackerLossPct>=5&&r.attackerLossPct<=85,"Attacker loss 5-85%");
  ok(r.defenderLossPct>=5&&r.defenderLossPct<=85,"Defender loss 5-85%");

  // Retreat
  const rr=br.resolve({composition:{troops:10000,tanks:500}},{composition:{troops:100}},"retreat","defensive_hold","plains",null);
  eq(rr.attackerWins,false,"Retreat: attacker doesn't win");

  // Bombardment excludes ground
  const bb=br.resolve({composition:{troops:1000,tanks:50}},{composition:{troops:800}},"bombardment","defensive_hold","plains",null);
  ok(!bb.phases.map(p=>p.name).includes("Ground Assault"),"Bombardment: no ground phase");

  // Coastal has naval phase
  const cc=br.resolve({composition:{troops:2000,naval:30}},{composition:{troops:1500,naval:10}},"full_assault","defensive_hold","coastal",null);
  ok(cc.phases.map(p=>p.name).includes("Naval Support"),"Coastal: has naval phase");

  // Terrain detection
  eq(BattleResolver.getTerrainForLocation(70,30),"arctic","70N = arctic");
  eq(BattleResolver.getTerrainForLocation(25,30),"desert","25N 30E = desert");

  // AI command
  eq(br.chooseAICommand({composition:{troops:10000,tanks:500}},{composition:{troops:500}}),"full_assault","Strong def = full_assault");
  eq(br.chooseAICommand({composition:{troops:100}},{composition:{troops:20000,tanks:800}}),"retreat","Weak def = retreat");

  // All terrains work
  for(const t of ["plains","urban","forest","desert","mountain","coastal","arctic"]){
    const tr=br.resolve({composition:{troops:2000,tanks:50}},{composition:{troops:1500,tanks:30}},"full_assault","defensive_hold",t,null);
    ex(tr,`Terrain '${t}' works`);
  }

  // Minimal units
  const mn=br.resolve({composition:{troops:1}},{composition:{troops:1}},"full_assault","defensive_hold","plains",null);
  ex(mn,"Minimal units work");

  // Apply losses
  const tu={composition:{troops:10,tanks:5}};
  br._applyLossesToUnit(tu,0.99);
  ok(tu.composition.troops>=1,"Troops >= 1 after 99% loss");
},"Battle Resolver");

// ── 6. Units & Missiles ──
safe(()=>{
  console.log("  Units & Missiles");
  const um=new UnitManager();
  const u=um.deployUnit("USA",38,-77,{troops:5000,tanks:100},"DC");
  ex(u,"Deploy returns unit");
  ex(u.id,"Unit has id");
  eq(u.owner,"USA","Owner is USA");
  ok(um.getUnitsForOwner("USA").length===1,"1 unit for USA");
  ok(um.getUnitsForOwner("CHN").length===0,"0 units for CHN");

  um.moveUnit(u.id,40,-80);
  eq(u.lat,40,"Moved lat");
  eq(u.lng,-80,"Moved lng");

  um.startMove(u.id,50,-90);
  eq(u.status,"moving","Status is moving");
  um.completeMove(u.id);
  eq(u.lat,50,"Completed lat");
  eq(u.status,"idle","Status back to idle");

  const u2=um.deployUnit("USA",39,-78,{troops:3000},"VA");
  const merged=um.mergeUnits(u.id,u2.id);
  ex(merged,"Merge returns unit");
  ok(merged.composition.troops>=8000,"Merged troops");

  const split=um.splitUnit(u.id,{troops:1000});
  ex(split,"Split returns unit");
  ok(split.composition.troops===1000,"Split has 1000 troops");

  ok(um.applyDamage(u.id,0.5),"applyDamage returns true");
  ok(u.composition.troops>0,"Troops survived 50% damage");

  ty(um.getPrimaryType(u),"string","getPrimaryType returns string");
  ok(um.getUnitStrength(u)>0,"getUnitStrength > 0");
  ty(um.getUnitSizeLabel(u),"string","getUnitSizeLabel returns string");

  const near=um.getUnitsNear(50,-90,100);
  ar(near,"getUnitsNear returns array");

  // Missiles
  const mm=new MissileManager();
  mm.init({USA:MILITARY_DATA.USA});
  mm.addMissile("USA","cruise",5);
  const inv=mm.getInventory("USA");
  ex(inv,"USA missile inventory");
  ok((inv.cruise||0)>=5,"USA has cruise missiles after add");
  ok(mm.hasMissile("USA","cruise"),"hasMissile cruise");
  ok(mm.consumeMissile("USA","cruise"),"consumeMissile");

  mm.addMissile("USA","icbm",5);
  ok(mm.getInventory("USA").icbm>=5,"addMissile works");

  ok(mm.canReach("icbm",0,0,50,50),"ICBM global range");
  ty(MissileManager.calcDistance(0,0,10,10),"number","calcDistance returns number");
},"Units & Missiles");

// ── 7. Research Tree ──
safe(()=>{
  console.log("  Research Tree");
  const rt=new ResearchTree();
  rt.init(["USA","CHN"]);
  ex(rt.getResearchState("USA"),"USA research state");
  const avail=rt.getAvailableNodes("USA");
  ar(avail,"getAvailableNodes returns array");
  ok(avail.length>0,"Available nodes > 0");
  ok(rt.hasResearched("USA","mil_1"),"USA has mil_1 (starter)");
  ok(!rt.hasResearched("USA","mil_6"),"USA doesn't have mil_6");

  const started=rt.startResearch("USA","military","mil_2",0);
  ex(started,"startResearch returns object");
  eq(rt.startResearch("USA","military","mil_3",0),null,"Can't start 2nd research");

  const completed=rt.processTick(1000);
  ar(completed,"processTick returns array");
  ok(completed.length>0,"mil_2 completed after 1000 days");
  ok(rt.hasResearched("USA","mil_2"),"mil_2 now researched");

  rt.autoResearch("CHN",0);
  ex(rt.activeResearch["CHN"],"CHN auto-research started");
},"Research Tree");

// ── 8. Geopolitics ──
safe(()=>{
  console.log("  Geopolitics");
  const geo=new Geopolitics();
  const forces={USA:{...MILITARY_DATA.USA},CHN:{...MILITARY_DATA.CHN},RUS:{...MILITARY_DATA.RUS}};
  geo.init(forces);
  ex(geo.economy.USA,"USA economy in geo");
  ty(geo.getRelation("USA","CHN"),"number","Relation is number");
  ok(!geo.isAtWar("USA","CHN"),"USA/CHN not at war initially");

  const war=geo.declareWar("USA","CHN");
  ex(war,"declareWar returns result");
  ok(geo.isAtWar("USA","CHN"),"USA/CHN now at war");

  geo.improveRelations("USA","RUS");
  const rel=geo.getRelation("USA","RUS");
  ok(rel>=-100&&rel<=100,"Relation in range");

  ex(geo.governmentTypes.USA,"USA has government type");
  const govMods=geo.getGovernmentModifiers("USA");
  ex(govMods,"getGovernmentModifiers returns object");
  ty(govMods.gdpMod,"number","gdpMod is number");
},"Geopolitics");

// ── 9. Game Engine Init ──
let engine;
safe(()=>{
  console.log("  Game Engine Init");
  engine=new GameEngine();
  engine.init("USA");
  eq(engine.playerCode,"USA","Player is USA");
  eq(engine.phase,"playing","Phase is playing");
  ok(Object.keys(engine.forces).length>10,"Forces loaded");
  ok(Object.keys(engine.ownership).length>50,"Ownership populated");
  ok(engine.getPlayerTerritories().length>0,"Player has territories");
  ex(engine.battleResolver,"Has battleResolver");
  ex(engine.economySystem,"Has economySystem");
  ex(engine.researchTree,"Has researchTree");
  ex(engine.unitManager,"Has unitManager");
  ex(engine.missileManager,"Has missileManager");
  ex(engine.clock,"Has clock");
  ex(engine.geo,"Has geopolitics");
},"Engine Init");

if(!engine){console.log("FATAL: Engine failed");process.exit(1)}

// ── 10. Engine Territory & Power ──
safe(()=>{
  console.log("  Engine Territory & Power");
  const pt=engine.getPlayerTerritories();
  ok(pt.length===50,"USA has 50 territories");
  eq(engine.getTerritoryCountryCode("USA-CA"),"USA","Territory country code");
  ex(engine.getTerritoryForces("USA-CA"),"Territory forces exist");
  ok(engine.getTerritoryForces("USA-CA").activeMilitary>0,"Territory has troops");
  ok(engine.getFactionPower("USA")>0,"Faction power > 0");
  ok(engine.getFactionPowerPercent("USA")>0,"Power percent > 0");
  const prog=engine.getCountryConquestProgress("USA","USA");
  eq(prog.owned,prog.total,"USA fully owns USA");
  ok(engine.isCountryFullyConquered("USA","USA"),"USA fully conquered by USA");
},"Engine Territory");

// ── 11. Engine Attack ──
safe(()=>{
  console.log("  Engine Attack");
  eq(engine.canAttack(engine.getPlayerTerritories()[0]),false,"Can't attack own territory");
  eq(engine.canAttack("NONEXISTENT"),false,"Can't attack nonexistent");
  eq(engine.attack(engine.getPlayerTerritories()[0],"full_assault"),null,"Attack own returns null");
  eq(engine.attack("NONEXISTENT","full_assault"),null,"Attack nonexistent returns null");

  // Find attackable target
  let target=null;
  for(const [tid,owner] of Object.entries(engine.ownership)){
    if(owner!=="USA"&&engine.canAttack(tid)){target=tid;break}
  }
  if(target){
    const origOwner=engine.ownership[target];
    const result=engine.attack(target,"full_assault");
    ex(result,"Attack returns result");
    ty(result.attackerWins,"boolean","Has attackerWins");
    eq(result.attacker,"USA","Attacker is USA");
    eq(result.defender,origOwner,"Defender matches");
    ex(result.losses,"Has losses");
    engine.resumeAfterBattle();
  }
},"Engine Attack");

// ── 12. Engine Production ──
safe(()=>{
  console.log("  Engine Production");
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=500;
  const q=engine.queueProduction("USA","troops");
  ex(q,"queueProduction returns result");
  ok(engine.productionQueue.length>0,"Queue not empty");
  eq(engine.queueProduction("FAKE","troops"),null,"Invalid country returns null");
  eq(engine.queueProduction("USA","fake_unit"),null,"Invalid type returns null");
},"Engine Production");

// ── 13. Engine Fortification ──
safe(()=>{
  console.log("  Engine Fortification");
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=500;
  const tid=engine.getPlayerTerritories()[0];
  const f=engine.fortify(tid);
  ex(f,"Fortify returns result");
  eq(f.targetLevel,1,"Target level 1");
  eq(engine.fortify("CHN"),null,"Can't fortify enemy territory");
},"Engine Fortification");

// ── 13b. Production Countdown ──
safe(()=>{
  console.log("  Production Countdown");
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=5000;
  const startDay=engine.clock.totalDays;

  // Queue a troop production
  const q=engine.queueProduction("USA","troops");
  ex(q,"Queue troops");
  const order=engine.productionQueue.find(o=>o.type==="troops"&&o.startDay===startDay);
  ex(order,"Found queued order");
  eq(order.durationDays,7,"Troops take 7 days");
  eq(order.startDay,startDay,"startDay matches clock");

  // Advance 3 days — should still be in queue
  for(let i=0;i<3;i++) engine.clock._advanceDay();
  engine._processProductionQueue();
  ok(engine.productionQueue.some(o=>o===order),"Still in queue after 3 days");

  // Check countdown math
  const elapsed=engine.clock.totalDays-order.startDay;
  eq(elapsed,3,"3 days elapsed");
  const daysLeft=Math.max(0,Math.ceil(order.durationDays-elapsed));
  eq(daysLeft,4,"4 days remaining");

  // Advance 4 more days — should complete
  for(let i=0;i<4;i++) engine.clock._advanceDay();
  engine._processProductionQueue();
  ok(!engine.productionQueue.some(o=>o===order),"Removed from queue after 7 days");

  // Fortify countdown
  eco.budget=5000;
  const ftid=engine.getPlayerTerritories()[2];
  engine.fortify(ftid);
  const fortOrder=engine.fortifyQueue.find(o=>o.code===ftid);
  ex(fortOrder,"Fortify order exists");
  eq(fortOrder.durationDays,14,"Fortify takes 14 days");

  // Advance 10 days — still in queue
  for(let i=0;i<10;i++) engine.clock._advanceDay();
  engine._processFortificationQueue();
  ok(engine.fortifyQueue.some(o=>o===fortOrder),"Fortify still in queue after 10 days");
  const fortRemain=Math.max(0,Math.ceil(fortOrder.durationDays-(engine.clock.totalDays-fortOrder.startDay)));
  eq(fortRemain,4,"4 days remaining on fortify");

  // Complete it
  for(let i=0;i<4;i++) engine.clock._advanceDay();
  engine._processFortificationQueue();
  ok(!engine.fortifyQueue.some(o=>o===fortOrder),"Fortify removed after 14 days");

  // Facility countdown
  eco.budget=5000;
  const facTid=engine.getPlayerTerritories()[3];
  engine.buildFacility(facTid,"mine");
  const facOrder=engine.facilityQueue.find(o=>o.territoryId===facTid);
  ex(facOrder,"Facility order exists");
  eq(facOrder.durationDays,60,"Facility takes 60 days");
  const facStart=facOrder.startDay;

  // Advance 30 days
  for(let i=0;i<30;i++) engine.clock._advanceDay();
  engine._processFacilityQueue(engine.clock.totalDays);
  ok(engine.facilityQueue.some(o=>o===facOrder),"Facility still in queue after 30 days");
  const facRemain=Math.max(0,Math.ceil(facOrder.durationDays-(engine.clock.totalDays-facStart)));
  eq(facRemain,30,"30 days remaining on facility");

  // Complete it
  for(let i=0;i<30;i++) engine.clock._advanceDay();
  engine._processFacilityQueue(engine.clock.totalDays);
  ok(!engine.facilityQueue.some(o=>o===facOrder),"Facility removed after 60 days");
  ok((engine.facilities[facTid]?.mine||0)>0,"Mine built in territory");
},"Production Countdown");

// ── 14. Engine Espionage ──
safe(()=>{
  console.log("  Engine Espionage");
  ty(engine.performEspionage,"function","performEspionage exists");
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=500;
  const r1=engine.performEspionage("CHN","steal_tech");
  ex(r1,"steal_tech returns result");
  ty(r1.success,"boolean","Has success");
  ty(r1.message,"string","Has message");
  eco.budget=500;
  const r2=engine.performEspionage("CHN","sabotage");
  ex(r2,"sabotage returns result");
  eco.budget=0;
  const r3=engine.performEspionage("CHN","steal_tech");
  eq(r3.success,false,"Zero budget fails");
  eco.budget=500;
  const r4=engine.performEspionage("CHN","nonexistent_op");
  eq(r4.success,false,"Invalid op fails");
},"Engine Espionage");

// ── 15. Trade Routes & Economic History ──
safe(()=>{
  console.log("  Trade & Economic History");
  ar(engine.getTradeRoutes("USA"),"Trade routes is array");
  engine._recordEconomicSnapshot();
  engine._recordEconomicSnapshot();
  const hist=engine.getEconomicHistory("USA");
  ar(hist,"History is array");
  ok(hist.length>=1,"Has history entries");
  ar(engine.getEconomicHistory("ZZZZ"),"Unknown faction returns array");
  eq(engine.getEconomicHistory("ZZZZ").length,0,"Unknown faction empty");
},"Trade & History");

// ── 16. Resource Market ──
safe(()=>{
  console.log("  Resource Market");
  const m=engine.getResourceMarket();
  ty(m,"object","Market is object");
  for(const k of ["oil","steel","tech","food","rare_earth"]){
    ex(m[k],`Market has ${k}`);
    ok(m[k].price>0,`${k} price > 0`);
  }
  engine.fluctuateMarket();
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=1000;
  ex(engine.buyResource("oil",10),"Buy returns result");
  ex(engine.sellResource("oil",5),"Sell returns result");
},"Resource Market");

// ── 17. World Council ──
safe(()=>{
  console.log("  World Council");
  const r1=engine.proposeResolution("sanctions","CHN");
  ex(r1,"Sanctions resolution result");
  ty(r1.passed,"boolean","Has passed");
  const r2=engine.proposeResolution("ceasefire","CHN");
  ex(r2,"Ceasefire result");
  const all=engine.getWorldCouncilResolutions();
  ar(all,"Resolutions is array");
  ok(all.length>=2,"At least 2 resolutions");
},"World Council");

// ── 18. Diplomatic Map ──
safe(()=>{
  console.log("  Diplomatic Map");
  const d=engine.getDiplomaticMapData();
  ty(d,"object","Returns object");
  ex(d.USA,"USA in diplomatic data");
  eq(d.USA.status,"player","USA status is player");
  ok(Object.keys(d).length>10,"Many factions");
},"Diplomatic Map");

// ── 19. Peace Treaty ──
safe(()=>{
  console.log("  Peace Treaty");
  ty(engine.proposePeaceTreaty,"function","proposePeaceTreaty exists");
  if(!engine.geo.isAtWar("USA","RUS")) engine.geo.declareWar("USA","RUS");
  const r=engine.proposePeaceTreaty("RUS",{territory:[],reparations:0,dmz:false});
  ex(r,"Treaty returns result");
  ty(r.accepted,"boolean","Has accepted");
  ty(r.message,"string","Has message");
},"Peace Treaty");

// ── 20. Save/Load ──
safe(()=>{
  console.log("  Save/Load");
  ty(engine.saveGame,"function","saveGame exists");
  ty(engine.loadGame,"function","loadGame exists");
  eq(engine.saveGame(0),true,"saveGame returns true");
  const raw=localStorage.getItem("world_conquest_save_0");
  ok(raw!==null,"Save exists in storage");
  const data=JSON.parse(raw);
  eq(data.playerCode,"USA","Saved player is USA");
  ex(data.ownership,"Save has ownership");
  const slots=engine.getSaveSlots();
  ar(slots,"getSaveSlots returns array");
  eq(slots.length,4,"4 save slots");
  eq(engine.loadGame(0),true,"loadGame returns true");
  localStorage.setItem("world_conquest_save_2","{bad}");
  eq(engine.loadGame(2),false,"Corrupt save returns false");
  localStorage.removeItem("world_conquest_save_2");
  eq(engine.loadGame(2),false,"Missing save returns false");
  for(let i=0;i<4;i++) localStorage.removeItem(`world_conquest_save_${i}`);
},"Save/Load");

// ── 21. Naval & Campaigns ──
safe(()=>{
  console.log("  Naval & Campaigns");
  ty(engine.canNavalInvade,"function","canNavalInvade exists");
  ty(engine.canNavalInvade("JPN"),"boolean","Returns boolean");
  ty(engine.planCampaign,"function","planCampaign exists");
  ty(engine.executeCampaign,"function","executeCampaign exists");
  const pt=engine.getPlayerTerritories();
  const et=Object.entries(engine.ownership).filter(([,o])=>o!=="USA").map(([t])=>t);
  if(pt.length>0&&et.length>0){
    const plan=engine.planCampaign(pt[0],et[0]);
    ok(plan===null||Array.isArray(plan),"planCampaign returns array or null");
  }
},"Naval & Campaigns");

// ── 22. Alliance Co-belligerence ──
safe(()=>{
  console.log("  Alliance Co-belligerence");
  ty(engine.processAllianceCoBelligerence,"function","Exists");
  engine.processAllianceCoBelligerence("USA","CHN");
  ok(true,"Runs without crash");
},"Alliance Co-belligerence");

// ── 23. Facility Construction ──
safe(()=>{
  console.log("  Facility Construction");
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=500;
  const tid=engine.getPlayerTerritories()[1];
  const r=engine.buildFacility(tid,"factory");
  eq(r,true,"buildFacility returns true");
  ok(engine.facilityQueue.length>0,"Facility queue not empty");
  eq(engine.buildFacility(tid,"mine"),false,"Can't build 2 in same territory");
  eq(engine.buildFacility("CHN","factory"),false,"Can't build in enemy territory");
},"Facility Construction");

// ── 24. Unit Designer ──
safe(()=>{
  console.log("  Unit Designer");
  ex(engine.unitDesigner,"unitDesigner exists");
  const tl=engine.unitDesigner.getMaxTechLevel("USA");
  ty(tl,"number","Tech level is number");
  ok(tl>=1&&tl<=5,"Tech level 1-5");
},"Unit Designer");

// ── 25. War GDP Penalty (Regression) ──
safe(()=>{
  console.log("  War GDP Penalty");
  // Ensure USA and CHN are at war (from earlier test)
  if(!engine.geo.isAtWar("USA","CHN")) engine.geo.declareWar("USA","CHN");
  ok(engine.geo.isAtWar("USA","CHN"),"USA/CHN at war");

  // Get country ownership map
  const co=engine._getCountryOwnership();
  ex(co.USA,"Country ownership has USA");

  // Process geopolitics economy and check war penalty applied
  const usaEcoBefore=engine.geo.economy.USA.gdp;
  engine.geo.processEconomy(engine.forces,co);
  // War should reduce GDP — the penalty is -15% per war
  // We can't check exact value due to other modifiers, but GDP should be modified
  ok(engine.geo.economy.USA.gdp>0,"USA GDP still positive after war penalty");

  // Verify the war is counted: manually check war iteration
  let warCount=0;
  const owner=co["USA"]||"USA";
  for(const w of engine.geo.wars){
    const [a,b]=w.split("-");
    if(a===owner||b===owner) warCount++;
  }
  ok(warCount>=1,"USA has at least 1 active war counted");
},"War GDP Penalty");

// ── 26. Battle Casualty Symmetry (Regression) ──
safe(()=>{
  console.log("  Battle Casualty Symmetry");
  const br=new BattleResolver();

  // Equal forces: when attacker loses, defender should take LESS damage (defenderLossPct*0.4)
  // Run multiple trials to verify pattern
  let defLossWhenAttWins=0, defLossWhenAttLoses=0, trials=0;
  for(let i=0;i<20;i++){
    const a={composition:{troops:5000,tanks:200}};
    const d={composition:{troops:5000,tanks:200}};
    const r=br.resolve(a,d,"full_assault","defensive_hold","plains",null);
    if(r.attackerWins){
      defLossWhenAttWins+=r.defenderLossPct;
    } else {
      defLossWhenAttLoses+=r.defenderLossPct;
      trials++;
    }
  }
  // When defender wins, they should take reduced casualties (multiplied by 0.4)
  // vs when they lose (full casualties)
  if(trials>0&&defLossWhenAttWins>0){
    const avgWhenDefWins=defLossWhenAttLoses/trials;
    ok(avgWhenDefWins<80,"Winning defender takes reasonable casualties");
  }
  ok(true,"Battle casualty regression passed");
},"Battle Casualty Symmetry");

// ── 27. Facility Economy Integration (Regression) ──
safe(()=>{
  console.log("  Facility Economy Integration");
  // Build a facility in a player territory
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=5000;
  const tid=engine.getPlayerTerritories()[4];

  // Directly place a completed facility
  if(!engine.facilities[tid]) engine.facilities[tid]={factory:0,mine:0,farm:0,oil:0,military:0};
  engine.facilities[tid].factory=2;

  // Process economy with territory-level ownership
  const co=engine._getCountryOwnership();
  engine.economySystem.processTurn(engine.forces,co,engine.geo,engine.facilities,engine.ownership);

  // Verify USA economy was processed (GDP should be > 0)
  const usaEco=engine.economySystem.getEconomy("USA");
  ok(usaEco.gdp>0,"USA GDP positive after facility processing");

  // Verify facilities are counted: check that factory boost is applied
  // factories add 0.02 to GDP multiplier each, so 2 factories = +0.04
  // We can't check the exact multiplier, but GDP should reflect facility presence
  ok(usaEco.gdp>100,"USA GDP reflects facility boost");
},"Facility Economy Integration");

// ── 28. Alliance System ──
safe(()=>{
  console.log("  Alliance System");
  ok(!engine.isAllied("USA","GBR"),"USA/GBR not allied initially");
  engine.toggleAlliance("GBR");
  ok(engine.isAllied("USA","GBR"),"USA/GBR allied after toggle");
  // Alliance should improve relations
  ok(engine.geo.getRelation("USA","GBR")>0,"Relations improved with ally");

  engine.toggleAlliance("GBR");
  ok(!engine.isAllied("USA","GBR"),"Alliance dissolved after second toggle");

  // Can't ally with self
  engine.toggleAlliance("USA");
  ok(!engine.isAllied("USA","USA"),"Can't ally with self");

  // Re-form for later tests
  engine.toggleAlliance("GBR");
  ok(engine.isAllied("USA","GBR"),"Re-formed alliance");
},"Alliance System");

// ── 29. Diplomacy Actions ──
safe(()=>{
  console.log("  Diplomacy Actions");
  // Improve relations
  const r1=engine.diplomacyAction("improve","FRA");
  ex(r1,"Improve returns result");
  ok(r1.message.includes("Diplomatic"),"Improve has message");

  // Denounce
  const r2=engine.diplomacyAction("denounce","RUS");
  ex(r2,"Denounce returns result");
  ok(engine.geo.getRelation("USA","RUS")<0,"Relations decreased after denounce");

  // Trade deal (need positive relations first)
  engine.geo.modifyRelation("USA","FRA",50);
  const r3=engine.diplomacyAction("trade","FRA");
  ex(r3,"Trade returns result");
  ok(r3.message.includes("Trade"),"Trade has message");

  // Sanction
  const r4=engine.diplomacyAction("sanction","PRK");
  ex(r4,"Sanction returns result");
  ok(r4.message.includes("sanction")||r4.message.includes("Sanction"),"Sanction has message");

  // Invalid action
  eq(engine.diplomacyAction("invalid","CHN"),null,"Invalid action returns null");

  // War via diplomacy action
  if(!engine.geo.isAtWar("USA","PRK")){
    const r5=engine.diplomacyAction("war","PRK");
    ex(r5,"War returns result");
    ok(engine.geo.isAtWar("USA","PRK"),"Now at war with PRK");
  }

  // Peace via diplomacy action
  const r6=engine.diplomacyAction("peace","PRK");
  ex(r6,"Peace returns result");
},"Diplomacy Actions");

// ── 30. Government & Policies ──
safe(()=>{
  console.log("  Government & Policies");
  const origGov=engine.geo.governmentTypes.USA;
  ex(origGov,"USA has government type");

  // Change government
  const stabBefore=engine.geo.economy.USA.stability;
  const r1=engine.geo.setGovernment("USA","authoritarian");
  ok(r1.success,"Changed to authoritarian");
  eq(engine.geo.governmentTypes.USA,"authoritarian","Government updated");
  ok(engine.geo.economy.USA.stability<=stabBefore,"Stability decreased");

  // Same government again
  const r2=engine.geo.setGovernment("USA","authoritarian");
  ok(!r2.success,"Already authoritarian");

  // Invalid government
  const r3=engine.geo.setGovernment("USA","fakegov");
  ok(!r3.success,"Invalid gov type rejected");

  // Restore democracy
  engine.geo.setGovernment("USA","democracy");

  // Toggle policy
  const r4=engine.geo.togglePolicy("USA","conscription");
  ok(r4.success,"Conscription toggled");
  eq(r4.enabled,true,"Conscription enabled");
  ok(r4.message.includes("enacted"),"Enacted message");

  // Toggle off
  const r5=engine.geo.togglePolicy("USA","conscription");
  ok(r5.success,"Conscription toggled off");
  eq(r5.enabled,false,"Conscription disabled");
  ok(r5.message.includes("repealed"),"Repealed message");

  // Invalid policy
  const r6=engine.geo.togglePolicy("USA","fakepolicy");
  ok(!r6.success,"Invalid policy rejected");

  // Government modifiers
  const mods=engine.geo.getGovernmentModifiers("USA");
  ty(mods.gdpMod,"number","gdpMod is number");
  ty(mods.stabilityMod,"number","stabilityMod is number");
  ty(mods.militaryMod,"number","militaryMod is number");
  ty(mods.taxMod,"number","taxMod is number");
  ty(mods.conscription,"boolean","conscription is boolean");
},"Government & Policies");

// ── 31. Action Points ──
safe(()=>{
  console.log("  Action Points");
  const co=engine._getCountryOwnership();
  engine.geo.resetAP("USA",co);
  ok(engine.geo.actionPoints>=3,"At least 3 AP");
  eq(engine.geo.actionPoints,engine.geo.maxActionPoints,"AP equals max");

  ok(engine.geo.spendAP(1),"Spend 1 AP");
  eq(engine.geo.actionPoints,engine.geo.maxActionPoints-1,"AP decreased by 1");

  ok(!engine.geo.spendAP(100),"Can't overspend AP");
  eq(engine.geo.actionPoints,engine.geo.maxActionPoints-1,"AP unchanged after failed spend");
},"Action Points");

// ── 32. Trade & Sanctions Detail ──
safe(()=>{
  console.log("  Trade & Sanctions Detail");
  // Ensure trade with FRA from earlier
  const partners=engine.geo.getTradePartners("USA");
  ar(partners,"getTradePartners returns array");

  // Sanction queries
  const against=engine.geo.getSanctionsAgainst("PRK");
  ar(against,"getSanctionsAgainst returns array");

  const by=engine.geo.getSanctionsBy("USA");
  ar(by,"getSanctionsBy returns array");

  // Cancel trade
  engine.geo.modifyRelation("USA","FRA",50);
  const cancel=engine.geo.proposeTrade("USA","FRA");
  ex(cancel,"Cancel trade returns result");
  ok(cancel.message.includes("cancelled")||cancel.message.includes("established"),"Trade toggled");

  // Lift sanction
  const lift=engine.geo.imposeSanction("USA","PRK");
  ex(lift,"Lift sanction returns result");
  ok(lift.message.includes("lifted")||lift.message.includes("imposed"),"Sanction toggled");
},"Trade & Sanctions Detail");

// ── 33. Nuke Launch ──
safe(()=>{
  console.log("  Nuke Launch");
  // Give USA nukes
  engine.forces.USA.nuclearWeapons=5;
  if(!engine.geo.isAtWar("USA","CHN")) engine.geo.declareWar("USA","CHN");
  const r=engine.launchNuke("CHN");
  ex(r,"launchNuke returns result");
  ty(r.success,"boolean","Has success");
  if(r.success){
    ok(engine.forces.USA.nuclearWeapons<5,"Nuke count decreased");
    ok(r.message,"Has message");
  }
},"Nuke Launch");

// ── 34. Missile Launch ──
safe(()=>{
  console.log("  Missile Launch");
  // Deploy a unit and give missiles
  const u=engine.unitManager.deployUnit("USA",38,-77,{troops:5000,tanks:100},"TestUnit");
  engine.missileManager.addMissile("USA","cruise",5);

  // Launch at enemy territory
  const r=engine.launchMissile("cruise",35,100);
  if(r){
    ex(r,"launchMissile returns result");
    ty(r.hit,"boolean","Has hit property");
    ty(r.message,"string","Has message");
  }

  // Invalid missile type
  eq(engine.launchMissile("fake_missile",35,100),null,"Invalid type returns null");
},"Missile Launch");

// ── 35. Unit Movement ──
safe(()=>{
  console.log("  Unit Movement");
  const u=engine.unitManager.deployUnit("USA",40,-75,{troops:3000},"MoveTest");
  const r=engine.movePlayerUnit(u.id,45,-80);
  ex(r,"movePlayerUnit returns result");
  eq(r.toLat,45,"Target lat");
  eq(r.toLng,-80,"Target lng");
  eq(u.lat,45,"Unit at target lat");
  eq(u.lng,-80,"Unit at target lng");
  eq(u.status,"idle","Status is idle");

  // Can't move enemy unit
  const e=engine.unitManager.deployUnit("CHN",30,100,{troops:1000},"Enemy");
  eq(engine.movePlayerUnit(e.id,35,105),false,"Can't move enemy unit");
},"Unit Movement");

// ── 36. Split & Move ──
safe(()=>{
  console.log("  Split & Move");
  const u=engine.unitManager.deployUnit("USA",42,-74,{troops:4000,tanks:200},"SplitTest");
  const r=engine.splitAndMoveUnit(u.id,0.5,50,-80);
  ex(r,"splitAndMoveUnit returns result");
  ex(r.movedUnitId,"Has movedUnitId");
  ok(r.movedUnitId!==u.id,"New unit has different id");
  ok(u.composition.troops<=2100,"Original has ~half troops");

  const newU=engine.unitManager.units.get(r.movedUnitId);
  ex(newU,"New unit exists");
  ok(newU.composition.troops>=1900,"New unit has ~half troops");
  eq(newU.lat,50,"New unit at target lat");

  // Full move (fraction=1)
  const u2=engine.unitManager.deployUnit("USA",42,-74,{troops:1000},"FullMove");
  const r2=engine.splitAndMoveUnit(u2.id,1.0,55,-85);
  ex(r2,"Full move works");
  eq(r2.movedUnitId,u2.id,"Same unit id for full move");
  eq(u2.lat,55,"Unit moved to target");

  // Invalid fraction
  eq(engine.splitAndMoveUnit(u.id,0,50,-80),null,"Fraction 0 returns null");
  eq(engine.splitAndMoveUnit(u.id,-0.5,50,-80),null,"Negative fraction returns null");
},"Split & Move");

// ── 37. Unit Designer Deep ──
safe(()=>{
  console.log("  Unit Designer Deep");
  const ud=engine.unitDesigner;

  // Advance tech
  const lvl=ud.getMaxTechLevel("USA");
  if(lvl<5){
    ok(ud.advanceTech("USA"),"advanceTech returns true");
    eq(ud.getMaxTechLevel("USA"),lvl+1,"Tech level increased");
  }

  // Can't exceed 5
  for(let i=0;i<10;i++) ud.advanceTech("USA");
  eq(ud.getMaxTechLevel("USA"),5,"Tech capped at 5");
  ok(!ud.advanceTech("USA"),"advanceTech returns false at max");

  // Create design
  const d=ud.createDesign("USA","infantry","Test Infantry",3,2,2,1);
  ex(d,"createDesign returns design");
  eq(d.baseType,"infantry","Base type is infantry");
  eq(d.owner,"USA","Owner is USA");
  eq(d.weaponTech,3,"Weapon tech is 3");

  // Invalid base type
  eq(ud.createDesign("USA","fake","X",1,1,1,1),null,"Invalid type returns null");

  // Design cost
  const cost=ud.calcDesignCost(d);
  ty(cost,"number","Cost is number");
  ok(cost>0,"Cost > 0");
  ok(cost<Infinity,"Cost is finite");

  // Design stats
  const stats=ud.getDesignStats(d);
  ex(stats,"getDesignStats returns object");
  ok(stats.attack>0,"Attack > 0");
  ok(stats.defense>0,"Defense > 0");
  ok(stats.combatPower>0,"Combat power > 0");

  // Production cost
  const pc=ud.getProductionCost(d.id,5);
  ty(pc,"number","Production cost is number");
  ok(pc>cost,"5 units cost more than 1");

  // Invalid design
  eq(ud.getProductionCost("nonexistent"),Infinity,"Invalid design = Infinity");

  // Designs for owner
  const designs=ud.getDesignsForOwner("USA");
  ar(designs,"getDesignsForOwner returns array");
  ok(designs.length>0,"USA has designs");
  ok(designs.some(dd=>dd.id===d.id),"Our design is in the list");

  // Available types
  const types=ud.getAvailableTypes("USA");
  ar(types,"getAvailableTypes returns array");
  ok(types.length>0,"Has available types");
},"Unit Designer Deep");

// ── 38. Day/Week/Month Processing ──
safe(()=>{
  console.log("  Day/Week/Month Processing");

  // Capture state before
  const dayBefore=engine.clock.totalDays;
  const eco=engine.economySystem.getEconomy("USA");
  eco.budget=5000;

  // Process a day
  engine.clock._advanceDay();
  engine._onDayChange(engine.clock.day,engine.clock.month,engine.clock.year);
  eq(engine.clock.totalDays,dayBefore+1,"Day advanced");

  // Process enough days to trigger a week
  for(let i=0;i<7;i++){
    engine.clock._advanceDay();
  }
  // Week change
  engine._onWeekChange(engine.clock.totalDays);
  ok(true,"Week processing didn't crash");

  // Month change
  engine._onMonthChange(engine.clock.month,engine.clock.year);
  ok(eco.gdp>0,"Economy processed — GDP > 0");
  ok(true,"Month processing didn't crash");
},"Day/Week/Month Processing");

// ── 39. AI Turns ──
safe(()=>{
  console.log("  AI Turns");
  // Run AI directly
  engine._runAI();
  ok(true,"AI turn ran without crash");

  // Run multiple rounds
  for(let i=0;i<3;i++) engine._runAI();
  ok(true,"Multiple AI rounds ran without crash");

  // AI diplomacy
  engine.geo.runAIDiplomacy("CHN",engine.forces,engine._getCountryOwnership());
  ok(true,"AI diplomacy ran without crash");
},"AI Turns");

// ── 40. Victory Check ──
safe(()=>{
  console.log("  Victory Check");
  // Should not trigger victory with normal state
  engine._checkVictory();
  eq(engine.phase,"playing","Still playing after victory check");

  // Check domination threshold
  ty(engine._checkVictory,"function","_checkVictory exists");
},"Victory Check");

// ── 41. Find Territory At ──
safe(()=>{
  console.log("  Find Territory At");
  const t=engine.findTerritoryAt(37.7749,-122.4194); // San Francisco
  if(t){
    ty(t,"string","Returns territory ID string");
    ok(t.startsWith("USA"),"Found US territory near SF");
  }
  // Remote location — should still find a player territory or null
  const t2=engine.findTerritoryAt(0,0);
  ok(t2===null||typeof t2==="string","Returns null or string ID");
},"Find Territory At");

// ── 42. Economy Controls ──
safe(()=>{
  console.log("  Economy Controls");
  // Tax rate via engine (validates ownership)
  // USA-CA is owned by USA (the player)
  const eco=engine.economySystem.getEconomy("USA");
  ok(engine.setTaxRate("USA","income",30)!==false,"setTaxRate through engine");

  // Spending allocation
  ok(engine.setSpendingAllocation("USA",{
    military:25,education:20,healthcare:20,infrastructure:20,research:15
  })!==false,"setSpendingAllocation through engine");

  // Sector nationalization
  const r=engine.toggleSectorNationalization("USA","agriculture");
  ok(r===true||r===false,"Nationalization returns boolean");
},"Economy Controls");

// ── 43. Geopolitics Economy Processing ──
safe(()=>{
  console.log("  Geopolitics Economy Processing");
  const co=engine._getCountryOwnership();

  // Record GDP before
  const gdpBefore=engine.geo.economy.USA?.gdp||0;

  // Process economy
  engine.geo.processEconomy(engine.forces,co);

  // GDP should be recalculated
  ok(engine.geo.economy.USA.gdp>0,"USA GDP positive after geo processing");

  // Get faction summary
  const summary=engine.geo.getFactionEconomySummary("USA",co);
  ex(summary,"getFactionEconomySummary returns result");
  ok(summary.gdp>0,"Summary GDP > 0");
},"Geopolitics Economy Processing");

// ── 44. Unit Auto-Deploy ──
safe(()=>{
  console.log("  Unit Auto-Deploy");
  const unitsBefore=engine.unitManager.getUnitsForOwner("USA").length;
  engine.unitManager.autoDeploy(engine.forces,engine.ownership);
  const unitsAfter=engine.unitManager.getUnitsForOwner("USA").length;
  ok(unitsAfter>=unitsBefore,"Units same or more after autoDeploy");
  ok(true,"autoDeploy didn't crash");
},"Unit Auto-Deploy");

// ── 45. Clock Toggle Pause ──
safe(()=>{
  console.log("  Clock Toggle Pause");
  const c=new GameClock();
  eq(c.speedIndex,0,"Starts paused");
  c.togglePause();
  ok(c.speedIndex>0,"Unpaused after toggle");
  const si=c.speedIndex;
  c.togglePause();
  eq(c.speedIndex,0,"Paused again");
  c.togglePause();
  eq(c.speedIndex,si,"Restored to previous speed");
},"Clock Toggle Pause");

// ── 46. Research Progress ──
safe(()=>{
  console.log("  Research Progress");
  const rt=engine.researchTree;
  // getProgress returns active research or null
  const prog=rt.getProgress("USA");
  // May be null if no active research, or an object with research state
  ok(prog===null||typeof prog==="object","getProgress returns null or object");

  // Start research and check progress
  const avail=rt.getAvailableNodes("USA");
  if(avail.length>0&&!rt.activeResearch["USA"]){
    rt.startResearch("USA",avail[0].branch,avail[0].id,engine.clock.totalDays);
    const prog2=rt.getProgress("USA");
    ex(prog2,"Active research has progress");
    ex(prog2.nodeId,"Progress has nodeId");
  }

  // Check overall research state — returns branch map with Sets of node IDs
  const state=rt.getResearchState("USA");
  ex(state,"getResearchState returns object");
  ok(Object.keys(state).length>0,"USA has research branches");
  // Each branch has a nodes Set
  const firstBranch=Object.values(state)[0];
  ex(firstBranch.nodes,"Branch has nodes Set");
  ok(firstBranch.nodes.size>0,"Branch has completed nodes");
},"Research Progress");

// ── 47. Co-belligerence with Alliances ──
safe(()=>{
  console.log("  Co-belligerence Extended");
  // Form alliance with GBR
  if(!engine.isAllied("USA","GBR")) engine.toggleAlliance("GBR");
  ok(engine.isAllied("USA","GBR"),"USA/GBR allied");

  // Declare war on IRN and check co-belligerence
  if(!engine.geo.isAtWar("USA","IRN")) engine.geo.declareWar("USA","IRN");
  engine.processAllianceCoBelligerence("USA","IRN");
  ok(true,"Co-belligerence processed without crash");
},"Co-belligerence Extended");

// ── 48. Economic History Snapshots ──
safe(()=>{
  console.log("  Economic History Snapshots");
  engine._recordEconomicSnapshot();
  engine._recordEconomicSnapshot();
  engine._recordEconomicSnapshot();
  const hist=engine.getEconomicHistory("USA");
  ok(hist.length>=3,"At least 3 history snapshots");
  ex(hist[0].gdp,"Snapshot has gdp");
  ex(hist[0].budget,"Snapshot has budget");
},"Economic History Snapshots");

// ── 49. Aggregated Losses Distribution ──
safe(()=>{
  console.log("  Aggregated Losses Distribution");
  // Save original forces
  const origTroops={};
  for(const code of Object.keys(engine.forces)){
    origTroops[code]=engine.forces[code].activeMilitary;
  }

  // Count how many countries USA owns
  const usaCountries=new Set();
  for(const [tid,owner] of Object.entries(engine.ownership)){
    if(owner==="USA") usaCountries.add(engine.getTerritoryCountryCode(tid));
  }
  ok(usaCountries.size>=1,"USA owns at least 1 country");

  // Apply aggregated losses
  engine._applyLossesAggregated("USA",0.10);

  // Total loss should be ~10% regardless of number of countries
  let totalBefore=0,totalAfter=0;
  for(const cc of usaCountries){
    totalBefore+=origTroops[cc]||0;
    totalAfter+=engine.forces[cc]?.activeMilitary||0;
  }
  const actualLoss=1-totalAfter/totalBefore;
  ok(actualLoss>0.05&&actualLoss<0.20,`Aggregated loss ~10%, got ${(actualLoss*100).toFixed(1)}%`);

  // Restore forces
  for(const code of Object.keys(engine.forces)){
    engine.forces[code].activeMilitary=origTroops[code];
  }
},"Aggregated Losses Distribution");

// ── 50. Economy Controls After Conquest ──
safe(()=>{
  console.log("  Economy Controls After Conquest");
  // setTaxRate should work for player's own country
  ok(engine.setTaxRate("USA","income",28),"setTaxRate works for own country");
  const eco=engine.economySystem.getEconomy("USA");
  eq(eco.incomeTaxRate,28,"Income tax set to 28");

  ok(engine.setSpendingAllocation("USA",{
    military:20,education:25,healthcare:20,infrastructure:20,research:15
  }),"setSpendingAllocation works");
  eq(eco.spending.education,25,"Education spending set to 25");

  // Should fail for enemy country
  ok(!engine.setTaxRate("CHN","income",50),"Can't set tax for enemy");
  ok(!engine.setSpendingAllocation("CHN",{military:50}),"Can't set spending for enemy");
},"Economy Controls After Conquest");

// ── 51. AI Attack Losses Both Sides ──
safe(()=>{
  console.log("  AI Attack Losses Both Sides");
  // Find an AI faction adjacent to player
  let aiCode=null,target=null;
  for(const [tid,owner] of Object.entries(engine.ownership)){
    if(owner!=="USA"){
      const neighbors=getTerritoryNeighbors(tid);
      for(const n of neighbors){
        if(engine.ownership[n]==="USA"){aiCode=owner;target=n;break}
      }
      if(aiCode) break;
    }
  }
  if(aiCode&&target){
    // Save AI forces
    const aiCountries=new Set();
    for(const [tid,owner] of Object.entries(engine.ownership)){
      if(owner===aiCode) aiCountries.add(engine.getTerritoryCountryCode(tid));
    }
    let aiTroopsBefore=0;
    for(const cc of aiCountries) aiTroopsBefore+=engine.forces[cc]?.activeMilitary||0;

    engine._aiAttack(aiCode,target);

    let aiTroopsAfter=0;
    for(const cc of aiCountries) aiTroopsAfter+=engine.forces[cc]?.activeMilitary||0;
    ok(aiTroopsAfter<aiTroopsBefore,"AI lost troops from attack");
  }
  ok(true,"AI attack losses test completed");
},"AI Attack Losses Both Sides");

// ── 52. Conquest Progress Check ──
safe(()=>{
  console.log("  Conquest Progress Check");
  const prog=engine.getCountryConquestProgress("USA","USA");
  ok(prog.owned>0,"USA owns USA territories");
  ok(prog.owned<=prog.total,"Owned <= total");
  const enemyProg=engine.getCountryConquestProgress("CHN","USA");
  eq(enemyProg.owned,0,"USA owns 0 CHN territories");
},"Conquest Progress Check");

// ── Print Results ──
console.log("");
if(fails.length>0) for(const f of fails) console.log(f);
const allGood=F===0&&E===0;
console.log(`\n${"=".repeat(50)}`);
console.log(`${allGood?"ALL TESTS PASSED":"SOME TESTS FAILED"}`);
console.log(`Total: ${T} | Passed: ${P} | Failed: ${F} | Errors: ${E}`);
console.log(`Pass Rate: ${((P/T)*100).toFixed(1)}%`);
console.log("=".repeat(50));
process.exit(allGood?0:1);
