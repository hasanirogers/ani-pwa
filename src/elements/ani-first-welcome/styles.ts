import { css } from 'lit';

export default css`
  :host {
    display: none;
    color: var(--app-color);
    padding: 2rem;
    margin: 2rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--app-primary-color);
  }

  :host([opened]) {
    display: block;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    line-height: 1.2;
  }

  a {
    color: var(--app-text-color);
    font-weight: bold;
  }

  em {
    font-weight: bold;
    opacity: 0.8;
  }
`;
