export const wallIDs: number[] = [];
export const pathIDs: number[] = [];
export const finalPathIDs: number[] = [];
export let startID = 0;
export let endID = 349;
let buttonType = "wall";

export function setButtonType(buttonState: string) {
    buttonType = buttonState;
}

export function render() {
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 14; j++) {
            const btnID = i * 14 + j;
            if (wallIDs.includes(btnID)) {
                const wallButton = document.getElementById(btnID + "") as HTMLButtonElement;
                wallButton.className = "bg-teal-900 w-10 h-10 rounded-xl";
            }
            else if (btnID === startID) {
                const startButton = document.getElementById(btnID + "") as HTMLButtonElement;
                startButton.className = "bg-green-800 w-10 h-10 rounded-xl";
            }
            else if (btnID === endID) {
                const endButton = document.getElementById(btnID + "") as HTMLButtonElement;
                endButton.className = "bg-red-800 w-10 h-10 rounded-xl";
            }
            else if (pathIDs.includes(btnID)) {
                const pathButton = document.getElementById(btnID + "") as HTMLButtonElement;
                pathButton.className = "bg-yellow-600 w-10 h-10 rounded-xl";
            }
            else {
                const button = document.getElementById(btnID + "") as HTMLButtonElement;
                button.className = "bg-zinc-900 w-10 h-10 rounded-xl";
            }
        }
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function renderFinalPath(): Promise<void> {
    for (const btnID of finalPathIDs) {
        if (btnID === startID || btnID === endID) {
            continue;
        }

        const finalPathButton = document.getElementById(btnID + "") as HTMLButtonElement;

        finalPathButton.className = "bg-sky-300 w-10 h-10 rounded-xl";

        await sleep(20);
    }

    finalPathIDs.length = 0;
    pathIDs.length = 0;
}

function handleButtonClick(buttonClicked: HTMLButtonElement) {
    const btnID = parseInt(buttonClicked.id);

    if (buttonType === "wall") {
        if (!wallIDs.includes(btnID)) {
            wallIDs.push(btnID);
        }
        else {
            wallIDs.splice(wallIDs.indexOf(btnID), 1);
        }
    }
    else if (buttonType === "start" && btnID !== endID) {
        startID = btnID;
    }
    else if (buttonType === "end" && btnID !== startID) {
        endID = btnID;
    }

    render();
}

export function populateMap() {
    const mapContainer = document.getElementById("map");
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 14; j++) {
            const btn = document.createElement("button");
            const btnID = i*14 + j;

            btn.textContent = ""; 
            btn.className = "bg-zinc-900 w-10 h-10 rounded-xl";
            btn.id = btnID + "";
            
            btn.addEventListener("click", () => handleButtonClick(btn));
            
            mapContainer?.appendChild(btn);
        }
    }
    render();
}