import { Block } from "src/block/Block";
import {
  BlocksContainer,
  getContainerData,
  getContainerHtml,
} from "src/BlocksContainer";
import { BaseField, FieldFactory } from "src/fields/field";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

export type ContainerFieldData = bre.BaseFieldData & {
  type: "container";
  blocks: bre.IBlockData[];
  html: string;
};

type ContainerFieldFactory = FieldFactory<ContainerFieldData>;

export const createContainerField: ContainerFieldFactory = (props, data) => {
  const { $element } = props;

  const updateBlocks = () => {
    const blocks = getContainerData(container, true);
    const html = getContainerHtml(container);
    field.data = {
      ...field.data,
      blocks,
      html,
    };

    // TODO: call update callback
  };

  const container: BlocksContainer = new BlocksContainer(
    $element,
    updateBlocks,
    updateBlocks,
    (block: Block) => {
      // this.select();
    },
    (block: Block) => {
      //
    },
    updateBlocks,
    updateBlocks,
    props.onUpload,
    true
  );

  const field: bre.core.field.ContainerField = {
    type: "container",
    name: data.name,
    $field: $element,
    data,
    container,
    getElement: () => {
      const html = getContainerHtml(container);
      return helpers.createElement(html);
    },
  };

  $element.classList.add(Selectors.selectorFieldContainer);

  $element.addEventListener("click", ev => {
    // TODO:
    // field.select();
    ev.stopPropagation();
    return false;
  });

  return field;
};

// export class ContainerField extends BaseField {
// public container: BlocksContainer;
// private $placeholder: HTMLElement;
// public bind() {
//   const field = this;
//   const $field = this.$field;
//   this.container = new BlocksContainer(
//     $field,
//     (block: Block) => {
//       field.updateBlocks();
//     },
//     (block: Block) => {
//       field.updateBlocks();
//     },
//     (block: Block) => {
//       this.select();
//     },
//     (block: Block) => {
//       //
//     },
//     (block: Block) => {
//       field.updateBlocks();
//     },
//     (block: Block) => {
//       field.updateBlocks();
//     },
//     field.onUpload,
//     true
//   );
//   $dom.addClass($field, Selectors.selectorFieldContainer);
//   $field.addEventListener("click", ev => {
//     field.select();
//     ev.stopPropagation();
//     return false;
//   });
// }
// public updateBlocks() {
//   const { container } = this;
//   const data = getContainerData(container, true);
//   this.updateProperty("blocks", data, true);
//   const html = getContainerHtml(container);
//   this.updateProperty("html", html, true);
// }
// public deselect() {
//   this.container.blocks.forEach(b => b.deselect());
//   this.$field.classList.remove(Selectors.selectorFieldSelected);
// }
// }
