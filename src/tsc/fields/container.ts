import {
  createContainer,
  getContainerData,
  getContainerHtml
} from "@/BlocksContainer";
import { toggleFieldSelection, isValidFieldType } from "@/fields/field";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { Selectors } from "@/ui/Selectors";
import { emmiter } from "@/emmiter";
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

  const { fire: fireEvent, on, off } = emmiter<bre.field.FieldEventMap>();
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

const html = (field: bre.field.Field<ContainerFieldData>) => {
  const { container } = field as ContainerField;
  const html = getContainerHtml(container);
  // TODO: get blocks html via html method
  return helpers.createElement(html);
};

const bind = () => {};
