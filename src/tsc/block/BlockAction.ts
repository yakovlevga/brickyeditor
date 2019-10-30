export class BlockAction {
  constructor(
    public icon?: string,
    public action?: (block) => any,
    public title?: string
  ) {}
}
