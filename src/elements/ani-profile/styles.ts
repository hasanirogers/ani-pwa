import { css, unsafeCSS } from 'lit';
import FilePondStyles from 'filepond/dist/filepond.min.css?raw';
import FilePondImagePreviewStyles from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css?raw';

export const informationStyles = css`
  :host {
    display: block;
  }

  nav {
    text-align: center;
  }

  button.image {
    width: 100%;
  }

  button.close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
  }

  legend {
    text-align: center;
    margin-bottom: 0;
  }

  fieldset {
    text-align: center;
  }

  kemet-card {
    margin: 0 auto;
  }

  kemet-count {
    text-align: left;
  }

  kemet-textarea {
    width: 100%;
  }

  .delete {
    position: absolute;
    top: 5rem;
    right: -2rem;
  }

  .profile {
    display: block;
    margin: 0;
  }

  .profile-image {
    text-align: center;
    max-width: 128px;
    position: relative;
    margin: auto;
  }

  .profile-image + div {
    display: flex;
    gap: 1px;
    flex-direction: column;
    width: 100%;
  }

  .actions {
     text-align: center;
  }
`;

export const libraryStyles = css`
  :host {
    display: block;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(1, minmax(150px, 1fr));
    gap: var(--kemet-spacer-xl);
    flex-wrap: wrap;
    margin: var(--kemet-spacer-xl);
    padding: 0;
    list-style: none;
  }

  h2 {
    margin: var(--kemet-spacer-xl) 0;
    border-bottom: none;
  }

  p,
  h2 {
    padding: 0 2rem;
  }

  form {
    padding: 0 1rem 1rem 1rem;
  }

  kemet-field {
    padding: 1rem;
  }


  @media screen and (min-width: 768px) {
    ul {
      grid-template-columns: repeat(2, minmax(150px, 1fr));
    }
  }

  @media screen and (min-width: 1024px) {
    ul {
      grid-template-columns: repeat(3, minmax(150px, 1fr));
    }
  }

  @media screen and (min-width: 1280px) {
    ul {
      grid-template-columns: repeat(4, minmax(150px, 1fr));
    }
  }
`;

export const filepondStyles = css`${unsafeCSS(FilePondStyles)}`;
export const filepondImagePreviewStyles = css`${unsafeCSS(FilePondImagePreviewStyles)}`;
