
namespace BrickyEditor {
    export namespace Fields {
        export class EmbedField extends BaseField {

            public settings() {
                let field = this;
                return function() {
                    field.data.url = prompt('Link to embed media', 'http://instagr.am/p/BYJAes_HEI0/');
                    field.loadMedia();
                }
            }

            bind() {         
                let field = this;
                let $field = this.$field;
                
                $field.on('click', function() {
                    field.data.url = prompt('Link to embed media', 'http://instagr.am/p/BYJAes_HEI0/');
                    field.loadMedia();
                });

                field.loadMedia();
            } 
            
            loadMedia() {
                let field = this;    
                if(!field.data || !field.data.url)
                    return;

                Services.EmbedService
                    .getEmbedAsync(field.data.url)
                    .done(function(json) {
                        field.data.embed = json;
                        let $embed = $(json.html);
                        
                        let $script = $embed.filter('script');
                        if($script.length > 0) {
                            $script.remove();
                            var scriptSrc = $script.attr('src');
                            if(scriptSrc.breStartsWith('//')) {
                                scriptSrc = "https:" + scriptSrc;
                                $.getScript(scriptSrc)
                                    .done(script => {
                                        Services.EmbedService.processEmbed(json.provider_name);
                                    }) 
                                    .fail(function(err) {});
                            }
                        }
                        
                        field.$field.empty();
                        field.$field.removeAttr('class');
                        field.$field.removeAttr('style');
                        field.$field.append($embed);
                        field.selectBlock();
                    });
            }
        }
    }
}