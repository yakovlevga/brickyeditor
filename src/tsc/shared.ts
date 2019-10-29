import { UI } from "src/ui/UI";

let _ui: UI | null = null;

export const setUI = (ui: UI) => (_ui = ui);
export const getUI = () => _ui;
