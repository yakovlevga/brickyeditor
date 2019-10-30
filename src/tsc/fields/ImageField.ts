import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/BaseField";
import { locales } from "src/locales";
import { LinkPromptParams, promptAsync } from "src/prompt";
import { bre } from "src/types/bre";
import { helpers } from "src/helpers";

type ImageFieldData = {
  name: "image";
  src: string;
  alt: string;
  file: File;
  link: Pick<HTMLLinkElement, "href" | "title" | "target">;
};

type ImagePromptParams = {
  src: bre.prompt.PromptParameter;
  alt: bre.prompt.PromptParameter;
  file: bre.prompt.PromptParameter;
};

const getPromptParams: (props: ImageFieldData) => ImagePromptParams = ({
  src,
  file,
  alt,
}) => ({
  src: {
    value: src,
    title: locales.prompt.image.link.title,
    placeholder: locales.prompt.image.link.placeholder,
  },
  file: {
    type: "file",
    value: file,
    title: locales.prompt.image.upload.title,
    placeholder: locales.prompt.image.upload.placeholder,
  },
  alt: {
    value: alt,
    title: locales.prompt.image.alt.title,
    placeholder: locales.prompt.image.alt.placeholder,
  },
  // TODO: link params
});

export class ImageField extends BaseField<ImageFieldData> {
  private get isImg(): boolean {
    return (this._isImg =
      this._isImg || this.$field.tagName.toLowerCase() === "img");
  }

  public _isImg?: boolean;
  private $link?: HTMLLinkElement;

  public bind() {
    const field = this;

    this.setSrc(this.data.src, false);
    this.$field.addEventListener("click", async () => {
      const params = getPromptParams(this.data);
      const updated = await promptAsync<ImagePromptParams>(params);

      if (updated !== null) {
        const { file, src, alt } = updated;

        if (file !== undefined) {
          // todo: add some common handler for image uploading?
          if (field.onUpload) {
            field.onUpload(file, url => {
              field.setSrc(url);
              field.setFile(null);
            });
          } else {
            field.setFile(file);
            field.setSrc(null);
          }
        } else if (src) {
          field.setSrc(src);
          field.setFile(null);
        }

        field.setAlt(alt);

        // const link = HtmlLinkParams.getLinkFromParams(fields);
        // this.setLink(link);
      }

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

  public setSrc(src: string | null, fireUpdate: boolean = true) {
    if (src) {
      if (this.isImg) {
        this.$field.setAttribute("src", src);
      } else {
        this.$field.style.backgroundImage = `url(${src}`;
      }
    }
    this.updateProperty("src", src, fireUpdate);
  }

  public setAlt(alt?: string) {
    this.$field.setAttribute(this.isImg ? "alt" : "title", alt || "");
    this.updateProperty("alt", alt);
  }

  public setFile(file: string | null) {
    if (file !== null) {
      if (this.isImg) {
        this.$field.setAttribute("src", file);
      } else {
        this.$field.style.backgroundImage = `url(${file})`;
      }
    }

    this.updateProperty("file", file);
  }

  public setLink(url: LinkPromptParams) {
    if (url && url.href) {
      if (!this.$link) {
        this.$link = helpers.createElement(
          `<a href='${url.href}' title='${url.title}' target='${url.target}'></a>`
        ) as HTMLLinkElement;
        this.$link.addEventListener("click", ev => {
          ev.stopPropagation();
          return false;
        });

        const { parentElement } = this.$field;
        if (parentElement !== null) {
          parentElement.insertBefore(this.$link, this.$field);
          this.$link.appendChild(this.$link);
        }
        // this.$field.wrap(this.$link);
      } else {
        this.$link.href = url.href.value;
      }
    } else if (this.$link) {
      $dom.unwrap(this.$field);
      this.$link = undefined;
      delete this.$link;
    }

    this.updateProperty("link", url);
  }

  public getEl(): HTMLElement {
    const $el = super.getEl();
    const { link } = this.data;
    if (link && link.href) {
      const $link = helpers.createElement(
        `<a href='${link.href}' title='${link.title}' target='${link.target}'></a>`
      );
      $link.appendChild($el);
      return $link;
    }
    return $el;
  }
}
