import { bre } from '@/types/bre';
import { modal } from '@/modal';

export const propmtFieldEditorAsync = <TFieldData extends bre.field.FieldData>(
  field: bre.field.Field<TFieldData>,
  editor: (field: bre.field.FieldBase) => any
) =>
  new Promise<TFieldData | null>(resolve => {
    const { $element: $editor, data: updatedData } = editor(field);

    modal(
      $editor,
      () => {
        resolve(updatedData);
      },
      () => {
        resolve(null);
      }
    );
  });
