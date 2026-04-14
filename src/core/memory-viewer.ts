/**
 * Agent Debugger - Memory Viewer
 * 
 * Visualizes agent memory state in real-time.
 */

export interface MemoryEntry {
  id: string;
  type: 'short-term' | 'long-term' | 'working' | 'semantic' | 'episodic';
  content: string;
  timestamp: number;
  accessCount: number;
  importance: number; // 0-1
  metadata?: Record<string, any>;
  tags?: string[];
  embedding?: number[]; // For semantic search visualization
}

export interface MemorySnapshot {
  timestamp: number;
  shortTerm: MemoryEntry[];
  longTerm: MemoryEntry[];
  working: MemoryEntry[];
  semantic: MemoryEntry[];
  episodic: MemoryEntry[];
  totalEntries: number;
  memoryUsage: number; // bytes estimate
}

export interface MemoryQuery {
  type?: MemoryEntry['type'][];
  search?: string;
  minImportance?: number;
  tags?: string[];
  limit?: number;
}

/**
 * Memory Viewer
 * 
 * Tracks and visualizes agent memory state.
 */
export class MemoryViewer {
  private memories: Map<string, MemoryEntry> = new Map();
  private accessLog: Array<{ id: string; timestamp: number }> = [];
  private snapshots: MemorySnapshot[] = [];
  private maxSnapshots = 100;

  /**
   * Add a memory entry
   */
  addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'accessCount'>): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const memory: MemoryEntry = {
      ...entry,
      id,
      timestamp: Date.now(),
      accessCount: 0,
    };

    this.memories.set(id, memory);
    return id;
  }

  /**
   * Add short-term memory
   */
  addShortTerm(content: string, metadata?: Record<string, any>): string {
    return this.addMemory({ type: 'short-term', content, importance: 0.5, metadata });
  }

  /**
   * Add long-term memory
   */
  addLongTerm(content: string, importance: number = 0.7, metadata?: Record<string, any>): string {
    return this.addMemory({ type: 'long-term', content, importance, metadata });
  }

  /**
   * Add working memory
   */
  addWorking(content: string, metadata?: Record<string, any>): string {
    return this.addMemory({ type: 'working', content, importance: 0.8, metadata });
  }

  /**
   * Add semantic memory
   */
  addSemantic(content: string, embedding: number[], metadata?: Record<string, any>): string {
    return this.addMemory({ type: 'semantic', content, importance: 0.6, metadata, embedding });
  }

  /**
   * Add episodic memory (experience)
   */
  addEpisodic(content: string, metadata?: Record<string, any>): string {
    return this.addMemory({ type: 'episodic', content, importance: 0.5, metadata });
  }

  /**
   * Access memory (track access)
   */
  accessMemory(id: string): MemoryEntry | undefined {
    const memory = this.memories.get(id);
    if (memory) {
      memory.accessCount++;
      this.accessLog.push({ id, timestamp: Date.now() });
    }
    return memory;
  }

  /**
   * Get memory by ID
   */
  getMemory(id: string): MemoryEntry | undefined {
    return this.memories.get(id);
  }

  /**
   * Query memories
   */
  queryMemories(query: MemoryQuery): MemoryEntry[] {
    let results = Array.from(this.memories.values());

    // Filter by type
    if (query.type && query.type.length > 0) {
      results = results.filter(m => query.type!.includes(m.type));
    }

    // Filter by importance
    if (query.minImportance !== undefined) {
      results = results.filter(m => m.importance >= query.minImportance!);
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(m => 
        m.tags && query.tags!.some(t => m.tags!.includes(t))
      );
    }

    // Search in content
    if (query.search) {
      const search = query.search.toLowerCase();
      results = results.filter(m => 
        m.content.toLowerCase().includes(search)
      );
    }

    // Sort by importance and recency
    results.sort((a, b) => {
      const scoreA = a.importance * 0.7 + (1 / (Date.now() - a.timestamp + 1)) * 0.3;
      const scoreB = b.importance * 0.7 + (1 / (Date.now() - b.timestamp + 1)) * 0.3;
      return scoreB - scoreA;
    });

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Get memories by type
   */
  getByType(type: MemoryEntry['type']): MemoryEntry[] {
    return this.queryMemories({ type: [type] });
  }

  /**
   * Get current snapshot
   */
  getSnapshot(): MemorySnapshot {
    const byType: Record<string, MemoryEntry[]> = {
      'short-term': [],
      'long-term': [],
      'working': [],
      'semantic': [],
      'episodic': [],
    };

    let totalSize = 0;

    for (const memory of this.memories.values()) {
      byType[memory.type].push(memory);
      totalSize += memory.content.length * 2; // Rough estimate
    }

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      shortTerm: byType['short-term'],
      longTerm: byType['long-term'],
      working: byType['working'],
      semantic: byType['semantic'],
      episodic: byType['episodic'],
      totalEntries: this.memories.size,
      memoryUsage: totalSize,
    };

    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get memory history
   */
  getHistory(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Get access statistics
   */
  getAccessStats(): {
    totalAccesses: number;
    mostAccessed: Array<{ id: string; content: string; count: number }>;
    recentAccesses: Array<{ id: string; timestamp: number }>;
  } {
    const mostAccessed: Array<{ id: string; content: string; count: number }> = [];
    const seen = new Set<string>();

    for (const [id, memory] of this.memories) {
      if (memory.accessCount > 0) {
        mostAccessed.push({
          id,
          content: memory.content.slice(0, 50),
          count: memory.accessCount,
        });
      }
    }

    mostAccessed.sort((a, b) => b.count - a.count);

    const recentAccesses = this.accessLog.slice(-50).reverse();

    return {
      totalAccesses: this.accessLog.length,
      mostAccessed: mostAccessed.slice(0, 10),
      recentAccesses,
    };
  }

  /**
   * Get memory statistics
   */
  getStats(): {
    total: number;
    byType: Record<string, number>;
    avgImportance: number;
    totalSize: number;
    snapshots: number;
  } {
    const byType: Record<string, number> = {};
    let totalImportance = 0;
    let totalSize = 0;

    for (const memory of this.memories.values()) {
      byType[memory.type] = (byType[memory.type] || 0) + 1;
      totalImportance += memory.importance;
      totalSize += memory.content.length * 2;
    }

    return {
      total: this.memories.size,
      byType,
      avgImportance: this.memories.size > 0 ? totalImportance / this.memories.size : 0,
      totalSize,
      snapshots: this.snapshots.length,
    };
  }

  /**
   * Delete memory
   */
  deleteMemory(id: string): boolean {
    return this.memories.delete(id);
  }

  /**
   * Clear all memories
   */
  clear(): void {
    this.memories.clear();
    this.accessLog = [];
    this.snapshots = [];
  }

  /**
   * Export memories as JSON
   */
  export(): string {
    return JSON.stringify({
      memories: Array.from(this.memories.values()),
      snapshots: this.snapshots,
    }, null, 2);
  }

  /**
   * Import memories from JSON
   */
  import(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.memories) {
        for (const mem of data.memories) {
          this.memories.set(mem.id, mem);
        }
      }
      if (data.snapshots) {
        this.snapshots = data.snapshots;
      }
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton
let viewerInstance: MemoryViewer | null = null;

export function getMemoryViewer(): MemoryViewer {
  if (!viewerInstance) {
    viewerInstance = new MemoryViewer();
  }
  return viewerInstance;
}
