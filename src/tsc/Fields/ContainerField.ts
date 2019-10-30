import { Block } from "src/block/Block";
import {
  BlocksContainer,
  getContainerData,
  getContainerHtml,
} from "src/BlocksContainer";
import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/fields/BaseField";
import { helpers } from "src/helpers";
import { Selectors } from "src/ui/Selectors";

export class ContainerField extends BaseField {
  public container: BlocksContainer;
  private $placeholder: HTMLElement;

  public bind() {
    const field = this;
    const $field = this.$field;

    this.container = new BlocksContainer(
      $field,
      (block: Block) => {
        field.updateBlocks();
      },
      (block: Block) => {
        field.updateBlocks();
      },
      (block: Block) => {
        this.select();
      },
      (block: Block) => {
        //
      },
      (block: Block) => {
        field.updateBlocks();
      },
      (block: Block) => {
        field.updateBlocks();
      },
      field.onUpload,
      true
    );

    $dom.addClass($field, Selectors.selectorFieldContainer);
    $field.addEventListener("click", ev => {
      field.select();
      ev.stopPropagation();
      return false;
    });
  }

  public updateBlocks() {
    const { container } = this;
    const data = getContainerData(container, true);
    this.updateProperty("blocks", data, true);

    const html = getContainerHtml(container);
    this.updateProperty("html", html, true);
  }

  public deselect() {
    this.container.blocks.forEach(b => b.deselect());
    this.$field.classList.remove(Selectors.selectorFieldSelected);
  }

  public getEl(): HTMLElement {
    const { container } = this;
    const html = getContainerHtml(container);
    return helpers.createElement(html);
  }
}
