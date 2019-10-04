import { $dom } from "src/Common/DOMHelpers";
import { BaseField } from "src/BaseField";
import { Editor } from "../Editor";
import { EditorStrings } from "../EditorStrings";
import { $ajax } from "src/Common/AJAXHelper";
import { PromptParameter } from "../Prompt/Prompt";
import { EmbedService } from "../Services/Services";

export class EmbedField extends BaseField {

    getSettingsEl(): HTMLElement {
        let $el = $dom.el('<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>');
        $dom.before(this.$field, $el);
        return $el;
    }

    get settings(): (field: BaseField) => void {
        return (field: EmbedField) => {
            this.showEmbedLoaderAsync(field);
        }
    }

    bind() {
        let field = this;
        let $field = this.$field;

        $dom.on($field, 'click', async () => {
            this.showEmbedLoaderAsync(field);
        });

        field.loadMedia(false);
    }

    private async showEmbedLoaderAsync(field) {
        const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());
        if (fields != null) {
            const url = fields.getValue('url');
            if (url) {
                field.setUrl(url);
                await field.loadMedia(true);
            }
        }
    }

    private getPromptParams(): Array<PromptParameter> {
        return [
            new PromptParameter('url', EditorStrings.embedFieldLinkTitle, this.data.url || 'http://instagr.am/p/BO9VX2Vj4fF/', EditorStrings.embedFieldLinkPlaceholder)
        ];
    }

    async loadMedia(fireUpdate: boolean) {
        let field = this;
        if (!field.data || !field.data.url)
            return;

        const json = await EmbedService.getEmbedAsync(field.data.url);

        field.setEmbed(json, fireUpdate);
        const $embed = $dom.el(json.html);
        const $script = $dom.first($embed, 'script') as HTMLScriptElement;
        if ($script) {
            $script.remove();
            var scriptSrc = $script.src;
            if (scriptSrc.breStartsWith('//')) {
                scriptSrc = "https:" + scriptSrc;
                $ajax.getScript(scriptSrc)
                    .then(() => {
                        EmbedService.processEmbed(json.provider_name);
                    });
            }
        }

        field.$field.innerHTML = '';
        field.$field.removeAttribute('class');
        field.$field.removeAttribute('style');
        field.$field.appendChild($embed);
        field.select();
    }

    setEmbed(value: any, fireUpdate: boolean = true) {
        this.updateProperty('embed', value, fireUpdate);
    }

    setUrl(value: string) {
        this.updateProperty('url', value);
    }
}