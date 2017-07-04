namespace BrickyEditor {
    export namespace Services {
        export class EmbedService {
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
        }
    }      
}