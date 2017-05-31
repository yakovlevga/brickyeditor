/// <reference path="types/jquery.d.ts" />
/// <reference path="types/common.d.ts" />

namespace BrickyEditor {
    export class Editor {
        private blocks: Array<Block> = [];
        private templates: any;

        public options: EditorOptions;

        public modal: Modal;
        public htmlTools: HtmlTools;

        // UI
        private $el: JQuery; // jquery element of editor
        private $tools: JQuery; // jquery element of editor tools
        private $filter: JQuery; // blocks filter             

        constructor($el: JQuery, options: EditorOptions) {
            let editor = this;
            this.options = options ? options : new EditorOptions();
            $.extend(this.options, new EditorOptions());
            this.$el = $el;
            this
                .loadTemplatesAsync()
                .done(function() {
                    if(editor.options.blocks.length) {
                        editor.options.blocks.forEach(block => {
                            editor.addBlock(block.template, block.fields);
                        });
                    }

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
            tasks.push(TemplateService
                .loadTemplatesAsync(editor.options.templatesFolder)
                .done(function() {})
                .fail(function(err) {
                    console.log("Templates loading error");
                    result.reject();
                }));

            // load modal template
            tasks.push(TemplateService
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
            TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, Constants.templateToolsKey)
                .done(function(html) {
                    editor.$tools = $(html);
                })
                .fail(function(err) {
                    console.log("Tools loading error");
                    result.reject();
                });
                
            // load html tools template
            TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, Constants.templateHtmlToolsKey)
                .done(function(html) {
                    var htmlTools = new HtmlTools(html, editor);
                    editor.htmlTools = htmlTools;
                    editor.$el.append(htmlTools.$control);
                })
                .fail(function(err) {
                    console.log("Html Tools loading error");
                    result.reject();
                });

             $.when
                .apply($, tasks)
                .then(function() { 
                    editor.addTools();
                    result.resolve(); 
                });

            return result;
        }

        private addTools() {
            let editor = this;
            let categories: Array<string> = new Array<string>();
            var $templates = $(Constants.selectorTemplates, editor.$tools);
            $templates.hide();
            editor.$el.append(editor.$tools);
                                            
            for (var templateName in TemplateService.templates) {
                let block = new Block(null, templateName);
                let template = TemplateService.templates[templateName];
                let $template = $(`<div class='template m-r-1 m-b-1 m-l-1 p-1' data-bricky-template="${templateName}">${block.getHtml(true)}</div>`);
                $templates.append($template);

                // fill all templates categories
                Common.arrayEach(template.category, function(category) {
                    let exists : Boolean = Common.arrayAny(categories, function(x) {
                        return x.breEqualsInvariant(category);
                    });
                    if(!exists) {
                        categories.push(category);
                    }
                });                             
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
                    editor.$tools.animate({ right: '-204px'}, 'fast')
                    $hideBtn.removeAttr("data-brickyeditor-hide-tools");
                }
                else {
                    editor.$tools.animate({ right: '0px'}, 'fast');
                    $hideBtn.attr("data-brickyeditor-hide-tools", "true");
                }
                $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");                
            });
                
            
            // draw all categories to filter            
            // editor.$filter = $(Constants.selectorFilter, editor.$tools);
            // let filterSelect = $('select', editor.$filter);
            // filterSelect.append('<option>all</option>');
            // categories.forEach(category => {
            //     filterSelect.append(`<option>${category}</option>`);
            // });            
        }

        private addBlock(template: string, data? : Array<Fields.BaseField>) {
            var block = new Block(this, template, data);
            var blockTools = 
            `<div class='brickyeditor-block-tools'>
                <div class='brickyeditor-icon brickyeditor-icon-x'></div>
                <div class='brickyeditor-icon brickyeditor-icon-cog'></div>
                <div class='brickyeditor-icon brickyeditor-icon-up'></div>
                <div class='brickyeditor-icon brickyeditor-icon-down'></div>
            </div>`;
            this.$el.append(blockTools);
            this.$el.append(block.$editor);
            this.blocks.push(block);
        }
        
        public getData() : any {
            var blocksData = [];            
            this.blocks.forEach(block => {
                blocksData.push(block.getData());
            });
            return blocksData;
        }

        public getHtml() : string {
            var blocksData = [];
            this.blocks.forEach(block => {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        }
    }
}