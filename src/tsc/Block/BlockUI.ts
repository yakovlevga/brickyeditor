namespace BrickyEditor {
    export class BlockUI {

        public $tools: JQuery; // block tools
        public $editor: JQuery; // block editor

        // Block actions
        private static actions: BlockAction[] = [
            { 'icon' : 'ellipsis-h' },
            { 'icon' : 'trash-o',       'action': (block) => block.delete() },
            { 'icon' : 'copy',          'action': (block) => block.copy() },
            { 'icon' : 'angle-up',      'action': (block) => block.move(-1) },
            { 'icon' : 'angle-down',    'action': (block) => block.move(+1) }
        ];

        constructor(
            private block: Block,
            public $block: JQuery,
            data?: Array<Fields.BaseField>) {

            // When we call constructor for templates previews, we pass null editor.
            if(this.block.editor) {
                this.buildEditorUI();
            }

            this.bindFields(data);
        }

        public delete() {
            this.$editor.remove();
        }

        /**
         * Generate block editor wrapper with block tools.
         */
        private buildEditorUI() {
            this.$tools = $('<div class="bre-block-tools bre-btn-deck"></div>');
            BlockUI.actions.forEach(action => {
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

            this.$block.on('click', () => this.block.select());
        }

        /**
         * Build button element with icon and action
         *
         * @param action Block action
         */
        private buildButton(action: BlockAction) : JQuery {
            let $el = $(`<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`);
            if(action.action) {
                $el.on('click', () => action.action(this.block));
            }
            return $el;
        }

        /**
         * Find and bind block fields
         *
         * @param data Array of block fields data
         */
        private bindFields(data?: Array<Fields.BaseField>) {
            this.$block
                .find(Selectors.selectorField)
                .addBack(Selectors.selectorField)
                .each((idx, elem) => {
                    let $field = $(elem);
                    let field = Fields.BaseField.createField(this.block, $field, data);
                    this.block.fields.push(field);
                });
        }
    }
}