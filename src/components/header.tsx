export function Header() {
    return (
        <div className="py-10 h-20 font-[monospace] text-xl grid grid-cols-2 justify-items-center">
            <h1>Path Visualizer</h1>
            <div className="grid grid-cols-2 gap-10">
                <button>A*</button>
                <button>Dijkstra</button>
            </div>
        </div>
    );
}