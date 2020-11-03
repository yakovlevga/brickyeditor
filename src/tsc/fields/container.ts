import {
  addBlockToContainer,
  createFieldContainer,
  getContainerPlaceholder,
} from '@/blocksContainer/blocksContainer';
import { helpers } from '@/helpers';
import { bre } from '@/types/bre';
import { selectField } from '@/state/editorState';
import { getContainerHtml } from '@/blocksContainer/getContainerHtml';

export const container: bre.field.FieldDescriptor<bre.field.container.ContainerFieldData> = {
  makeField: ($element, initialData, parentBlock) => {
    $element.addEventListener('click', ev => {
      ev.stopPropagation();
      selectField(field);
    });

    const field = {
      $element,
      data: initialData,
      parentBlock,
    } as bre.field.container.ContainerField;

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

function getHtml(
  field: bre.field.Field<bre.field.container.ContainerFieldData>
) {
  const { container } = field as bre.field.container.ContainerField;
  const html = getContainerHtml(container);
  // TODO: get blocks html via html method
  return helpers.createElement(html);
}
