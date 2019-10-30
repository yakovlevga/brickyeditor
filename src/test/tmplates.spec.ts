import { expect } from "chai";
import { JSDOM } from "jsdom";
import "mocha";

import { Template } from "../tsc/Templates/Template";

const { window } = new JSDOM();
global.document = window.document;

function getTemplateDiv(): HTMLDivElement {
  const $el = window.document.createElement("div") as HTMLDivElement;
  $el.innerHTML =
    '<div class="bre-template" data-name="Display Heading 1">' +
    '<h1 data-bre-field=\'{ "name" : "text", "type": "html" }\'></h1>' +
    "</div>";
  return $el.children[0] as HTMLDivElement;
}

describe("Template", () => {
  const $template = getTemplateDiv();
  const template = new Template($template);

  it("should be loaded", () => {
    expect(template.loaded).is.true;
  });

  it("should has preview", () => {
    expect(template.$preview).not.undefined.and.not.null;
  });

  it("preview should be valid html element", () => {
    expect(template.$preview.tagName.toLowerCase()).is.equals("h1");
  });
});
