import { css } from 'lit';

export default css`
  :host {
    text-align: center;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--kemet-border-radius-lg);
    border: 1px solid var(--app-border-color);
  }

  :host([selected]) {
    cursor: pointer;
    border: 2px solid var(--app-primary-color);
  }

  figure {
    display: flex;
    height: 100%;
    flex-direction: column;
    position: relative;
  }

  img {
    height: 196px;
    margin: auto;
  }

  div:has(img) {
    flex: 1;
    margin-top: var(--kemet-spacer-xl);
  }

  header {
    font-size: clamp(1rem, 5vw, 1.5rem);
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  footer {
    margin-bottom: var(--kemet-spacer-md);
  }

  header,
  footer {
    padding: 0 var(--kemet-spacer-md);
  }
`;
