import {
  addBlockToContainer,
  createContainer,
  getContainerData,
  getContainerHtml
} from "@/BlocksContainer";
import { defaultOptions } from "@/defaults";
import { getRequest } from "@/httpTransport";
import { loadTemplatesAsync } from "@/template";
import { bre } from "@/types/bre";
import { Selectors } from "@/ui/Selectors";
import { getTemplateSelector } from "@/ui/templateSelector";
import { initHtmlTools } from "@/ui/htmlTools";

export class Editor {
  constructor($editor: HTMLElement, options: bre.Options) {
    editor($editor, options);
  }
}

export const editor = (
  $element: HTMLElement,
  options: bre.Options = defaultOptions
) =>
  new Promise<bre.core.Editor>(async resolve => {
    const optionsWithDefaults = { ...defaultOptions, ...options };
    const container = createContainer($element, false);

    const editor = {
      $element,
      container,
      selectedContainer: container,
      data: () => getContainerData(container),
      html: () => getContainerHtml(container)
    };

    $element.classList.add(Selectors.classEditor);

    initHtmlTools(optionsWithDefaults);

    // TODO: move it to separate plugin?
    // bindFormSubmit(editor, optionsWithDefaults);

    const templates = await loadTemplatesAsync(
      optionsWithDefaults.templatesUrl,
      editor.$element
    );

    const templatesUI = getTemplateSelector();
    if (templates !== undefined) {
      templatesUI.setTemplates(templates);
      templatesUI.on("select", t => {
        addBlockToContainer(container, {
          blockTemplate: t!.template
        });
      });
      $element.append(templatesUI.$element);
    }

    const blocks = await loadInitialBlocks(optionsWithDefaults);
    if (blocks !== null) {
      blocks.map(blockData =>
        addBlockToContainer(container, {
          blockData
        })
      );
    }

    resolve(editor);
  });

const loadInitialBlocks = ({ blocks, blocksUrl }: bre.Options) =>
  new Promise<bre.core.block.BlockData[] | null>(async (resolve, reject) => {
    const url = blocksUrl;
    // const editor = this;

    if (url !== undefined) {
      try {
        const blocks = await getRequest(url);
        resolve(blocks);
      } catch (error) {
        reject(error);
      }

      return;
    }

    if (blocks !== undefined) {
      resolve(blocks);
      return;
    }

    resolve(null);
  });

// const bindFormSubmit = (
//   editor: bre.core.Editor,
//   { formSelector, inputSelector, ignoreHtml }: bre.Options
// ): void => {
//   if (formSelector === undefined || inputSelector === undefined) {
//     return;
//   }

//   const $form = document.querySelector(formSelector);
//   if ($form === null) {
//     return;
//   }

//   const $input = document.querySelector(inputSelector);
//   if ($input === null) {
//     return;
//   }

//   if ($input instanceof HTMLInputElement) {
//     $form.addEventListener("submit", () => {
//       const blocks = getContainerData(editor.container, ignoreHtml);
//       ($input as HTMLInputElement).value = JSON.stringify(blocks);
//     });
//   }
// };
