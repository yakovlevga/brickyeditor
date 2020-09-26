import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { image } from '@/fields/image';
import { bre } from '@/types/bre';

jest.mock('@/editorState');

jest.mock('@/fields/editors', () => {
  return {
    propmtFieldEditorAsync: async (field: bre.field.FieldBase) => ({
      ...field.data,
      src: 'https://bar.com/foo.jpg',
    }),
  };
});

const block: bre.block.Block = {} as bre.block.Block;

const src = 'https://foo.com/bar.jpg';
const link: Partial<Pick<HTMLLinkElement, 'title' | 'href' | 'target'>> = {
  title: 'title',
  href: src,
};
const alt = 'alt';

describe('Image field', () => {
  test('was correctly initialized using img element', () => {
    const $field = document.createElement('img');
    image.makeField(
      $field,
      { type: 'image', name: 'field', src, link, alt },
      block
    );

    expect($field.src).toEqual(src);
    expect($field.alt).toEqual(alt);
  });

  test('was correctly initialized using div element', () => {
    const $field = document.createElement('div');
    image.makeField(
      $field,
      { type: 'image', name: 'field', src, link, alt },
      block
    );

    expect($field.style.backgroundImage).toEqual(`url(${src})`);
    expect($field.title).toEqual(alt);
  });

  test('should correctly update data link', async () => {
    const $field = document.createElement('img');
    image.makeField(
      $field,
      { type: 'image', name: 'field', src, link, alt },
      block
    );

    await userEvent.click($field);
    expect($field.src).toEqual('https://bar.com/foo.jpg');
  });
});
