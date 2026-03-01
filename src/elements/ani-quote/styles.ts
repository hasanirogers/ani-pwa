import { css } from 'lit';

export default css`
  :host {
    position: relative;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  cite a {
    color: var(--app-link-color);
  }

  img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 50%;
  }

  strong {
    display: inline-flex;
    align-items: baseline;
  }

  header {
    display: grid;
    gap: 1rem;
    align-items: center;
    grid-template-columns: auto 1fr;
  }

  header span {
    opacity: 0.75;
    font-size: 0.85rem;
  }

  header > :first-child {
    display: flex;
  }

  blockquote {
    font-style: italic;
    text-align: justify;
    display: flex;
    gap: var(--kemet-spacer-md);
    align-items: flex-start;
    position: relative;
    margin: 1rem 0 1.5rem 0;
    opacity: 0.75;
    line-height: 1.5;
  }

  blockquote::before {
    content: '❝';
  }

  blockquote::after {
    content: '❞';
  }

  blockquote::before,
  blockquote::after {
    position: relative;
    top: -1rem;
    font-size: 3rem;
    opacity: 0.33;
  }

  footer {
    display: flex;
    justify-content: space-between;
    grid-column: span 2;
    margin-top: var(--kemet-spacer-md);
    padding: var(--kemet-spacer-md) 0 var(--kemet-spacer-2xl) 0;
    border-bottom: var(--app-border);
  }

  footer > * {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  ani-note {
    color: var(--ani-color-info);
    padding: 1rem;
    margin-left: 1.5rem;
    border-radius: var(--kemet-border-radius-md);
    border-left: 3px solid var(--ani-color-info);
    background-color: var(--ani-color-info-light);
  }

  [aria-label="Show note"][active] {
    color: var(--ani-color-success);
  }

  [aria-label="Like"][active],
  [aria-label="Like"][active] + * {
    color: var(--ani-quote-color-like);
  }

  [aria-label="Delete"] {
    position: absolute;
    top: 0;
    right: 0;
  }

  [icon="patch-check-fill"] {
    position: relative;
    top: 2px;
  }

  @media screen and (min-width: 768px) {
    figure {
      margin-left: 5rem;
    }
  }
`;
