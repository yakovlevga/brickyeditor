declare var instgrm: any;

declare namespace bre {
  namespace ui {}

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

  namespace prompt {
    type PromptParameter = {
      key: string;
      value: string;
      title: string;
      placeholder?: string;
    };

    type PromptParameterWithControl = PromptParameter & {
      control: HTMLElement;
    };

    interface IPromptParameterImageResult {
      fileContent: string;
      fileInfo: IPromptParameterImageResultFile;
    }

    interface IPromptParameterImageResultFile {
      lastModified: number;
      lastModifiedDate: any;
      name: string;
      size: number;
      type: string;

      // constructor(file: File) {
      //   this.name = file.name;
      //   this.size = file.size;
      //   this.type = file.type;
      //   this.lastModified = (file as any).lastModified;
      //   this.lastModifiedDate = file.lastModifiedDate;
      // }
    }

    interface IPromptParameterOption {
      title: string;
      value: any;
      selected?: boolean;
    }
  }
}
