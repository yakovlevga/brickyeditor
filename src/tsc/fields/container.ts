import {
  getContainerHtml,
  addBlockToContainer,
  createFieldContainer,
  getContainerPlaceholder
} from "@/blocksContainer";
import { isValidFieldType } from "@/fields/field";
import { helpers } from "@/helpers";
import { bre } from "@/types/bre";
import { FieldFactory } from "@/fields/fields";
import { selectField } from "@/editorState";

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

export const container: FieldFactory = props => {
  const { $element, data } = props;

  if (!isValidFieldType<ContainerFieldData>(data, "container")) {
    return null;
  }

  if (props.preview) {
    $element.append(getContainerPlaceholder());
    return {
      $element
    };
  }

  $element.addEventListener("click", ev => {
    ev.stopPropagation();
    selectField(field);
  });

  const field = {
    $element,
    data,
    html,
    parentBlock: props.parentBlock
  } as ContainerField;

  const fieldContainer = createFieldContainer(field);
  field.container = fieldContainer;

  // TODO Should data.blocks be nullable?
  if (data.blocks && data.blocks.length > 0) {
    data.blocks.map(blockData =>
      addBlockToContainer(
        fieldContainer,
        {
          blockData
        },
        false
      )
    );
  }

  return field;
};

export const isContainerField = (
  field: bre.field.FieldBase
): field is ContainerField => {
  return field.data.type === "container";
};

const html = (field: bre.field.Field<ContainerFieldData>) => {
  const { container } = field as ContainerField;
  const html = getContainerHtml(container);
  // TODO: get blocks html via html method
  return helpers.createElement(html);
};
