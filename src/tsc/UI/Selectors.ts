export class Selectors {

    public static attrContentEditable = 'contenteditable';
    public static selectorContentEditable = 'contenteditable';

    public static attrField = 'data-bre-field';
    public static selectorField = `[${Selectors.attrField}]`;

    public static classEditor = 'bre-editor';

    public static classTemplate = 'bre-template';
    public static selectorTemplate = `.${Selectors.classTemplate}`;

    public static classTemplateGroup = 'bre-template-group';
    public static selectorTemplateGroup = `.${Selectors.classTemplateGroup}`;

    public static selectorTemplatePreview = '.bre-template-preview';

    public static classMobile = 'brickyeditor-tools-mobile';

    public static htmlToolsCommand = 'data-bre-doc-command';
    public static htmlToolsCommandRange = 'data-bre-doc-command-range';

    public static selectorFieldSelected = 'bre-field-selected';
    public static selectorFieldContainer = 'bre-field-container';

    public static selectorHtmlToolsCommand = Selectors.attr(Selectors.htmlToolsCommand);
    public static selectorHtmlToolsCommandRange = Selectors.attr(Selectors.htmlToolsCommandRange);

    private static attr(attr) {
        return `[${attr}]`;
    }
}