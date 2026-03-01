// import { html, render } from 'lit';
// import { expect, test, describe, vi, beforeEach } from 'vitest';
// import { page } from '@vitest/browser/context';

// import AniLike from './share';
// import './share';
// import 'kemet-ui/dist/components/kemet-icon/kemet-icon';

// describe('Like', () => {
//   beforeEach(() => {
//     render(
//       html`<ani-like></ani-like>`,
//       document.body,
//     );
//   });

//   test('user is able to post a new quote', async () => {
//     const spyAddQuote = vi.spyOn(AniLike.prototype, 'handleLike');
//     const likeButton = page.getByRole('button');
//     await likeButton.click();
//     expect(spyAddQuote).toHaveBeenCalled();
//   });
// });
