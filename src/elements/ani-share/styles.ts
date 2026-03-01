import { css } from 'lit';

export default css`
  :host {
    --ani-like-color: inherit;
    color: var(--ani-like-color);
    display: flex;
  }

  :host([liked]) {
    --ani-like-color: rgb(var(--kemet-color-red-600));
  }

  button {
    display: inline-flex;
    gap: var(--kemet-spacer-sm);
    align-items: center;
  }
`;
