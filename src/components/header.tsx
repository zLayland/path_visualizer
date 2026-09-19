import type { Algorithm } from "@/scripts/pathfinding";

interface HeaderProps {
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  disabled: boolean;
}

export function Header({ algorithm, onAlgorithmChange, disabled }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Algorithm playground</p>
          <h1>Path Visualizer</h1>
        </div>
      </div>

      <div className="algorithm-switch" role="group" aria-label="Pathfinding algorithm">
        <button
          type="button"
          className={algorithm === "astar" ? "active" : ""}
          onClick={() => onAlgorithmChange("astar")}
          disabled={disabled}
        >
          A*
        </button>
        <button
          type="button"
          className={algorithm === "dijkstra" ? "active" : ""}
          onClick={() => onAlgorithmChange("dijkstra")}
          disabled={disabled}
        >
          Dijkstra
        </button>
      </div>
    </header>
  );
}
