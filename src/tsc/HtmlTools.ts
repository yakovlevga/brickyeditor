namespace BrickyEditor {
    export class HtmlTools {

        public $control: JQuery; // jquery element of editor html tools

        constructor(html: string, editor: Editor) {
            var tools = this;
            tools.$control = $(html);
            $(Constants.selectorHtmlToolsCommand, this.$control)
                .on("click", function() {
                    let $command = $(this);
                    let selection = window.getSelection();
                    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                    
                    if($command.is(Constants.selectorHtmlToolsCommandRange) && !range)
                        return;

                    let command = $command.data().brickyeditorDocCommand;                
                    if(command == 'CreateLink') {
                        editor.modal.promptAsync(tools.getLinkPromptParams(selection))                    
                        .done(fields => {
                            selection = window.getSelection();
                            selection.addRange(range);
                            
                            var href = fields.getValue('href');
                            if(href) {
                                document.execCommand(command, false, href);
                                
                                var target = fields.getValue('target');
                                if(target) {
                                    selection.anchorNode.parentElement.setAttribute('target', target);
                                }

                                var title = fields.getValue('title');
                                if(title) {
                                    selection.anchorNode.parentElement.setAttribute('title', title);
                                }
                            }
                        })
                        .fail(() => {
                            selection = window.getSelection();
                            selection.addRange(range);
                        });
                    }
                    else {
                        document.execCommand(command);
                    }

                    //todo: hide tools for mobile
                    //editor.htmlTools.$control.hide();
                    
                    return false;                
                });
        }

        private getLinkPromptParams(selection: Selection) : Array<Prompt.PromptParameter> {
            var href = '', title = '', target = '';
            if(selection.anchorNode && selection.anchorNode.parentNode.nodeName.breEqualsInvariant('a')) {
                var a = $(selection.anchorNode.parentNode);
                href = a.attr('href');
                title = a.attr('title');
                target = a.attr('target');
            }

            return [
                new Prompt.PromptParameter('href', 'Url', href, 'Url'),
                new Prompt.PromptParameter('title', 'Title', title, 'Title'),
                new Prompt.PromptParameterOptions('target', 'Target', [
                    ['', ''],
                    ['Blank', '_blank'],
                    ['Self', '_self'],
                    ['Parent', '_parent'],
                    ['Top', '_top'],
                ], target)
            ];
        }
    }
}