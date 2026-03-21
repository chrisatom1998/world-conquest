/* ============================================================
   WORLD CONQUEST - App Bootstrap
   Starts the browser app
   ============================================================ */

(async function main() {
  const controller = new GameController("map");
  await controller.init();
})();
