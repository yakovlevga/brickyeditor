import { bre } from '@/types/bre';
import { findFieldElements } from '@/block/Block';
import { helpers, strEqualsInvariant } from '@/helpers';
import { getFieldFactory } from '@/fields/fields';

export const setupBlockFields = (block: bre.block.Block) => {
  const $fields = findFieldElements(block.$element);
  const fields = $fields.map($f => {
    const field = bindBlockField($f, block);
    if (field !== null) {
      field.parentBlock.parentContainer.editor.fire('fieldCreate', {
        sender: field,
      });
    }
    return field;
  });

  return helpers.filterNotNull(fields);
};

function bindBlockField($element: HTMLElement, parentBlock: bre.block.Block) {
  const initialData = helpers.parseElementData($element, 'breField');
  if (initialData === null) {
    return null;
  }
  const blockData = getFieldDataByName(parentBlock, initialData.name);
  const data = blockData !== null ? blockData : initialData;
  const fieldFactory = getFieldFactory(data.type);
  return fieldFactory.makeField($element, initialData, parentBlock);
}

function getFieldDataByName(
  block: bre.block.Block,
  name: string
): bre.field.FieldData | null {
  if (!block.data || !block.data.fields) {
    return null;
  }

  const field = block.data.fields.find(f => strEqualsInvariant(f.name, name));

  if (field === undefined) {
    return null;
  }

  return field as bre.field.FieldData;
}
