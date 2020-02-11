import { bre } from "src/types/bre";
import { dialog } from "src/modal";

export const propmtFieldEditorAsync = <
  TFieldData extends bre.core.field.FieldData
>({
  editor,
  data
}: bre.ui.Field<TFieldData>) =>
  new Promise<TFieldData | null>(resolve => {
    if (editor === undefined) {
      resolve(null);
      return;
    }

    const { $element: $editor, data: updatedData } = editor(data);

    dialog({
      content: $editor,
      ok: () => {
        resolve(updatedData);
      },
      cancel: () => {
        resolve(null);
      }
    });
  });
