/**
 * Agent Debugger - Tool Tracker
 * 
 * Tracks all tool calls with timing and results.
 */

export interface ToolCall {
  id: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
  error?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface ToolStats {
  toolName: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  lastCalled: number;
  successRate: number;
}

export interface ToolQuery {
  toolName?: string;
  status?: ToolCall['status'];
  timeRange?: { start: number; end: number };
  limit?: number;
}

/**
 * Tool Tracker
 * 
 * Tracks all tool invocations with detailed timing.
 */
export class ToolTracker {
  private calls: Map<string, ToolCall> = new Map();
  private currentCall?: ToolCall;
  private toolStats: Map<string, ToolStats> = new Map();

  /**
   * Start tracking a tool call
   */
  startCall(toolName: string, args: Record<string, any>, metadata?: Record<string, any>): string {
    const id = `tool_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const call: ToolCall = {
      id,
      toolName,
      args,
      status: 'pending',
      startTime: Date.now(),
      metadata,
    };

    this.calls.set(id, call);
    this.currentCall = call;

    return id;
  }

  /**
   * Mark call as running
   */
  startRunning(callId?: string): void {
    const call = callId ? this.calls.get(callId) : this.currentCall;
    if (call) {
      call.status = 'running';
    }
  }

  /**
   * Complete a tool call
   */
  completeCall(callId: string, result: any): void {
    const call = this.calls.get(callId);
    if (call) {
      call.status = 'completed';
      call.result = result;
      call.endTime = Date.now();
      call.duration = call.endTime - call.startTime;
      this.updateStats(call);
    }
  }

  /**
   * Fail a tool call
   */
  failCall(callId: string, error: string | Error): void {
    const call = this.calls.get(callId);
    if (call) {
      call.status = 'failed';
      call.error = error instanceof Error ? error.message : error;
      call.endTime = Date.now();
      call.duration = call.endTime - call.startTime;
      this.updateStats(call);
    }
  }

  /**
   * Update statistics for a tool
   */
  private updateStats(call: ToolCall): void {
    let stats = this.toolStats.get(call.toolName);

    if (!stats) {
      stats = {
        toolName: call.toolName,
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        lastCalled: 0,
        successRate: 0,
      };
      this.toolStats.set(call.toolName, stats);
    }

    stats.totalCalls++;
    stats.lastCalled = Date.now();

    if (call.status === 'completed') {
      stats.successfulCalls++;
    } else {
      stats.failedCalls++;
    }

    if (call.duration !== undefined) {
      stats.avgDuration = (stats.avgDuration * (stats.totalCalls - 1) + call.duration) / stats.totalCalls;
      stats.minDuration = Math.min(stats.minDuration, call.duration);
      stats.maxDuration = Math.max(stats.maxDuration, call.duration);
    }

    stats.successRate = stats.successfulCalls / stats.totalCalls;
  }

  /**
   * Get call by ID
   */
  getCall(callId: string): ToolCall | undefined {
    return this.calls.get(callId);
  }

  /**
   * Get all calls
   */
  getAllCalls(): ToolCall[] {
    return Array.from(this.calls.values())
      .sort((a, b) => b.startTime - a.startTime);
  }

  /**
   * Query calls
   */
  queryCalls(query: ToolQuery): ToolCall[] {
    let results = this.getAllCalls();

    if (query.toolName) {
      results = results.filter(c => c.toolName === query.toolName);
    }

    if (query.status) {
      results = results.filter(c => c.status === query.status);
    }

    if (query.timeRange) {
      results = results.filter(c =>
        c.startTime >= query.timeRange!.start &&
        c.startTime <= query.timeRange!.end
      );
    }

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Get calls for current trace
   */
  getCurrentCalls(): ToolCall[] {
    return Array.from(this.calls.values())
      .filter(c => c.startTime > (Date.now() - 60 * 60 * 1000))
      .sort((a, b) => b.startTime - a.startTime);
  }

  /**
   * Get all tool statistics
   */
  getAllStats(): ToolStats[] {
    return Array.from(this.toolStats.values())
      .sort((a, b) => b.totalCalls - a.totalCalls);
  }

  /**
   * Get stats for a specific tool
   */
  getToolStats(toolName: string): ToolStats | undefined {
    return this.toolStats.get(toolName);
  }

  /**
   * Get slow calls (above average)
   */
  getSlowCalls(threshold: number = 1.5): ToolCall[] {
    const results: ToolCall[] = [];

    for (const [toolName, stats] of this.toolStats) {
      const thresholdDuration = stats.avgDuration * threshold;
      
      for (const call of this.calls.values()) {
        if (call.toolName === toolName && 
            call.duration && 
            call.duration > thresholdDuration) {
          results.push(call);
        }
      }
    }

    return results.sort((a, b) => (b.duration || 0) - (a.duration || 0));
  }

  /**
   * Get failed calls
   */
  getFailedCalls(): ToolCall[] {
    return this.queryCalls({ status: 'failed' });
  }

  /**
   * Get pending calls
   */
  getPendingCalls(): ToolCall[] {
    return this.queryCalls({ status: 'pending' });
  }

  /**
   * Get active calls (pending or running)
   */
  getActiveCalls(): ToolCall[] {
    const pending = this.queryCalls({ status: 'pending' });
    const running = this.queryCalls({ status: 'running' });
    return [...pending, ...running];
  }

  /**
   * Get overall statistics
   */
  getOverallStats(): {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    avgDuration: number;
    totalDuration: number;
    uniqueTools: number;
    successRate: number;
  } {
    let totalCalls = 0;
    let successfulCalls = 0;
    let failedCalls = 0;
    let totalDuration = 0;

    for (const call of this.calls.values()) {
      totalCalls++;
      if (call.status === 'completed') successfulCalls++;
      if (call.status === 'failed') failedCalls++;
      if (call.duration) totalDuration += call.duration;
    }

    return {
      totalCalls,
      successfulCalls,
      failedCalls,
      avgDuration: totalCalls > 0 ? totalDuration / totalCalls : 0,
      totalDuration,
      uniqueTools: this.toolStats.size,
      successRate: totalCalls > 0 ? successfulCalls / totalCalls : 0,
    };
  }

  /**
   * Get timeline of calls
   */
  getTimeline(limit: number = 50): Array<{
    timestamp: number;
    toolName: string;
    duration?: number;
    status: ToolCall['status'];
  }> {
    return this.getAllCalls()
      .slice(0, limit)
      .map(call => ({
        timestamp: call.startTime,
        toolName: call.toolName,
        duration: call.duration,
        status: call.status,
      }));
  }

  /**
   * Clear old calls
   */
  clearOldCalls(maxAge: number = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - maxAge;
    let cleared = 0;

    for (const [id, call] of this.calls) {
      if (call.startTime < cutoff) {
        this.calls.delete(id);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Export calls as JSON
   */
  export(): string {
    return JSON.stringify({
      calls: Array.from(this.calls.values()),
      stats: Array.from(this.toolStats.values()),
    }, null, 2);
  }
}

// Singleton
let trackerInstance: ToolTracker | null = null;

export function getToolTracker(): ToolTracker {
  if (!trackerInstance) {
    trackerInstance = new ToolTracker();
  }
  return trackerInstance;
}
