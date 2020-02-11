import {
  createContainer,
  getContainerData,
  getContainerHtml
} from "src/BlocksContainer";
import { toggleFieldSelection, isValidFieldType } from "src/fields/field";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { emmiter, FieldEventMap } from "src/emmiter";
import { FieldFactory } from "src/fields/fields";

type ContainerFieldType = "container";
type ContainerFieldPayload = {
  html: string;
  blocks: bre.core.block.BlockData[];
};
type ContainerFieldData = bre.core.field.FieldData<
  ContainerFieldType,
  ContainerFieldPayload
>;
export type ContainerField = bre.ui.Field<ContainerFieldData> & {
  container: bre.core.IBlocksContainer;
};

export const container: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<ContainerFieldData>(data, "container")) {
    return null;
  }

  if (preview) {
    return { $element };
  }

  const container = createContainer($element, !preview);

  const { fire: fireEvent, on, off } = emmiter<FieldEventMap>();
  const field: ContainerField = {
    $element,
    data,
    on,
    off,
    html,
    bind,
    container
  };

  $element.classList.add(Selectors.selectorFieldContainer);

  $element.addEventListener("click", ev => {
    // TODO:
    // field.select();
    toggleFieldSelection(field, true, fireEvent);
    ev.stopPropagation();
    return false;
  });

  const updateBlocks = () => {
    const blocks = getContainerData(container);
    const html = getContainerHtml(container);

    const updatedData = {
      ...field.data,
      blocks,
      html
    };

    // TODO: call update callback
  };

  return field;
};

const html = (field: bre.ui.Field<ContainerFieldData>) => {
  const { container } = field as ContainerField;
  const html = getContainerHtml(container);
  // TODO: get blocks html via html method
  return helpers.createElement(html);
};

const bind = () => {};

// const container: BlocksContainer = new BlocksContainer(
//   $element,
//   updateBlocks,
//   updateBlocks,
//   (block: Block) => {
//     // this.select();
//   },
//   (block: Block) => {
//     //
//   },
//   updateBlocks,
//   updateBlocks,
//   props.onUpload,
//   true
// );

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
