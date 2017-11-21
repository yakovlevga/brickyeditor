namespace BrickyEditor {
    export namespace Services {
        export class TemplateService {
            
            static templates: Template[];

            static async loadTemplatesAsync(editor: Editor): Promise<Template[]> {
                this.templates = [];
                const templates = this.templates;
                const url = editor.options.templatesUrl;
                
                return new Promise<Template[]>(async (resolve, reject) => {
                    
                    try {
                        const data = await $.get(url);

                        // set custom templates style
                        const $style = $(data).filter('style');
                        if ($style && $style.length > 0) {
                            editor.$editor.prepend($style);
                        }

                        const $templates = $(data).filter('.bre-template');
                        $templates.each((idx, t) => {
                            let template = new Template(t);
                            this.templates.push(template);
                        });

                        resolve(this.templates);
                    }
                    catch (err) {
                        console.log('Templates file not found.');
                        reject(err);
                    }
                });
            }

            static getTemplate(templateName: string): Template {
                for (var i = 0; i < this.templates.length; i++) {
                    var template = this.templates[i];
                    if (template.name.toLowerCase() === templateName.toLowerCase()) {
                        return template;
                    }
                }

                return null;
            }
        }
    }
}