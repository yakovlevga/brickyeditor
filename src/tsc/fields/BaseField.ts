import { str } from "src/common/Common";
import { createHtmlField, HtmlFieldData } from "src/fields/HtmlField";
import { createImageField, ImageFieldData } from "src/fields/ImageField";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

export type CreateFieldProps<
  TData extends bre.BaseFieldData = bre.BaseFieldData
> = {
  $element: HTMLElement;
  data?: bre.core.field.Data[];
  onSelect?: (field: bre.core.field.Field<TData>) => void;
  onUpdate?: (field: bre.core.field.Field<TData>) => void;
  onUpload?: bre.FileUploadHandler;
};

export type FieldFactory<
  TData extends bre.BaseFieldData = bre.BaseFieldData
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
    createHtmlField(
      props as CreateFieldProps<HtmlFieldData>,
      data as HtmlFieldData
    ),
  image: (props, data) =>
    createImageField(
      props as CreateFieldProps<ImageFieldData>,
      data as ImageFieldData
    ),
  embed: (props, data) =>
    createHtmlField(
      props as CreateFieldProps<HtmlFieldData>,
      data as HtmlFieldData
    ),
};

export const createField = (
  props: CreateFieldProps<bre.BaseFieldData>
): bre.core.field.Field => {
  // take base field props from data-bre-field attribute
  let fieldData = helpers.parseElementData<bre.BaseFieldData>(
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

export const updateFieldProperty = <TData extends bre.BaseFieldData>(
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

export abstract class BaseField<
  TData extends bre.BaseFieldData = bre.BaseFieldData
> {
  // public data: TData;
  // protected onUpload: (file: any, callback: (url: string) => void) => void;

  // protected settings: (field: BaseField<TData>) => void;
  // private onSelect: (field: BaseField<TData>) => void;
  // private onUpdate: (
  //   property: keyof TData,
  //   oldValue: any,
  //   newValue: any
  // ) => void;

  // constructor(
  //   $field: HTMLElement,
  //   data: any,
  //   onSelect: (field: BaseField<TData>) => void,
  //   onUpdate: (property: keyof TData, oldValue: any, newValue: any) => void,
  //   onUpload?: (file: any, callback: (url: string) => void) => void
  // ) {
  //   this.$field = $field;
  //   this.data = data;
  //   this.onSelect = onSelect;
  //   this.onUpdate = onUpdate;
  //   this.onUpload = onUpload;
  //   this.bind();
  // }

  // public getEl(): HTMLElement {

  // }

  // protected getSettingsEl(): HTMLElement | null {
  //   return null;
  // }

  protected bind() {
    // should be ovverided from child
  }
}
