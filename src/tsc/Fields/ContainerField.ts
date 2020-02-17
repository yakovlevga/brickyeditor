namespace BrickyEditor {
  export namespace Fields {
    export class ContainerField extends BaseField {
      public container: BlocksContainer;
      private $placeholder: JQuery;

      bind() {
        let field = this;
        let $field = this.$field;

        this.container = new BlocksContainer(
          $field,
          () => {
            field.updateBlocks();
          },
          () => {
            field.updateBlocks();
          },
          () => {
            this.select();
          },
          () => {},
          () => {
            field.updateBlocks();
          },
          () => {
            field.updateBlocks();
          },
          field.onUpload,
          true
        );

        $field.addClass(Selectors.selectorFieldContainer);
        $field.on("click", ev => {
          field.select();
          ev.stopPropagation();
          return false;
        });

        if (this.data.blocks) {
          this.data.blocks.forEach(block => {
            let template = Services.TemplateService.getTemplate(block.template);
            if (template) {
              this.container.addBlock(template, block.fields, null, false);
            }
          });
        }
      }

      updateBlocks() {
        this.updateProperty("blocks", this.container.getData(true), true);
        this.updateProperty("html", this.container.getHtml(), true);
      }

      public deselect() {
        this.container.blocks.forEach(b => b.deselect());
        this.$field.removeClass(Selectors.selectorFieldSelected);
      }

      public getEl(): JQuery {
        let html = this.container.getHtml();
        return $(html);
      }
    }
  }
}
