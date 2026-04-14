# Agent Debugger

<p align="center">
  <img src="public/logo.svg" alt="Agent Debugger" width="400"/>
</p>

<p align="center">
  <strong>See inside your agent's brain. Like Chrome DevTools, but for AI agents.</strong>
</p>

<p align="center">
  <a href="https://github.com/moggan1337/agent-debugger/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"/>
  </a>
  <a href="https://www.npmjs.com/package/agent-debugger">
    <img src="https://img.shields.io/npm/v/agent-debugger.svg" alt="npm"/>
  </a>
</p>

---

## 🎯 What is Agent Debugger?

Agent Debugger is a visual debugging tool for AI agents. It provides real-time insights into:

- 🧠 **Reasoning Trace** - See every thought, action, and decision
- 📊 **Memory State** - Monitor short-term, long-term, and working memory
- 🔧 **Tool Calls** - Track every tool invocation with timing
- ⚡ **Performance** - Latency, tokens, cost, and throughput
- 🐛 **Error Tracking** - Catch and diagnose failures

## Features

### Reasoning Tracer
```
┌─────────────────────────────────────┐
│  🧠 Reasoning Trace                │
├─────────────────────────────────────┤
│  ○ think: "Analyzing request..."    │
│  │                                  │
│  ○ action: "Calling search API"    │
│  │                                  │
│  ○ observation: "Found 5 results"  │
│  │                                  │
│  ○ decision: "Using result #2"     │
└─────────────────────────────────────┘
```

### Memory Viewer
```
┌─────────────────────────────────────┐
│  📊 Memory State                    │
├─────────────────────────────────────┤
│  Short-term: ████████░░ 80%        │
│  Long-term:  ██████░░░░ 60%        │
│  Working:    ████░░░░░░ 40%        │
│  Semantic:   ███████░░░ 70%         │
└─────────────────────────────────────┘
```

### Tool Tracker
```
┌─────────────────────────────────────┐
│  🔧 Tool Calls                      │
├─────────────────────────────────────┤
│  web-search     ✓ 45ms             │
│  file-read     ✓ 12ms             │
│  code-execute  ✓ 234ms            │
│  api-call      ✗ 1.2s (failed)  │
└─────────────────────────────────────┘
```

### Performance Monitor
```
┌─────────────────────────────────────┐
│  ⚡ Performance                    │
├─────────────────────────────────────┤
│  Latency:    245ms                │
│  Tokens:     12,450                │
│  Cost:       $0.12                │
│  Success:    98.5%                │
└─────────────────────────────────────┘
```

---

## Installation

```bash
npm install agent-debugger
```

Or clone and build:

```bash
git clone https://github.com/moggan1337/agent-debugger.git
cd agent-debugger
npm install
npm run build
```

---

## Quick Start

### Basic Usage

```typescript
import { AgentInspector } from 'agent-debugger';

// Create inspector
const inspector = new AgentInspector();

// Start debug session
inspector.startSession('my-agent');

// Trace your agent
inspector.think('Analyzing user request...');
inspector.act('Calling search API');

const callId = inspector.callTool('search', { query: 'AI agents' });

// Complete the tool call
inspector.completeTool(callId, { results: [...] });

// Check memory
inspector.remember('User wants to search', 'working');

// End session
inspector.endSession();

// Get full report
console.log(inspector.getReport());
```

### Web UI

```typescript
import { AgentInspector } from 'agent-debugger';
import { createDebugServer } from 'agent-debugger/server';

const inspector = new AgentInspector();
const server = createDebugServer(inspector, { port: 3000 });

server.start();
```

Then open http://localhost:3000 to see the visual debugger.

---

## API Reference

### AgentInspector

Main debugger class combining all components.

```typescript
const inspector = new AgentInspector();

// Session management
inspector.startSession(agentId: string): string
inspector.endSession(): void
inspector.pauseSession(): void
inspector.resumeSession(): void
inspector.getState(): DebugState
inspector.getReport(): string

// Reasoning
inspector.think(content: string): string
inspector.act(content: string): string
inspector.observe(content: string): string
inspector.decide(content: string): string
inspector.checkpoint(label: string): string

// Tools
inspector.callTool(name: string, args: object): string
inspector.completeTool(callId: string, result: any): void
inspector.failTool(callId: string, error: string): void

// Memory
inspector.remember(content: string, type?: MemoryType): string

// Performance
inspector.recordLatency(duration: number): void
inspector.recordTokens(input: number, output: number): void

// Export
inspector.export(): string
```

### ReasoningTracer

Tracks agent reasoning step by step.

