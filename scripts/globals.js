import { FontLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/FontLoader.js';

//#region Font
let sharedFont = null;

export async function loadSharedFont() {
    if (sharedFont) return sharedFont;

    const loader = new FontLoader();
    const FONT_URL = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json';

    try {
        sharedFont = await loader.loadAsync(FONT_URL);
        return sharedFont;
    } catch (error) {
        console.error("Error loadingl font:", error);
        throw error;
    }
}
export const getFont = () => sharedFont;
//#endregion

export var gridSize = 20;

export function SetGridSize(value) {
    gridSize = value;
}

export var height = 6;

export var debugMode = false;

//#region Default Block Handling
export let defaultBlock = 99;

const blockMap = {
  "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, 
  "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, 
  "10": 10, "None": 99
};

export const getDefaultBlock = (value) => blockMap[value] ?? 99;

export const setDefaultBlock = (value) => {defaultBlock = blockMap[value] ?? 99};
//#endregion

export function ToggleDebugMode(value) {
    debugMode = value;
}

export var fogMode = true;

export function ToggleFogMode(value) {
    fogMode = value;
}