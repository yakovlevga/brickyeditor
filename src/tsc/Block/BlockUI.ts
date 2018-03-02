import { BlockUIAction } from "./BlockUIAction";
import { $dom } from "../Common/DOMHelpers";
import { UI } from "../UI/UI";

export class BlockUI {

    public $editor: HTMLElement;    // block editor
    public $tools: HTMLElement;     // block tools        
    public $block: HTMLElement;     // block

    private onSelect: () => void;

    public delete() {
        this.$editor.remove();
    }

    constructor(
        $block: HTMLElement,
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
        this.$editor.classList.toggle("bre-selected", isOn);
    }

    /**
     * Generate block editor wrapper with block tools.
     */
    private buildEditorUI(actions: BlockUIAction[]) {
        this.$tools = $dom.el('<div class="bre-block-tools bre-btn-deck"></div>');
        actions.forEach(action => {
            var $btn = this.buildButton(action);
            this.$tools.appendChild($btn);
        });
        UI.initBtnDeck(this.$tools);

        this.$editor = $dom.el('<div class="bre-block-wrapper"></div>');
        this.$editor.appendChild(this.$tools);
        this.$editor.appendChild(this.$block);

        $dom.on(this.$editor, 'mouseover', () => {
            this.$editor.classList.add('bre-active');
        });

        $dom.on(this.$editor, 'mouseout', () => {
            this.$editor.classList.remove('bre-active');
        });

        $dom.on(this.$editor, 'click', () => {
            this.onSelect();
        });

        // this.$editor.hover(
        //     () => { this.$editor.classList.add('bre-active'); },
        //     () => { this.$editor.classList.remove('bre-active'); });

        // this.$block.on('click', () => this.onSelect());
    }

    /**
     * Build button element with icon and action
     *
     * @param action Button action
     */
    private buildButton(action: BlockUIAction): HTMLElement {
        let $el = $dom.el(`<button type="button" class="bre-btn"><i class="fa fa-${action.icon}"></i></button>`);
        if (action.action) {
            $el.onclick = function (ev) {
                action.action()
                ev.stopPropagation();
                return false;
            }
        }
        return $el;
    }
}