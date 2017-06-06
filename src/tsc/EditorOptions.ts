namespace BrickyEditor {
    export class EditorOptions {
        public templatesBaseFolder: string = "templates";
        public templatesFolder: string = "templates/bootstrap4";
        public onload: any;
        public blocks: Array<Block>;
        public compactTools?: Boolean = null;
    }
}