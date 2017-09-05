namespace BrickyEditor {
    export namespace Services {
        export class EmbedService {
            static Instagram : string = 'Instagram';

            constructor() {
            }

            public static getEmbedAsync(url: string) : JQueryDeferred<any> {
                var task = $.Deferred();
                var url = `https://noembed.com/embed?url=${url}`;
                $.ajax({
                    url: url,
                    type: "get",                    
                    dataType: "jsonp"
                })            
                .done(function(json) {
                    task.resolve(json);
                })
                .fail(function(err){
                    task.reject(err);                
                });

                return task;
            }

            public static processEmbed(provider: string) {
                switch (provider) {
                    case EmbedService.Instagram:
                        if(instgrm) {
                            instgrm.Embeds.process();
                        }
                        break;
                
                    default:
                        break;
                }
            }
        }
    }      
}