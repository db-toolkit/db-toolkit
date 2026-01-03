/**
 * Session Analytics
 * Tracks session duration and patterns
 */

class SessionAnalytics {
  constructor(telemetryManager) {
    this.telemetry = telemetryManager;
    this.sessions = [];
    this.currentSession = null;
  }

  /**
   * Start a new session
   */
  startSession(metadata = {}) {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      endTime: null,
      duration: null,
      ...metadata
    };

    this.telemetry.trackSessionStart();
  }

  /**
   * End current session
   */
  endSession() {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;

    // Store session data
    this.sessions.push(this.currentSession);
    
    // Track session end
    this.telemetry.trackSessionEnd();

    // Keep only last 100 sessions
    if (this.sessions.length > 100) {
      this.sessions = this.sessions.slice(-100);
    }

    this.currentSession = null;
  }

  /**
   * Get session statistics
   */
  getSessionStats(days = 30) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recentSessions = this.sessions.filter(s => s.startTime > cutoff);

    if (recentSessions.length === 0) {
      return {
        totalSessions: 0,
        avgDuration: 0,
        totalDuration: 0,
        longestSession: 0,
        shortestSession: 0,
        sessionsPerDay: 0
      };
    }

    const durations = recentSessions.map(s => s.duration);
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

    return {
      totalSessions: recentSessions.length,
      avgDuration: Math.round(totalDuration / recentSessions.length),
      totalDuration,
      longestSession: Math.max(...durations),
      shortestSession: Math.min(...durations),
      sessionsPerDay: Math.round((recentSessions.length / days) * 10) / 10
    };
  }

  /**
   * Get daily usage pattern
   */
  getDailyPattern(days = 7) {
    const pattern = new Map();
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

    this.sessions
      .filter(s => s.startTime > cutoff)
      .forEach(session => {
        const day = new Date(session.startTime).toLocaleDateString();
        const hour = new Date(session.startTime).getHours();
        
        if (!pattern.has(day)) {
          pattern.set(day, []);
        }
        
        pattern.get(day).push({
          hour,
          duration: session.duration
        });
      });

    return Object.fromEntries(pattern);
  }

  /**
   * Get peak usage hours
   */
  getPeakUsageHours(days = 30) {
    const hourCounts = new Array(24).fill(0);
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

    this.sessions
      .filter(s => s.startTime > cutoff)
      .forEach(session => {
        const hour = new Date(session.startTime).getHours();
        hourCounts[hour]++;
      });

    return hourCounts
      .map((count, hour) => ({ hour: hour, count, percentage: Math.round((count / this.sessions.length) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 peak hours
  }

  /**
   * Get session duration breakdown
   */
  getDurationBreakdown(days = 30) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recentSessions = this.sessions.filter(s => s.startTime > cutoff);

    if (recentSessions.length === 0) {
      return { short: 0, medium: 0, long: 0 };
    }

    const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;

    let breakdown = { short: 0, medium: 0, long: 0 };

    recentSessions.forEach(session => {
      const ratio = session.duration / avgDuration;
      if (ratio < 0.8) {
        breakdown.short++;
      } else if (ratio < 1.2) {
        breakdown.medium++;
      } else {
        breakdown.long++;
      }
    });

    return breakdown;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get current session info
   */
  getCurrentSession() {
    return this.currentSession ? {
      id: this.currentSession.id,
      duration: Date.now() - this.currentSession.startTime,
      startTime: this.currentSession.startTime
    } : null;
  }

  /**
   * Clear session history
   */
  clearHistory() {
    this.sessions = [];
    this.currentSession = null;
  }
}

module.exports = { SessionAnalytics };