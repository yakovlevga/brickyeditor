namespace BrickyEditor {
    export class Template {
        public name: string;
        public category: string[];

        public $html: JQuery;
        public $preview: JQuery;

        constructor(el: Element){
            const previewSelector = '.bre-template-preview';
            
            let $template = $(el);
            let data = $template.data();
            
            this.name = data.name;
            this.category = data.cactegory || [];

            this.$html = $template.contents().not(previewSelector);
            this.$preview = $(previewSelector, $template).contents();
            
            if(!this.$preview.length) {
                let block = new Block(null, this);
                let blockEl = block.getHtml(true);
                this.$preview = $(blockEl);
            }
        }

        public getPreview() : JQuery {
            let $template = $(`<div class='bre-template'></div>`);   
            $template.append(this.$preview);
            return $template;
        }
    }
}