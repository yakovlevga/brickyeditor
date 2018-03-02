import { PromptParameter, PromptParameterOptions, PromptParameterList } from "./Prompt/Prompt";
import { EditorStrings } from "./EditorStrings";

export class HtmlLinkParams {
    constructor(
        public href: string = '',
        public title: string = '',
        public target: string = '') {
    }

    public getLinkPromptParams(): PromptParameter[] {
        return [
            new PromptParameter('href', EditorStrings.htmlEditorLinkUrlTitle, this.href, EditorStrings.htmlEditorLinkUrlPlaceholder),
            new PromptParameter('title', EditorStrings.htmlEditorLinkTitleTitle, this.title, EditorStrings.htmlEditorLinkTitlePlaceholder),
            new PromptParameterOptions('target', EditorStrings.htmlEditorLinkTargetTitle, [
                ['', ''],
                [EditorStrings.htmlEditorLinkTargetBlank, '_blank'],
                [EditorStrings.htmlEditorLinkTargetSelf, '_self'],
                [EditorStrings.htmlEditorLinkTargetParent, '_parent'],
                [EditorStrings.htmlEditorLinkTargetTop, '_top'],
            ], this.target)
        ];
    }

    public static getLinkFromParams(fields: PromptParameterList): HtmlLinkParams {
        const href = fields.getValue('href');
        const title = fields.getValue('title');
        const target = fields.getValue('target');
        return new HtmlLinkParams(href, title, target);
    }
}