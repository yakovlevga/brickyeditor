import {
  createContainer,
  getContainerData,
  getContainerHtml,
  addBlockToContainer
} from "@/blocksContainer";
import { isValidFieldType } from "@/fields/field";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { emitter } from "@/emitter";
import { FieldFactory } from "@/fields/fields";

type ContainerFieldType = "container";
type ContainerFieldPayload = {
  html: string;
  blocks: bre.block.BlockData[];
};
type ContainerFieldData = bre.field.FieldData<
  ContainerFieldType,
  ContainerFieldPayload
>;
export type ContainerField = bre.field.Field<ContainerFieldData> & {
  container: bre.BlocksContainer;
};

export const container: FieldFactory = ({ $element, preview, data }) => {
  if (!isValidFieldType<ContainerFieldData>(data, "container")) {
    return null;
  }

  if (preview) {
    return { $element };
  }

  const container = createContainer($element, !preview);

  // TODO Should data.blocks be nullable?
  if (data.blocks && data.blocks.length > 0) {
    data.blocks.map(blockData =>
      addBlockToContainer(
        container,
        {
          blockData
        },
        false
      )
    );
  }

  const eventEmitter = emitter<bre.field.FieldEventMap>();
  const field: ContainerField = {
    ...eventEmitter,
    $element,
    data,
    html,
    container
  };

  // $element.addEventListener("click", () => {
  //   // ev.stopPropagation();
  //   toggleFieldSelection(field, true);
  //   // return false;
  // });

  // const updateBlocks = () => {
  //   const blocks = getContainerData(container);
  //   const html = getContainerHtml(container);

  //   const updatedData = {
  //     ...field.data,
  //     blocks,
  //     html
  //   };

  //   // TODO: call update callback
  // };

  return field;
};

const html = (field: bre.field.Field<ContainerFieldData>) => {
  const { container } = field as ContainerField;
  const html = getContainerHtml(container);
  // TODO: get blocks html via html method
  return helpers.createElement(html);
};
