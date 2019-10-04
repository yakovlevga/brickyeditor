declare var instgrm: any;

declare namespace bre {
  interface IHtmlToolsButton {
    icon: string;
    command: string;
    range: boolean;
    aValueArgument: string;
  }

  interface IBlockData {
    template: string;
    fields: any[];
    html?: string;
  }
}
