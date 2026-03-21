const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Wait for game to initialize
  await new Promise(r => setTimeout(r, 2000));
  
  // Start the campaign as USA
  await page.waitForSelector('.country-card[data-code="USA"]');
  await page.click('.country-card[data-code="USA"]');
  await page.click('#btn-start');
  
  // Wait for game map to load
  await new Promise(r => setTimeout(r, 2000));

  const canAttackAny = await page.evaluate(() => {
    const engine = window.app.engine;
    let attackable = false;
    let logs = [];
    
    // Check if USA can attack MEX-BCN
    const canAtt = engine.canAttack("MEX-BCN");
    logs.push(`engine.canAttack("MEX-BCN"): ${canAtt}`);
    logs.push(`engine.ownership['MEX-BCN']: ${engine.ownership["MEX-BCN"]}`);
    logs.push(`engine.playerCode: ${engine.playerCode}`);
    
    // Target country bounds fallback
    const neighbors = window.NEIGHBORS["USA"] || [];
    logs.push(`NEIGHBORS['USA']: ${neighbors.join(', ')}`);
    
    return logs;
  });

  console.log("Evaluation Results:");
  canAttackAny.forEach(l => console.log(l));
  
  await browser.close();
})();
