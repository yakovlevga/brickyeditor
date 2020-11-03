import { bre } from '@/types/bre';
import { helpers } from '@/helpers';

export const toggleFieldSelection = (
  field: bre.field.FieldBase,
  selected: boolean
) => {
  helpers.toggleClassName(field.$element, 'bre-field-selected', selected);
  if (selected) {
    field.parentBlock.parentContainer.editor.fire('fieldSelect', {
      sender: field,
    });
  } else {
    field.parentBlock.parentContainer.editor.fire('fieldBlur', {
      sender: field,
    });
  }
};
