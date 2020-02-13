import { createBlockFromData, createBlockFromTemplate } from "@/block/block";
import * as template from "@/template";
import { Mutable } from "@/types/bre";

const $template = document.createElement("div");
$template.innerHTML =
  '<div data-bre-field=\'{ "name" : "bar", "type": "html" }\'></div>';

describe("create block", () => {
  it("calls getTemplate with the right template name", () => {
    (template as Mutable<typeof template>).getTemplate = jest.fn(
      (templateName: string) => ({
        name: templateName,
        $template,
        $preview: $template
      })
    );

    const block = createBlockFromData({
      template: "foo",
      fields: []
    });

    expect(template.getTemplate).toHaveBeenCalledTimes(1);
    expect(template.getTemplate).toHaveBeenCalledWith(block.data.template);
  });

  test("from template", () => {
    const block = createBlockFromTemplate("foo", $template);

    expect(block).not.toBeNull();
    expect(block.$element).toBeInstanceOf(HTMLDivElement);
    expect(block.data.template).toEqual("foo");
  });
});
