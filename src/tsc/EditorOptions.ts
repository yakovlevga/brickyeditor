namespace BrickyEditor {
    export class EditorOptions {
        public templatesUrl: string = "templates/bootstrap4.html";
        public onload: any;
        public blocks: Array<Block>;
        public compactTools?: Boolean = null;
        public compactToolsWidth: number = 768;
        public ignoreHtml?: Boolean = null

        constructor(options: EditorOptions) {
            this.templatesUrl = options.templatesUrl || this.templatesUrl;
            this.onload = options.onload;
            this.blocks = options.blocks;
            this.compactTools = options.compactTools;
            this.ignoreHtml = options.ignoreHtml || false;
        }
    }
}