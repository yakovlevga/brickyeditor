import { str } from "src/common/Common";
import {
  ContainerField,
  EmbedField,
  HtmlField,
  ImageField,
} from "src/fields/Fields";
import { helpers } from "src/helpers";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

const _fields: any | null = null;

export const createField = <TData extends bre.Data = bre.Data>(
  $element: HTMLElement,
  data?: bre.core.field.Data[],
  onSelect?: (field: BaseField<TData>) => void,
  onUpdate?: (property: keyof TData, oldValue: any, newValue: any) => void,
  onUpload?: bre.FileUploadHandler
): BaseField<TData> => {
  // take base field props from data-bre-field attribute
  let fieldData = helpers.parseElementData<bre.core.field.Data>(
    $element,
    "breField"
  );

  if (
    fieldData === null ||
    fieldData.name === undefined ||
    fieldData.type === undefined
  ) {
    throw new Error(
      `There is no data defined in a field: ${$element.innerHTML}`
    );
  }

  const { name, type } = fieldData;

  // if data passed from block
  if (data !== undefined) {
    const addFieldData = data.find(f => str.equalsInvariant(f.name, name));
    if (addFieldData) {
      fieldData = {
        ...fieldData,
        ...addFieldData,
      };
    }
  }

  // find field constructor in registered fields
  if (_fields === null) {
    BaseField.registerCommonFields();
  }

  if (_fields.hasOwnProperty(type)) {
    const field = _fields[type];
    return new field($element, fieldData, onSelect, onUpdate, onUpload);
  } else {
    throw new Error(`${type} field not found`);
  }
};

export abstract class BaseField<TData extends bre.Data = bre.Data> {
  public static get type(): string {
    let name = (this as any).name;
    name = name.replace("Field", "");
    name = name.substring(0, 1).toLowerCase() + name.substring(1);
    return name;
  }

  /**
   * Register Field Type
   */
  public static commonFieldsRegistered: boolean = false;

  /**
   * Register Field Type
   */
  public static registerCommonFields() {
    if (!this.commonFieldsRegistered) {
      HtmlField.registerField();
      ImageField.registerField();
      EmbedField.registerField();
      ContainerField.registerField();
    }
    this.commonFieldsRegistered = true;
  }

  private static registerField() {
    // check if already registered to avoid dublicates
    if (_fields.hasOwnProperty(this.type)) {
      delete _fields[this.type];
    }

    // add field class to registered fields
    _fields[this.type] = this;
  }

  public $field: HTMLElement;
  public name: string;
  public data: TData;
  protected onUpload: (file: any, callback: (url: string) => void) => void;

  protected settings: (field: BaseField<TData>) => void;
  private onSelect: (field: BaseField<TData>) => void;
  private onUpdate: (
    property: keyof TData,
    oldValue: any,
    newValue: any
  ) => void;

  constructor(
    $field: HTMLElement,
    data: any,
    onSelect: (field: BaseField<TData>) => void,
    onUpdate: (property: keyof TData, oldValue: any, newValue: any) => void,
    onUpload?: (file: any, callback: (url: string) => void) => void
  ) {
    this.$field = $field;
    this.data = data;
    this.onSelect = onSelect;
    this.onUpdate = onUpdate;
    this.onUpload = onUpload;
    this.bind();
  }

  public deselect() {
    this.$field.classList.remove(Selectors.selectorFieldSelected);
  }

  public getEl(): HTMLElement {
    const $el = this.$field.cloneNode(true) as HTMLElement;
    $el.attributes.removeNamedItem(Selectors.attrField);
    return $el;
  }

  protected getSettingsEl(): HTMLElement | null {
    return null;
  }

  protected bind() {
    // should be ovverided from child
  }

  protected select() {
    this.$field.classList.add(Selectors.selectorFieldSelected);
    this.onSelect(this);
  }

  protected updateProperty(
    prop: keyof TData,
    value: any,
    fireUpdate: boolean = true
  ) {
    const oldValue = this.data[prop];
    if (oldValue === value) {
      return;
    }

    this.data[prop] = value;

    if (fireUpdate) {
      this.onUpdate(prop, oldValue, value);
    }
  }
}
