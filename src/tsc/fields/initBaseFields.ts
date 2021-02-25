import { fieldFactories } from '@/fields/fields';
import { html } from '@/fields/html';
import { image } from '@/fields/image';
import { embed } from '@/fields/embed';
import { container } from '@/fields/container';
import { htmlCode } from '@/fields/code';

export const initBaseFields = () => {
  fieldFactories.html = html;
  fieldFactories.image = image;
  fieldFactories.embed = embed;
  fieldFactories.htmlCode = htmlCode;
  fieldFactories.container = container;
};
