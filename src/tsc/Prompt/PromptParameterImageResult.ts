namespace BrickyEditor {
    export namespace Prompt {
        export class PromptParameterImageResult {
            public fileContent: string;
            public fileInfo: PromptParameterImageResultFile; 
        }

        export class PromptParameterImageResultFile {
            public lastModified: number;
            public lastModifiedDate: any;
            public name: string;
            public size: number;
            public type: string;

            constructor(file: File) {
                this.name = file.name;
                this.size = file.size;
                this.type = file.type;
                this.lastModified = (file as any).lastModified;
                this.lastModifiedDate = file.lastModifiedDate;
            }
        }
    }
}