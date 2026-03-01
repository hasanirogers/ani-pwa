import { css } from 'lit';

export default css`
  :host {
    display: block;
    min-width: 360px;
  }

  h2 {
    font-size: 1.5rem;
    color: var(--app-color);
    max-width: 480px;
    margin-bottom: var(--kemet-spacer-md);
  }

  .copy {
    color: var(--app-color);
    display: grid;
    grid-template-columns: auto 1fr;
    width: 100%;
    padding: 0;
    align-items: center;
    justify-content: center;
    text-align: left;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: var(--kemet-border-radius-lg);

    & > * {
      padding: var(--kemet-spacer-md);
    }

    :first-child {
      display: flex;
      white-space: nowrap;
      background-color: var(--app-card-background-color);
    }
  }

  ul {
    color: var(--app-color);
    list-style: none;
    padding: 0 1rem;
    margin: 1rem 0;
    display: flex;
    gap: var(--kemet-spacer-xl);
    justify-content: space-around;
    text-align: left;
    flex-direction: row;
  }
`;
