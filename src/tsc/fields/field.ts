import { html } from "src/fields/html";
import { embed } from "src/fields/embed";
import { container } from "src/fields/container";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { FireFunc, FieldEventMap } from "src/emmiter";
import { image } from "src/fields/image";
import { selectField } from "src/block/Block";

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
  html,
  image,
  embed,
  container
};

export const isValidFieldType = <TResult extends bre.core.field.FieldData>(
  data: bre.core.field.FieldData,
  type: TResult["type"]
): data is TResult => data.type === type;

export const createField = ({
  $element,
  preview,
  data: initialData
}: ICreateFieldProps): bre.ui.FieldBase | null => {
  // take base field props from data-bre-field attribute
  let data = helpers.parseElementData($element, "breField");

  if (data === null) {
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

function bindField($element: HTMLElement, block?: bre.core.block.Block) {
  let data = helpers.parseElementData($element, "breField");

  if (data === null) {
    return null;
  }

  if (block === undefined) {
    return createField({
      $element,
      preview: true,
      data
    });
  }

  data = getFieldDataByName(block, data.name) || data;

  const field = createField({
    $element,
    preview: false,
    data
  });

  if (field !== null && field.on !== undefined) {
    field.on("focus", ev => {
      if (ev !== undefined) {
        selectField(block, ev.field);
      }
    });
  }

  return field;
}

export const bindFields = (
  $element: HTMLElement,
  block?: bre.core.block.Block
) => {
  const $fieldElement = findFieldElements($element);
  const fields = $fieldElement.map($fieldElement =>
    bindField($fieldElement, block)
  );

  return helpers.filterNotNull(fields);
};

function getFieldDataByName(
  block: bre.core.block.Block,
  name: string
): bre.core.field.FieldData | null {
  if (!block.data || !block.data.fields) {
    return null;
  }

  const field = block.data.fields.find(f => strEqualsInvariant(f.name, name));

  if (field === undefined) {
    return null;
  }

  return field as bre.core.field.FieldData;
}

function findFieldElements($html: HTMLElement) {
  const nodes = $html.querySelectorAll<HTMLElement>(Selectors.selectorField);
  let $fields: HTMLElement[] =
    nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];

  if ($html.attributes.getNamedItem(Selectors.attrField) !== null) {
    $fields = [...$fields, $html];
  }

  return $fields;
}
