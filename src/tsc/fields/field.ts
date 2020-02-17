import { bre } from "@/types/bre";
import { Selectors } from "@/ui/Selectors";

export const isValidFieldType = <TResult extends bre.field.FieldData>(
  data: bre.field.FieldData,
  type: string
): data is TResult => data.type === type;

export const updateFieldData = <TData extends bre.field.FieldData>(
  field: bre.field.Field<TData>,
  changes: {
    [TProp in keyof TData]?: TData[TProp];
  },
  fireEvent: boolean = true
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

    if (fireEvent) {
      field.fire("change", { field });
    }
  }
};

export const toggleFieldSelection = (
  field: bre.field.FieldBase,
  selected: boolean,
  fireEvent: boolean = true
) => {
  const { classList } = field.$element;
  if (selected) {
    field.selected = selected;
    classList.add(Selectors.selectorFieldSelected);
  } else {
    classList.remove(Selectors.selectorFieldSelected);
  }

  if (fireEvent !== undefined && selected) {
    field.fire("select", { field });
  }
};

export const getCleanFieldElement = ($field: HTMLElement) => {
  const $el = $field.cloneNode(true) as HTMLElement;
  $el.attributes.removeNamedItem(Selectors.attrField);
  return $el;
};
