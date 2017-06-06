namespace BrickyEditor {
    export class Constants {
        public static templatesFolder: string = 'templates/bootstrap4';

        public static field = 'data-bricky-field';
        public static templateModalKey = "modal";
        public static templateToolsKey = "tools";
        public static templateHtmlToolsKey = "htmlTools";
        public static selectorModalContent = ".brickyeditor-modal-content";
        public static selectorModalClose = ".brickyeditor-modal-close";
        public static selectorTemplates = '.templates';
        public static selectorTemplate = '.template';
        public static selectorCancel = '.brickyeditor-cancel';
        public static selectorSave = '.brickyeditor-save';
        public static selectorLoader = '#brickyeditorLoader';
        public static selectorFilter = '#brickyeditorFilter';        
        public static selectorField = `[${Constants.field}]`;

        public static selectorHtmlToolsCommand = '[data-brickyeditor-doc-command]';
        public static selectorHtmlToolsCommandRange = '[data-brickyeditor-doc-command-range]';

        public static selectorBlockWrapper = '.brickyeditor-block-wrapper';

        public static classMobile = "brickyeditor-tools-mobile";

        public static dummyText = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.";
    }
}