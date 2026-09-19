export type Tool = "wall" | "start" | "end";

interface SelectionProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onRun: () => void;
  onClearPath: () => void;
  onClearBoard: () => void;
  running: boolean;
}

export function Selection({
  tool,
  onToolChange,
  speed,
  onSpeedChange,
  onRun,
  onClearPath,
  onClearBoard,
  running,
}: SelectionProps) {
  return (
    <div className="controls-card">
      <div className="tool-group" role="group" aria-label="Grid editing tool">
        <button
          type="button"
          className={`tool-button wall-tool ${tool === "wall" ? "active" : ""}`}
          onClick={() => onToolChange("wall")}
          disabled={running}
        >
          <span className="tool-dot wall-dot" /> Walls
        </button>
        <button
          type="button"
          className={`tool-button ${tool === "start" ? "active" : ""}`}
          onClick={() => onToolChange("start")}
          disabled={running}
        >
          <span className="tool-dot start-dot" /> Start
        </button>
        <button
          type="button"
          className={`tool-button ${tool === "end" ? "active" : ""}`}
          onClick={() => onToolChange("end")}
          disabled={running}
        >
          <span className="tool-dot end-dot" /> End
        </button>
      </div>

      <div className="speed-control">
        <div className="speed-label">
          <span>Animation speed</span>
          <strong>{speed}%</strong>
        </div>
        <input
          aria-label="Animation speed"
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          disabled={running}
        />
      </div>

      <div className="action-group">
        <button type="button" className="secondary-button" onClick={onClearPath} disabled={running}>
          Clear path
        </button>
        <button type="button" className="secondary-button" onClick={onClearBoard} disabled={running}>
          Reset board
        </button>
        <button type="button" className="run-button" onClick={onRun} disabled={running}>
          <span className="play-icon" aria-hidden="true" />
          {running ? "Running…" : "Visualize"}
        </button>
      </div>
    </div>
  );
}
