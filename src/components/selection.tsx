import { useState } from "react";
import { setButtonType } from "@/scripts/map_render";
import { runAStar } from "@/scripts/a_star";

function renderButtons (activeButton: string) {
        const wallBtn = document.getElementById("wall") as HTMLButtonElement;
        const startBtn = document.getElementById("start") as HTMLButtonElement;
        const endBtn = document.getElementById("end") as HTMLButtonElement;
        
        wallBtn.className = "bg-zinc-800 w-20 h-10 rounded-xl"
        startBtn.className = "bg-green-800 w-20 h-10 rounded-xl"
        endBtn.className = "bg-red-800 w-20 h-10 rounded-xl"
        
        if (activeButton === "wall") {
            wallBtn.className = "bg-zinc-900 w-20 h-10 rounded-xl"
        }
        else if (activeButton === "start") {
            startBtn.className = "bg-green-950 w-20 h-10 rounded-xl"
        }
        else if (activeButton === "end") {
            endBtn.className = "bg-red-950 w-20 h-10 rounded-xl"
        }
    }

export function Selection() {
    const [activeButton, setActiveButton] = useState("wall");

    const handleButtonClick = (buttonType: string) => {
        setActiveButton(buttonType);
        setButtonType(buttonType);
        renderButtons(buttonType);
    }

    return (
        <div className="font-[monospace] px-10 w-325 h-20 flex gap-4">
            <button className="bg-zinc-800 w-20 h-10 rounded-xl" id="wall" onClick={() => handleButtonClick("wall")}>
                Wall
            </button>
            <button className="bg-green-800 w-20 h-10 rounded-xl" id="start" onClick={() => handleButtonClick("start")}>
                Start
            </button>
            <button className="bg-red-800 w-20 h-10 rounded-xl" id="end" onClick={() => handleButtonClick("end")}>
                End
            </button>
            <button className="bg-blue-800 w-20 h-10 rounded-xl ml-auto" id="play" onClick={runAStar}>
                Play
            </button>
        </div>
    );
}