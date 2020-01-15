import { helpers, px } from "src/helpers";
import { bre } from "src/types/bre";
import { deleteBlock } from "src/BlocksContainer";

const width = 40;
const style: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  width: px(width),
  minHeight: px(width),
  backgroundColor: "green",
  zIndex: "1000", // TODO: magic number?
  transform: `translateX(-${px(width)})`,
  transition: "all 2s"
};

const html = `<div>
  <button>del</button>
</div>`;

const $tools = helpers.createElement(html, style);
const $delete = $tools.querySelector("button")!;

export const showBlockEditor = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block
) => {
  $delete.onclick = () => {
    debugger;
    deleteBlock(container, block);
  };

  block.$element.insertAdjacentElement("beforebegin", $tools);
};

export const hideBlockEditor = () => {
  $delete.onclick = null;
  $tools.remove();
};
