import { html } from "@/fields/html";
import { embed } from "@/fields/embed";
import { container } from "@/fields/container";
import { image } from "@/fields/image";
import { bre } from "@/types/bre";
import { helpers, strEqualsInvariant } from "@/helpers";
import { Selectors } from "@/ui/Selectors";

let fields: {
  [TKey in string]: FieldFactory;
} = {
  html,
  image,
  embed,
  container
};

const getFieldFunc = (type: string) => fields[type];

export const registerField = () => {
  // TODO:
};

export interface ICreateFieldProps {
  $element: HTMLElement;
  preview: boolean;
  data: bre.field.FieldData;
}

export type FieldFactory = (
  props: ICreateFieldProps
) => bre.field.FieldBase | null;

export const createField = ({
  $element,
  preview,
  data: initialData
}: ICreateFieldProps): bre.field.FieldBase | null => {
  // take base field props from data-bre-field attribute
  let data = helpers.parseElementData($element, "breField");

  if (data === null) {
    return null;
  }

  // if data passed from block
  if (initialData !== undefined) {
    data = {
      ...data,
      ...initialData
    };
  }

  const field = getFieldFunc(data.type);
  if (field === undefined) {
    throw new Error(`${data.type} field not found`);
  }

  return field({
    $element,
    preview,
    data
  });
};

export const bindFields = ($element: HTMLElement, block?: bre.block.Block) => {
  const $fieldElement = findFieldElements($element);
  const fields = $fieldElement.map($fieldElement =>
    bindField($fieldElement, block)
  );

  return helpers.filterNotNull(fields);
};

function bindField($element: HTMLElement, block?: bre.block.Block) {
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

  return field;
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

function findFieldElements($html: HTMLElement) {
  const nodes = $html.querySelectorAll<HTMLElement>(Selectors.selectorField);
  let $fields: HTMLElement[] =
    nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];

  if ($html.attributes.getNamedItem(Selectors.attrField) !== null) {
    $fields = [...$fields, $html];
  }

  return $fields;
}
