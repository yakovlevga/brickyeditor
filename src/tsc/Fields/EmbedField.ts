namespace BrickyEditor {
    export namespace Fields {
        export class EmbedField extends BaseField {

            getSettingsEl(): JQuery {
                let $el = $('<div style="position: absolute;width: 100%; height: 100px;;text-align: center;font-weight: bold;vertical-align: middle;background: #333;opacity: 0.2;">Change embed element link</div>');
                this.$field.before($el);
                return $el;
            }

            get settings(): (field: BaseField) => void {
                return (field: EmbedField) => {
                    field.data.url = prompt('Link to embed media', 'http://instagr.am/p/BO9VX2Vj4fF/');
                    field.loadMedia();
                }
            }

            bind() {
                let field = this;
                let $field = this.$field;
                
                $field.on('click', async () => {
                    field.data.url = prompt('Link to embed media', 'http://instagr.am/p/BO9VX2Vj4fF/');
                    await field.loadMedia();
                });

                field.loadMedia();
            }

            async loadMedia() {
                let field = this;
                if (!field.data || !field.data.url)
                    return;

                const json = await Services.EmbedService.getEmbedAsync(field.data.url);
                
                field.data.embed = json;
                const $embed = $(json.html);

                const $script = $embed.filter('script');
                if ($script.length > 0) {
                    $script.remove();
                    var scriptSrc = $script.attr('src');
                    if (scriptSrc.breStartsWith('//')) {
                        scriptSrc = "https:" + scriptSrc;
                        $.getScript(scriptSrc)
                            .done(script => {
                                Services.EmbedService.processEmbed(json.provider_name);
                            })
                            .fail(function (err) { });
                    }
                }

                field.$field.empty();
                field.$field.removeAttr('class');
                field.$field.removeAttr('style');
                field.$field.append($embed);
                field.selectBlock();
            }
        }
    }
}