```typescript
const tracer = new ReasoningTracer();

tracer.startTrace(agentId: string): string
tracer.stopTrace(status?: 'completed' | 'failed' | 'paused'): void

// Events
tracer.think(content: string): string
tracer.act(content: string): string
tracer.observe(content: string): string
tracer.decide(content: string): string
tracer.toolCall(toolName: string, args: object): string
tracer.toolResult(toolName: string, result: any): string
tracer.error(message: string, error?: Error): string
tracer.checkpoint(label: string): string

// Query
tracer.getTrace(traceId: string): ReasoningTrace
tracer.getEventTree(traceId: string): TraceEvent
tracer.getTraceStats(traceId: string): TraceStats
```

### MemoryViewer

Visualizes agent memory state.

```typescript
const viewer = new MemoryViewer();

// Add memories
viewer.addShortTerm(content: string): string
viewer.addLongTerm(content: string, importance?: number): string
viewer.addWorking(content: string): string
viewer.addSemantic(content: string, embedding: number[]): string
viewer.addEpisodic(content: string): string

// Query
viewer.queryMemories(query: MemoryQuery): MemoryEntry[]
viewer.getSnapshot(): MemorySnapshot
viewer.getAccessStats(): AccessStats
viewer.getStats(): MemoryStats
```

### ToolTracker

Tracks tool invocations.

```typescript
const tracker = new ToolTracker();

tracker.startCall(toolName: string, args: object): string
tracker.completeCall(callId: string, result: any): void
tracker.failCall(callId: string, error: string): void

// Query
tracker.getAllCalls(): ToolCall[]
tracker.getToolStats(toolName: string): ToolStats
tracker.getSlowCalls(threshold?: number): ToolCall[]
tracker.getFailedCalls(): ToolCall[]
tracker.getOverallStats(): OverallStats
```

### PerformanceMonitor

Tracks performance metrics.

```typescript
const monitor = new PerformanceMonitor();

monitor.recordMetric(name: string, value: number): void
monitor.recordCPU(usage: number): void
monitor.recordMemory(usage: number): void
monitor.recordTokens(input: number, output: number): void
monitor.recordLatency(duration: number): void
monitor.recordRequest(success: boolean, latency: number, tokens: TokenPair): void

monitor.getSummary(): PerformanceSummary
monitor.getSnapshots(): PerformanceSnapshot[]
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Debugger                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Reasoning  │  │   Memory    │  │    Tool    │        │
│  │   Tracer  │  │   Viewer    │  │   Tracker  │        │
│  └─────┬─────┘  └──────┬──────┘  └──────┬─────┘        │
│        │                 │                 │                │
│        └────────────────┼────────────────┘                │
│                         │                                  │
│                  ┌──────┴──────┐                          │
│                  │  Inspector  │                          │
│                  │  (Unified) │                          │
│                  └──────┬──────┘                          │
│                         │                                  │
│        ┌────────────────┼────────────────┐                │
│        │                │                │                  │
│  ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐        │
│  │    Web    │  │   JSON    │  │  Webhook  │        │
│  │     UI    │  │    API    │  │   Events  │        │
│  └───────────┘  └───────────┘  └───────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Web UI

The debugger includes a full-featured web interface:

### Panels

1. **Trace Timeline** - Visual reasoning flow
2. **Memory State** - Real-time memory visualization
3. **Tool Calls** - Live tool invocation tracking
4. **Performance Metrics** - Latency, tokens, cost
5. **Agent State** - Current status and iteration

### Features

- Real-time updates
- Event filtering
- Search across traces
- Export reports
- Breakpoints
- Session replay

---

## Examples

### Expressive Agent

```typescript
import { AgentInspector } from 'agent-debugger';

const inspector = new AgentInspector();
inspector.startSession('expressive-agent');

// Agent thinking
inspector.think('User wants to build a website');
inspector.act('Analyzing requirements');

// Tool call
const searchId = inspector.callTool('web-search', { query: 'web development trends' });
const results = await performSearch();
inspector.completeTool(searchId, results);

inspector.observe(`Found ${results.length} relevant articles`);

// More reasoning
inspector.decide('Will focus on modern frameworks');

inspector.endSession();
console.log(inspector.getReport());
```

### Debugging Tool Issues

```typescript
const tracker = new ToolTracker();

// Track a problematic tool
const callId = tracker.startCall('database-query', { 
  sql: 'SELECT * FROM users' 
});

try {
  const result = await db.query(sql);
  tracker.completeCall(callId, result);
} catch (error) {
  tracker.failCall(callId, error.message);
  
  // Analyze failures
  const failures = tracker.getFailedCalls();
  console.log('Failed calls:', failures);
}
```

---

## Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE)

---

<p align="center">
  <strong>Debug smarter. Build better agents.</strong>
</p>
