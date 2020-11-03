import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/dom';

import { html } from '@/fields/html';
import { bre } from '@/types/bre';

import * as editorState from '@/state/editorState';
jest.mock('@/editorState');
const selectFieldMock = (editorState as typeof editorState)
  .selectField as jest.Mock;

const foo = 'bar';
const block: bre.block.Block = {} as bre.block.Block;

describe.skip('Html field', () => {
  test('was correctly initialized', () => {
    const $field = document.createElement('div');
    html.makeField($field, { type: 'html', name: 'field', html: foo }, block);

    expect($field.textContent).toEqual(foo);
    expect($field).toHaveAttribute('contenteditable');
  });

  test('correctly updates data on user input', async () => {
    const $field = document.createElement('div');
    document.body.append($field);
    const field = html.makeField(
      $field,
      { type: 'html', name: 'field', html: '' },
      block
    );

    await userEvent.type($field, foo);
    expect($field.textContent).toEqual(foo);
    expect(field.data.html).toEqual(foo);
  });

  test(`paste event calls document.execCommand('insertHTML')`, async () => {
    document.execCommand = jest.fn();

    const $field = document.createElement('div');
    document.body.append($field);
    html.makeField($field, { type: 'html', name: 'field', html: '' }, block);

    fireEvent.paste($field, {
      clipboardData: {
        getData: () => foo,
      },
    });

    await waitFor(() => {
      expect(document.execCommand).toBeCalledWith('insertHTML', false, foo);
    });
  });

  test('was selected after click', async () => {
    const $field = document.createElement('div');
    document.body.append($field);
    html.makeField($field, { type: 'html', name: 'field', html: '' }, block);

    await userEvent.click($field);

    expect(selectFieldMock).toBeCalledTimes(1);
  });
});
