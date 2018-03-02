namespace BrickyEditor {
    export namespace Fields {
        export class ImageField extends BaseField {

            private $link: HTMLLinkElement;

            bind() {
                let field = this;
                let data = this.data;

                this.setSrc(this.data.src, false);
                $dom.on(this.$field, 'click', async () => {
                    const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());
                    if (fields != null) {
                        const file = fields.getValue('file');
                        const src = fields.getValue('src');
                        if (file) {
                            if(field.onUpload) {
                                field.onUpload(file, url => {
                                    field.setSrc(url);
                                    field.setFile(null);
                                });
                            }
                            else {
                                field.setFile(file);
                                field.setSrc(null);
                            }
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }

                        const alt = fields.getValue('alt');
                        field.setAlt(alt);

                        const link = HtmlLinkParams.getLinkFromParams(fields);
                        this.setLink(link);
                    }
                    field.select();
                });
            }

            private getPromptParams(): Array<Prompt.PromptParameter> {
                var params = [
                    new Prompt.PromptParameter('src', EditorStrings.imageFieldLinkTitle, this.data.url, EditorStrings.imageFieldLinkPlaceholder),
                    new Prompt.PromptParameterImage('file', EditorStrings.imageFieldUploadTitle, this.data.file, EditorStrings.imageFieldUploadButton),
                    new Prompt.PromptParameter('alt', EditorStrings.imageFieldAltTitle, this.data.alt, EditorStrings.imageFieldAltPlaceholder),
                    new Prompt.PromptParameter(null, EditorStrings.imageFieldUrlSubtitle, null, null),
                ];

                const link: HtmlLinkParams = this.data.link ? this.data.link : new HtmlLinkParams();
                const linkParams = link.getLinkPromptParams();
                return params.concat(linkParams);
            }

            setSrc(src: string, fireUpdate: boolean = true) {
                if (src) {
                    if (this.isImg) {
                        this.$field.setAttribute('src', src);
                    }
                    else {
                        this.$field.style.backgroundImage = `url(${src}`;
                    }
                }
                this.updateProperty('src', src, fireUpdate);
            }

            setAlt(alt) {
                this.$field.setAttribute(this.isImg ? 'alt' : 'title', alt);
                this.updateProperty('alt', alt);
            }

            setFile(file) {
                if (file) {
                    if (this.isImg) {
                        this.$field.setAttribute('src', file.fileContent);
                    }
                    else {
                        this.$field.style.backgroundImage = `url(${file.fileContent})`;
                    }
                }
                this.updateProperty('file', file);
            }

            setLink(url: HtmlLinkParams) {

                if (url && url.href) {
                    if (!this.$link) {
                        this.$link = $dom.el(`<a href='${url.href}' title='${url.title}' target='${url.target}'></a>`) as HTMLLinkElement;
                        $dom.on(this.$link, 'click', ev => {
                            ev.stopPropagation();
                            return false;
                        });

                        $dom.wrap(this.$field, this.$link);
                        //this.$field.wrap(this.$link);
                    }
                    else {
                        this.$link.href = url.href;
                    }
                }
                else if (this.$link) {
                    $dom.unwrap(this.$field);
                    this.$link = null;
                    delete this.$link;
                }

                this.updateProperty('link', url);
            }

            _isImg: Boolean;
            private get isImg(): Boolean {
                return this._isImg = this._isImg || this.$field.tagName.toLowerCase() === 'img';
            }

            public getEl(): HTMLElement {
                let $el = super.getEl();
                const {link} = this.data;
                if(link && link.href){
                    const $link = $dom.el(`<a href='${link.href}' title='${link.title}' target='${link.target}'></a>`);
                    $link.appendChild($el);
                    return $link;
                }
                return $el;
            }
        }
    }
}