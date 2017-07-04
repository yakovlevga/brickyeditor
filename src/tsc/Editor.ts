/// <reference path="types/jquery.d.ts" />
/// <reference path="types/common.d.ts" />

namespace BrickyEditor {
    export class Editor extends Container {
        private templates: any;

        public options: EditorOptions;
        public modal: Modal;
        public htmlTools: HtmlTools;

        // UI
        private $tools: JQuery; // jquery element of editor tools
        private $filter: JQuery; // blocks filter      
        private $toolsBtn: JQuery; // show tools button
        
        private compactTools? : boolean = null;
        private _isMobile : boolean;
        public get isMobile() : boolean {
            return this._isMobile;
        }
        public set isMobile(value : boolean) {
            if(this._isMobile == value)
                return;
                
            this._isMobile = value;
            if(this.$tools != null) {
                this.$tools.toggle(!value);                
                this.$toolsBtn.toggle(value);
                if(value) {
                    this.$tools.addClass(Constants.classMobile);
                }
                else {
                    this.$tools.removeClass(Constants.classMobile);
                }
            }
        } 

        constructor($el: JQuery, options: EditorOptions) {
            super($el);
            
            let editor = this;
            this.options = new EditorOptions(options);
            
            editor
                .loadTemplatesAsync()
                .done(function() {
                    // Load blocks into container
                    editor.loadBlocks(editor.options.blocks);

                    // OnLoad handler
                    if(editor.options.onload) {
                        editor.options.onload(editor);
                    }
                });
        }

        private loadTemplatesAsync() : JQueryDeferred<any> {
            let result = $.Deferred();
            let editor = this;
            let tasks = [];            

            // load templates
            tasks.push(Services.TemplateService
                .loadTemplatesAsync(editor.options.templatesFolder)
                .done(function() {})
                .fail(function(err) {
                    console.log("Templates loading error");
                    result.reject();
                }));

            // load modal template
            tasks.push(Services.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, Constants.templateModalKey)
                .done(function(html) {
                    var modal = new Modal(html);
                    editor.modal = modal;
                    editor.$el.append(modal.$control);         
                })
                .fail(function(err) {
                    console.log("Modal loading error");
                    result.reject();
                }));

            // load tools template
            Services.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, Constants.templateToolsKey)
                .done(function(html) {
                    editor.$tools = $(html);
                    let toolsBtn = `<button class='brickyeditor-tools-show-btn'><i class='fa fa-cog'></i></button>`;
                    editor.$toolsBtn = $(toolsBtn);
                    editor.$toolsBtn.on('click', () => {
                        editor.modal.showModal(editor.$tools.clone(true));
                    });
                })
                .fail(function(err) {
                    console.log("Tools loading error");
                    result.reject();
                });
                
            // load html tools template
            Services.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, Constants.templateHtmlToolsKey)
                .done(function(html) {
                    var htmlTools = new HtmlTools(html, editor);
                    editor.htmlTools = htmlTools;
                    editor.$el.append(htmlTools.$control);

                    //todo: hide tools for mobile
                    //htmlTools.$control.hide();
                })
                .fail(function(err) {
                    console.log("Html Tools loading error");
                    result.reject();
                });

             $.when
                .apply($, tasks)
                .then(function() { 
                    editor.addTools();

                    // subscribe to window resizing, to check if need to show mobile version
                    $(window).resize(() => editor.checkIsCompactTools(editor));

                    result.resolve(); 
                });

            return result;
        }

        private addTools() {
            let editor = this;
            let categories: Array<string> = new Array<string>();
            let $templates = $(Constants.selectorTemplates, editor.$tools);
            $templates.hide();
            editor.$el.append(editor.$tools);
            editor.$el.append(editor.$toolsBtn);

            // Set is mobile if there is not enough of space for tools
            // or if it's not forced by compactTools in passed settings.
            editor.checkIsCompactTools(editor);

            for (var templateName in Services.TemplateService.templates) {
                let block = new Block(null, null, templateName);
                let template = Services.TemplateService.templates[templateName];
                let $template = $(`<div class='template m-1 p-1' data-bricky-template="${templateName}">${block.getHtml(true)}</div>`);
                $templates.append($template);

                // fill all templates categories
                if(template.category) {
                    template.category.forEach(category => {
                        let exists = categories.some(c => {
                            return c.breEqualsInvariant(category);
                        });
                        if(!exists) {
                            categories.push(category);
                        }
                    });
                }
            }

            $(Constants.selectorTemplate, $templates)
                .on('click', function() {
                    var template = $(this).data().brickyTemplate;
                    editor.addBlock(template);
                });

            $(Constants.selectorLoader, editor.$tools)
                .fadeOut('slow', function() {
                    $templates.fadeIn('fast');
            });
            
            let $hideBtn = $('[data-brickyeditor-hide-tools]', editor.$tools);
            $hideBtn.on('click', function() {
                if($hideBtn.attr("data-brickyeditor-hide-tools")) {
                    if(editor.isMobile) {
                        editor.$tools.hide();
                        editor.$toolsBtn.show();
                    }
                    else {
                        editor.$tools.animate({ right: '-204px'}, 'fast')
                        $hideBtn.removeAttr("data-brickyeditor-hide-tools");
                        $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");                        
                    }
                }
                else {
                    if(editor.isMobile) {
                    }
                    else {
                        editor.$tools.animate({ right: '0px'}, 'fast');
                        $hideBtn.attr("data-brickyeditor-hide-tools", "true");
                        $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");
                    }
                }
            });
                
            
            // draw all categories to filter            
            // editor.$filter = $(Constants.selectorFilter, editor.$tools);
            // let filterSelect = $('select', editor.$filter);
            // filterSelect.append('<option>all</option>');
            // categories.forEach(category => {
            //     filterSelect.append(`<option>${category}</option>`);
            // });            
        }

        // Set is mobile if there is not enough of space for tools
        // or if it's not forced by compactTools in passed settings.
        private checkIsCompactTools(editor: Editor) {            
            if(editor.compactTools == null) {
                let offset = (window.innerWidth - editor.$el.width()) / 2 - editor.$tools.width();
                editor.isMobile = offset <= 0;
            }        
            else {
                editor.isMobile = editor.compactTools;
            }
        }
    }
}