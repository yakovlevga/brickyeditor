export class Selectors {
  public static attrField = "data-bre-field";
  public static selectorField = `[${Selectors.attrField}]`;

  public static classEditor = "bre-editor";

  public static classTemplate = "bre-template";
  public static selectorTemplate = `.${Selectors.classTemplate}`;

  public static classTemplateGroup = "bre-template-group";
  public static selectorTemplateGroup = `.${Selectors.classTemplateGroup}`;

  public static selectorTemplatePreview = ".bre-template-preview";

  public static selectorFieldSelected = "bre-field-selected";
  public static selectorBlockSelected = "bre-block-selected";
}
