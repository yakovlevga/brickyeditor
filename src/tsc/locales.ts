export const locales = {
  errorBlocksFileNotFound: (url: string) => {
    return `Blocks file not found. Requested file: ${url}.`;
  },
  errorTemplatesFileNotFound: (url: string) => {
    return `Templates file not found. Requested file: ${url}.`;
  },
  errorBlockTemplateNotFound: (templateName: string) => {
    return `Template "${templateName}" not found.`;
  },
  errorTemplateParsing: (name: string) => {
    return `Template parsing error: ${name}.`;
  },

  embedFieldLinkTitle: "Link to embed media",
  embedFieldLinkPlaceholder: "Link to instagram, youtube and etc.",

  prompt: {
    image: {
      link: {
        title: "Image link",
        placeholder: "http://url-to-image.png",
      },
      alt: {
        title: "Image alt",
        placeholder: "Image 'alt' attribute value",
      },
      upload: {
        title: "or Upload a file",
        placeholder: "select file",
        button: "Select file",
      },
      url: {
        subtitle: "Link to open on image click",
      },
    },
  },

  htmlEditorLinkUrlTitle: "Url",
  htmlEditorLinkUrlPlaceholder: "http://put-your-link.here",

  htmlEditorLinkTitleTitle: "Title",
  htmlEditorLinkTitlePlaceholder: "Title attribute for link",

  htmlEditorLinkTargetTitle: "Target",
  htmlEditorLinkTargetBlank: "Blank",
  htmlEditorLinkTargetSelf: "Self",
  htmlEditorLinkTargetParent: "Parent",
  htmlEditorLinkTargetTop: "Top",

  buttonClose: "close",
  buttonOk: "Ok",
  buttonCancel: "Cancel",

  defaultTemplatesGroupName: "Other templates",
};
