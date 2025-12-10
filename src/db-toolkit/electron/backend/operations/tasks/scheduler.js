/**
 * Adaptive task scheduler.
 */

class AdaptiveScheduler {
  constructor() {
    this.taskStats = {};
    this.lastActivity = Date.now();
    this.activityThreshold = 300000; // 5 minutes
  }

  recordActivity() {
    this.lastActivity = Date.now();
  }

  isSystemIdle() {
    return (Date.now() - this.lastActivity) > this.activityThreshold;
  }

  getAdaptiveInterval(taskName, baseInterval, idleMultiplier = 2.0) {
    if (this.isSystemIdle()) {
      return Math.floor(baseInterval * idleMultiplier);
    }
    return baseInterval;
  }

  recordTaskExecution(taskName, duration, itemsProcessed = 0) {
    if (!this.taskStats[taskName]) {
      this.taskStats[taskName] = {
        executions: 0,
        totalDuration: 0,
        totalItems: 0,
        lastExecution: null
      };
    }

    const stats = this.taskStats[taskName];
    stats.executions++;
    stats.totalDuration += duration;
    stats.totalItems += itemsProcessed;
    stats.lastExecution = new Date().toISOString();
  }

  getStats() {
    return {
      taskStats: this.taskStats,
      lastActivity: this.lastActivity,
      isIdle: this.isSystemIdle()
    };
  }
}

const scheduler = new AdaptiveScheduler();

module.exports = { scheduler };
