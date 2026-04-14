/**
 * Agent Debugger - Reasoning Tracer
 * 
 * Tracks and visualizes agent reasoning steps.
 */

export type TraceEvent = {
  id: string;
  type: 'thought' | 'action' | 'observation' | 'decision' | 'tool-call' | 'tool-result' | 'error' | 'checkpoint';
  timestamp: number;
  duration?: number;
  data: {
    content: string;
    metadata?: Record<string, any>;
  };
  parentId?: string;
  children?: string[];
  collapsed?: boolean;
};

export interface ReasoningTrace {
  id: string;
  agentId: string;
  sessionId: string;
  events: TraceEvent[];
  startTime: number;
  endTime?: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  metadata?: Record<string, any>;
}

export interface TraceQuery {
  type?: TraceEvent['type'][];
  search?: string;
  timeRange?: { start: number; end: number };
  limit?: number;
  offset?: number;
}

/**
 * Reasoning Tracer
 * 
 * Records and queries agent reasoning traces.
 */
export class ReasoningTracer {
  private traces: Map<string, ReasoningTrace> = new Map();
  private currentTrace?: ReasoningTrace;
  private eventIndex: Map<string, TraceEvent> = new Map();

  /**
   * Start a new trace
   */
  startTrace(agentId: string, metadata?: Record<string, any>): string {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const trace: ReasoningTrace = {
      id: traceId,
      agentId,
      sessionId: `session_${Date.now()}`,
      events: [],
      startTime: Date.now(),
      status: 'running',
      metadata,
    };

    this.traces.set(traceId, trace);
    this.currentTrace = trace;

    console.log(`[Tracer] Started trace: ${traceId}`);
    return traceId;
  }

  /**
   * Stop the current trace
   */
  stopTrace(status: ReasoningTrace['status'] = 'completed'): void {
    if (this.currentTrace) {
      this.currentTrace.endTime = Date.now();
      this.currentTrace.status = status;
      console.log(`[Tracer] Stopped trace: ${this.currentTrace.id}`);
      this.currentTrace = undefined;
    }
  }

  /**
   * Add an event to the current trace
   */
  addEvent(
    type: TraceEvent['type'],
    content: string,
    metadata?: Record<string, any>,
    parentId?: string
  ): string {
    if (!this.currentTrace) {
      console.warn('[Tracer] No active trace');
      return '';
    }

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const event: TraceEvent = {
      id: eventId,
      type,
      timestamp: Date.now(),
      data: { content, metadata },
      parentId,
    };

    // Index by ID
    this.eventIndex.set(eventId, event);

    // Add to trace
    this.currentTrace.events.push(event);

    // Update parent's children
    if (parentId) {
      const parent = this.eventIndex.get(parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(eventId);
      }
    }

    return eventId;
  }

  /**
   * Add a thought event
   */
  think(content: string, metadata?: Record<string, any>): string {
    return this.addEvent('thought', content, metadata);
  }

  /**
   * Add an action event
   */
  act(content: string, metadata?: Record<string, any>): string {
    return this.addEvent('action', content, metadata);
  }

  /**
   * Add an observation event
   */
  observe(content: string, metadata?: Record<string, any>): string {
    return this.addEvent('observation', content, metadata);
  }

  /**
   * Add a decision event
   */
  decide(content: string, metadata?: Record<string, any>): string {
    return this.addEvent('decision', content, metadata);
  }

  /**
   * Add a tool call event
   */
  toolCall(toolName: string, args: Record<string, any>, parentId?: string): string {
    return this.addEvent('tool-call', `${toolName}(${JSON.stringify(args)})`, { toolName, args }, parentId);
  }

  /**
   * Add a tool result event
   */
  toolResult(toolName: string, result: any, parentId?: string): string {
    const content = typeof result === 'string' 
      ? result 
      : JSON.stringify(result).slice(0, 200) + (JSON.stringify(result).length > 200 ? '...' : '');
    return this.addEvent('tool-result', content, { toolName, result }, parentId);
  }

  /**
   * Add an error event
   */
  error(message: string, error?: Error): string {
    return this.addEvent('error', message, { 
      stack: error?.stack,
      name: error?.name 
    });
  }

  /**
   * Add a checkpoint
   */
  checkpoint(label: string, metadata?: Record<string, any>): string {
    return this.addEvent('checkpoint', label, metadata);
  }

