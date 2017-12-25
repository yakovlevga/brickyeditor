namespace BrickyEditor {
    export class HtmlLinkParams {
        constructor(
            public href: string = '',
            public title: string = '',
            public target: string = '') {        
        }

        public getLinkPromptParams(): Prompt.PromptParameter[] {
            return [
                new Prompt.PromptParameter('href', EditorStrings.htmlEditorLinkUrlTitle, this.href, EditorStrings.htmlEditorLinkUrlPlaceholder),
                new Prompt.PromptParameter('title',  EditorStrings.htmlEditorLinkTitleTitle, this.title, EditorStrings.htmlEditorLinkTitlePlaceholder),
                new Prompt.PromptParameterOptions('target',  EditorStrings.htmlEditorLinkTargetTitle, [
                    ['', ''],
                    [EditorStrings.htmlEditorLinkTargetBlank, '_blank'],
                    [EditorStrings.htmlEditorLinkTargetSelf, '_self'],
                    [EditorStrings.htmlEditorLinkTargetParent, '_parent'],
                    [EditorStrings.htmlEditorLinkTargetTop, '_top'],
                ], this.target)
            ];
        }

        public static getLinkFromParams(fields: Prompt.PromptParameterList) : HtmlLinkParams {
            const href = fields.getValue('href');
            const title = fields.getValue('title');
            const target = fields.getValue('target');
            return new HtmlLinkParams(href, title, target);
        }
    }
}