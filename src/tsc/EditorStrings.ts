export class EditorStrings {
  public static embedFieldLinkTitle = "Link to embed media";
  public static embedFieldLinkPlaceholder =
    "Link to instagram, youtube and etc.";

  public static imageFieldLinkTitle = "Image link";
  public static imageFieldLinkPlaceholder = "http://url-to-image.png";

  public static imageFieldUploadTitle = "or Upload a file";
  public static imageFieldUploadButton = "Select file";

  public static imageFieldAltTitle = "Alt";
  public static imageFieldAltPlaceholder = "Image 'alt' attribute value";

  public static imageFieldUrlSubtitle = "Link to open on image click";

  public static htmlEditorLinkUrlTitle = "Url";
  public static htmlEditorLinkUrlPlaceholder = "http://put-your-link.here";

  public static htmlEditorLinkTitleTitle = "Title";
  public static htmlEditorLinkTitlePlaceholder = "Title attribute for link";

  public static htmlEditorLinkTargetTitle = "Target";
  public static htmlEditorLinkTargetBlank = "Blank";
  public static htmlEditorLinkTargetSelf = "Self";
  public static htmlEditorLinkTargetParent = "Parent";
  public static htmlEditorLinkTargetTop = "Top";

  public static buttonClose = "close";
  public static buttonOk = "Ok";
  public static buttonCancel = "Cancel";

  public static defaultTemplatesGroupName = "Other templates";
  public static errorBlocksFileNotFound = (url: string) =>
    `Blocks file not found. Requested file: ${url}.`;
  public static errorTemplatesFileNotFound = (url: string) =>
    `Templates file not found. Requested file: ${url}.`;
  public static errorBlockTemplateNotFound = (templateName: string) =>
    `Template "${templateName}" not found.`;
  public static errorTemplateParsing = (name: string) =>
    `Template parsing error: ${name}.`;
}
