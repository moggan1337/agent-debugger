/**
 * Agent Debugger - Inspector
 * 
 * Main debugger that combines all monitoring components.
 */

import { ReasoningTracer, getTracer } from './tracer.js';
import { MemoryViewer, getMemoryViewer } from './memory-viewer.js';
import { ToolTracker, getToolTracker } from './tool-tracker.js';
import { PerformanceMonitor, getPerformanceMonitor } from './performance-monitor.js';

export interface DebugSession {
  id: string;
  agentId: string;
  startTime: number;
  endTime?: number;
  status: 'active' | 'paused' | 'ended';
}

export interface DebugState {
  session: DebugSession;
  trace: any;
  memory: any;
  tools: any;
  performance: any;
}

/**
 * Agent Inspector
 * 
 * Main debugger combining tracer, memory viewer, tool tracker, and performance monitor.
 */
export class AgentInspector {
  private tracer: ReasoningTracer;
  private memoryViewer: MemoryViewer;
  private toolTracker: ToolTracker;
  private performanceMonitor: PerformanceMonitor;
  private currentSession?: DebugSession;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(
    tracer?: ReasoningTracer,
    memoryViewer?: MemoryViewer,
    toolTracker?: ToolTracker,
    performanceMonitor?: PerformanceMonitor
  ) {
    this.tracer = tracer || getTracer();
    this.memoryViewer = memoryViewer || getMemoryViewer();
    this.toolTracker = toolTracker || getToolTracker();
    this.performanceMonitor = performanceMonitor || getPerformanceMonitor();
  }

  /**
   * Start a debug session
   */
  startSession(agentId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    this.currentSession = {
      id: sessionId,
      agentId,
      startTime: Date.now(),
      status: 'active',
    };

    // Start tracing
    this.tracer.startTrace(agentId, { sessionId });

    this.emit('session:start', this.currentSession);

    return sessionId;
  }

