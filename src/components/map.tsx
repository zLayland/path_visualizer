import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/header";
import { Selection, type Tool } from "@/components/selection";
import {
  CELL_COUNT,
  COLUMNS,
  ROWS,
  runAStar,
  runDijkstra,
  type Algorithm,
} from "@/scripts/pathfinding";

const DEFAULT_START = Math.floor(ROWS / 2) * COLUMNS + 4;
const DEFAULT_END = Math.floor(ROWS / 2) * COLUMNS + (COLUMNS - 5);

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

export function Map() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [tool, setTool] = useState<Tool>("wall");
  const [walls, setWalls] = useState<Set<number>>(() => new Set());
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [visited, setVisited] = useState<Set<number>>(() => new Set());
  const [path, setPath] = useState<Set<number>>(() => new Set());
  const [speed, setSpeed] = useState(60);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Draw walls, move the endpoints, then visualize a route.");
  const dragMode = useRef<"add" | "remove" | null>(null);
  const runToken = useRef(0);

  const clearPath = useCallback(() => {
    setVisited(new Set());
    setPath(new Set());
    setStatus("Ready to visualize.");
  }, []);

  useEffect(() => {
    const stopDragging = () => {
      dragMode.current = null;
    };
    window.addEventListener("pointerup", stopDragging);
    return () => window.removeEventListener("pointerup", stopDragging);
  }, []);

  const updateCell = useCallback(
    (id: number, isDrag = false) => {
      if (running) return;
      clearPath();

      if (tool === "start") {
        if (id !== end && !walls.has(id)) setStart(id);
        return;
      }

      if (tool === "end") {
        if (id !== start && !walls.has(id)) setEnd(id);
        return;
      }

      if (id === start || id === end) return;

      setWalls((current) => {
        const next = new Set(current);
        if (!isDrag) dragMode.current = current.has(id) ? "remove" : "add";
        const mode = dragMode.current;
        if (mode === "add") next.add(id);
        if (mode === "remove") next.delete(id);
        return next;
      });
    },
    [clearPath, end, running, start, tool, walls],
  );

  async function visualize() {
    if (running) return;

    const token = ++runToken.current;
    setRunning(true);
    setVisited(new Set());
    setPath(new Set());
    setStatus(`${algorithm === "astar" ? "A*" : "Dijkstra"} is exploring the grid…`);

    const result = algorithm === "astar" ? runAStar(start, end, walls) : runDijkstra(start, end, walls);
    const visitDelay = Math.max(2, 72 - speed * 0.7);

    for (const id of result.visitedOrder) {
      if (runToken.current !== token) return;
      if (id !== start && id !== end) {
        setVisited((current) => new Set(current).add(id));
      }
      await sleep(visitDelay);
    }

    if (result.path.length === 0) {
      setStatus("No route found. Try removing a few walls.");
      setRunning(false);
      return;
    }

    setStatus(`Route found — ${Math.max(0, result.path.length - 1)} steps.`);
    for (const id of result.path) {
      if (runToken.current !== token) return;
      if (id !== start && id !== end) {
        setPath((current) => new Set(current).add(id));
      }
      await sleep(Math.max(8, visitDelay * 1.5));
    }

    setRunning(false);
  }

  function resetBoard() {
    runToken.current += 1;
    setRunning(false);
    setWalls(new Set());
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
    setVisited(new Set());
    setPath(new Set());
    setStatus("Board reset. Add walls or move the endpoints.");
  }

  function cellClass(id: number) {
    if (id === start) return "grid-cell start-cell";
    if (id === end) return "grid-cell end-cell";
    if (walls.has(id)) return "grid-cell wall-cell";
    if (path.has(id)) return "grid-cell path-cell";
    if (visited.has(id)) return "grid-cell visited-cell";
    return "grid-cell";
  }

  return (
    <main className="app-shell">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <div className="content-shell">
        <Header algorithm={algorithm} onAlgorithmChange={(next) => { clearPath(); setAlgorithm(next); }} disabled={running} />

        <section className="hero-copy">
          <div>
            <h2>See shortest-path algorithms think.</h2>
            <p>
              Compare A* and Dijkstra on the same board. Paint obstacles, reposition the start and goal,
              and watch each algorithm explore.
            </p>
          </div>
          <div className="legend" aria-label="Grid legend">
            <span><i className="legend-swatch visited-swatch" /> Explored</span>
            <span><i className="legend-swatch path-swatch" /> Shortest path</span>
          </div>
        </section>

        <Selection
          tool={tool}
          onToolChange={setTool}
          speed={speed}
          onSpeedChange={setSpeed}
          onRun={visualize}
          onClearPath={clearPath}
          onClearBoard={resetBoard}
          running={running}
        />

        <section className="board-card" aria-label="Pathfinding grid">
          <div className="board-topbar">
            <div className="board-status">
              <span className={`status-light ${running ? "running" : ""}`} />
              {status}
            </div>
            <span className="grid-size">{COLUMNS} × {ROWS}</span>
          </div>

          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
            onPointerLeave={() => { dragMode.current = null; }}
          >
            {Array.from({ length: CELL_COUNT }, (_, id) => (
              <button
                key={id}
                type="button"
                className={cellClass(id)}
                aria-label={id === start ? "Start node" : id === end ? "End node" : `Grid cell ${id + 1}`}
                onPointerDown={(event) => {
                  event.preventDefault();
                  updateCell(id, false);
                }}
                onPointerEnter={(event) => {
                  if (event.buttons === 1 && tool === "wall") updateCell(id, true);
                }}
              >
                {id === start && <span className="endpoint-icon">S</span>}
                {id === end && <span className="endpoint-icon">E</span>}
              </button>
            ))}
          </div>
        </section>

        <p className="tip">Tip: choose Walls and click-drag across the board to draw or erase obstacles.</p>
      </div>
    </main>
  );
}
