export const COLUMNS = 25;
export const ROWS = 14;
export const CELL_COUNT = COLUMNS * ROWS;

export type Algorithm = "astar" | "dijkstra";

export interface SearchResult {
  visitedOrder: number[];
  path: number[];
}

interface NodeState {
  id: number;
  distance: number;
  priority: number;
}

function neighbors(id: number, walls: Set<number>): number[] {
  const row = Math.floor(id / COLUMNS);
  const col = id % COLUMNS;
  const result: number[] = [];

  if (row > 0) result.push(id - COLUMNS);
  if (col < COLUMNS - 1) result.push(id + 1);
  if (row < ROWS - 1) result.push(id + COLUMNS);
  if (col > 0) result.push(id - 1);

  return result.filter((neighbor) => !walls.has(neighbor));
}

function manhattan(a: number, b: number): number {
  const aRow = Math.floor(a / COLUMNS);
  const aCol = a % COLUMNS;
  const bRow = Math.floor(b / COLUMNS);
  const bCol = b % COLUMNS;
  return Math.abs(aRow - bRow) + Math.abs(aCol - bCol);
}

function reconstructPath(parent: Map<number, number>, start: number, end: number): number[] {
  if (start === end) return [start];
  if (!parent.has(end)) return [];

  const path = [end];
  let current = end;

  while (current !== start) {
    const previous = parent.get(current);
    if (previous === undefined) return [];
    current = previous;
    path.push(current);
  }

  return path.reverse();
}

function runSearch(
  start: number,
  end: number,
  walls: Set<number>,
  heuristic: (id: number) => number,
): SearchResult {
  const distances = new Array<number>(CELL_COUNT).fill(Infinity);
  const parent = new Map<number, number>();
  const visited = new Set<number>();
  const visitedOrder: number[] = [];
  const frontier: NodeState[] = [];

  distances[start] = 0;
  frontier.push({ id: start, distance: 0, priority: heuristic(start) });

  while (frontier.length > 0) {
    let bestIndex = 0;
    for (let i = 1; i < frontier.length; i += 1) {
      if (frontier[i].priority < frontier[bestIndex].priority) bestIndex = i;
    }

    const current = frontier.splice(bestIndex, 1)[0];
    if (visited.has(current.id)) continue;

    visited.add(current.id);
    visitedOrder.push(current.id);

    if (current.id === end) {
      return { visitedOrder, path: reconstructPath(parent, start, end) };
    }

    for (const neighbor of neighbors(current.id, walls)) {
      if (visited.has(neighbor)) continue;

      const candidateDistance = current.distance + 1;
      if (candidateDistance >= distances[neighbor]) continue;

      distances[neighbor] = candidateDistance;
      parent.set(neighbor, current.id);
      frontier.push({
        id: neighbor,
        distance: candidateDistance,
        priority: candidateDistance + heuristic(neighbor),
      });
    }
  }

  return { visitedOrder, path: [] };
}

export function runDijkstra(start: number, end: number, walls: Set<number>): SearchResult {
  return runSearch(start, end, walls, () => 0);
}

export function runAStar(start: number, end: number, walls: Set<number>): SearchResult {
  return runSearch(start, end, walls, (id) => manhattan(id, end));
}
