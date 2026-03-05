import { html, render } from 'lit';
import { expect, test, describe, vi } from 'vitest';
import AniBook from './book';
import './book';
import { userEvent } from '@vitest/browser/context';


describe('Book', () => {
  test('adds or removes a book when clicked', async () => {
    render(
      html`<ani-book selectable identifier="Iaqe9CG_s6cC"></ani-book>`,
      document.body,
    );

    const spyHandleSelected = vi.spyOn(AniBook.prototype, 'handleSelected');
    const component = document.querySelector('ani-book') as AniBook;
    await userEvent.click(component);
    expect(spyHandleSelected).toHaveBeenCalled();
  });

  test('does not call handleSelected if not selectable', async () => {
    render(
      html`<ani-book identifier="Iaqe9CG_s6cC"></ani-book>`,
      document.body,
    );

    const spyHandleSelected = vi.spyOn(AniBook.prototype, 'handleSelected');
    const component = document.querySelector('ani-book');
    component?.click();
    expect(spyHandleSelected).not.toHaveBeenCalled();
  });
});
