import { useEffect } from "react";
import { populateMap } from "@/scripts/map_render";

export function Map() {
    useEffect(() => {
        populateMap();
    }, []);

    return (
        <div className="p-10 w-325 h-full grid grid-cols-25 gap-x-3 gap-y-3" id="map">
        </div>
    );
}