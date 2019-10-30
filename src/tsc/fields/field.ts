import { str } from "src/common/Common";
import { ContainerFieldData, createContainerField } from "src/fields/container";
import { createEmbedField, EmbedFieldData } from "src/fields/embed";
import { createHtmlField, HtmlFieldData } from "src/fields/html";
import { createImageField, ImageFieldData } from "src/fields/image";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

export type CreateFieldProps<
  TData extends bre.core.field.FieldData = bre.core.field.FieldData
> = {
  $element: HTMLElement;
  data?: bre.core.field.Data[];
  onSelect?: (field: bre.core.field.Field<TData>) => void;
  onUpdate?: (field: bre.core.field.Field<TData>) => void;
  onUpload?: bre.FileUploadHandler;
};

export type FieldFactory<
  TData extends bre.core.field.FieldData = bre.core.field.FieldData
> = (
  props: CreateFieldProps<TData>,
  data: TData
) => bre.core.field.Field<TData>;

const _fields: {
  [TKey in bre.core.field.FieldType]: FieldFactory;
} = {
  html: (props, data) =>
    createHtmlField(
      props as CreateFieldProps<HtmlFieldData>,
      data as HtmlFieldData
    ),
  container: (props, data) =>
    createContainerField(
      props as CreateFieldProps<ContainerFieldData>,
      data as ContainerFieldData
    ),
  image: (props, data) =>
    createImageField(
      props as CreateFieldProps<ImageFieldData>,
      data as ImageFieldData
    ),
  embed: (props, data) =>
    createEmbedField(
      props as CreateFieldProps<EmbedFieldData>,
      data as EmbedFieldData
    ),
};

export const createField = (
  props: CreateFieldProps<bre.core.field.FieldData>
): bre.core.field.Field => {
  // take base field props from data-bre-field attribute
  let fieldData = helpers.parseElementData<bre.core.field.FieldData>(
    props.$element,
    "breField"
  );

  if (
    fieldData === null ||
    fieldData.name === undefined ||
    fieldData.type === undefined
  ) {
    throw new Error(
      `There is no data defined in a field: ${props.$element.innerHTML}`
    );
  }

  const { name, type } = fieldData;

  // if data passed from block
  if (props.data !== undefined) {
    const addFieldData = props.data.find(f =>
      str.equalsInvariant(f.name, name)
    );
    if (addFieldData) {
      fieldData = {
        ...fieldData,
        ...addFieldData,
      };
    }
  }

  if (_fields[type] !== undefined) {
    const createFieldFunc = _fields[type];
    return createFieldFunc(props, fieldData);
  } else {
    throw new Error(`${type} field not found`);
  }
};

export const updateFieldProperty = <TData extends bre.core.field.FieldData>(
  field: bre.core.field.Field<TData>,
  prop: keyof TData,
  value: any,
  fireUpdate: boolean = true
) => {
  const oldValue = field.data[prop];
  if (oldValue === value) {
    return;
  }

  field.data = {
    ...field.data,
    [prop]: value,
  };

  if (fireUpdate && field.onUpdate) {
    field.onUpdate(field);
  }
};

export const toggleFieldSelection = (
  field: bre.core.field.Field,
  selected: boolean
) => {
  if (selected === true) {
    field.$field.classList.add(Selectors.selectorFieldSelected);
    if (field.onSelect !== undefined) {
      field.onSelect(field);
    }
  } else {
    field.$field.classList.remove(Selectors.selectorFieldSelected);
    if (field.onDeselect !== undefined) {
      field.onDeselect(field);
    }
  }
};

export const getFieldElement = ($field: HTMLElement) => {
  const $el = $field.cloneNode(true) as HTMLElement;
  $el.attributes.removeNamedItem(Selectors.attrField);
  return $el;
};
