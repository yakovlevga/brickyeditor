import { $dom } from "src/common/DOMHelpers";
import { Editor } from "src/Editor";
import { BaseField } from "src/fields/BaseField";
import { HtmlLinkParams } from "src/HtmlLinkParams";
import { locales } from "src/locales";
import { prompt } from "src/modal";
import { PromptParameter, PromptParameterImage } from "src/prompt/Prompt";

const getPromptParams: (props: {
  url: string;
  alt: string;
  file: any;
}) => bre.prompt.PromptParameter[] = ({ url, file, alt }) => [
  {
    key: "src",
    value: url,
    title: locales.prompt.image.link.title,
    placeholder: locales.prompt.image.link.placeholder,
  },
  {
    key: "file",
    value: file,
    title: locales.prompt.image.upload.title,
    placeholder: locales.prompt.image.upload.placeholder,
  },
  {
    key: "alt",
    value: alt,
    title: locales.prompt.image.alt.title,
    placeholder: locales.prompt.image.alt.placeholder,
  },
];

// new PromptParameter(
//   "src",
//   EditorStrings.imageFieldLinkTitle,
//   this.data.url,
//   EditorStrings.imageFieldLinkPlaceholder
// ),
// new PromptParameterImage(
//   "file",
//   EditorStrings.imageFieldUploadTitle,
//   this.data.file,
//   EditorStrings.imageFieldUploadButton
// ),
// new PromptParameter(
//   "alt",
//   EditorStrings.imageFieldAltTitle,
//   this.data.alt,
//   EditorStrings.imageFieldAltPlaceholder
// ),
// new PromptParameter(
//   null,
//   EditorStrings.imageFieldUrlSubtitle,
//   null,
//   null
// ),

export class ImageField extends BaseField {
  private get isImg(): boolean {
    return (this._isImg =
      this._isImg || this.$field.tagName.toLowerCase() === "img");
  }

  public _isImg: boolean;
  private $link: HTMLLinkElement;

  public bind() {
    const field = this;
    const data = this.data;

    this.setSrc(this.data.src, false);
    $dom.on(this.$field, "click", async () => {
      const params = getPromptParams(this.data);
      const result = await prompt(params);
      debugger;
      // const fields = await Editor.UI.modal.promptAsync(field.getPromptParams());
      // if (fields != null) {
      //   const file = fields.getValue("file");
      //   const src = fields.getValue("src");
      //   if (file) {
      //     if (field.onUpload) {
      //       field.onUpload(file, url => {
      //         field.setSrc(url);
      //         field.setFile(null);
      //       });
      //     } else {
      //       field.setFile(file);
      //       field.setSrc(null);
      //     }
      //   } else if (src) {
      //     field.setSrc(src);
      //     field.setFile(null);
      //   }
      //   const alt = fields.getValue("alt");
      //   field.setAlt(alt);
      //   const link = HtmlLinkParams.getLinkFromParams(fields);
      //   this.setLink(link);
      // }
      // field.select();
    });
  }

  public setSrc(src: string, fireUpdate: boolean = true) {
    if (src) {
      if (this.isImg) {
        this.$field.setAttribute("src", src);
      } else {
        this.$field.style.backgroundImage = `url(${src}`;
      }
    }
    this.updateProperty("src", src, fireUpdate);
  }

  public setAlt(alt) {
    this.$field.setAttribute(this.isImg ? "alt" : "title", alt);
    this.updateProperty("alt", alt);
  }

  public setFile(file) {
    if (file) {
      if (this.isImg) {
        this.$field.setAttribute("src", file.fileContent);
      } else {
        this.$field.style.backgroundImage = `url(${file.fileContent})`;
      }
    }
    this.updateProperty("file", file);
  }

  public setLink(url: HtmlLinkParams) {
    if (url && url.href) {
      if (!this.$link) {
        this.$link = $dom.el(
          `<a href='${url.href}' title='${url.title}' target='${url.target}'></a>`
        ) as HTMLLinkElement;
        $dom.on(this.$link, "click", ev => {
          ev.stopPropagation();
          return false;
        });

        $dom.wrap(this.$field, this.$link);
        // this.$field.wrap(this.$link);
      } else {
        this.$link.href = url.href;
      }
    } else if (this.$link) {
      $dom.unwrap(this.$field);
      this.$link = null;
      delete this.$link;
    }

    this.updateProperty("link", url);
  }

  public getEl(): HTMLElement {
    const $el = super.getEl();
    const { link } = this.data;
    if (link && link.href) {
      const $link = $dom.el(
        `<a href='${link.href}' title='${link.title}' target='${link.target}'></a>`
      );
      $link.appendChild($el);
      return $link;
    }
    return $el;
  }

  // private getPromptParams(): PromptParameter[] {
  //   const link: HtmlLinkParams = this.data.link
  //     ? this.data.link
  //     : new HtmlLinkParams();
  //   const linkParams = link.getLinkPromptParams();
  //   return params.concat(linkParams);
  // }
}
