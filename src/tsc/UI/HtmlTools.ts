import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { helpers } from "src/helpers";
import { locales } from "src/locales";
import { promptAsync } from "src/prompt";
import { bre } from "src/Types/bre";
import { Selectors } from "src/ui/Selectors";

type LinkPromptParams = {
  href: bre.prompt.PromptParameter;
  title: bre.prompt.PromptParameter;
  target: bre.prompt.PromptParameter;
};

const getPromptParams = (link?: HTMLLinkElement): LinkPromptParams => ({
  title: {
    title: locales.prompt.link.title.title,
    placeholder: locales.prompt.link.title.placeholder,
    value: link ? link.getAttribute("title") : "",
  },
  href: {
    title: locales.prompt.link.href.title,
    placeholder: locales.prompt.link.href.placeholder,
    value: link ? link.getAttribute("href") : "",
  },
  target: {
    type: "select",
    title: locales.prompt.link.target.title,
    value: link ? link.getAttribute("target") : "",
    options: [
      { title: "", value: "" },
      { title: locales.prompt.link.target.blank, value: "_blank" },
      { title: locales.prompt.link.target.parent, value: "_parent" },
      { title: locales.prompt.link.target.self, value: "_self" },
      { title: locales.prompt.link.target.top, value: "_top" },
    ],
  },
});

const promptLinkParamsAsync = async (selection: Selection) => {
  //  let link: HtmlLinkParams;

  let currentLink;
  if (
    selection.anchorNode !== null &&
    selection.anchorNode.parentNode !== null &&
    str.equalsInvariant(selection.anchorNode.parentNode.nodeName, "a")
  ) {
    currentLink = selection.anchorNode.parentNode as HTMLLinkElement;
  }
  const promptParams = getPromptParams(currentLink);

  return await promptAsync(promptParams);
};

const renderButtonElement = ({
  icon,
  command,
  range,
  aValueArgument,
}: bre.IHtmlToolsButton): HTMLElement => {
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
      const link = await promptLinkParamsAsync(selection);

      if (link === null) {
        return;
      }

      if (link.href) {
        document.execCommand(command, false, link.href);

        if (
          selection.anchorNode !== null &&
          selection.anchorNode.parentElement !== null
        ) {
          if (link.target) {
            selection.anchorNode.parentElement.setAttribute(
              "target",
              link.target
            );
          }

          if (link.title) {
            selection.anchorNode.parentElement.setAttribute(
              "title",
              link.title
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

const renderControl = (buttons: bre.IHtmlToolsButton[]) => {
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
    const $wrapper = $dom.el(
      `<div class="bre-temp-container" contenteditable="true">${$container.innerHTML}</div>`
    );
    $container.innerHTML = "";
    $container.removeAttribute(Selectors.attrContentEditable);
    $container.appendChild($wrapper);

    const range = document.createRange();
    range.selectNodeContents($wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

let control: HTMLElement;

export const initHtmlTools = ({ htmlToolsButtons }: bre.Options) => {
  control = renderControl(htmlToolsButtons);
  document.body.appendChild(control);
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
