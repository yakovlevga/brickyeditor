import { bre } from "@/types/bre";
import { Selectors } from "@/ui/Selectors";
import { FireFunc, FieldEventMap } from "@/emmiter";

export const isValidFieldType = <TResult extends bre.core.field.FieldData>(
  data: bre.core.field.FieldData,
  type: string
): data is TResult => data.type === type;

export const updateFieldData = <TData extends bre.core.field.FieldData>(
  field: bre.ui.Field<TData>,
  changes: {
    [TProp in keyof TData]?: TData[TProp];
  },
  fireEvent?: FireFunc<FieldEventMap>
) => {
  const { data } = field;

  // TODO: deep compare?
  const props = Object.keys(changes) as Array<keyof TData>;
  const hasChanges = props.some(p => data[p] !== changes[p]);

  if (hasChanges) {
    field.data = {
      ...data,
      changes
    };

    if (fireEvent !== undefined) {
      fireEvent("change", { field });
    }
  }
};

export const toggleFieldSelection = (
  field: bre.ui.FieldBase,
  selected: boolean,
  fireEvent?: FireFunc<FieldEventMap>
) => {
  const { classList } = field.$element;
  if (selected) {
    field.selected = selected;
    classList.add(Selectors.selectorFieldSelected);
  } else {
    classList.remove(Selectors.selectorFieldSelected);
  }

  if (fireEvent !== undefined) {
    fireEvent(selected ? "focus" : "blur", { field });
  }
};

export const getCleanFieldElement = ($field: HTMLElement) => {
  const $el = $field.cloneNode(true) as HTMLElement;
  $el.attributes.removeNamedItem(Selectors.attrField);
  return $el;
};
