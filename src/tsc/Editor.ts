import {
  addBlockToContainer,
  createContainer,
  getContainerData,
  getContainerHtml
} from "src/BlocksContainer";
import { defaultOptions } from "src/defaults";
import { getRequest } from "src/httpTransport";
import { loadTemplatesAsync } from "src/template";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { getTemplateSelector } from "src/ui/templateSelector";
import { initHtmlTools } from "src/ui/htmlTools";

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
    const getData = () => getContainerData(container, options.ignoreHtml);
    const getHtml = () => getContainerHtml(container);

    const editor = {
      $element,
      container,
      selectedContainer: container,
      getData,
      getHtml
    };

    $element.classList.add(Selectors.classEditor);

    initHtmlTools(optionsWithDefaults);

    // TODO: move it to separate plugin?
    bindFormSubmit(editor, optionsWithDefaults);

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

const bindFormSubmit = (
  editor: bre.core.Editor,
  { formSelector, inputSelector, ignoreHtml }: bre.Options
): void => {
  if (formSelector === undefined || inputSelector === undefined) {
    return;
  }

  const $form = document.querySelector(formSelector);
  if ($form === null) {
    return;
  }

  const $input = document.querySelector(inputSelector);
  if ($input === null) {
    return;
  }

  if ($input instanceof HTMLInputElement) {
    $form.addEventListener("submit", () => {
      const blocks = getContainerData(editor.container, ignoreHtml);
      ($input as HTMLInputElement).value = JSON.stringify(blocks);
    });
  }
};
