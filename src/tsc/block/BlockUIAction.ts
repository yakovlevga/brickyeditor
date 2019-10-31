import { bre } from "src/types/bre";

export class BlockUIAction {
  constructor(
    public icon: string,
    public action?: (block: bre.core.block.Block) => void,
    public title?: string
  ) {}
}
