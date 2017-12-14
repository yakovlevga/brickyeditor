namespace BrickyEditor {
    export class UI {
        // Templates
        private $tools: JQuery;
        private $toolsBtn: JQuery;
        private $toolsTemplates: JQuery;
        private $toolsHideBtn: JQuery;
        private $toolsLoader: JQuery;

        // Modal
        public modal: Modal;

        // Html Editing Tools
        public htmlTools: HtmlTools;

        // Set is mobile if there is not enough of space for tools
        // or if it's not forced by compactTools in passed settings.
        private get isCompactTools(): boolean {
            var compactTools = this.editor.options.compactTools;
            if (compactTools == null) {
                return window.innerWidth < this.editor.options.compactToolsWidth;
            }
            else {
                return compactTools.valueOf();
            }
        }

        constructor(public editor: Editor) {
            this.editor = editor;

            this.setTools();
            this.setModal();

            this.htmlTools = new HtmlTools(this.editor);
        }

        private setTools() {
            this.$tools = $('<div class="bre bre-tools" data-bricky-tools></div>');

            this.$toolsTemplates = $('<div class="bre-tools-templates"></div>');
            this.$toolsLoader = $('<div class="bre-tools-loader"><b>Loading...</b></div>');
            this.$toolsHideBtn = $('<button type="button" class="bre-tools-toggle"><div>►</div></button>');

            this.$tools.append([this.$toolsHideBtn, this.$toolsLoader, this.$toolsTemplates]);

            this.$toolsHideBtn.on('click', () => this.toggleTools());

            this.editor.$editor.append(this.$tools);

            if (this.isCompactTools) {
                this.$tools.addClass("bre-tools-templates-compact");
                this.toggleTools();
            }
        }

        private toggleTools() {
            this.$tools.toggleClass('bre-tools-collapsed', !this.$toolsHideBtn.hasClass("bre-tools-toggle-collapsed"));
            this.$toolsHideBtn.toggleClass("bre-tools-toggle-collapsed");
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
                $preview.on('click', (ev) => {
                    editor.addBlock(template);
                    ev.stopPropagation();
                    return false;
                });
                this.$toolsTemplates.append($preview);
            });
        }

        public static initBtnDeck($btnsDeck: JQuery) {
            var $btns = $('.bre-btn', $btnsDeck);
            var $firstBtn = $btns.eq(0);

            $firstBtn.on('click', (ev) => {
                UI.toggleBtnDeck($btnsDeck);
                ev.stopPropagation();
                return false;
            });
        }

        public static toggleBtnDeck($btnsDeck: JQuery, isOn?: Boolean) {
            var $btns = $('.bre-btn', $btnsDeck);
            if (!$btns || $btns.length == 0)
                return;

            var $firstBtn = $btns.eq(0);
            var size = 32;
            var gap = size / 6;

            isOn = isOn || $btnsDeck.data().isOn || false;

            if (isOn) {
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