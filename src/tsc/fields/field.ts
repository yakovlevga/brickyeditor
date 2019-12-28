import { str } from "src/common/Common";
import { html } from "src/fields/html";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { FireFunc } from "src/emmiter";

export interface ICreateFieldProps {
  $element: HTMLElement;
  preview: boolean;
  data: bre.core.field.FieldData;
}

export type FieldFactory = (
  props: ICreateFieldProps
) => bre.ui.FieldBase | null;

// interface FieldFactoryMap {
//   html: HtmlFieldData;
// }

const Fields: {
  [TKey in string]: FieldFactory;
} = {
  html
};

export const isValidFieldType = <TResult extends bre.core.field.FieldData>(
  data: bre.core.field.FieldData,
  type: TResult["type"]
): data is TResult => {
  const isValid = data.type === type;

  // throw new Error(
  //   `Wrong fields type passed. Expected: ${type}, given: ${data.type}.`
  // );

  return isValid;
};

export const getFieldByName = (
  fields: bre.core.field.FieldData[]
): bre.core.field.FieldData => {
  return fields.find(f =>
    str.equalsInvariant(f.name, name)
  ) as bre.core.field.FieldData;
};

export const createField = ({
  $element,
  preview,
  data: initialData
}: ICreateFieldProps): bre.ui.FieldBase | null => {
  // take base field props from data-bre-field attribute
  let data = helpers.parseElementData($element, "breField");

  if (data === null) {
    // throw new Error(
    //   `There is no data defined in a field: ${$element.innerHTML}`
    // );

    return null;
  }

  const type: keyof typeof Fields = data.type;

  // if data passed from block
  if (initialData !== undefined) {
    data = {
      ...data,
      ...initialData
    };
  }

  const createFieldFunc = Fields[type];

  if (createFieldFunc === undefined) {
    throw new Error(`${type} field not found`);
  }

  return createFieldFunc({
    $element,
    preview,
    data
  });
};

export const updateFieldData = <TData extends bre.core.field.FieldData>(
  field: bre.ui.Field<TData>,
  changes: {
    [TProp in keyof TData]?: TData[TProp];
  },
  fireEvent?: FireFunc
) => {
  const { data } = field;

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
  fireEvent?: FireFunc
) => {
  field.selected = selected;

  const { classList } = field.$element;
  const toggleFunc = selected ? classList.add : classList.remove;
  toggleFunc(Selectors.selectorFieldSelected);

  if (fireEvent !== undefined) {
    fireEvent(selected ? "focus" : "blur", { field });
  }
};

export const getFieldElement = ($field: HTMLElement) => {
  const $el = $field.cloneNode(true) as HTMLElement;
  $el.attributes.removeNamedItem(Selectors.attrField);
  return $el;
};
