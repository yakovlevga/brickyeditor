import { $dom } from "src/common/DOMHelpers";
import { Selectors } from "src/ui/Selectors";
import { TemplateGroup } from "src/templates/TemplateGroup";
import { EditorStrings } from "src/EditorStrings";
import { HtmlTools } from "src/ui/HtmlTools";
import { Editor } from "src/Editor";
import { Modal } from "src/ui/Modal";

export class UI {
  // Templates
  private $tools: HTMLElement;
  private $toolsBtn: HTMLElement;
  private $toolsTemplates: HTMLElement;
  private $toolsHideBtn: HTMLElement;
  private $toolsLoader: HTMLElement;

  // Modal
  public modal: Modal;

  // Html Editing Tools
  public htmlTools: HtmlTools;

  // Set is mobile if there is not enough of space for tools
  // or if it's not forced by compactTools in passed settings.
  private get isCompactTools(): boolean {
    var compactTools = this.editor.options.compactTools;
    if (compactTools == null) {
      return window.innerWidth < this.editor.options.compactToolsWidth;
    } else {
      return compactTools.valueOf();
    }
  }

  constructor(public editor: Editor) {
    this.editor = editor;

    this.setTools();
    this.setModal();

    this.htmlTools = new HtmlTools(this.editor);
  }

  private setTools() {
    this.$tools = $dom.el(
      '<div class="bre bre-tools" data-bricky-tools></div>'
    );

    this.$toolsTemplates = $dom.el('<div class="bre-tools-templates"></div>');
    this.$toolsLoader = $dom.el(
      '<div class="bre-tools-loader"><b>Loading...</b></div>'
    );
    this.$toolsHideBtn = $dom.el(
      '<button type="button" class="bre-tools-toggle"><div>►</div></button>'
    );

    this.$tools.appendChild(this.$toolsHideBtn);
    this.$tools.appendChild(this.$toolsLoader);
    this.$tools.appendChild(this.$toolsTemplates);
    this.$toolsHideBtn.onclick = ev => this.toggleTools();

    this.editor.$editor.appendChild(this.$tools);

    if (this.isCompactTools) {
      $dom.addClass(this.$tools, "bre-tools-templates-compact");
      this.toggleTools();
    }
  }

  private toggleTools() {
    $dom.toggleClass(
      this.$tools,
      "bre-tools-collapsed",
      !$dom.hasClass(this.$toolsHideBtn, "bre-tools-toggle-collapsed")
    );
    $dom.toggleClass(this.$toolsHideBtn, "bre-tools-toggle-collapsed");
  }

  private setModal() {
    let $modal = $dom.el(
      '<div class="bre bre-modal"><div class="bre-modal-placeholder"></div></div>'
    );
    let $modalCloseBtn = $dom.el(
      `<div class="bre-modal-close"><a href="#">${EditorStrings.buttonClose} ✖</a></div>`
    );
    let $modalContent = $dom.el('<div class="bre-modal-content"></div>');
    let $modalForm = $dom.el("<form></form>");
    let $modalBtns = $dom.el('<div class="bre-btns"></div>');
    let $modalOk = $dom.el(
      `<button type="button" class="bre-btn bre-btn-primary">${EditorStrings.buttonOk}</button>`
    );
    let $modalCancel = $dom.el(
      `<button type="button" class="bre-btn">${EditorStrings.buttonCancel}</button>`
    );

    $modalBtns.appendChild($modalOk);
    $modalBtns.appendChild($modalCancel);
    $modalForm.appendChild($modalBtns);
    $modalContent.appendChild($modalForm);

    let $placeholder = $dom.first($modal, ".bre-modal-placeholder");
    $placeholder.appendChild($modalCloseBtn);
    $placeholder.appendChild($modalContent);

    this.modal = new Modal(
      $modal,
      $modalCloseBtn,
      $modalForm,
      $modalBtns,
      $modalOk,
      $modalCancel
    );

    this.editor.$editor.appendChild($modal);
  }

  public toggleToolsLoader(toggle: boolean) {
    $dom.toggle(this.$toolsLoader, toggle);
  }

  public setTemplates(templateGroups: TemplateGroup[]) {
    let editor = this.editor;
    templateGroups.forEach(group => {
      if (group.templates.length === 0) return;

      let $header = $dom.el(
        `<div class='${Selectors.classTemplateGroup}'>${group.name}</div>`
      );
      this.$toolsTemplates.appendChild($header);
      let $group = $dom.el("<div></div>");
      group.templates.forEach(template => {
        let $preview = template.getPreview();
        $preview.setAttribute("title", template.name);
        $preview.onclick = ev => {
          editor.addBlock(template);
          ev.stopPropagation();
          return false;
        };
        $group.appendChild($preview);
      });

      $dom.on($header, "click", () => {
        $dom.toggle($group);
      });
      this.$toolsTemplates.appendChild($group);
    });
  }

  public static initBtnDeck($btnsDeck: HTMLElement) {
    var $btns = $dom.select($btnsDeck, ".bre-btn");
    var $firstBtn = $btns[0];
    $dom.on($firstBtn, "click", ev => {
      UI.toggleBtnDeck($btnsDeck);
      ev.stopPropagation();
      return false;
    });
  }

  public static toggleBtnDeck($btnsDeck: HTMLElement, isOn?: boolean) {
    var $btns = $dom.select($btnsDeck, ".bre-btn");
    if (!$btns || $btns.length == 0) return;

    var $firstBtn = $btns[0];
    var size = 32;
    var gap = size / 6;

    isOn = isOn || <any>$btnsDeck.dataset["isOn"] || false;

    if (isOn) {
      $btnsDeck.style.height = "0";
      $btnsDeck.style.width = "0";
      $btns.forEach(($btn, idx) => {
        if (idx === 0) return;
        $btn.style.opacity = "0";
        $btn.style.top = "0";
        $btn.style.left = "0";
      });
    } else {
      $btns.forEach(($btn, idx) => {
        if (idx === 0) return;
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
    $btnsDeck.dataset["isOn"] = String(!isOn);
  }
}
