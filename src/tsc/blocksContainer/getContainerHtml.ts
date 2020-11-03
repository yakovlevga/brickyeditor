import { bre } from '@/types/bre';
import { getBlockHtml } from '@/block/Block';

export const getContainerHtml = (container: bre.BlocksContainer) => {
  // TODO: fix it
  const html = container.blocks
    .map(block => getBlockHtml(block, true))
    .join('\n');
  const root: HTMLElement = container.$element.cloneNode(false) as HTMLElement;
  root.innerHTML = html;
  return root.outerHTML;
};
