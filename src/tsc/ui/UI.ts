import { $dom } from "src/common/DOMHelpers";
import { Editor } from "src/Editor";
import { helpers } from "src/helpers";
import { getTemplatePreview } from "src/template";
import { bre } from "src/types/bre";
import { initHtmlTools } from "src/ui/htmlTools";
import { Selectors } from "src/ui/Selectors";

export class UI {
  public static initBtnDeck($btnsDeck: HTMLElement) {
    const $btns = $dom.select($btnsDeck, ".bre-btn");
    const $firstBtn = $btns[0];
    $firstBtn.addEventListener("click", ev => {
      UI.toggleBtnDeck($btnsDeck);
      ev.stopPropagation();
      return false;
    });
  }

  public static toggleBtnDeck($btnsDeck: HTMLElement, isOn?: boolean) {
    const $btns = $dom.select($btnsDeck, ".bre-btn");
    if (!$btns || $btns.length === 0) {
      return;
    }

    const $firstBtn = $btns[0];
    const size = 32;
    const gap = size / 6;

    isOn = isOn || ($btnsDeck.dataset.isOn as any) || false;

    if (isOn) {
      $btnsDeck.style.height = "0";
      $btnsDeck.style.width = "0";
      $btns.forEach(($btn, idx) => {
        if (idx === 0) {
          return;
        }
        $btn.style.opacity = "0";
        $btn.style.top = "0";
        $btn.style.left = "0";
      });
    } else {
      $btns.forEach(($btn, idx) => {
        if (idx === 0) {
          return;
        }
        $btn.style.opacity = "1";
        $btn.style.left = `${(idx + 1) * (size + gap)}px`;
      });

      // $btns.not(':first').each((idx, btn) => {

      //     $(btn).css({ 'opacity': 1, 'left': (idx + 1) * (size + gap) });
      // });
      $btnsDeck.style.height = `${size}px`;
      $btnsDeck.style.width = `${(size + gap) * $btns.length - gap}px`;
    }

    $dom.toggleClass($firstBtn, "bre-btn-active", !isOn);
    $btnsDeck.dataset.isOn = String(!isOn);
  }

  // Templates
  private $tools?: HTMLElement;
  private $toolsTemplates?: HTMLElement;
  private $toolsHideBtn?: HTMLElement;
  private $toolsLoader?: HTMLElement;

  constructor(public editor: Editor) {
    this.editor = editor;

    initHtmlTools(editor.options);
    this.setTools();
  }

  public toggleToolsLoader(toggle: boolean) {
    helpers.toggleVisibility(this.$toolsLoader!, toggle);
  }

  public setTemplates(templateGroups: bre.core.ITemplateGroup[]) {
    const { editor } = this;
    templateGroups.forEach(group => {
      if (group.templates.length === 0) {
        return;
      }

      const $header = helpers.createElement(
        `<div class='${Selectors.classTemplateGroup}'>${group.name}</div>`
      );
      this.$toolsTemplates!.appendChild($header);
      const $group = helpers.createElement("<div></div>");
      group.templates.forEach(template => {
        const { $preview } = template;
        $preview.setAttribute("title", template.name);
        $preview.onclick = ev => {
          editor.addBlock(template);
          ev.stopPropagation();
          return false;
        };
        $group.appendChild($preview);
      });

      $header.addEventListener("click", () => {
        $dom.toggle($group);
      });
      this.$toolsTemplates!.appendChild($group);
    });
  }

  // Set is mobile if there is not enough of space for tools
  // or if it's not forced by compactTools in passed settings.
  private get isCompactTools(): boolean {
    const compactTools = this.editor.options.compactTools;
    if (compactTools == null) {
      return window.innerWidth < this.editor.options.compactToolsWidth;
    } else {
      return compactTools.valueOf();
    }
  }

  private setTools() {
    this.$tools = helpers.createElement(
      '<div class="bre bre-tools" data-bricky-tools></div>'
    );

    this.$toolsTemplates = helpers.createElement(
      '<div class="bre-tools-templates"></div>'
    );
    this.$toolsLoader = helpers.createElement(
      '<div class="bre-tools-loader"><b>Loading...</b></div>'
    );
    this.$toolsHideBtn = helpers.createElement(
      '<button type="button" class="bre-tools-toggle"><div>►</div></button>'
    );

    this.$tools.appendChild(this.$toolsHideBtn);
    this.$tools.appendChild(this.$toolsLoader);
    this.$tools.appendChild(this.$toolsTemplates);
    this.$toolsHideBtn.onclick = this.toggleTools;

    this.editor.$editor.appendChild(this.$tools);

    if (this.isCompactTools) {
      $dom.addClass(this.$tools, "bre-tools-templates-compact");
      this.toggleTools();
    }
  }

  private toggleTools() {
    $dom.toggleClass(
      this.$tools!,
      "bre-tools-collapsed",
      !$dom.hasClass(this.$toolsHideBtn!, "bre-tools-toggle-collapsed")
    );
    $dom.toggleClass(this.$toolsHideBtn!, "bre-tools-toggle-collapsed");
  }

  // private setModal() {
  //   const $modal = helpers.createElement(
  //     '<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>'
  //   );
  //   const $modalCloseBtn = helpers.createElement(
  //     `<div class="bre-modal-close"><a href="#">${EditorStrings.buttonClose} ✖</a></div>`
  //   );
  //   const $modalContent = helpers.createElement('<div class="bre-modal-content"></div>');
  //   const $modalForm = helpers.createElement("<form></form>");
  //   const $modalBtns = helpers.createElement('<div class="bre-btns"></div>');
  //   const $modalOk = helpers.createElement(
  //     `<button type="button" class="bre-btn bre-btn-primary">${EditorStrings.buttonOk}</button>`
  //   );
  //   const $modalCancel = helpers.createElement(
  //     `<button type="button" class="bre-btn">${EditorStrings.buttonCancel}</button>`
  //   );

  //   $modalBtns.appendChild($modalOk);
  //   $modalBtns.appendChild($modalCancel);
  //   $modalForm.appendChild($modalBtns);
  //   $modalContent.appendChild($modalForm);

  //   const $placeholder = $dom.first($modal, ".bre-modal-placeholder");
  //   $placeholder.appendChild($modalCloseBtn);
  //   $placeholder.appendChild($modalContent);

  //   this.editor.$editor.appendChild($modal);
  // }
}
