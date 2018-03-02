namespace BrickyEditor {
    export class Template {
        public name: string;
        public loaded: boolean = true;
        public $html: HTMLElement;
        public $preview: HTMLElement;

        constructor($template: HTMLElement) {
            this.name = $template.dataset.name;
            this.$preview = $dom.first($template, Selectors.selectorTemplatePreview);
            if(this.$preview) {
                $template.removeChild(this.$preview);
            }
            
            this.$html = $template;

            if(!this.$preview) {
                let block = new Block(this, true);
                let blockHtml = block.getHtml(true);                
                if(blockHtml === null) {
                    this.loaded = false;
                }
                else {
                    this.$preview = $dom.el(blockHtml);
                }
            }
        }

        public getPreview(): HTMLElement {
            let $template = $dom.el(`<div class='${Selectors.classTemplate}'></div>`);
            $template.appendChild(this.$preview);
            return $template;
        }
    }
}