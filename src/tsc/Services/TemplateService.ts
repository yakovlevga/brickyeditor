namespace BrickyEditor {
    export namespace Services {
        export class TemplateService {            
            static templates : Template[];
            constructor() {}

            static loadTemplateAsync(folder: string, template: string) : JQueryDeferred<string> {
                TemplateService.templates = [];
                var task = $.Deferred<string>();
                $.get(TemplateService.getTemplateUrl(folder, template))
                .done(function(html) {
                    task.resolve(html);
                })
                .fail(function(err){
                    task.reject(err);                
                });

                return task;
            }

            // load config file
            static loadTemplateConfigAsync(folder: string) : JQueryDeferred<any[]> {
                var task = $.Deferred<any[]>();
                $.getJSON(TemplateService.getTemplatesConfigUrl(folder))
                .done(json => {
                    task.resolve(json);
                })
                .fail(e => {
                    console.log(e);
                    task.reject(e);                
                });
                return task;
            }

            static filteredTemplates(filter: string) {
                TemplateService.templates.map(el => {
                    el.category.filter(c => {
                        c.toLowerCase() === filter.toLowerCase(); 
                    });
                });
            }

            static loadTemplatesAsync(folder: string) : JQueryDeferred<{}> {
                var result = $.Deferred();                
                TemplateService.loadTemplateConfigAsync(folder)
                    .done(function(result){
                        result.forEach(t => {
                            TemplateService.templates.push(new Template(t));
                        });
                    })
                    .fail(e => {
                        console.log(e);
                    })
                    .then(function() {
                        var tasks = [];
                        TemplateService.templates.forEach(t => {
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
}