import { bre } from "@/types/bre";

type IState = { container: bre.BlocksContainer | null };
let data: IState = {
  container: null
};

export const state = {
  getSelectedContainer: () => data.container,
  setSelectedContainer: (container: bre.BlocksContainer) => {
    data.container = container;
  }
};
