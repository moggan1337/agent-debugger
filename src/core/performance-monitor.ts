/**
 * Agent Debugger - Performance Monitor
 * 
 * Tracks agent performance metrics.
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceSnapshot {
  timestamp: number;
  cpu: number;
  memory: number;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  latency: number;
  throughput: number;
}

export interface AgentMetrics {
  agentId: string;
  uptime: number;
  requestsProcessed: number;
  requestsFailed: number;
  avgLatency: number;
  totalTokens: number;
  totalCost: number;
  successRate: number;
}

/**
 * Performance Monitor
 * 
 * Tracks CPU, memory, tokens, cost, and latency.
 */
export class PerformanceMonitor {
  private metrics: Map<string, MetricBuffer> = new Map();
  private snapshots: PerformanceSnapshot[] = [];
  private maxSnapshots = 100;
  private startTime = Date.now();
  private tokenCost = 0.00001; // Cost per token (configurable)

  /**
   * Record a metric
   */
  recordMetric(name: string, value: number, unit?: string, metadata?: Record<string, any>): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, new MetricBuffer(name));
    }
    
    this.metrics.get(name)!.add({
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata,
    });
  }

  /**
   * Record CPU usage
   */
  recordCPU(usage: number): void {
    this.recordMetric('cpu.usage', usage, '%');
  }

  /**
   * Record memory usage
   */
  recordMemory(usage: number): void {
    this.recordMetric('memory.usage', usage, 'MB');
  }

  /**
   * Record token usage
   */
  recordTokens(input: number, output: number): void {
    this.recordMetric('tokens.input', input, 'tokens');
    this.recordMetric('tokens.output', output, 'tokens');
    this.recordMetric('tokens.total', input + output, 'tokens');
    
    const cost = (input + output) * this.tokenCost;
    this.recordMetric('cost.total', cost, 'USD');
  }

  /**
   * Record latency
   */
  recordLatency(duration: number): void {
    this.recordMetric('latency.request', duration, 'ms');
  }

  /**
   * Record request
   */
  recordRequest(success: boolean, latency: number, tokens: { input: number; output: number }): void {
    this.recordLatency(latency);
    this.recordTokens(tokens.input, tokens.output);
    this.recordMetric('requests.total', 1, 'count');
    this.recordMetric('requests.success', success ? 1 : 0, 'count');
    
    // Take snapshot every N requests
    const totalRequests = this.getMetric('requests.total')?.length || 0;
    if (totalRequests % 10 === 0) {
      this.takeSnapshot();
    }
  }

  /**
   * Take a performance snapshot
   */
  takeSnapshot(): PerformanceSnapshot {
    const cpu = this.getLatestMetric('cpu.usage')?.value || 0;
    const memory = this.getLatestMetric('memory.usage')?.value || 0;
    const inputTokens = this.getLatestMetric('tokens.input')?.value || 0;
    const outputTokens = this.getLatestMetric('tokens.output')?.value || 0;
    const latency = this.getLatestMetric('latency.request')?.value || 0;
    const cost = this.getLatestMetric('cost.total')?.value || 0;

    // Calculate throughput (requests per second over last minute)
    const recentRequests = this.getMetricsInRange('requests.total', Date.now() - 60000);
    const throughput = recentRequests.length / 60;

    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      cpu,
      memory,
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost,
      latency,
      throughput,
    };

    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get snapshots
   */
  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Get all metrics for a name
   */
  getMetric(name: string): PerformanceMetric[] {
    return this.metrics.get(name)?.getAll() || [];
  }

  /**
   * Get latest metric value
   */
  getLatestMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name)?.getLatest();
  }

  /**
   * Get metrics in time range
   */
  getMetricsInRange(name: string, start: number, end: number = Date.now()): PerformanceMetric[] {
    return this.metrics.get(name)?.getInRange(start, end) || [];
  }

  /**
   * Get statistics for a metric
   */
  getStats(name: string): {
    count: number;
    min: number;
    max: number;
    avg: number;
    latest: number;
  } | null {
    const buffer = this.metrics.get(name);
    if (!buffer) return null;

    const values = buffer.getAll().map(m => m.value);
    if (values.length === 0) return null;

    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      latest: values[values.length - 1],
    };
  }

  /**
   * Get overall agent metrics
   */
  getAgentMetrics(): AgentMetrics {
    const uptime = Date.now() - this.startTime;
    
    const totalRequests = this.getMetric('requests.total').length;
    const failedRequests = this.getMetric('requests.success')
      .filter(m => m.value === 0).length;
    
    const latencies = this.getMetric('latency.request').map(m => m.value);
    const avgLatency = latencies.length > 0 
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length 
      : 0;

    const totalTokens = this.getMetric('tokens.total')
      .reduce((sum, m) => sum + m.value, 0);
    
    const totalCost = this.getMetric('cost.total')
      .reduce((sum, m) => sum + m.value, 0);

    return {
      agentId: 'agent',
      uptime,
      requestsProcessed: totalRequests,
      requestsFailed: failedRequests,
      avgLatency,
      totalTokens,
      totalCost,
      successRate: totalRequests > 0 ? (totalRequests - failedRequests) / totalRequests : 0,
    };
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    uptime: number;
    snapshots: number;
    metrics: string[];
    currentCPU: number;
    currentMemory: number;
    avgLatency: number;
    totalTokens: number;
    totalCost: number;
    successRate: number;
  } {
    const agentMetrics = this.getAgentMetrics();

    return {
      uptime: agentMetrics.uptime,
      snapshots: this.snapshots.length,
      metrics: Array.from(this.metrics.keys()),
      currentCPU: this.getLatestMetric('cpu.usage')?.value || 0,
      currentMemory: this.getLatestMetric('memory.usage')?.value || 0,
      avgLatency: agentMetrics.avgLatency,
      totalTokens: agentMetrics.totalTokens,
      totalCost: agentMetrics.totalCost,
      successRate: agentMetrics.successRate,
    };
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    const data: Record<string, any> = {
      snapshots: this.snapshots,
      metrics: {},
    };

    for (const [name, buffer] of this.metrics) {
      data.metrics[name] = buffer.getAll();
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear();
    this.snapshots = [];
    this.startTime = Date.now();
  }
}

/**
 * Metric Buffer - Circular buffer for metrics
 */
class MetricBuffer {
  private name: string;
  private metrics: PerformanceMetric[] = [];
  private maxSize = 1000;

  constructor(name: string) {
    this.name = name;
  }

  add(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxSize) {
      this.metrics.shift();
    }
  }

  getAll(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getLatest(): PerformanceMetric | undefined {
    return this.metrics[this.metrics.length - 1];
  }

  getInRange(start: number, end: number): PerformanceMetric[] {
    return this.metrics.filter(m => m.timestamp >= start && m.timestamp <= end);
  }
}

// Singleton
let monitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
}
