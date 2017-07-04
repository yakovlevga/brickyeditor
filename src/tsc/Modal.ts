namespace BrickyEditor {
    export class Modal {

        public $control: JQuery; // jquery element of editor tools   
        public closeFunction: any;

        private $content: JQuery;

        constructor(html: string) {
            var modal = this;
            this.$control = $(html);
            this.$content = $(Constants.selectorModalContent, this.$control);
            
            $(Constants.selectorModalClose, this.$control)
                .on('click', function() {
                    modal.hideModal();
            });  
        }

        public hideModal() {            
            let $content = this.$content;
            this.$control.fadeOut(function() {
                $content.html('');
            });
        }

        public showModal($html) {
            this.$content.append($html);
            if(!$html.is(':visible')) {
                $html.show();
            }
            this.$control.fadeIn();
        }

        public promptAsync(fields: Array<Prompt.PromptParameter>) : JQueryDeferred<Prompt.PromptParameterList> {
            let result = $.Deferred<Prompt.PromptParameterList>();
            let modal = this;
            let $form = $('<form></form>');

            fields.forEach(field => {
                $form.append(field.$control);
            });

            let $ok = $('<button type="button" class="btn btn-ok m-r-1">Ok</button>');
            $ok.on('click', function() {
                fields.forEach(field => field.parseValue());
                modal.hideModal();
                result.resolve(new Prompt.PromptParameterList(fields));
            });

            let $cancel = $('<button type="button" class="btn btn-cancel">Cancel</button>');
            $cancel.on('click', function() {
                modal.hideModal();
                result.reject(fields);
            });
            $form.append($ok);
            $form.append($cancel);

            modal.showModal($form);
            return result;
        }        
    }
}