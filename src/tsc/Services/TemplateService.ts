namespace BrickyEditor {
    export namespace Services {
        export class TemplateService {
            
            static templates: TemplateGroup[];

            static async loadTemplatesAsync(editor: Editor): Promise<TemplateGroup[]> {
                this.templates = [];
                const templates = this.templates;
                const url = editor.options.templatesUrl;
                
                return new Promise<TemplateGroup[]>(async (resolve, reject) => {
                    
                    try {
                        const data = await $.get(url);

                        // set custom templates style
                        const $style = $(data).filter('style');
                        if ($style && $style.length > 0) {
                            editor.$editor.prepend($style);
                        }

                        let $data = $(`<div>${data}</div>`);
                        const $groups = $(Selectors.selectorTemplateGroup, $data);
                        $groups.each((idx, el) => {
                            let $group = $(el);     
                            let templates = this.getTemplates($group);
                            this.templates.push(new TemplateGroup($group.attr('title'), templates));
                            $group.remove();
                        })
                                                    
                        // the rest ungroupped templates
                        let templates = this.getTemplates($data);
                        let defaultGroupName = this.templates.length > 0 ? 'Other templates' : '';
                        let group = new TemplateGroup(defaultGroupName, templates);
                        this.templates.push(group);

                        resolve(this.templates);
                    }
                    catch (err) {
                        console.log('Templates file not found.');
                        reject(err);
                    }
                });
            }

            private static getTemplates($el: JQuery) : Template[] {
                let templates = [];
                
                const $templates = $(Selectors.selectorTemplate, $el);
                $templates.each((idx, t) => {
                    let template = new Template(t);
                    templates.push(template);
                });

                return templates;
            }

            static getTemplate(templateName: string): Template {
                for (var gi = 0; gi < this.templates.length; gi++) {
                    const group = this.templates[gi];
                    for (var ti = 0; ti < group.templates.length; ti++) {
                        const template = group.templates[ti];
                        if (template.name.toLowerCase() === templateName.toLowerCase()) {
                            return template;
                        }
                    }
                }

                return null;
            }
        }
    }
}