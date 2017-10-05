namespace BrickyEditor {
    export class UI {
        public compactTools?: boolean;

        public editor: Editor;

        // Templates
        private $tools : JQuery;
        private $toolsBtn : JQuery;
        private $toolsTemplates : JQuery;
        private $toolsHideBtn : JQuery;
        private $toolsLoader : JQuery;

        // Modal
        public modal : Modal;

        // Html Editing Tools
        public htmlTools : HtmlTools;

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
                    this.$tools.addClass(Selectors.classMobile);
                }
                else {
                    this.$tools.removeClass(Selectors.classMobile);
                }
            }
        } 

        // Set is mobile if there is not enough of space for tools
        // or if it's not forced by compactTools in passed settings.
        private checkIsCompactTools(editor: Editor) {            
            if(this.compactTools == null) {
                let offset = (window.innerWidth - editor.$editor.width()) / 2 - this.$tools.width();
                this.isMobile = offset <= 0;
            }        
            else {
                this.isMobile = this.compactTools;
            }
        }

        constructor(editor: Editor) {
            this.editor = editor;

            this.setTools();
            this.setModal();

            this.htmlTools = new HtmlTools(this.editor);
        }

        private setTools() {
            this.$toolsTemplates = $('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = $('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = $('<button class="bre-tools-toggle"><div>></div></button>');            
            this.$tools = $('<div class="bre bre-tools" data-bricky-tools></div>');
            this.$tools.append([this.$toolsHideBtn, this.$toolsLoader, this.$toolsTemplates]);

            this.$toolsHideBtn.on('click', () => {
                this.$tools.toggleClass('bre-tools-collapsed', !this.$toolsHideBtn.hasClass("bre-tools-toggle-collapsed"));
                this.$toolsHideBtn.toggleClass("bre-tools-toggle-collapsed"); 
            });            
            
            this.editor.$editor.append(this.$tools);
        }

        private setModal() {
            let $modal = $('<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>');
            let $modalCloseBtn = $('<div class="bre-modal-close"><a href="#">close ✖</a></div>');
            let $modalContent = $('<div class="bre-modal-content"></div>');
            let $modalForm = $('<form></form>');
            let $modalBtns = $('<div class="bre-btns"></div>');
            let $modalOk = $('<button type="button" class="bre-btn bre-btn-primary">Ok</button>');
            let $modalCancel = $('<button type="button" class="bre-btn">Cancel</button>');     

            $modalBtns.append($modalOk);
            $modalBtns.append($modalCancel);
            $modalForm.append($modalBtns);            
            $modalContent.append($modalForm);

            let $placeholder = $('.bre-modal-placeholder', $modal);
            $placeholder.append($modalCloseBtn);
            $placeholder.append($modalContent);

            this.modal = new Modal($modal, $modalCloseBtn, $modalForm, $modalBtns, $modalOk, $modalCancel);

            this.editor.$editor.append($modal);
        }

        public toggleToolsLoader(toggle) {
            this.$toolsLoader.toggle(toggle);
        }

        public setTemplates(templates: Template[]) {
            let editor = this.editor;            
            templates.forEach(template => {
                let $preview = template.getPreview();
                $preview.on('click', () => {
                    editor.addBlock(template);
                });
                this.$toolsTemplates.append($preview);
            });
        }
        
        public static initBtnDeck($btnsDeck: JQuery) {
            var $btns = $('.bre-btn', $btnsDeck);
            var $firstBtn = $btns.eq(0);
                        
            $firstBtn.on('click', function() {
                UI.toggleBtnDeck($btnsDeck); 
            });
        }
        
        public static toggleBtnDeck($btnsDeck: JQuery, isOn?: Boolean) {
            var $btns = $('.bre-btn', $btnsDeck);
            if(!$btns || $btns.length == 0)
                return;

            var $firstBtn = $btns.eq(0);
            var size = 32;
            var gap = size / 6;

            isOn = isOn || $btnsDeck.data().isOn || false;            

            if(isOn) {                 
                $btnsDeck.css({ 'height': 0, 'width': 0 });       
                $btns.not(':first').css({ 'opacity': 0, 'top': 0, 'left': 0 });
            }
            else {                
                $btns.not(':first').each((idx, btn) => {
                    $(btn).css({ 'opacity': 1, 'left': (idx + 1) * (size + gap) });
                });
                $btnsDeck.css({ 'height': size, 'width': (size + gap) * $btns.length - gap });
            }

            $firstBtn.toggleClass('bre-btn-active', !isOn)
            $btnsDeck.data('isOn', !isOn);
        }
    }
}