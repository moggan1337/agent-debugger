# Agent Debugger
## 🎬 Demo
![Agent Debugger Demo](demo.gif)

*Watch your agent's reasoning unfold step by step*

## Screenshots
| Component | Preview |
|-----------|---------|
| Agent Tree View | ![tree](screenshots/tree-view.png) |
| Tool Call Graph | ![graph](screenshots/tool-graph.png) |
| Message Timeline | ![timeline](screenshots/timeline.png) |

## Visual Description
The debugger presents agent cognition as an interactive tree with expandable nodes showing thoughts, decisions, and tool calls. The tool call graph visualizes dependencies between operations. Timeline shows message exchanges with latency and token usage breakdown.

---



[![CI](https://github.com/moggan1337/agent-debugger/actions/workflows/ci.yml/badge.svg)](https://github.com/moggan1337/agent-debugger/actions/workflows/ci.yml)

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
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="node"/>
  </a>
</p>

---

## 🎯 What is Agent Debugger?

Agent Debugger is a visual debugging toolkit designed specifically for AI agents. It provides developers with unprecedented visibility into the inner workings of autonomous AI systems, making it easier to understand, debug, and optimize agent behavior.

Think of it as Chrome DevTools for your AI agents - giving you real-time insights into decision-making processes, memory usage, tool invocations, and performance characteristics.

### Key Capabilities

Agent Debugger provides real-time insights into:

- 🧠 **Reasoning Trace** - See every thought, action, and decision your agent makes
- 📊 **Memory State** - Monitor short-term, long-term, and working memory in real-time
- 🔧 **Tool Calls** - Track every tool invocation with detailed timing and results
- ⚡ **Performance** - Analyze latency, token usage, cost, and throughput metrics
- 🐛 **Error Tracking** - Catch, diagnose, and understand failures quickly

### Why Use Agent Debugger?

Building and debugging AI agents is notoriously difficult because:

1. **Opacity** - Traditional debugging tools can't see inside LLM reasoning
2. **Complexity** - Agents make many API calls and memory operations
3. **Latency** - Understanding slow responses requires detailed timing data
4. **Cost** - Token usage can spiral without visibility into consumption
5. **Memory Leaks** - Agents can accumulate memory without proper monitoring

Agent Debugger solves these problems by providing comprehensive instrumentation for your agent applications.

---

## 📐 Detailed Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AGENT DEBUGGER ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           YOUR AI AGENT APPLICATION                         │ │
│  │                                                                             │ │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │   │   Reasoning  │  │    Memory    │  │     Tool     │  │  Performance │ │ │
│  │   │   Module     │  │    Module    │  │    Module    │  │    Module    │ │ │
│  │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │ │
│  │          │                 │                 │                 │          │ │
│  └──────────┼─────────────────┼─────────────────┼─────────────────┼──────────┘ │
│             │                 │                 │                 │            │
│             └─────────────────┼─────────────────┼─────────────────┘            │
│                               │                     │                            │
│                      ┌────────┴─────────────────────┴────────┐                 │
│                      │            AGENT INSPECTOR              │                 │
│                      │  ┌─────────────────────────────────┐    │                 │
│                      │  │     Unified Debug Interface     │    │                 │
│                      │  │  • Event Aggregation            │    │                 │
│                      │  │  • Session Management           │    │                 │
│                      │  │  • Real-time State Updates      │    │                 │
│                      │  │  • Cross-component Correlation  │    │                 │
│                      │  └─────────────────────────────────┘    │                 │
│                      └──────────────────┬─────────────────────┘                 │
│                                         │                                          │
│            ┌────────────────────────────┼────────────────────────────────┐       │
│            │                            │                                │       │
│  ┌─────────┴─────────┐    ┌─────────────┴─────────────┐    ┌───────────┴──────┐ │
│  │     WEB UI        │    │        JSON API           │    │   WEBHOOK EVENTS │ │
│  │                   │    │                           │    │                   │ │
│  │ • Timeline View   │    │  • REST Endpoints        │    │ • session:start  │ │
│  │ • Memory Browser  │    │  • WebSocket Streaming   │    │ • session:end    │ │
│  │ • Tool Inspector   │    │  • Query Interface       │    │ • tool:call      │ │
│  │ • Performance     │    │  • Export/Import          │    │ • tool:complete  │ │
│  │   Dashboard       │    │                           │    │ • memory:update  │ │
│  │ • Search & Filter │    │                           │    │ • error:occurred │ │
│  └───────────────────┘    └───────────────────────────┘    └───────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CORE COMPONENTS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ReasoningTracer                                  │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Event Types:                                                 │   │    │
│  │  │  • thought      - Internal reasoning steps                   │   │    │
│  │  │  • action       - Actions taken by the agent                 │   │    │
│  │  │  • observation  - Information perceived                       │   │    │
│  │  │  • decision     - Choices made by the agent                  │   │    │
│  │  │  • tool-call    - Tool invocations                           │   │    │
│  │  │  • tool-result  - Results from tool calls                     │   │    │
│  │  │  • error        - Errors encountered                         │   │    │
│  │  │  • checkpoint   - Named checkpoints for navigation            │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    MemoryViewer                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Memory Types:                                                │   │    │
│  │  │  • short-term   - Recent context and temporary data           │   │    │
│  │  │  • long-term    - Persistent, important information           │   │    │
│  │  │  • working      - Active processing information               │   │    │
│  │  │  • semantic     - Embedding-based semantic memories           │   │    │
│  │  │  • episodic     - Experience and event records                │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ToolTracker                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Tracking Features:                                          │   │    │
│  │  │  • Call identification and correlation                      │   │    │
│  │  │  • Duration timing with millisecond precision                │   │    │
│  │  │  • Success/failure status tracking                           │   │    │
│  │  │  • Argument and result recording                             │   │    │
│  │  │  • Per-tool and aggregate statistics                         │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    PerformanceMonitor                               │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Metrics Tracked:                                           │   │    │
│  │  │  • CPU usage percentage                                     │   │    │
│  │  │  • Memory consumption (MB)                                   │   │    │
│  │  │  • Token usage (input/output/total)                         │   │    │
│  │  │  • Request latency (ms)                                     │   │    │
│  │  │  • Cost calculations (USD)                                   │   │    │
│  │  │  • Throughput (requests per second)                          │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Debugging Workflow Explained

Understanding the complete debugging workflow helps you get the most out of Agent Debugger.

### Step 1: Initialize the Inspector

```typescript
import { AgentInspector } from 'agent-debugger';

// Create the main inspector instance
const inspector = new AgentInspector();

// Optional: Attach event listeners for real-time monitoring
inspector.on('session:start', (session) => {
  console.log(`Debug session started: ${session.id}`);
});

inspector.on('tool:call', (data) => {
  console.log(`Tool called: ${data.toolName}`);
});
```

### Step 2: Start a Debug Session

```typescript
// Start a debug session for your agent
const sessionId = inspector.startSession('my-agent-v1');

// The session captures all agent activity from this point
```

### Step 3: Instrument Your Agent Code

Wrap your agent's operations with debug calls:

```typescript
// Trace reasoning
inspector.think('Analyzing user query...');
inspector.act('Searching for relevant documents');
inspector.observe('Found 15 relevant documents');

// Track tool calls
const searchCallId = inspector.callTool('document-search', {
  query: 'machine learning',
  limit: 10
});

// ... execute the actual tool ...
const results = await performSearch('machine learning', 10);

inspector.completeTool(searchCallId, results);

// Continue reasoning
inspector.decide('Using top 5 results for response');
inspector.observe('Response generation complete');
```

### Step 4: Monitor Memory State

```typescript
// Add memories to track agent's information state
inspector.remember('User is interested in ML', 'working');
inspector.remember('Previous query about algorithms', 'short-term');
inspector.remember('Core ML concepts learned', 'long-term', 0.9);

// Query memory state
const memorySnapshot = inspector.getState().memory;
console.log('Current memory usage:', memorySnapshot.stats.total, 'entries');
```

### Step 5: Track Performance

```typescript
// Record performance metrics
inspector.recordLatency(245);
inspector.recordTokens(1500, 350);

// Or let the inspector auto-track tool calls
const callId = inspector.callTool('expensive-operation', {});
const startTime = Date.now();

await expensiveOperation();

inspector.completeTool(callId, { success: true });
```

### Step 6: Generate Debug Report

```typescript
// End the session
inspector.endSession();

// Get comprehensive report
const report = inspector.getReport();
console.log(report);

// Export raw data for analysis
const rawData = inspector.export();
```

---

## ✨ Features

### Reasoning Tracer

The Reasoning Tracer captures every step of your agent's thought process, providing a complete timeline of decision-making.

```typescript
import { ReasoningTracer } from 'agent-debugger';

const tracer = new ReasoningTracer();
tracer.startTrace('my-agent');

// Log reasoning steps
tracer.think('User wants to book a flight to New York');
tracer.act('Parsing travel dates from query');
tracer.observe('Departure: 2024-03-15, Return: 2024-03-20');
tracer.decide('Searching for flights matching criteria');

// Nested reasoning with parent-child relationships
const parentEvent = tracer.act('Searching for flights');
tracer.toolCall('flight-search', { destination: 'NYC', dates: '...' }, parentEvent);
tracer.toolResult('flight-search', { flights: [...] }, parentEvent);

tracer.stopTrace();
```

**Output Visualization:**

```
┌─────────────────────────────────────┐
│  🧠 Reasoning Trace                │
├─────────────────────────────────────┤
│  ○ think: "Analyzing request..."    │
│  │                                  │
│  ○ action: "Calling search API"    │
│  │    └── tool-call: search(...)   │
│  │        tool-result: [...]       │
│  │                                  │
│  ○ observation: "Found 5 results"  │
│  │                                  │
│  ○ decision: "Using result #2"     │
└─────────────────────────────────────┘
```

### Memory Viewer

Track all memory types your agent uses:

```typescript
import { MemoryViewer } from 'agent-debugger';

const viewer = new MemoryViewer();

// Add different memory types
viewer.addShortTerm('Current conversation context');
viewer.addWorking('Processing active request');
viewer.addLongTerm('User preferences', 0.8);
viewer.addSemantic('Machine learning concepts', [0.1, 0.3, ...]);
viewer.addEpisodic('User asked about pricing at 2:30 PM');

// Query memories
const results = viewer.queryMemories({
  type: ['working', 'short-term'],
  minImportance: 0.5,
  limit: 10
});

// Get snapshot
const snapshot = viewer.getSnapshot();
console.log('Memory usage:', snapshot.memoryUsage, 'bytes');
```

**Memory Type Explanations:**

| Type | Purpose | Retention | Typical Use |
|------|---------|-----------|-------------|
| `short-term` | Temporary context | Seconds to minutes | Current conversation turn |
| `working` | Active processing | During task execution | Processing current request |
| `long-term` | Persistent facts | Minutes to hours | User preferences, learned facts |
| `semantic` | Meaning-based | Long-term | Knowledge with embeddings |
| `episodic` | Experiences | Long-term | Past interactions, events |

**Visual Memory State:**

```
┌─────────────────────────────────────┐
│  📊 Memory State                    │
├─────────────────────────────────────┤
│  Short-term: ████████░░ 80%        │
│  Long-term:  ██████░░░░ 60%        │
│  Working:    ████░░░░░░ 40%        │
│  Semantic:   ███████░░░ 70%        │
│  Episodic:    ███░░░░░░░ 30%        │
│                                     │
│  Total: 47 entries | 12.4 KB        │
└─────────────────────────────────────┘
```

### Tool Tracker

Monitor every tool your agent calls with detailed timing:

```typescript
import { ToolTracker } from 'agent-debugger';

const tracker = new ToolTracker();

// Track tool calls
const callId = tracker.startCall('web-search', {
  query: 'latest AI developments',
  limit: 5
});

// Simulate tool execution
tracker.startRunning(callId);
const results = await searchWeb('latest AI developments', 5);
tracker.completeCall(callId, results);

// Handle failures gracefully
const badCallId = tracker.startCall('database-query', {
  sql: 'SELECT * FROM invalid_table'
});

try {
  const result = await db.query('SELECT * FROM invalid_table');
  tracker.completeCall(badCallId, result);
} catch (error) {
  tracker.failCall(badCallId, error.message);
}

// Query tool statistics
const stats = tracker.getToolStats('web-search');
console.log(`Success rate: ${(stats.successRate * 100).toFixed(1)}%`);
console.log(`Avg duration: ${stats.avgDuration.toFixed(2)}ms`);

// Get slow calls for optimization
const slowCalls = tracker.getSlowCalls(2.0); // 2x average threshold
slowCalls.forEach(call => {
  console.log(`Slow call: ${call.toolName} took ${call.duration}ms`);
});
```

**Tool Call Output:**

```
┌─────────────────────────────────────┐
│  🔧 Tool Calls                      │
├─────────────────────────────────────┤
│  web-search     ✓ 45ms             │
│  file-read     ✓ 12ms             │
│  database-...  ✗ 1.2s (failed)    │
│  code-execute  ✓ 234ms            │
│  api-call      ✓ 89ms             │
├─────────────────────────────────────┤
│  Total: 5 | Success: 80%           │
│  Avg Duration: 140ms               │
└─────────────────────────────────────┘
```

### Performance Monitor

Comprehensive performance tracking:

```typescript
import { PerformanceMonitor } from 'agent-debugger';

const monitor = new PerformanceMonitor();

// Record various metrics
monitor.recordCPU(45.2);
monitor.recordMemory(128.5);
monitor.recordTokens(1500, 350);
monitor.recordLatency(245);

// Record a complete request
monitor.recordRequest(true, 245, { input: 1500, output: 350 });

// Get agent metrics
const metrics = monitor.getAgentMetrics();
console.log(`
  Uptime: ${(metrics.uptime / 1000).toFixed(1)}s
  Requests: ${metrics.requestsProcessed}
  Success Rate: ${(metrics.successRate * 100).toFixed(1)}%
  Total Cost: $${metrics.totalCost.toFixed(6)}
`);

// Get performance snapshots
const snapshots = monitor.getSnapshots();
console.log('Recent snapshots:', snapshots.length);
```

**Performance Dashboard:**

```
┌─────────────────────────────────────┐
│  ⚡ Performance                    │
├─────────────────────────────────────┤
│  Latency:    245ms                │
│  Tokens:     12,450                │
│  Cost:       $0.12                │
│  Success:    98.5%                │
│  CPU:        45.2%                │
│  Memory:     128.5 MB             │
└─────────────────────────────────────┘
```

---

## 🚀 Installation and Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager

### Install via npm

```bash
npm install agent-debugger
```

### Install via yarn

```bash
yarn add agent-debugger
```

### Install via pnpm

```bash
pnpm add agent-debugger
```

### Clone and Build from Source

```bash
# Clone the repository
git clone https://github.com/moggan1337/agent-debugger.git
cd agent-debugger

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Start development mode with watch
npm run dev
```

### TypeScript Configuration

Ensure your `tsconfig.json` supports ES modules:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 📖 Usage Examples

### Basic Usage

The simplest way to start debugging your agent:

```typescript
import { AgentInspector } from 'agent-debugger';

// Create inspector
const inspector = new AgentInspector();

// Start debug session
inspector.startSession('my-first-agent');

// Trace your agent's reasoning
inspector.think('Analyzing user request...');
inspector.act('Calling search API');

// Track a tool call
const callId = inspector.callTool('search', { query: 'AI agents' });

// Complete the tool call (after actual execution)
inspector.completeTool(callId, { results: ['result1', 'result2'] });

// Check memory
inspector.remember('User wants to search', 'working');
inspector.remember('Search completed', 'short-term');

// Record performance
inspector.recordLatency(245);
inspector.recordTokens(1500, 350);

// End session
inspector.endSession();

// Get full report
console.log(inspector.getReport());
```

### Web UI Setup

Launch the visual debugger interface:

```typescript
import { AgentInspector } from 'agent-debugger';
import { createDebugServer } from 'agent-debugger/server';

const inspector = new AgentInspector();
const server = createDebugServer(inspector, { port: 3000 });

await server.start();

console.log('Debug UI available at http://localhost:3000');
```

### Expressive Agent Example

A complete example showing all features:

```typescript
import { AgentInspector } from 'agent-debugger';

async function runExpressiveAgent() {
  const inspector = new AgentInspector();
  inspector.startSession('expressive-agent');

  // Phase 1: Understanding
  inspector.think('User wants to find information about web development');
  inspector.act('Parsing query intent');
  inspector.observe('Query type: informational search');

  // Phase 2: Search
  const searchId = inspector.callTool('web-search', {
    query: 'web development best practices 2024',
    limit: 10
  });

  inspector.observe('Calling search API...');
  const searchResults = await performSearch('web development best practices 2024');
  inspector.completeTool(searchId, searchResults);

  inspector.observe(`Found ${searchResults.length} results`);

  // Phase 3: Analysis
  inspector.think('Analyzing search results for relevance');
  inspector.decide('Filtering to top 5 most relevant results');

  // Add to memory
  inspector.remember('User interested in web dev trends', 'working');
  inspector.remember('2024 is current year', 'long-term');

  // Phase 4: Response
  inspector.act('Generating response with curated results');
  inspector.think('Response ready');

  inspector.endSession();

  // Print report
  console.log(inspector.getReport());

  return inspector.export();
}

runExpressiveAgent();
```

### Debugging Tool Issues

Identify and diagnose problematic tool calls:

```typescript
import { ToolTracker } from 'agent-debugger';

async function debugToolIssues() {
  const tracker = new ToolTracker();

  // Track multiple tool calls
  const tools = [
    { name: 'database-query', args: { sql: 'SELECT * FROM users' } },
    { name: 'web-search', args: { query: 'test' } },
    { name: 'file-read', args: { path: '/data/file.json' } },
  ];

  for (const tool of tools) {
    const callId = tracker.startCall(tool.name, tool.args);

    try {
      const result = await executeTool(tool.name, tool.args);
      tracker.completeCall(callId, result);
    } catch (error) {
      tracker.failCall(callId, error.message);
    }
  }

  // Analyze failures
  const failures = tracker.getFailedCalls();
  console.log('\n❌ Failed Calls:');
  failures.forEach(call => {
    console.log(`  ${call.toolName}: ${call.error}`);
  });

  // Find slow calls
  const slowCalls = tracker.getSlowCalls(1.5);
  console.log('\n🐢 Slow Calls (>1.5x avg):');
  slowCalls.forEach(call => {
    console.log(`  ${call.toolName}: ${call.duration}ms`);
  });

  // Get per-tool statistics
  console.log('\n📊 Tool Statistics:');
  const allStats = tracker.getAllStats();
  allStats.forEach(stat => {
    console.log(`  ${stat.toolName}:`);
    console.log(`    Calls: ${stat.totalCalls}`);
    console.log(`    Success: ${(stat.successRate * 100).toFixed(1)}%`);
    console.log(`    Avg: ${stat.avgDuration.toFixed(2)}ms`);
  });
}

async function executeTool(name: string, args: any) {
  // Simulated tool execution
  return { success: true, data: [] };
}

debugToolIssues();
```

### Memory Analysis Example

Track and analyze agent memory usage:

```typescript
import { MemoryViewer } from 'agent-debugger';

function analyzeMemory() {
  const viewer = new MemoryViewer();

  // Simulate agent memory operations
  viewer.addShortTerm('Current request: user asking about pricing');
  viewer.addWorking('Processing: calculating quote for tier-2 plan');

  viewer.addLongTerm('User is enterprise customer', 0.9);
  viewer.addLongTerm('Prefers detailed explanations', 0.7);

  viewer.addSemantic('Cloud computing concepts', [0.1, 0.2, 0.3]);
  viewer.addSemantic('Enterprise pricing models', [0.4, 0.5, 0.6]);

  viewer.addEpisodic('User upgraded plan on 2024-01-15');
  viewer.addEpisodic('User asked about API limits on 2024-02-20');

  // Query different memory types
  console.log('\n📊 Memory Analysis:');
  console.log('==================\n');

  // Working memory
  const working = viewer.getByType('working');
  console.log('Working Memory:');
  working.forEach(m => console.log(`  • ${m.content}`));

  // Important long-term memories
  const important = viewer.queryMemories({
    type: ['long-term'],
    minImportance: 0.7
  });
  console.log('\nImportant Long-term:');
  important.forEach(m => console.log(`  • ${m.content}`));

  // Recent episodic memories
  const stats = viewer.getStats();
  console.log('\nMemory Statistics:');
  console.log(`  Total entries: ${stats.total}`);
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  // Access patterns
  const accessStats = viewer.getAccessStats();
  console.log(`\nTotal memory accesses: ${accessStats.totalAccesses}`);

  return viewer.getSnapshot();
}

analyzeMemory();
```

### Advanced: Custom Event Handling

Listen to debug events for custom processing:

```typescript
import { AgentInspector } from 'agent-debugger';

const inspector = new AgentInspector();

// Set up event listeners
inspector.on('session:start', (session) => {
  console.log(`[EVENT] Session started: ${session.id}`);
  // Send to your analytics service
});

inspector.on('session:end', (session) => {
  console.log(`[EVENT] Session ended: ${session.id}`);
  console.log(`  Duration: ${session.endTime! - session.startTime}ms`);
});

inspector.on('tool:call', (data) => {
  console.log(`[EVENT] Tool call: ${data.toolName}`);
  // Log for monitoring
});

inspector.on('tool:complete', (data) => {
  console.log(`[EVENT] Tool completed: ${data.toolName} (${data.duration}ms)`);
});

inspector.on('tool:error', (data) => {
  console.error(`[EVENT] Tool error: ${data.toolName} - ${data.error}`);
  // Alert on failures
});

inspector.on('memory:update', (data) => {
  console.log(`[EVENT] Memory updated: ${data.type} memory`);
});

inspector.on('error:occurred', (data) => {
  console.error(`[EVENT] Error: ${data.message}`);
  // Send to error tracking service
});

// Start using the inspector
inspector.startSession('event-demo');

// Your agent code here...

inspector.endSession();
```

### Advanced: Multi-Agent Debugging

Debug scenarios with multiple agents:

```typescript
import { AgentInspector, ReasoningTracer } from 'agent-debugger';

function debugMultiAgent() {
  // Create separate inspectors for each agent
  const orchestratorInspector = new AgentInspector();
  const searchInspector = new AgentInspector();
  const synthesisInspector = new AgentInspector();

  // Start sessions for each
  orchestratorInspector.startSession('orchestrator-agent');
  searchInspector.startSession('search-agent');
  synthesisInspector.startSession('synthesis-agent');

  // Simulate orchestration
  orchestratorInspector.think('User wants comprehensive research report');

  // Search agent works
  searchInspector.think('Searching for relevant sources');
  const searchCallId = searchInspector.callTool('web-search', {
    query: 'latest AI research trends'
  });
  searchInspector.completeTool(searchCallId, { sources: [...] });

  // Synthesis agent combines results
  synthesisInspector.think('Synthesizing search results into report');
  synthesisInspector.act('Formatting response with citations');

  // Orchestrator completes
  orchestratorInspector.decide('Report generation complete');
  orchestratorInspector.endSession();

  searchInspector.endSession();
  synthesisInspector.endSession();

  // Compare performance across agents
  console.log('\n📊 Multi-Agent Comparison:');
  console.log('========================\n');

  console.log('Orchestrator:');
  console.log(orchestratorInspector.getReport());

  console.log('\nSearch Agent:');
  console.log(searchInspector.getReport());

  console.log('\nSynthesis Agent:');
  console.log(synthesisInspector.getReport());
}

debugMultiAgent();
```

---

## 📚 API Reference

### AgentInspector

The main unified debugging interface that combines all components.

#### Constructor

```typescript
constructor(
  tracer?: ReasoningTracer,
  memoryViewer?: MemoryViewer,
  toolTracker?: ToolTracker,
  performanceMonitor?: PerformanceMonitor
)
```

Creates a new inspector with optional custom component implementations.

#### Session Management

```typescript
// Start a new debug session
startSession(agentId: string): string
// Returns: Session ID

// End the current session
endSession(): void

// Pause the session (tracing continues but marked as paused)
pauseSession(): void

// Resume a paused session
resumeSession(): void

// Get current debug state
getState(): DebugState | null
```

#### Reasoning Methods

```typescript
// Add reasoning events
think(content: string, metadata?: Record<string, any>): string
act(content: string, metadata?: Record<string, any>): string
observe(content: string, metadata?: Record<string, any>): string
decide(content: string, metadata?: Record<string, any>): string

// Add a checkpoint for navigation
checkpoint(label: string, metadata?: Record<string, any>): string

// All methods return: Event ID
```

#### Tool Tracking Methods

```typescript
// Start tracking a tool call
callTool(name: string, args: Record<string, any>): string
// Returns: Call ID for correlation

// Complete a tracked tool call
completeTool(callId: string, result: any): void

// Mark a tool call as failed
failTool(callId: string, error: string): void
```

#### Memory Methods

```typescript
// Add a memory entry
remember(
  content: string,
  type?: 'short-term' | 'long-term' | 'working' | 'semantic' | 'episodic'
): string
// Returns: Memory ID

// Default type is 'short-term'
```

#### Performance Methods

```typescript
// Record latency in milliseconds
recordLatency(duration: number): void

// Record token usage
recordTokens(input: number, output: number): void
```

#### Event Handling

```typescript
// Subscribe to events
on(event: string, callback: (data: any) => void): void

// Unsubscribe from events
off(event: string, callback: (data: any) => void): void

// Available events:
// - 'session:start' - Session started
// - 'session:end' - Session ended
// - 'session:pause' - Session paused
// - 'session:resume' - Session resumed
// - 'tool:call' - Tool call started
// - 'tool:complete' - Tool call completed
// - 'tool:error' - Tool call failed
// - 'memory:update' - Memory updated
// - 'error:occurred' - Error occurred
```

#### Export Methods

```typescript
// Get formatted text report
getReport(): string

// Export all data as JSON string
export(): string

// Get trace tree for visualization
getTraceTree(): TraceEvent | null

// Get all traces
getAllTraces(): ReasoningTrace[]
```

### ReasoningTracer

Tracks agent reasoning step by step.

#### Constructor

```typescript
constructor()
```

#### Trace Management

```typescript
// Start a new trace
startTrace(agentId: string, metadata?: Record<string, any>): string
// Returns: Trace ID

// Stop the current trace
stopTrace(status?: 'completed' | 'failed' | 'paused'): void

// Get current trace
getCurrentTrace(): ReasoningTrace | undefined

// Get trace by ID
getTrace(traceId: string): ReasoningTrace | undefined

// Get all traces
getAllTraces(): ReasoningTrace[]

// Query traces with filters
queryTraces(query: TraceQuery): ReasoningTrace[]
```

#### Event Recording

```typescript
// Add reasoning events
think(content: string, metadata?: Record<string, any>): string
act(content: string, metadata?: Record<string, any>): string
observe(content: string, metadata?: Record<string, any>): string
decide(content: string, metadata?: Record<string, any>): string
checkpoint(label: string, metadata?: Record<string, any>): string

// Tool-related events
toolCall(toolName: string, args: object, parentId?: string): string
toolResult(toolName: string, result: any, parentId?: string): string

// Error event
error(message: string, error?: Error): string

// All return: Event ID
```

#### Trace Analysis

```typescript
// Get event tree for visualization
getEventTree(traceId: string): TraceEvent | null

// Get statistics for a trace
getTraceStats(traceId: string): {
  totalEvents: number;
  byType: Record<string, number>;
  duration: number;
  toolCalls: number;
  errors: number;
}

// Get single event
getEvent(eventId: string): TraceEvent | undefined
```

#### Import/Export

```typescript
// Export trace as JSON
exportTrace(traceId: string): string

// Import trace from JSON
importTrace(json: string): string | null

// Clear old traces
clearOldTraces(maxAge?: number): number
// Default maxAge: 24 hours in milliseconds
```

### MemoryViewer

Visualizes and manages agent memory state.

#### Constructor

```typescript
constructor()
```

#### Memory Addition

```typescript
// Add memories of specific types
addShortTerm(content: string, metadata?: Record<string, any>): string
addLongTerm(content: string, importance?: number, metadata?: Record<string, any>): string
addWorking(content: string, metadata?: Record<string, any>): string
addSemantic(content: string, embedding: number[], metadata?: Record<string, any>): string
addEpisodic(content: string, metadata?: Record<string, any>): string

// Generic memory addition
addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'accessCount'>): string

// All return: Memory ID
```

#### Memory Access

```typescript
// Access memory (tracks access count)
accessMemory(id: string): MemoryEntry | undefined

// Get single memory
getMemory(id: string): MemoryEntry | undefined

// Get memories by type
getByType(type: MemoryEntry['type']): MemoryEntry[]

// Query memories with filters
queryMemories(query: MemoryQuery): MemoryEntry[]
```

#### Snapshot and Statistics

```typescript
// Get current memory snapshot
getSnapshot(): MemorySnapshot

// Get memory history
getHistory(): MemorySnapshot[]

// Get access statistics
getAccessStats(): {
  totalAccesses: number;
  mostAccessed: Array<{ id: string; content: string; count: number }>;
  recentAccesses: Array<{ id: string; timestamp: number }>;
}

// Get memory statistics
getStats(): {
  total: number;
  byType: Record<string, number>;
  avgImportance: number;
  totalSize: number;
  snapshots: number;
}
```

#### Memory Management

```typescript
// Delete a memory entry
deleteMemory(id: string): boolean

// Clear all memories
clear(): void

// Export memories
export(): string

// Import memories
import(json: string): boolean
```

### ToolTracker

Tracks all tool invocations with timing and results.

#### Constructor

```typescript
constructor()
```

#### Tool Call Tracking

```typescript
// Start tracking a call
startCall(toolName: string, args: object, metadata?: Record<string, any>): string
// Returns: Call ID

// Mark call as running
startRunning(callId?: string): void

// Complete a call
completeCall(callId: string, result: any): void

// Fail a call
failCall(callId: string, error: string | Error): void
```

#### Call Retrieval

```typescript
// Get single call
getCall(callId: string): ToolCall | undefined

// Get all calls (sorted by time, newest first)
getAllCalls(): ToolCall[]

// Query calls with filters
queryCalls(query: ToolQuery): ToolCall[]

// Get current/historical calls
getCurrentCalls(): ToolCall[]

// Get pending calls
getPendingCalls(): ToolCall[]

// Get active calls (pending or running)
getActiveCalls(): ToolCall[]
```

#### Statistics

```typescript
// Get stats for all tools
getAllStats(): ToolStats[]

// Get stats for specific tool
getToolStats(toolName: string): ToolStats | undefined

// Get calls that exceed average duration
getSlowCalls(threshold?: number): ToolCall[]
// Default threshold: 1.5 (1.5x average)

// Get failed calls
getFailedCalls(): ToolCall[]

// Get overall statistics
getOverallStats(): {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgDuration: number;
  totalDuration: number;
  uniqueTools: number;
  successRate: number;
}

// Get timeline view
getTimeline(limit?: number): Array<{
  timestamp: number;
  toolName: string;
  duration?: number;
  status: ToolCall['status'];
}>
```

#### Call Management

```typescript
// Clear old calls
clearOldCalls(maxAge?: number): number
// Default maxAge: 24 hours in milliseconds

// Export calls
export(): string
```

### PerformanceMonitor

Tracks performance metrics.

#### Constructor

```typescript
constructor()
```

#### Metric Recording

```typescript
// Record a custom metric
recordMetric(name: string, value: number, unit?: string, metadata?: object): void

// Record CPU usage
recordCPU(usage: number): void  // Percentage

// Record memory usage
recordMemory(usage: number): void  // MB

// Record token usage
recordTokens(input: number, output: number): void

// Record latency
recordLatency(duration: number): void  // Milliseconds

// Record a complete request
recordRequest(success: boolean, latency: number, tokens: { input: number; output: number }): void
```

#### Metric Retrieval

```typescript
// Get all values for a metric
getMetric(name: string): PerformanceMetric[]

// Get latest value for a metric
getLatestMetric(name: string): PerformanceMetric | undefined

// Get values in time range
getMetricsInRange(name: string, start: number, end?: number): PerformanceMetric[]

// Get statistics for a metric
getStats(name: string): {
  count: number;
  min: number;
  max: number;
  avg: number;
  latest: number;
} | null
```

#### Snapshots

```typescript
// Take a performance snapshot
takeSnapshot(): PerformanceSnapshot

// Get all snapshots
getSnapshots(): PerformanceSnapshot[]

// Get overall agent metrics
getAgentMetrics(): AgentMetrics

// Get performance summary
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
}
```

#### Management

```typescript
// Export metrics
export(): string

// Reset all metrics
reset(): void
```

---

## ⚙️ Configuration Options

### Inspector Configuration

```typescript
import { AgentInspector } from 'agent-debugger';

// Create with custom components
const inspector = new AgentInspector(
  new ReasoningTracer(),
  new MemoryViewer(),
  new ToolTracker(),
  new PerformanceMonitor()
);
```

### Memory Configuration

```typescript
const viewer = new MemoryViewer();

// Configure maximum snapshots (default: 100)
viewer.getSnapshot(); // Creates snapshot

// Query with filters
const results = viewer.queryMemories({
  type: ['working', 'short-term'],  // Filter by type
  minImportance: 0.5,               // Minimum importance (0-1)
  tags: ['important', 'user'],      // Filter by tags
  limit: 10,                        // Limit results
  search: 'query text'              // Text search
});
```

### Tool Tracker Configuration

```typescript
const tracker = new ToolTracker();

// Query options
const slowCalls = tracker.getSlowCalls(2.0);  // 2x average threshold

// Time range queries
const recentCalls = tracker.queryCalls({
  toolName: 'web-search',
  status: 'completed',
  timeRange: {
    start: Date.now() - 3600000,  // Last hour
    end: Date.now()
  },
  limit: 50
});
```

### Performance Monitor Configuration

```typescript
const monitor = new PerformanceMonitor();

// Configure token cost (default: $0.00001 per token)
monitor.recordTokens(1500, 350);  // Cost calculated automatically

// Custom metrics
monitor.recordMetric('custom.value', 42, 'units', { metadata: 'data' });
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. No Events Being Captured

**Symptom:** Debug session starts but no events appear.

**Solution:**
```typescript
// Ensure you're calling the inspector methods
inspector.startSession('my-agent');

// Check if session is active
const state = inspector.getState();
if (!state) {
  console.error('No active session!');
}

// Verify you're calling the trace methods
inspector.think('This should appear');
inspector.act('This should appear');
```

#### 2. Tool Calls Not Correlating

**Symptom:** Tool call and result don't connect properly.

**Solution:**
```typescript
// Always use the call ID returned by callTool
const callId = inspector.callTool('search', { query: 'test' });

// ... execute your tool ...

// Use the same call ID to complete
inspector.completeTool(callId, { results: [...] });
```

#### 3. Memory Entries Not Appearing

**Symptom:** Memory viewer shows no entries.

**Solution:**
```typescript
// Use the remember method
inspector.remember('Some content', 'working');

// Or use the memory viewer directly
const viewer = new MemoryViewer();
viewer.addWorking('Content');
viewer.addShortTerm('More content');

// Check the memory snapshot
const snapshot = viewer.getSnapshot();
console.log('Entries:', snapshot.totalEntries);
```

#### 4. Performance Metrics Not Accurate

**Symptom:** Latency/token metrics seem wrong.

**Solution:**
```typescript
// Record metrics accurately
const start = Date.now();

// ... execute operation ...

const end = Date.now();
inspector.recordLatency(end - start);  // Manual timing

// Or use the automatic tracking
const callId = inspector.callTool('my-tool', {});
const result = await executeTool();
inspector.completeTool(callId, result);  // Auto-records duration
```

#### 5. Event Listeners Not Firing

**Symptom:** Event callbacks never execute.

**Solution:**
```typescript
// Set up listeners before starting session
inspector.on('tool:complete', (data) => {
  console.log('Tool completed:', data);
});

// Start session after listener setup
inspector.startSession('my-agent');

// Ensure the event name is correct
// Valid events: 'session:start', 'session:end', 'tool:call', 
//               'tool:complete', 'tool:error', 'memory:update', 'error:occurred'
```

#### 6. Memory Leaks in Long Sessions

**Symptom:** Memory usage grows over time.

**Solution:**
```typescript
// Clear old data periodically
const tracer = new ReasoningTracer();
const cleared = tracer.clearOldTraces(60 * 60 * 1000);  // 1 hour

const tracker = new ToolTracker();
tracker.clearOldCalls(60 * 60 * 1000);  // 1 hour

// Or export and restart
const data = inspector.export();
inspector = new AgentInspector();  // Fresh instance
```

#### 7. Web UI Not Loading

**Symptom:** Debug server starts but UI doesn't respond.

**Solution:**
```typescript
import { createDebugServer } from 'agent-debugger/server';

const server = createDebugServer(inspector, {
  port: 3000,
  host: 'localhost',
  enableCORS: true  // Enable if accessing from different origin
});

await server.start();

// Check server logs
console.log('Server running at http://localhost:3000');
```

#### 8. Export Data Too Large

**Symptom:** `inspector.export()` produces huge JSON.

**Solution:**
```typescript
// Export just what you need
const data = {
  traces: inspector.getAllTraces(),
  state: inspector.getState()
};

// Use compression for storage
import { gzip } from 'zlib';
const compressed = gzip(JSON.stringify(data));
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Pull request process
- Testing requirements

### Development Setup

```bash
# Clone and install
git clone https://github.com/moggan1337/agent-debugger.git
cd agent-debugger
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Debug smarter. Build better agents.</strong>
</p>
