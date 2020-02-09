import { bre } from "src/types/bre";
import { helpers } from "src/helpers";

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

    helpers.showModal({
      content: [$editor],
      onOk: () => {
        resolve(updatedData);
      },
      onCancel: () => {
        resolve(null);
      }
    });
  });
