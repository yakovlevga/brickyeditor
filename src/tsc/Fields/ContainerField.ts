import { Block } from "src/block/Block";
import { BlocksContainer, blocksContainer } from "src/BlocksContainer";
import { $dom } from "src/common/DOMHelpers";
import { BaseField } from "src/Fields/BaseField";
import { Selectors } from "src/ui/Selectors";
import { helpers } from "src/helpers";

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
    $dom.on($field, "click", ev => {
      field.select();
      ev.stopPropagation();
      return false;
    });
  }

  public updateBlocks() {
    const { container } = this;
    const data = blocksContainer.getData(container, true);
    const html = blocksContainer.getHtml(container);
    this.updateProperty("blocks", data, true);
    this.updateProperty("html", html, true);
  }

  public deselect() {
    this.container.blocks.forEach(b => b.deselect());
    this.$field.classList.remove(Selectors.selectorFieldSelected);
  }

  public getEl(): HTMLElement {
    const html = blocksContainer.getHtml(this.container);
    return helpers.createElement(html);
  }
}
