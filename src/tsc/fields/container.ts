import {
  createContainer,
  getContainerData,
  getContainerHtml
} from "src/BlocksContainer";
import {
  FieldFactory,
  toggleFieldSelection,
  isValidFieldType
} from "src/fields/field";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { emmiter } from "src/emmiter";

export type ContainerFieldData = bre.core.field.FieldData & {};

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

  const container = createContainer($element, !preview);

  const field: ContainerField = {
    $element,
    data,
    container
  };

  $element.classList.add(Selectors.selectorFieldContainer);

  if (!preview) {
    const fireEvent = emmiter(field);

    field.cleanup = () => {
      const html = getContainerHtml(container);
      return helpers.createElement(html);
    };

    $element.addEventListener("click", ev => {
      // TODO:
      // field.select();
      toggleFieldSelection(field, true, fireEvent);
      ev.stopPropagation();
      return false;
    });

    const updateBlocks = () => {
      const blocks = getContainerData(container, true);
      const html = getContainerHtml(container);

      const updatedData = {
        ...field.data,
        blocks,
        html
      };

      // TODO: call update callback
    };
  }

  return field;
};

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
