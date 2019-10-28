import { BlockUI } from "src/block/BlockUI";
import { BlockUIAction } from "src/block/BlockUIAction";
import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { BaseField, ContainerField } from "src/fields/Fields";
import { bre } from "src/Types/bre";
import { Selectors } from "src/ui/Selectors";

export class Block {
  public name: string;
  public html: string;
  public fields: BaseField[] = [];
  public ui: BlockUI;
  public selectedField: BaseField;
  public events?: bre.core.block.Events;

  constructor(
    name: string,
    html: string,
    preview: boolean,
    data?: BaseField[],
    events?: bre.core.block.Events
  ) {
    this.name = name;
    this.html = html;
    this.events = events;

    const $block = $dom.el(html);
    this.bindFields($block, data);
    const actions = this.getActions();

    // Build block UI
    this.ui = new BlockUI($block, preview, actions, () => this.select());
  }

  public isContainer(): boolean {
    if (!this.selectedField) {
      return false;
    }

    return this.selectedField instanceof ContainerField;
  }

  public delete() {
    this.ui.delete();
    this.events.onDelete(this);
  }

  public move(offset: number) {
    this.events.onMove(this, offset);
  }

  public clone() {
    this.events.onCopy(this);
  }

  public select(field?: BaseField): void {
    if (field === this.selectedField) {
      return;
    }

    if (field === null) {
      field = this.fields[0];
    }

    if (this.selectedField) {
      this.selectedField.deselect();
    }

    this.selectedField = field;
    this.ui.toggleSelection(true);
    this.events.onSelect(this);
  }

  public deselect() {
    this.selectedField = null;
    this.fields.forEach(f => {
      f.deselect();
    });
    this.ui.toggleSelection(false);
    this.events.onDeselect(this);
  }

  public scrollTo() {
    // todo: move to block ui
    let top = $dom.offset(this.ui.$editor).top - 100; // todo: move this magic number away
    top = top > 0 ? top : 0;
  }

  public getData(ignoreHtml?: boolean): bre.IBlockData {
    const fieldsData: bre.Data[] = [];
    this.fields.forEach(field => {
      fieldsData.push(field.data);
    });

    const data: bre.IBlockData = {
      template: this.name,
      fields: fieldsData,
    };

    if (!ignoreHtml) {
      data.html = this.getHtml(true);
    }

    return data;
  }

  public getHtml(trim: boolean): string {
    const $html = $dom.el(this.html);
    const fieldsHtml: {
      [TKey: string]: HTMLElement;
    } = {};

    this.fields.forEach(field => {
      const name: string = field.name || field.data.name;
      fieldsHtml[name] = field.getEl();
    });

    $dom.select($html, Selectors.selectorField, true).forEach($elem => {
      const fieldData = $dom.data<any>($elem, "breField");
      const name = fieldData.name;
      const $field = fieldsHtml[name];
      $dom.replaceWith($elem, $field);
    });

    const html = $html.outerHTML;
    if (!html) {
      return null;
    }

    return trim ? str.totalTrim(html) : html;
  }

  /**
   * Finds and binds block fields
   *
   * @param data Array of block fields data
   */
  private bindFields($block: HTMLElement, data?: BaseField[]) {
    const block = this;
    const $fields = $dom.select($block, Selectors.selectorField, true);
    $fields.forEach($elem => {
      const onUpdate = (property: string, oldValue: any, newValue: any) => {
        if (block.events.onUpdate !== undefined) {
          block.events.onUpdate(block, property, oldValue, newValue);
        }
      };

      const onSelect = block.select;

      const field = BaseField.createField(
        $elem,
        data,
        onSelect,
        onUpdate,
        block.events ? block.events.onUpload : undefined
      );
      block.fields.push(field);
    });
  }

  private getActions(): BlockUIAction[] {
    const block = this;
    const actions = [
      new BlockUIAction("ellipsis-h"),
      new BlockUIAction("trash-o", () => block.delete()),
      new BlockUIAction("copy", () => block.clone()),
      new BlockUIAction("angle-up", () => block.move(-1)),
      new BlockUIAction("angle-down", () => block.move(1)),
    ];
    return actions;
  }
}
