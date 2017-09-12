namespace BrickyEditor {
    export namespace Services {
        export class TemplateService {
            constructor() {}
            static templates: Template[];

            static loadTemplatesAsync(editor: Editor) : JQueryDeferred<Template[]> {
                var result = $.Deferred<Template[]>();
                $.get(editor.options.templatesUrl)
                    .done((data) => {
                        this.templates = [];

                        // set custom templates style
                        let $style = $(data).filter('style');
                        if($style && $style.length > 0) {
                            editor.$editor.prepend($style);
                        }

                        let $templates = $(data).filter('.bre-template');
                        $templates.each((idx, t) => {
                            let template = new Template(t);                            
                            this.templates.push(template);
                        });

                        result.resolve(this.templates);
                    })
                    .fail(err => {
                        console.log('Templates file not found.');
                        result.fail(err);
                    });   

                return result;
            }

            static getTemplate(templateName: string) : Template {
                for (var i = 0; i < this.templates.length; i++) {
                    var template = this.templates[i];
                    if(template.name.toLowerCase() === templateName.toLowerCase()) {
                        return template;
                    }   
                }

                return null;
            }
        }
    }
}