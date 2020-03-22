import { html } from "@/fields/html";
import { embed } from "@/fields/embed";
import { container } from "@/fields/container";
import { image } from "@/fields/image";
import { bre } from "@/types/bre";
import { helpers, strEqualsInvariant } from "@/helpers";
import { FIELD_SELECTOR, FIELD_DATA_ATTR } from "@/constants";

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
  block: bre.block.Block | null;
  preview: boolean;
  data: bre.field.FieldData;
}

export type FieldFactory = (
  props: ICreateFieldProps
) => bre.field.FieldBase | Pick<bre.field.FieldBase, "$element"> | null;

export const createField: FieldFactory = ({
  block,
  $element,
  preview,
  data: initialData
}) => {
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
    data,
    block
  });
};

export const bindBlockFields = (
  $element: HTMLElement,
  block: bre.block.Block
) => {
  const $fieldElement = findFieldElements($element);
  const fields = $fieldElement.map($fieldElement =>
    bindBlockField($fieldElement, block)
  );
  return helpers.filterNotNull(fields);
};

export const bindTemplateFields = ($element: HTMLElement) => {
  const $fieldElement = findFieldElements($element);
  const fields = $fieldElement.map($fieldElement =>
    bindTemplateField($fieldElement)
  );
  return helpers.filterNotNull(fields);
};

function bindBlockField($element: HTMLElement, block: bre.block.Block) {
  let data = helpers.parseElementData($element, "breField");
  if (data === null) {
    return null;
  }

  data = getFieldDataByName(block, data.name) || data;

  return createField({
    block,
    $element,
    preview: false,
    data
  }) as bre.field.FieldBase;
}

function bindTemplateField($element: HTMLElement) {
  let data = helpers.parseElementData($element, "breField");

  if (data === null) {
    return null;
  }

  return createField({
    block: null,
    $element,
    preview: true,
    data
  }) as Pick<bre.field.FieldBase, "$element">;
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
  const nodes = $html.querySelectorAll<HTMLElement>(FIELD_SELECTOR);
  let $fields: HTMLElement[] =
    nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];

  if ($html.attributes.getNamedItem(FIELD_DATA_ATTR) !== null) {
    $fields = [...$fields, $html];
  }

  return $fields;
}