  /**
   * End debug session
   */
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.status = 'ended';
      this.tracer.stopTrace();
      this.emit('session:end', this.currentSession);
      this.currentSession = undefined;
    }
  }

  /**
   * Pause session
   */
  pauseSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'paused';
      this.tracer.stopTrace('paused');
      this.emit('session:pause', this.currentSession);
    }
  }

  /**
   * Resume session
   */
  resumeSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'active';
      this.tracer.startTrace(this.currentSession.agentId, {
        sessionId: this.currentSession.id,
        resumed: true,
      });
      this.emit('session:resume', this.currentSession);
    }
  }

  /**
   * Get current state
   */
  getState(): DebugState | null {
    if (!this.currentSession) return null;

    return {
      session: this.currentSession,
      trace: {
        current: this.tracer.getCurrentTrace(),
        stats: this.tracer.getCurrentTrace() 
          ? this.tracer.getTraceStats(this.tracer.getCurrentTrace()!.id)
          : null,
      },
      memory: {
        snapshot: this.memoryViewer.getSnapshot(),
        stats: this.memoryViewer.getStats(),
        accessStats: this.memoryViewer.getAccessStats(),
      },
      tools: {
        active: this.toolTracker.getActiveCalls(),
        stats: this.toolTracker.getAllStats(),
        overall: this.toolTracker.getOverallStats(),
      },
      performance: {
        summary: this.performanceMonitor.getSummary(),
        snapshots: this.performanceMonitor.getSnapshots().slice(-10),
      },
    };
  }

  /**
   * Add reasoning step
   */
  think(content: string): string {
    return this.tracer.think(content);
  }

  /**
   * Add action
   */
  act(content: string): string {
    return this.tracer.act(content);
  }

  /**
   * Add observation
   */
  observe(content: string): string {
    return this.tracer.observe(content);
  }

  /**
   * Add decision
   */
  decide(content: string): string {
    return this.tracer.decide(content);
  }

  /**
   * Call tool with tracking
   */
  callTool(toolName: string, args: Record<string, any>): string {
    const callId = this.toolTracker.startCall(toolName, args);
    const eventId = this.tracer.toolCall(toolName, args);

    this.performanceMonitor.recordMetric('tools.active', 1, 'count');

    return callId;
  }

  /**
   * Complete tool call
   */
  completeTool(callId: string, result: any): void {
    this.toolTracker.completeCall(callId, result);

    // Update tracer
    const call = this.toolTracker.getCall(callId);
    if (call) {
      this.tracer.toolResult(call.toolName, result);
    }

    this.performanceMonitor.recordMetric('tools.active', 0, 'count');
  }

  /**
   * Fail tool call
   */
  failTool(callId: string, error: string): void {
    this.toolTracker.failCall(callId, error);
    this.tracer.error(error);

    this.performanceMonitor.recordMetric('tools.active', 0, 'count');
  }

  /**
   * Add memory
   */
  remember(content: string, type: 'short-term' | 'long-term' | 'working' | 'semantic' | 'episodic' = 'short-term'): string {
    switch (type) {
      case 'short-term':
        return this.memoryViewer.addShortTerm(content);
      case 'long-term':
        return this.memoryViewer.addLongTerm(content);
      case 'working':
        return this.memoryViewer.addWorking(content);
      case 'semantic':
        return this.memoryViewer.addSemantic(content, []);
      case 'episodic':
        return this.memoryViewer.addEpisodic(content);
    }
  }

  /**
   * Record checkpoint
   */
  checkpoint(label: string): string {
    return this.tracer.checkpoint(label);
  }

  /**
   * Record latency
   */
  recordLatency(duration: number): void {
    this.performanceMonitor.recordLatency(duration);
  }

  /**
   * Record tokens
   */
  recordTokens(input: number, output: number): void {
    this.performanceMonitor.recordTokens(input, output);
  }

  /**
   * Add event listener
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: (data: any) => void): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      for (const callback of listeners) {
        try {
          callback(data);
        } catch (error) {
          console.error('[Inspector] Event handler error:', error);
        }
      }
    }
  }

  /**
   * Get trace tree for visualization
   */
  getTraceTree(): any {
    const trace = this.tracer.getCurrentTrace();
    if (!trace) return null;
    return this.tracer.getEventTree(trace.id);
  }

  /**
   * Get all traces
   */
  getAllTraces() {
    return this.tracer.getAllTraces();
  }

  /**
   * Export debug data
   */
  export(): string {
    return JSON.stringify({
      session: this.currentSession,
      traces: this.tracer.getAllTraces(),
      memory: this.memoryViewer.export(),
      tools: this.toolTracker.export(),
      performance: this.performanceMonitor.export(),
    }, null, 2);
  }

  /**
   * Get summary report
   */
  getReport(): string {
    const state = this.getState();
    if (!state) return 'No active session';

    const lines: string[] = [
      '╔══════════════════════════════════════════════════════════════╗',
      '║              Agent Debugger Report                         ║',
      '╠══════════════════════════════════════════════════════════════╣',
      `║ Session: ${(state.session.id).padEnd(49)}║`,
      `║ Agent:   ${(state.session.agentId).padEnd(49)}║`,
      `║ Status:  ${(state.session.status).padEnd(49)}║`,
      '╠══════════════════════════════════════════════════════════════╣',
      '║ TRACE                                                   ║',
    ];

    if (state.trace.stats) {
      lines.push(`║   Events: ${String(state.trace.stats.totalEvents).padEnd(47)}║`);
      lines.push(`║   Duration: ${(state.trace.stats.duration + 'ms').padEnd(44)}║`);
      lines.push(`║   Tool Calls: ${String(state.trace.stats.toolCalls).padEnd(43)}║`);
      lines.push(`║   Errors: ${String(state.trace.stats.errors).padEnd(47)}║`);
    }

    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║ MEMORY                                                   ║');
    lines.push(`║   Total: ${String(state.memory.stats.total).padEnd(46)}║`);
    for (const [type, count] of Object.entries(state.memory.stats.byType)) {
      lines.push(`║   ${type.padEnd(12)}: ${String(count).padEnd(43)}║`);
    }

    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║ TOOLS                                                    ║');
    lines.push(`║   Total Calls: ${String(state.tools.overall.totalCalls).padEnd(41)}║`);
    lines.push(`║   Success Rate: ${(state.tools.overall.successRate * 100).toFixed(1) + '%'.padEnd(40)}║`);
    lines.push(`║   Avg Duration: ${state.tools.overall.avgDuration.toFixed(0) + 'ms'.padEnd(41)}║`);

    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║ PERFORMANCE                                              ║');
    lines.push(`║   Total Tokens: ${String(state.performance.summary.totalTokens).padEnd(42)}║`);
    lines.push(`║   Total Cost: $${state.performance.summary.totalCost.toFixed(6).padEnd(44)}║`);
    lines.push(`║   Avg Latency: ${state.performance.summary.avgLatency.toFixed(0) + 'ms'.padEnd(42)}║`);
    lines.push(`║   Success Rate: ${(state.performance.summary.successRate * 100).toFixed(1) + '%'.padEnd(43)}║`);
    lines.push('╚══════════════════════════════════════════════════════════════╝');

    return lines.join('\n');
  }
}

// Factory function
export function createInspector(): AgentInspector {
  return new AgentInspector();
}

// Re-export everything
export { ReasoningTracer } from './tracer.js';
export { MemoryViewer } from './memory-viewer.js';
export { ToolTracker } from './tool-tracker.js';
export { PerformanceMonitor } from './performance-monitor.js';
