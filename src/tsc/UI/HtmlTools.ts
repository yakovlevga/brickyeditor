namespace BrickyEditor {
    export class HtmlTools {
        private $control: HTMLElement;

        constructor(private editor: Editor) {
            if (editor.options.htmlToolsButtons) {
                this.buttons = editor.options.htmlToolsButtons;
            }
            this.setControl();
        }

        private buttons = [
            { icon: 'bold', command: 'Bold', range: true, aValueArgument: null },
            { icon: 'italic', command: 'Italic', range: true, aValueArgument: null },
            { icon: 'link', command: 'CreateLink', range: true, aValueArgument: null },
            { icon: 'list-ul', command: 'insertUnorderedList', range: true, aValueArgument: null },
            { icon: 'list-ol', command: 'insertOrderedList', range: true, aValueArgument: null },
            { icon: 'undo', command: 'Undo', range: false, aValueArgument: null },
            { icon: 'repeat', command: 'Redo', range: false, aValueArgument: null },
        ];

        private setControl() {
            let $panel = $dom.el('<div class="bre-html-tools-panel"></div>');
            this.buttons.forEach(b => {
                let $btn = this.getButtonElement(b.icon, b.command, b.range, b.aValueArgument);
                $panel.appendChild($btn);
            });

            this.$control = $dom.el('<div class="bre-html-tools bre-btn-group"></div>');
            this.$control.appendChild($panel);
            $dom.hide(this.$control);
            this.editor.$editor.appendChild(this.$control);
        }

        private getButtonElement(icon: string, command: string, rangeCommand: boolean = true, aValueArgument: string = null): HTMLElement {
            let $btn = $dom.el(`<button type="button" class="bre-btn"><i class="fa fa-${icon}"></i></button>`);

            $btn.onclick = async () => {
                let selection = window.getSelection();
                let selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

                if (rangeCommand && !selectionRange)
                    return;

                if (command == 'CreateLink') {
                    const params = this.getLinkPromptParamsInternal(selection);
                    const fields = await Editor.UI.modal.promptAsync(params);
                    const link = HtmlLinkParams.getLinkFromParams(fields);
                    
                    if (link.href) {
                        document.execCommand(command, false, link.href);
                        if (link.target) {
                            selection.anchorNode.parentElement.setAttribute('target', link.target);
                        }
                        if (link.title) {
                            selection.anchorNode.parentElement.setAttribute('title', link.title);
                        }
                    }
                }
                else {
                    if (typeof (aValueArgument) === 'string') {
                        var valueArgument = aValueArgument.replace('%%SELECTION%%', selection.toString());
                    }

                    try {
                        document.execCommand(command, false, valueArgument);
                    }
                    catch {
                        this.wrapSelectionToContainer(selection);
                        document.execCommand(command, false, valueArgument);
                    }
                }

                return false;
            }

            return $btn;
        }

        //** Firefox execCommand hack */
        private wrapSelectionToContainer(selection: Selection) {
            let $container = selection.anchorNode.parentElement;
            const $wrapper = $dom.el(`<div class="bre-temp-container" contenteditable="true">${$container.innerHTML}</div>`);            
            $container.innerHTML = '';
            $container.removeAttribute(Selectors.attrContentEditable)
            $container.appendChild($wrapper);

            const range = document.createRange();
            range.selectNodeContents($wrapper);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        public show(rect: ClientRect) {
            // check if some text is seleted
            if (rect && rect.width > 1) {
                const $editor = this.editor.$editor;
                const offset = $dom.offset($editor);

                var editorWidth = $editor.clientWidth;
                var top = rect.top - offset.top + $dom.windowScrollTop() + rect.height;

                var controlWidth = this.$control.clientWidth;
                var left = rect.left - offset.left + rect.width / 2 - controlWidth / 2;
                if (left < 0) {
                    left = 0;
                }
                else if (left + controlWidth > editorWidth) {
                    left = editorWidth - controlWidth;
                }

                this.$control.style.top = `${top}px`;
                this.$control.style.left = `${left}px`;
                $dom.show(this.$control);
            }
            else {
                $dom.hide(this.$control);
            }
        }

        private getLinkPromptParamsInternal(selection: Selection): Prompt.PromptParameter[] {
            var link: HtmlLinkParams;

            if (selection && selection.anchorNode && selection.anchorNode.parentNode.nodeName.breEqualsInvariant('a')) {
                var $a = selection.anchorNode.parentNode as HTMLElement;
                link = new HtmlLinkParams(
                    $a.getAttribute('href'),
                    $a.getAttribute('title'),
                    $a.getAttribute('target'));
            }
            else {
                link = new HtmlLinkParams();
            }

            return link.getLinkPromptParams();
        }        
    }
}