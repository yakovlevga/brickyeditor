import {
  addBlockToContainer,
  getContainerData,
  getContainerHtml,
  createRootContainer
} from "@/blocksContainer";
import { defaultOptions } from "@/defaults";
import { getRequest } from "@/httpTransport";
import { loadTemplatesAsync } from "@/template";
import { bre } from "@/types/bre";
import { getTemplateSelector } from "@/ui/templateSelector";
import { helpers } from "@/helpers";
import { getInitialState } from "@/editorState";
import { emitter } from "./emitter";
import { modal } from "@/modal";

export class Editor {
  constructor($editor: HTMLElement, options: bre.EditorOptions) {
    editor($editor, options);
  }
}

export const editor = (
  $element: HTMLElement,
  options: bre.EditorOptions = defaultOptions
) =>
  new Promise<bre.Editor>(async resolve => {
    const optionsWithDefaults: bre.EditorOptions = {
      ...defaultOptions,
      ...options
    };

    const eventEmitter = emitter();

    const state = getInitialState();
    const editor: bre.Editor = {
      ...eventEmitter,
      $element,
      data: () => getBlocksData(state),
      html: () => getBlocksHtml(state),
      state,
      options: optionsWithDefaults,
      shared: {
        modal,
        helpers
      }
    };

    const rootContainer = createRootContainer(editor);

    editor.state.selectedContainers = [rootContainer];

    if (options.plugins) {
      options.plugins.map(({ plugin }) => plugin.init(editor));
    }

    helpers.toggleClassName($element, "bre-editor", true);

    // TODO: move it to separate plugin?
    // bindFormSubmit(editor, optionsWithDefaults);

    const templates = await loadTemplatesAsync(
      optionsWithDefaults.templatesUrl,
      editor.$element
    );

    const templatesUI = getTemplateSelector(editor);
    if (templates !== undefined) {
      templatesUI.setTemplates(templates);
      $element.append(templatesUI.$element);
    }

    const blocks = await loadInitialBlocks(optionsWithDefaults);
    if (blocks !== null) {
      blocks.map(blockData =>
        addBlockToContainer(
          rootContainer,
          {
            blockData
          },
          false
        )
      );
    }

    resolve(editor);
  });

const getBlocksData = (state: bre.EditorState): bre.block.BlockData[] => {
  throw Error("not implemented");
};
const getBlocksHtml = (state: bre.EditorState): string => {
  throw Error("not implemented");
};

const loadInitialBlocks = ({ blocks, blocksUrl }: bre.EditorOptions) =>
  new Promise<bre.block.BlockData[] | null>(async (resolve, reject) => {
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
//   editor: bre.Editor,
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
