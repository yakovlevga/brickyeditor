namespace BrickyEditor {
    export class EditorOptions {
        public templatesBaseFolder: string = "templates";
        public templatesFolder: string = "templates/bootstrap4";
        public onload: any;
        public blocks: Array<Block>;
        public compactTools?: Boolean = null;

        constructor(options: EditorOptions) {
            this.templatesBaseFolder = options.templatesBaseFolder || this.templatesBaseFolder;
            this.templatesFolder = options.templatesFolder || this.templatesFolder;
            this.onload = options.onload;
            this.blocks = options.blocks;
            this.compactTools = options.compactTools;

        }
    }
}