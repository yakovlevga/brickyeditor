/// <reference path="types/jquery.d.ts" />
/// <reference path="types/common.d.ts" />

namespace BrickyEditor {
    export class Editor {
        private blocks: Array<Block> = [];
        private templates: any;

        public options: EditorOptions;
        public selectedBlock: Block;

        public modal: Modal;
        public htmlTools: HtmlTools;

        // UI
        private $el: JQuery; // jquery element of editor
        private $tools: JQuery; // jquery element of editor tools
        private $filter: JQuery; // blocks filter      
        private $toolsBtn: JQuery; // show tools button

        
        private compactTools? : Boolean = null;
        private _isMobile : Boolean;
        public get isMobile() : Boolean {
            return this._isMobile;
        }
        public set isMobile(value : Boolean) {
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
            let editor = this;
            this.options = new EditorOptions(options);
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
            TemplateService
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

            // editor.$tools.toggle(!editor.isMobile);
            // editor.$toolsBtn.toggle(editor.isMobile);

            for (var templateName in TemplateService.templates) {
                let block = new Block(null, templateName);
                let template = TemplateService.templates[templateName];
                let $template = $(`<div class='template m-1 p-1' data-bricky-template="${templateName}">${block.getHtml(true)}</div>`);
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

        private addBlock(template: string, data? : Array<Fields.BaseField>, idx? : number) {
            var block = new Block(this, template, data);

            if(idx == null && this.selectedBlock != null) {
                idx = this.blocks.indexOf(this.selectedBlock) + 1;
            }

            if(idx != null) {   
                this.blocks[idx - 1].$block.after(block.$editor);
                this.blocks.splice(idx, 0, block);
                this.selectedBlock = block;                
            }
            else {
                this.$el.append(block.$editor);
                this.blocks.push(block);
            }
        }

        public deleteBlock(block: Block) {
            let idx = this.blocks.indexOf(block);
            this.blocks.splice(idx, 1);
            block.$editor.remove();
            block = null;
        }

        public moveBlock(block: Block, offset: number) {
            let idx = this.blocks.indexOf(block);
            let new_idx = idx + offset;

            if (new_idx < this.blocks.length && new_idx >= 0) {
                var $anchorBlock = this.blocks[new_idx].$editor;
                if(offset > 0) {
                    $anchorBlock.after(block.$editor);
                }
                else if (offset < 0) {
                    $anchorBlock.before(block.$editor);
                }

                this.blocks.splice(idx, 1);
                this.blocks.splice(new_idx, 0, block);
            }
        }

        public copyBlock(block: Block) {
            let idx = this.blocks.indexOf(block);
            this.addBlock(block.template, block.getData().fields, idx);
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