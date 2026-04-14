/**
 * Agent Debugger - Web UI
 * 
 * Visual interface for the debugger.
 */

export function createDebugUI(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Debugger</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a2e;
      color: #eaeaea;
      height: 100vh;
      overflow: hidden;
    }
    
    .container {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      grid-template-rows: 50px 1fr 100px;
      height: 100vh;
      gap: 1px;
      background: #333;
    }
    
    /* Header */
    .header {
      grid-column: 1 / -1;
      background: #16213e;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 20px;
    }
    
    .logo {
      font-size: 18px;
      font-weight: bold;
      color: #00d4ff;
    }
    
    .session-info {
      color: #888;
      font-size: 14px;
    }
    
    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .status.active { background: #00ff88; color: #000; }
    .status.paused { background: #ffaa00; color: #000; }
    .status.ended { background: #888; color: #000; }
    
    .btn {
      padding: 6px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .btn-primary { background: #00d4ff; color: #000; }
    .btn-danger { background: #ff4757; color: #fff; }
    .btn-success { background: #00ff88; color: #000; }
    
    .btn:hover { opacity: 0.8; transform: scale(1.02); }
    
    /* Sidebar */
    .sidebar {
      background: #16213e;
      overflow-y: auto;
    }
    
    .sidebar-section {
      padding: 15px;
      border-bottom: 1px solid #333;
    }
    
    .sidebar-title {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .trace-item {
      padding: 8px 12px;
      background: #1a1a2e;
      border-radius: 6px;
      margin-bottom: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    
    .trace-item:hover { background: #252545; }
    .trace-item.active { border-left: 3px solid #00d4ff; }
    
    /* Main Content */
    .main {
      background: #1a1a2e;
      overflow-y: auto;
      padding: 20px;
    }
    
    .panel {
      background: #16213e;
      border-radius: 12px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    
    .panel-header {
      padding: 12px 16px;
      background: #1a1a2e;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .panel-body { padding: 16px; }
    
    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 30px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #333;
    }
    
    .timeline-item {
      position: relative;
      padding: 10px 0;
      border-bottom: 1px solid #252545;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -25px;
      top: 14px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #00d4ff;
    }
    
    .timeline-item.thought::before { background: #a29bfe; }
    .timeline-item.action::before { background: #00d4ff; }
    .timeline-item.tool-call::before { background: #fdcb6e; }
    .timeline-item.tool-result::before { background: #00ff88; }
    .timeline-item.error::before { background: #ff4757; }
    
    .timeline-content {
      background: #1a1a2e;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    
    .timeline-time {
      font-size: 11px;
      color: #888;
      margin-top: 4px;
    }
    
    .timeline-type {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
    }
    
    /* Metrics */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }
    
    .metric-card {
      background: #1a1a2e;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #00d4ff;
    }
    
    .metric-label {
      font-size: 12px;
      color: #888;
      margin-top: 4px;
    }
    
    .metric-change {
      font-size: 11px;
      margin-top: 4px;
    }
    
    .metric-change.up { color: #00ff88; }
    .metric-change.down { color: #ff4757; }
    
    /* Memory View */
    .memory-bar {
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      margin: 10px 0;
    }
    
    .memory-segment {
      height: 100%;
      transition: width 0.3s;
    }
    
    .memory-segment.short-term { background: #a29bfe; }
    .memory-segment.long-term { background: #00d4ff; }
    .memory-segment.working { background: #fdcb6e; }
    .memory-segment.semantic { background: #00ff88; }
    
    /* Tool Calls */
    .tool-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .tool-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #252545;
    }
    
    .tool-icon {
      width: 32px;
      height: 32px;
      background: #252545;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }
    
    .tool-info { flex: 1; }
    
    .tool-name { font-weight: bold; font-size: 14px; }
    .tool-args { font-size: 12px; color: #888; margin-top: 2px; }
    
    .tool-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    
    .tool-status.running { background: #fdcb6e; color: #000; }
    .tool-status.completed { background: #00ff88; color: #000; }
    .tool-status.failed { background: #ff4757; color: #fff; }
    
    /* Footer */
    .footer {
      grid-column: 1 / -1;
      background: #16213e;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 30px;
      font-size: 12px;
      color: #888;
    }
    
    .footer-item { display: flex; align-items: center; gap: 6px; }
    .footer-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .footer-dot.green { background: #00ff88; }
    .footer-dot.yellow { background: #fdcb6e; }
    .footer-dot.red { background: #ff4757; }
    
    /* Animations */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .recording { animation: pulse 1s infinite; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1a1a2e; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="logo">🔍 Agent Debugger</div>
      <div class="session-info">
        Session: <span id="sessionId">-</span>
      </div>
      <div class="session-info">
        Agent: <span id="agentId">-</span>
      </div>
      <span id="status" class="status">Idle</span>
      <div style="flex: 1"></div>
      <button class="btn btn-primary" onclick="startSession()">Start Session</button>
      <button class="btn btn-danger" onclick="endSession()">End</button>
    </header>
    
    <!-- Sidebar - Trace List -->
    <aside class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">Traces</div>
        <div id="traceList">
          <div style="color: #666; padding: 10px; font-size: 13px;">
            No traces yet
          </div>
        </div>
      </div>
      
      <div class="sidebar-section">
        <div class="sidebar-title">Quick Stats</div>
        <div style="font-size: 13px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>Events:</span>
            <span id="eventCount">0</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>Tool Calls:</span>
            <span id="toolCallCount">0</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>Errors:</span>
            <span id="errorCount">0</span>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main">
      <!-- Performance Metrics -->
      <div class="panel">
        <div class="panel-header">
          Performance
          <span id="perfTime" style="font-size: 11px; color: #888;"></span>
        </div>
        <div class="panel-body">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value" id="latencyValue">0</div>
              <div class="metric-label">Avg Latency (ms)</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" id="tokenValue">0</div>
              <div class="metric-label">Total Tokens</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" id="costValue">$0.00</div>
              <div class="metric-label">Total Cost</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" id="successValue">100%</div>
              <div class="metric-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Reasoning Trace -->
      <div class="panel">
        <div class="panel-header">
          Reasoning Trace
          <button class="btn btn-primary" style="padding: 4px 12px; font-size: 11px;" onclick="simulateThink()">
            + Add Thought
          </button>
        </div>
        <div class="panel-body">
          <div class="timeline" id="traceTimeline">
            <div style="color: #666; text-align: center; padding: 40px;">
              Start a session to see the reasoning trace
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tool Calls -->
      <div class="panel">
        <div class="panel-header">
          Tool Calls
          <button class="btn btn-primary" style="padding: 4px 12px; font-size: 11px;" onclick="simulateToolCall()">
            + Simulate Call
          </button>
        </div>
        <div class="panel-body">
          <div class="tool-list" id="toolList">
            <div style="color: #666; text-align: center; padding: 20px;">
              No tool calls yet
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Right Panel - Memory & State -->
    <aside class="sidebar">
      <!-- Memory -->
      <div class="sidebar-section">
        <div class="sidebar-title">Memory</div>
        <div class="memory-bar">
          <div class="memory-segment short-term" style="width: 30%;" title="Short-term"></div>
          <div class="memory-segment long-term" style="width: 25%;" title="Long-term"></div>
          <div class="memory-segment working" style="width: 20%;" title="Working"></div>
          <div class="memory-segment semantic" style="width: 25%;" title="Semantic"></div>
        </div>
        <div style="font-size: 11px; color: #666;">
          <div style="display: flex; align-items: center; gap: 6px; margin: 4px 0;">
            <div style="width: 10px; height: 10px; background: #a29bfe; border-radius: 2px;"></div>
            Short-term: <span id="shortTermCount">0</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin: 4px 0;">
            <div style="width: 10px; height: 10px; background: #00d4ff; border-radius: 2px;"></div>
            Long-term: <span id="longTermCount">0</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin: 4px 0;">
            <div style="width: 10px; height: 10px; background: #fdcb6e; border-radius: 2px;"></div>
            Working: <span id="workingCount">0</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin: 4px 0;">
            <div style="width: 10px; height: 10px; background: #00ff88; border-radius: 2px;"></div>
            Semantic: <span id="semanticCount">0</span>
          </div>
        </div>
      </div>
      
      <!-- Agent State -->
      <div class="sidebar-section">
        <div class="sidebar-title">Agent State</div>
        <div style="font-size: 13px;">
          <div style="padding: 8px 0; border-bottom: 1px solid #252545;">
            <div style="color: #888; font-size: 11px;">Status</div>
            <div id="agentStatus">Idle</div>
          </div>
          <div style="padding: 8px 0; border-bottom: 1px solid #252545;">
            <div style="color: #888; font-size: 11px;">Iteration</div>
            <div id="iteration">0</div>
          </div>
          <div style="padding: 8px 0;">
            <div style="color: #888; font-size: 11px;">Context Size</div>
            <div id="contextSize">0 KB</div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="sidebar-section">
        <div class="sidebar-title">Actions</div>
        <button class="btn btn-primary" style="width: 100%; margin-bottom: 8px;" onclick="simulateFullTrace()">
          Simulate Full Trace
        </button>
        <button class="btn btn-success" style="width: 100%;" onclick="exportDebug()">
          Export Report
        </button>
      </div>
    </aside>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-item">
        <div class="footer-dot green"></div>
        <span>Tracer</span>
      </div>
      <div class="footer-item">
        <div class="footer-dot green"></div>
        <span>Memory Viewer</span>
      </div>
      <div class="footer-item">
        <div class="footer-dot green"></div>
        <span>Tool Tracker</span>
      </div>
      <div class="footer-item">
        <div class="footer-dot green"></div>
        <span>Performance Monitor</span>
      </div>
      <div style="flex: 1"></div>
      <div class="footer-item">
        <span id="uptime">Uptime: 0s</span>
      </div>
    </footer>
  </div>
  
  <script>
    // Debugger integration would go here
    // For demo purposes, we'll simulate activity
    
    let sessionActive = false;
    let sessionId = '';
    let startTime = 0;
    
    function startSession() {
      sessionActive = true;
      sessionId = 'session_' + Date.now();
      startTime = Date.now();
      
      document.getElementById('sessionId').textContent = sessionId.slice(0, 20) + '...';
      document.getElementById('agentId').textContent = 'demo-agent';
      document.getElementById('status').textContent = 'Active';
      document.getElementById('status').className = 'status active';
      
      updateMetrics();
      setInterval(updateMetrics, 1000);
    }
    
    function endSession() {
      sessionActive = false;
      document.getElementById('status').textContent = 'Ended';
      document.getElementById('status').className = 'status ended';
    }
    
    function updateMetrics() {
      if (!sessionActive) return;
      
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('uptime').textContent = 'Uptime: ' + elapsed + 's';
    }
    
    function simulateThink() {
      if (!sessionActive) return;
      
      const thoughts = [
        'Analyzing user request...',
        'Breaking down the task into steps...',
        'Searching for relevant context...',
        'Formulating response strategy...',
        'Considering alternative approaches...',
        'Evaluating confidence levels...',
        'Preparing final response...'
      ];
      
      const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
      addTimelineItem('thought', thought);
    }
    
    function simulateToolCall() {
      if (!sessionActive) return;
      
      const tools = ['web-search', 'code-execute', 'file-read', 'database-query', 'api-call'];
      const tool = tools[Math.floor(Math.random() * tools.length)];
      
      addToolItem(tool, { query: 'test query' });
    }
    
    function addTimelineItem(type, content) {
      const timeline = document.getElementById('traceTimeline');
      
      // Remove placeholder if present
      const placeholder = timeline.querySelector('div[style*="text-align: center"]');
      if (placeholder) placeholder.remove();
      
      const item = document.createElement('div');
      item.className = 'timeline-item ' + type;
      item.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-type">${type}</div>
          <div>${content}</div>
          <div class="timeline-time">${new Date().toLocaleTimeString()}</div>
        </div>
      `;
      timeline.insertBefore(item, timeline.firstChild);
      
      // Update count
      const count = parseInt(document.getElementById('eventCount').textContent) + 1;
      document.getElementById('eventCount').textContent = count;
    }
    
    function addToolItem(toolName, args) {
      const toolList = document.getElementById('toolList');
      
      // Remove placeholder if present
      const placeholder = toolList.querySelector('div[style*="text-align: center"]');
      if (placeholder) placeholder.remove();
      
      const item = document.createElement('div');
      item.className = 'tool-item';
      item.innerHTML = `
        <div class="tool-icon">⚙️</div>
        <div class="tool-info">
          <div class="tool-name">${toolName}</div>
          <div class="tool-args">${JSON.stringify(args)}</div>
        </div>
        <div class="tool-status running">Running</div>
      `;
      toolList.insertBefore(item, toolList.firstChild);
      
      // Simulate completion
      setTimeout(() => {
        item.querySelector('.tool-status').textContent = 'Completed';
        item.querySelector('.tool-status').className = 'tool-status completed';
      }, 500 + Math.random() * 1000);
      
      // Update count
      const count = parseInt(document.getElementById('toolCallCount').textContent) + 1;
      document.getElementById('toolCallCount').textContent = count;
    }
    
    function simulateFullTrace() {
      if (!sessionActive) {
        alert('Start a session first!');
        return;
      }
      
      // Simulate a full agent trace
      simulateThink();
      
      setTimeout(() => {
        simulateToolCall();
        
        setTimeout(() => {
          addTimelineItem('observation', 'Found 5 relevant results');
          
          setTimeout(() => {
            simulateThink();
            
            setTimeout(() => {
              addTimelineItem('action', 'Executing code...');
              
              setTimeout(() => {
                addTimelineItem('tool-result', 'Code executed successfully');
                addTimelineItem('decision', 'Response ready');
              }, 300);
            }, 400);
          }, 500);
        }, 600);
      }, 400);
    }
    
    function exportDebug() {
      alert('Export functionality would generate a debug report');
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Agent Debugger UI loaded');
    });
  </script>
</body>
</html>
`;
}

export { createDebugUI };
