import { createBlockFromData, createBlockFromTemplate } from "@/block/block";
import * as template from "@/template";
import { Mutable } from "@/types/bre";

const $template = document.createElement("div");
$template.innerHTML =
  '<div data-bre-field=\'{ "name" : "test-field", "type": "html" }\'></div>';

describe("create block", () => {
  it("calls getTemplate with the template name", () => {
    (template as Mutable<typeof template>).getTemplate = jest.fn(
      (templateName: string) => ({
        name: templateName,
        $html: $template,
        $preview: $template
      })
    );

    const block = createBlockFromData({
      template: "mock",
      fields: []
    });

    expect(template.getTemplate).toHaveBeenCalledTimes(1);
    expect(template.getTemplate).toHaveBeenCalledWith(block.data.template);
  });
});

test("should create block from template", () => {
  const block = createBlockFromTemplate("test-block", $template);
  expect(block).not.toBeNull();
});
