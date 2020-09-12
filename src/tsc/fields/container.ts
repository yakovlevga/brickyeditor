import {
  getContainerHtml,
  addBlockToContainer,
  createFieldContainer,
  getContainerPlaceholder,
} from '@/blocksContainer';
import { helpers } from '@/helpers';
import { bre } from '@/types/bre';
import { selectField } from '@/editorState';

type ContainerFieldType = 'container';
type ContainerFieldPayload = {
  html: string;
  blocks: bre.block.BlockData[];
};
export type ContainerFieldData = bre.field.FieldData<
  ContainerFieldType,
  ContainerFieldPayload
>;
export type ContainerField = bre.field.Field<ContainerFieldData> & {
  container: bre.BlocksContainer;
};

export const container: bre.field.FieldDescriptor<ContainerFieldData> = {
  makeField: ($element, initialData, parentBlock) => {
    $element.addEventListener('click', ev => {
      ev.stopPropagation();
      selectField(field);
    });

    const field = {
      $element,
      data: initialData,
      parentBlock,
    } as ContainerField;

    const fieldContainer = createFieldContainer(field);
    field.container = fieldContainer;

    // TODO Should data.blocks be nullable?
    if (initialData.blocks && initialData.blocks.length > 0) {
      initialData.blocks.map(blockData =>
        addBlockToContainer(
          fieldContainer,
          {
            blockData,
          },
          false
        )
      );
    }

    return field;
  },
  setupPreview: $element => {
    $element.append(getContainerPlaceholder(true));
    return $element;
  },
  getHtml,
};

export const isContainerField = (
  field: bre.field.FieldBase
): field is ContainerField => {
  return field.data.type === 'container';
};

function getHtml(field: bre.field.Field<ContainerFieldData>) {
  const { container } = field as ContainerField;
  const html = getContainerHtml(container);
  // TODO: get blocks html via html method
  return helpers.createElement(html);
}
