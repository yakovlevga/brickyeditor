import { helpers, strEqualsInvariant } from "@/helpers";

import { bre } from "@/types/bre";
import { linkEditor } from "@/fields/linkEditor";
import { dialog } from "@/modal";

const promptLinkParamsAsync = (initialData: Readonly<bre.field.LinkData>) =>
  new Promise<bre.field.LinkData | null>(resolve => {
    const { $element: $editor, data: updatedData } = linkEditor(initialData);

    dialog(
      $editor,
      () => {
        resolve(updatedData);
      },
      () => {
        resolve(null);
      }
    );
  });

const renderButtonElement = ({
  icon,
  command,
  range,
  aValueArgument
}: bre.HtmlToolsButton): HTMLElement => {
  const $btn = helpers.createElement(
    `<button type="button" class="bre-btn"><i class="fa fa-${icon}"></i></button>`
  );

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

    if (command === "CreateLink") {
      const selectedLink = getSeletedLink(selection);
      const currentLink =
        selectedLink !== null
          ? {
              href: selectedLink.href,
              title: selectedLink.title,
              target: selectedLink.target
            }
          : {};

      const updatedLink = await promptLinkParamsAsync(currentLink);

      if (updatedLink !== null && updatedLink.href) {
        document.execCommand(command, false, updatedLink.href);

        if (
          selection.anchorNode !== null &&
          selection.anchorNode.parentElement !== null
        ) {
          if (updatedLink.target) {
            selection.anchorNode.parentElement.setAttribute(
              "target",
              updatedLink.target
            );
          }

          if (updatedLink.title) {
            selection.anchorNode.parentElement.setAttribute(
              "title",
              updatedLink.title
            );
          }
        }
      }
    } else {
      let valueArgument;
      if (typeof aValueArgument === "string") {
        valueArgument = aValueArgument.replace(
          "%%SELECTION%%",
          selection.toString()
        );
      }

      try {
        document.execCommand(command, false, valueArgument);
      } catch {
        wrapSelectionToContainer(selection);
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
    strEqualsInvariant(selection.anchorNode.parentNode.nodeName, "a")
  ) {
    return selection.anchorNode.parentNode as HTMLLinkElement;
  }

  return null;
};

const renderControl = (buttons: bre.HtmlToolsButton[]) => {
  const $panel = helpers.createElement(
    '<div class="bre-html-tools-panel"></div>'
  );

  buttons.map(renderButtonElement).forEach($btn => $panel.appendChild($btn));

  const $controlRoot = helpers.createElement(
    '<div class="bre-html-tools bre-btn-group"></div>'
  );
  $controlRoot.appendChild($panel);
  helpers.toggleVisibility($controlRoot, false);

  return $controlRoot;
};

// ** Firefox execCommand hack */
// TODO: Check if it was fixed in latest versions
const wrapSelectionToContainer = (selection: Selection) => {
  if (selection.anchorNode === null) {
    return;
  }

  const $container = selection.anchorNode.parentElement;

  if ($container !== null) {
    const $wrapper = helpers.createElement(
      `<div class="bre-temp-container" contenteditable="true">${$container.innerHTML}</div>`
    );
    $container.innerHTML = "";
    $container.removeAttribute("contenteditable");
    $container.appendChild($wrapper);

    const range = document.createRange();
    range.selectNodeContents($wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

let control: HTMLElement;

export const initHtmlTools = ({ htmlToolsButtons }: bre.EditorOptions) => {
  if (htmlToolsButtons) {
    control = renderControl(htmlToolsButtons);
    document.body.appendChild(control);
  }
};

export const toggleHtmlTools = (rect: ClientRect | null) => {
  // check if some text is seleted
  if (rect !== null && rect.width > 1) {
    const top = rect.top + rect.height;
    const left = rect.left;
    control.style.top = `${top}px`;
    control.style.left = `${left}px`;
    helpers.toggleVisibility(control, true);
  } else {
    helpers.toggleVisibility(control, false);
  }
};
