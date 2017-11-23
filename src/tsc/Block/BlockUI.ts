namespace BrickyEditor {
    export class BlockUI {

        public $editor: JQuery; // block editor
        public $tools: JQuery; // block tools        
        public $block: JQuery; // block tools        

        private onSelect: () => void;

        public delete() {
            this.$editor.remove();
        }

        constructor(            
            $block: JQuery,
            preview: boolean,
            actions: BlockUIAction[],
            onSelect?: () => void) {

            this.$block = $block;
            this.onSelect = onSelect;            

            // When we call constructor for templates previews, we pass null editor.
            if (!preview) {
                this.buildEditorUI(actions);
            }
        }

        public toggleSelection(isOn: boolean) {
            this.$editor.toggleClass("bre-selected", isOn);
        }

        /**
         * Generate block editor wrapper with block tools.
         */
        private buildEditorUI(actions: BlockUIAction[]) {
            this.$tools = $('<div class="bre-block-tools bre-btn-deck"></div>');
            actions.forEach(action => {
                var $btn = this.buildButton(action);
                this.$tools.append($btn);
            });
            UI.initBtnDeck(this.$tools);

            this.$editor = $('<div class="bre-block-wrapper"></div>');
            this.$editor.append(this.$tools);
            this.$editor.append(this.$block);

            this.$editor.hover(
                () => { this.$editor.addClass('bre-active'); },
                () => { this.$editor.removeClass('bre-active'); });

            this.$block.on('click', () => this.onSelect());
        }

        /**
         * Build button element with icon and action
         *
         * @param action Button action
         */
        private buildButton(action: BlockUIAction): JQuery {
            let $el = $(`<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`);
            if (action.action) {
                $el.on('click', () => action.action());
            }
            return $el;
        }
    }
}