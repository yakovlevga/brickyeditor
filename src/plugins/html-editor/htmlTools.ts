import { bre } from '@/types/bre';
import { linkEditor } from '@/fields/linkEditor';
import { HtmlToolsButton } from './index';

const promptLinkParamsAsync = (
  modal: bre.EditorModal,
  initialData: Readonly<bre.LinkData>
) =>
  new Promise<bre.LinkData | null>(resolve => {
    const { $element: $editor, data: updatedData } = linkEditor(initialData);

    modal(
      $editor,
      () => {
        resolve(updatedData);
      },
      () => {
        resolve(null);
      }
    );
  });

const renderButtonElement = (
  modal: bre.EditorModal,
  helpers: bre.EditorHelpers,
  { icon, command, range, aValueArgument }: HtmlToolsButton
): HTMLElement => {
  const $btn = helpers.el({
    tag: 'button',
    className: 'bre-button' as BreStyles,
    innerHTML: icon,
  });

  $btn.onclick = async () => {
    const selection = window.getSelection();
    if (selection === null) {
      return;
    }

    const selectionRange =
      selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (range && !selectionRange) {
      return;
    }

    if (command === 'CreateLink') {
      const selectedLink = getSeletedLink(selection);
      const currentLink =
        selectedLink !== null
          ? {
              href: selectedLink.href,
              title: selectedLink.title,
              target: selectedLink.target,
            }
          : {};

      const updatedLink = await promptLinkParamsAsync(modal, currentLink);

      if (updatedLink !== null && updatedLink.href) {
        document.execCommand(command, false, updatedLink.href);

        if (
          selection.anchorNode !== null &&
          selection.anchorNode.parentElement !== null
        ) {
          if (updatedLink.target) {
            selection.anchorNode.parentElement.setAttribute(
              'target',
              updatedLink.target
            );
          }

          if (updatedLink.title) {
            selection.anchorNode.parentElement.setAttribute(
              'title',
              updatedLink.title
            );
          }
        }
      }
    } else {
      let valueArgument;
      if (typeof aValueArgument === 'string') {
        valueArgument = aValueArgument.replace(
          '%%SELECTION%%',
          selection.toString()
        );
      }

      try {
        document.execCommand(command, false, valueArgument);
      } catch {
        wrapSelectionToContainer(helpers, selection);
        document.execCommand(command, false, valueArgument);
      }
    }

    return false;
  };

  return $btn;
};

const getSeletedLink = (selection: Selection) => {
  if (
    selection.anchorNode !== null &&
    selection.anchorNode.parentNode !== null &&
    selection.anchorNode.parentNode.nodeName.toLowerCase() === 'a'
  ) {
    return selection.anchorNode.parentNode as HTMLLinkElement;
  }

  return null;
};

const renderControl = (
  modal: bre.EditorModal,
  helpers: bre.EditorHelpers,
  buttons: HtmlToolsButton[]
) => {
  const $panel = helpers.div('bre-plugin-html-editor-root' as BreStyles);

  buttons
    .map(btn => renderButtonElement(modal, helpers, btn))
    .forEach($btn => $panel.appendChild($btn));

  const $controlRoot = helpers.div('bre-html-tools' as BreStyles);

  $controlRoot.appendChild($panel);
  helpers.toggleVisibility($controlRoot, false);

  return $controlRoot;
};

// ** Firefox execCommand hack */
// TODO: Check if it was fixed in latest versions
const wrapSelectionToContainer = (
  helpers: bre.EditorHelpers,
  selection: Selection
) => {
  if (selection.anchorNode === null) {
    return;
  }

  const $container = selection.anchorNode.parentElement;

  if ($container !== null) {
    const $wrapper = helpers.createElement(
      `<div class="bre-temp-container" contenteditable="true">${$container.innerHTML}</div>`
    );
    $container.innerHTML = '';
    $container.removeAttribute('contenteditable');
    $container.appendChild($wrapper);

    const range = document.createRange();
    range.selectNodeContents($wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const initHtmlTools = (
  modal: bre.EditorModal,
  helpers: bre.EditorHelpers,
  buttons?: HtmlToolsButton[]
) => {
  if (buttons === undefined || buttons.length === 0) {
    return null;
  }

  const $control = renderControl(modal, helpers, buttons);
  document.body.appendChild($control);

  return $control;
};

export const toggleHtmlTools = (
  $control: HTMLElement,
  rect: ClientRect | null,
  helpers: bre.EditorHelpers
) => {
  if (rect !== null && rect.width > 1) {
    const top = rect.top + rect.height;
    const left = rect.left;
    $control.style.top = `${top}px`;
    $control.style.left = `${left}px`;
    helpers.toggleVisibility($control, true);
  } else {
    helpers.toggleVisibility($control, false);
  }
};

export const bindTextSelection = (
  $el: HTMLElement,
  handler: (rect: ClientRect | null) => any
) => {
  if (!$el.contentEditable) {
    return;
  }

  $el.addEventListener('mouseup', () => {
    setTimeout(() => {
      const rect = getSelectionRect();
      handler(rect);
    }, 0);
  });

  $el.addEventListener('keyup', () => {
    const rect = getSelectionRect();
    handler(rect);
  });
};

const getSelectionRect = () => {
  const selection = window.getSelection();
  if (selection === null) {
    return null;
  }

  const range = selection.getRangeAt(0);
  return range.getBoundingClientRect();
};
