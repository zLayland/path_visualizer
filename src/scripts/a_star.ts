import { pathIDs, finalPathIDs, wallIDs, startID, endID, render, renderFinalPath, setRunningState } from "@/scripts/map_render";

const COLUMNS = 25;
const ROWS = 14;

interface GridNode {
    id: number;
    g: number;
    h: number;
    f: number;
    parent: GridNode | null;
}

function heuristic(currentGridNode: GridNode, endGridNode: GridNode): number {
    let currentX = currentGridNode.id % COLUMNS;
    let currentY = Math.floor(currentGridNode.id / COLUMNS);

    const endX = endGridNode.id % COLUMNS;
    const endY = Math.floor(endGridNode.id / COLUMNS);

    return Math.abs(currentX - endX) + Math.abs(currentY - endY);
}

function getNeighborIDs(Gridnode: GridNode): number[] {
    const neighborIDs: number[] = [];
    const x = Gridnode.id % COLUMNS;
    const y = Math.floor(Gridnode.id / COLUMNS);

    if (x > 0) neighborIDs.push(Gridnode.id - 1);
    if (x < COLUMNS - 1) neighborIDs.push(Gridnode.id + 1);
    if (y > 0) neighborIDs.push(Gridnode.id - COLUMNS);
    if (y < ROWS - 1) neighborIDs.push(Gridnode.id + COLUMNS);

    return neighborIDs.filter(id => !wallIDs.includes(id));
}

function reconstructPath(currentGridNode: GridNode): number[] {
    console.log("reconstructing path");
    const path: number[] = [];
    let current: GridNode | null = currentGridNode;

    while (current !== null) {
        path.push(current.id);
        current = current.parent;
    }

    return path.reverse();
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let fps = 30;

export function setFPS(fps: number): void {
    fps = Math.max(1, fps);
}

async function aStar() {
    console.log("running A*");

    const openSet: GridNode[] = [];
    const closedSet = new Set<number>();

    const startGridNode: GridNode = { id: startID, g: 0, h: 0, f: 0, parent: null };
    const endGridNode: GridNode = { id: endID, g: Infinity, h: 0, f: Infinity, parent: null };

    openSet.push(startGridNode);

    startGridNode.h = heuristic(startGridNode, endGridNode);
    startGridNode.f = startGridNode.g + startGridNode.h;

    while (openSet.length > 0) {
        const currentGridNode = openSet.reduce((lowest, Gridnode) =>
            Gridnode.f < lowest.f ? Gridnode : lowest
        );

        if (currentGridNode.id === endGridNode.id) {
            console.log("path found");
            console.log(reconstructPath(currentGridNode));
            return reconstructPath(currentGridNode);
        }

        openSet.splice(openSet.indexOf(currentGridNode), 1);
        closedSet.add(currentGridNode.id);

        pathIDs.push(currentGridNode.id);

        render();

        const delayMs = 1000 / fps;
        await sleep(delayMs);

        for (const neighborID of getNeighborIDs(currentGridNode)) {
            if (closedSet.has(neighborID)) {
                continue;
            }

            const tentativeG = currentGridNode.g + 1;

            let neighborGridNode = openSet.find(Gridnode => Gridnode.id === neighborID);

            if (!neighborGridNode) {
                neighborGridNode = { id: neighborID, g: Infinity, h: heuristic({ id: neighborID, g: 0, h: 0, f: 0, parent: null }, endGridNode), f: Infinity, parent: null };
                openSet.push(neighborGridNode);
            }

            if (tentativeG >= neighborGridNode.g) {
                continue;
            }

            neighborGridNode.g = tentativeG;
            neighborGridNode.f = neighborGridNode.g + neighborGridNode.h;
            neighborGridNode.parent = currentGridNode;
        }
    }
    console.log("no path found");
    return [];
}

let isRunning = false;

export async function runAStar(): Promise<void> {
    if (isRunning) return;
    setRunningState(true);
    
    isRunning = true;

    pathIDs.length = 0;
    finalPathIDs.length = 0;


    try {
        await aStar();
    } finally {
        isRunning = false;
        const finalPath = await aStar();
        finalPathIDs.push(...finalPath);
        await renderFinalPath();
        setRunningState(false);
    }
}