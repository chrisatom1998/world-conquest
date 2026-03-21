/* ============================================================
   WORLD CONQUEST — Game Clock (Real-Time System)
   Replaces turn/AP system with continuous time simulation
   ============================================================ */

const GAME_SPEEDS = {
  0: { label: "⏸ Paused",  multiplier: 0,    key: "0" },
  1: { label: "▶ Normal",   multiplier: 1,    key: "1" },
  2: { label: "▶▶ Fast",    multiplier: 3,    key: "2" },
  3: { label: "▶▶▶ Faster", multiplier: 10,   key: "3" },
  4: { label: "⏩ Ultra",   multiplier: 30,   key: "4" },
  5: { label: "⚡ Max",     multiplier: 100,  key: "5" }
};

class GameClock {
  constructor() {
    /** Game date tracking */
    this.year = 2026;
    this.month = 1;  // 1–12
    this.day = 1;    // 1–30 (simplified)

    /** Total elapsed game days */
    this.totalDays = 0;

    /** Speed index (0 = paused, 1–5 = speeds) */
    this.speedIndex = 0;

    /** Internal timing */
    this._lastFrameTime = 0;
    this._rafId = null;
    this._running = false;

    /** Accumulated fractional days for smooth time advancement */
    this._dayAccumulator = 0;

    /**
     * 1 real second = N game-days at 1x speed.
     * At 1x, 1 real second = 1 game day (a full game year takes ~6 min).
     */
    this.baseDaysPerSecond = 1;

    /** Callbacks */
    this.onTick = null;        // (deltaDays: number) => void — fires every frame
    this.onDayChange = null;   // (day, month, year) => void
    this.onMonthChange = null; // (month, year) => void
    this.onWeekChange = null;  // (totalDays) => void
  }

  /** Get current speed multiplier */
  get speedMultiplier() {
    return GAME_SPEEDS[this.speedIndex]?.multiplier || 0;
  }

  /** Get current speed label */
  get speedLabel() {
    return GAME_SPEEDS[this.speedIndex]?.label || "Paused";
  }

  /** Get formatted date string */
  get dateString() {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${this.day} ${months[this.month - 1]} ${this.year}`;
  }

  /** Get short date string for HUD */
  get shortDateString() {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[this.month - 1]} ${this.year}`;
  }

  /**
   * Start the game clock loop.
   */
  start() {
    if (this._running) return;
    this._running = true;
    this._lastFrameTime = performance.now();
    this._loop();
  }

  /**
   * Stop the clock loop entirely.
   */
  stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /**
   * Set speed by index (0–5).
   */
  setSpeed(index) {
    this.speedIndex = Math.max(0, Math.min(5, index));
  }

  /**
   * Toggle pause/unpause (returns to last non-zero speed or 1).
   */
  togglePause() {
    if (this.speedIndex === 0) {
      this.setSpeed(this._lastSpeed || 1);
    } else {
      this._lastSpeed = this.speedIndex;
      this.setSpeed(0);
    }
  }

  /**
   * Main animation loop.
   * @private
   */
  _loop() {
    if (!this._running) return;

    const now = performance.now();
    const realDeltaSeconds = (now - this._lastFrameTime) / 1000;
    this._lastFrameTime = now;

    // Cap delta to prevent huge jumps (e.g. tab was background)
    const cappedDelta = Math.min(realDeltaSeconds, 0.1);

    if (this.speedMultiplier > 0) {
      const gameDaysDelta = cappedDelta * this.baseDaysPerSecond * this.speedMultiplier;
      this._dayAccumulator += gameDaysDelta;

      // Process full days
      let daysAdvanced = 0;
      while (this._dayAccumulator >= 1) {
        this._dayAccumulator -= 1;
        daysAdvanced++;
        this._advanceDay();
      }

      // Fire tick callback with fractional days for smooth updates
      if (this.onTick) {
        this.onTick(gameDaysDelta);
      }
    }

    this._rafId = requestAnimationFrame(() => this._loop());
  }

  /**
   * Advance the calendar by one day.
   * @private
   */
  _advanceDay() {
    this.day++;
    this.totalDays++;

    // Fire day change
    if (this.onDayChange) this.onDayChange(this.day, this.month, this.year);

    // Weekly check (every 7 days)
    if (this.totalDays % 7 === 0 && this.onWeekChange) {
      this.onWeekChange(this.totalDays);
    }

    // Month rollover (30-day months for simplicity)
    if (this.day > 30) {
      this.day = 1;
      this.month++;

      if (this.month > 12) {
        this.month = 1;
        this.year++;
      }

      if (this.onMonthChange) this.onMonthChange(this.month, this.year);
    }
  }

  /**
   * Get elapsed months since start.
   */
  get elapsedMonths() {
    return Math.floor(this.totalDays / 30);
  }

  /**
   * Check if N game-days have passed since a reference day.
   */
  hasDaysPassed(referenceTotalDays, requiredDays) {
    return (this.totalDays - referenceTotalDays) >= requiredDays;
  }
}
