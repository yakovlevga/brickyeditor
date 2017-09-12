namespace BrickyEditor {
    export class Selectors {

        public static field = 'data-bre-field';     
        public static selectorField = `[${Selectors.field}]`;

        public static classMobile = 'brickyeditor-tools-mobile';

        public static htmlToolsCommand = 'data-bre-doc-command';
        public static htmlToolsCommandRange = 'data-bre-doc-command-range';

        public static selectorHtmlToolsCommand = Selectors.attr(Selectors.htmlToolsCommand);
        public static selectorHtmlToolsCommandRange = Selectors.attr(Selectors.htmlToolsCommandRange);

        private static attr(attr) {
            return `[${attr}]`;
        }
    }
}