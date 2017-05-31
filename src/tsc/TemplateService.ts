namespace BrickyEditor {
    export class TemplateService {
        //private templates = ["html", "image"];
        static templates : any = {};

        constructor() {
        }

        static loadTemplateAsync(folder: string, template: string) : JQueryDeferred<string> {
            var task = $.Deferred();
            $.get(TemplateService.getTemplateUrl(folder, template))
            .done(function(html) {
                task.resolve(html);
            })
            .fail(function(err){
                task.reject(err);                
            });

            return task;
        }

        static loadTemplateConfigAsync(folder: string) : JQueryDeferred<Array<any>> {
            var task = $.Deferred();
            $.getJSON(TemplateService.getTemplatesConfigUrl(folder))
            .done(function(json) {
                task.resolve(json);
            })
            .fail(function(err){
                task.reject(err);                
            });
            return task;
        }

        static filteredTemplates(filter: string) {
            return Common.arrayMap(TemplateService.templates, function(el) {
                return Common.arrayAny(el.category, function(category: string) {
                    category.toLowerCase() === filter.toLowerCase(); 
                });              
            });
        }

        static loadTemplatesAsync(folder: string) : JQueryDeferred<{}> {
            var result = $.Deferred();
            var templates: Array<any>;
            
            TemplateService.loadTemplateConfigAsync(folder)
                .done(function(result){
                    templates = result;
                })
                .then(function() {
                    var tasks = [];
                    templates.forEach(t => {
                        var task = TemplateService
                            .loadTemplateAsync(folder, t.file)
                            .done(function(html) {
                                t.html = html;
                                TemplateService.templates[t.file] = t;
                            })
                            .fail(function(err) {
                                console.log(err);
                            });

                        tasks.push(task);
                    });
                    
                    $.when.apply($, tasks).then(function() {
                        result.resolve();
                    });
                })            

            return result;
        }

        static getTemplateUrl(folder: string, template: string) {
             return `${folder}/${template}.html`;
        }

        static getTemplatesConfigUrl(folder: string) {
             return `${folder}/templates.json`;
        }

        static getTemplate(name: string) {
            return TemplateService.templates[name];
        }

        static removeTemplate(name: string) {
            delete TemplateService.templates[name];
        }

        static getFieldValue($el: JQuery, prop: string) : string {
            return $el.attr(`data-bricky-field-${prop}`);
        }
    }
}