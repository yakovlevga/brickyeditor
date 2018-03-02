namespace BrickyEditor {
    export namespace Services {
        export class TemplateService {
            
            static templates: TemplateGroup[];

            static async loadTemplatesAsync(
                url: string, 
                $editor: HTMLElement, 
                onError: (message: string, code?: number) => any): Promise<TemplateGroup[]> {
                
                this.templates = [];
                const templates = this.templates;
                
                return new Promise<TemplateGroup[]>(async (resolve, reject) => {
                    
                    try {
                        const data = await $ajax.get(url);

                        // set custom templates style
                        const $data = $dom.el(`<div>${data}</div>`);

                        const $style = $dom.select($data, 'style', false);
                        if ($style.length > 0) {
                            $dom.before($editor, $style);
                            //$editor.prepend($style);
                        }

                        const $groups = $dom.select($data, Selectors.selectorTemplateGroup);
                        $groups.forEach($group => {
                            const title = $group.getAttribute('title');                            
                            let templates = this.getTemplates($group, onError);
                            this.templates.push(new TemplateGroup(title, templates));
                            $group.remove();
                        })
                                                    
                        // the rest ungroupped templates
                        let templates = this.getTemplates($data, onError);
                        let defaultGroupName = this.templates.length > 0 ? EditorStrings.defaultTemplatesGroupName : '';
                        let group = new TemplateGroup(defaultGroupName, templates);
                        this.templates.push(group);

                        resolve(this.templates);
                    }
                    catch (err) {
                        onError(EditorStrings.errorTemplatesFileNotFound(url));
                        reject(err);
                    }
                });
            }

            private static getTemplates(
                $el: HTMLElement,
                onError: (message: string, code?: number) => any) : Template[] {
                let templates = [];
                
                const $templates = $dom.select($el, Selectors.selectorTemplate);
                $templates.forEach($template => {
                    let template = new Template($template);
                    if(template.loaded) {
                        templates.push(template);
                    }
                    else {
                        onError(EditorStrings.errorTemplateParsing(template.name))
                    }
                });

                return templates;
            }

            static getTemplate(templateName: string): Template {
                for (var gi = 0; gi < this.templates.length; gi++) {
                    const group = this.templates[gi];
                    for (var ti = 0; ti < group.templates.length; ti++) {
                        const template = group.templates[ti];
                        if (template.name.breEqualsInvariant(templateName)) {
                            return template;
                        }
                    }
                }

                return null;
            }
        }
    }
}