namespace BrickyEditor {
    export class EditorStrings {
        static errorBlocksFileNotFound = function(url: string) { return `Blocks file not found. Requested file: ${url}.`; }
        static errorTemplatesFileNotFound = function(url: string) { return `Templates file not found. Requested file: ${url}.`; }
        static errorBlockTemplateNotFound = function(templateName: string) { return `Template "${templateName}" not found.`; }
        static errorTemplateParsing = function(name: string) { return `Template parsing error: ${name}.`; }

        static embedFieldLinkTitle = 'Link to embed media';
        static embedFieldLinkPlaceholder = 'Link to instagram, youtube and etc.';

        static imageFieldLinkTitle = 'Image link';
        static imageFieldLinkPlaceholder = 'http://url-to-image.png';
        
        static imageFieldUploadTitle = 'or Upload a file';
        static imageFieldUploadButton = 'Select file';

        static imageFieldAltTitle = 'Alt';
        static imageFieldAltPlaceholder = 'Image \'alt\' attribute value';

        static imageFieldUrlSubtitle = 'Link to open on image click';

        static htmlEditorLinkUrlTitle = 'Url';
        static htmlEditorLinkUrlPlaceholder = 'http://put-your-link.here';

        static htmlEditorLinkTitleTitle = 'Title';
        static htmlEditorLinkTitlePlaceholder = 'Title attribute for link';

        static htmlEditorLinkTargetTitle = 'Target';
        static htmlEditorLinkTargetBlank = 'Blank';
        static htmlEditorLinkTargetSelf = 'Self';
        static htmlEditorLinkTargetParent = 'Parent';
        static htmlEditorLinkTargetTop = 'Top';

        static buttonClose = 'close';
        static buttonOk = 'Ok';
        static buttonCancel = 'Cancel';
        
        static defaultTemplatesGroupName = 'Other templates';
    }
}