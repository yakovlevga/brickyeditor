import { createBlockFromTemplate } from "./block";

test("should create block from template", () => {
  const $template = document.createElement("div");
  $template.innerHTML =
    '<div data-bre-field=\'{ "name" : "test-field", "type": "html" }\'></div>';

  // data: bre.core.block.BlockData = {
  //   template: blockTemplate.name,
  //   fields: []
  // }

  const block = createBlockFromTemplate("test-block", $template);

  expect(block).not.toBeNull();
});
