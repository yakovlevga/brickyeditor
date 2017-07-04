
namespace BrickyEditor {
    export namespace Fields {
        export class EmbedField extends BaseField {            
            
            bind() {
                
                let field = this;
                let $field = this.$field;
                let data = this.data;

                $field.on('click', function() {
                    let url = prompt('Link to embed', 'http://instagr.am/p/fA9uwTtkSN/');
                    Services.EmbedService
                        .getEmbedAsync(url)
                        .done(function(json){
                            field.data.url = url;
                            field.data.embed = json;
                            let $embed = $(json.html);
                            let $script = $embed.filter('script');
                            if($script.length > 0) {
                                $script.remove();
                                var scriptSrc = $script.attr('src');
                                if(scriptSrc.breStartsWith('//')) {
                                    scriptSrc = "http:" + scriptSrc;
                                    $.getScript(scriptSrc)
                                        .done(function(script) {
                                            if(scriptSrc.breContains('instgram') && instgrm) {
                                                instgrm.Embeds.process();
                                            }
                                        }) 
                                        .fail(function(err) {});
                                }
                            }

                            $field.replaceWith($embed);

                            field.selectBlock();
                        });
                });
            }                    
        }
    }
}