  /**
   * Get trace by ID
   */
  getTrace(traceId: string): ReasoningTrace | undefined {
    return this.traces.get(traceId);
  }

  /**
   * Get current trace
   */
  getCurrentTrace(): ReasoningTrace | undefined {
    return this.currentTrace;
  }

  /**
   * Get all traces
   */
  getAllTraces(): ReasoningTrace[] {
    return Array.from(this.traces.values());
  }

  /**
   * Query traces
   */
  queryTraces(query: TraceQuery): ReasoningTrace[] {
    let traces = this.getAllTraces();

    if (query.search) {
      const search = query.search.toLowerCase();
      traces = traces.filter(trace =>
        trace.events.some(event =>
          event.data.content.toLowerCase().includes(search)
        )
      );
    }

    if (query.timeRange) {
      traces = traces.filter(trace =>
        trace.startTime >= query.timeRange!.start &&
        trace.startTime <= query.timeRange!.end
      );
    }

    traces.sort((a, b) => b.startTime - a.startTime);

    if (query.limit) {
      const offset = query.offset || 0;
      traces = traces.slice(offset, offset + query.limit);
    }

    return traces;
  }

  /**
   * Get event by ID
   */
  getEvent(eventId: string): TraceEvent | undefined {
    return this.eventIndex.get(eventId);
  }

  /**
   * Get event tree for visualization
   */
  getEventTree(traceId: string): TraceEvent | null {
    const trace = this.traces.get(traceId);
    if (!trace || trace.events.length === 0) return null;

    // Find root events (no parent)
    const roots = trace.events.filter(e => !e.parentId);
    
    if (roots.length === 0) return null;

    // If single root, return it
    if (roots.length === 1) return this.enrichEvent(roots[0], trace.events);

    // If multiple roots, create virtual root
    return {
      id: 'root',
      type: 'checkpoint',
      timestamp: trace.startTime,
      data: { content: 'Session Start', metadata: { isRoot: true } },
      children: roots.map(r => this.enrichEvent(r, trace.events)),
    };
  }

  /**
   * Enrich event with children
   */
  private enrichEvent(event: TraceEvent, allEvents: TraceEvent[]): TraceEvent {
    const children = allEvents.filter(e => e.parentId === event.id);
    return {
      ...event,
      children: children.length > 0 
        ? children.map(c => this.enrichEvent(c, allEvents))
        : undefined,
    };
  }

  /**
   * Get statistics for a trace
   */
  getTraceStats(traceId: string): {
    totalEvents: number;
    byType: Record<string, number>;
    duration: number;
    toolCalls: number;
    errors: number;
  } {
    const trace = this.traces.get(traceId);
    if (!trace) {
      return { totalEvents: 0, byType: {}, duration: 0, toolCalls: 0, errors: 0 };
    }

    const byType: Record<string, number> = {};
    let toolCalls = 0;
    let errors = 0;

    for (const event of trace.events) {
      byType[event.type] = (byType[event.type] || 0) + 1;
      if (event.type === 'tool-call') toolCalls++;
      if (event.type === 'error') errors++;
    }

    return {
      totalEvents: trace.events.length,
      byType,
      duration: (trace.endTime || Date.now()) - trace.startTime,
      toolCalls,
      errors,
    };
  }

  /**
   * Clear old traces
   */
  clearOldTraces(maxAge: number = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - maxAge;
    let cleared = 0;

    for (const [id, trace] of this.traces) {
      if (trace.startTime < cutoff) {
        this.traces.delete(id);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Export trace as JSON
   */
  exportTrace(traceId: string): string {
    const trace = this.traces.get(traceId);
    if (!trace) return '';
    return JSON.stringify(trace, null, 2);
  }

  /**
   * Import trace from JSON
   */
  importTrace(json: string): string | null {
    try {
      const trace = JSON.parse(json) as ReasoningTrace;
      this.traces.set(trace.id, trace);
      
      // Re-index events
      for (const event of trace.events) {
        this.eventIndex.set(event.id, event);
      }

      return trace.id;
    } catch (error) {
      console.error('[Tracer] Import failed:', error);
      return null;
    }
  }
}

// Singleton instance
let tracerInstance: ReasoningTracer | null = null;

export function getTracer(): ReasoningTracer {
  if (!tracerInstance) {
    tracerInstance = new ReasoningTracer();
  }
  return tracerInstance;
}
