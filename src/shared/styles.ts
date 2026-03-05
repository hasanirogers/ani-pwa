import { css } from 'lit';

export default css`
  :host([hidden]) {
    display: none;
  }

  a {
    color: var(--app-link-color)
  }

  button {
    cursor: pointer;
    color: inherit;
    font-size: inherit;
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
  }

  fieldset {
    border: none;
    padding: 0;
  }

  h2 {
    font-size: 2rem;
    font-weight: 400;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: var(--app-border);
  }

  h3 {
    font-size: 1.75rem;
    font-weight: 400;
  }

  legend {
    font-size: 2rem;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: var(--app-border);
  }

  cite {
    font-size: 0.9rem;
  }

  figure {
    margin: 0;
    padding: 0;
  }

  hr {
    opacity: 0.25;
  }

  a[href*='lostpassword'] {
    display: none;
  }

  kemet-button {
    --kemet-button-padding: 0.75rem 1rem;
  }

  kemet-fab {
    position: fixed;
    z-index: 9;
    bottom: var(--kemet-spacer-3xl);
    right: var(--kemet-spacer-lg);
  }

  kemet-tooltip {
    --kemet-popper-width: 80vw;
    position: relative;
  }

  kemet-toggle {
    --kemet-toggle-track-shadow: none;
    --kemet-toggle-track-color: transparent;
    --kemet-toggle-track-border: var(--app-border);
  }

  kemet-alert {
    pointer-events: none;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 9999;
    width: 96%;
    margin-top: 2%;
    transform: translateX(-50%);
    background: var(--app-background-color);
  }

  kemet-alert[opened] {
    pointer-events: auto;
  }

  kemet-alert > div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  kemet-alert[status=error] * {
    color: rgb(var(--kemet-color-error));
  }

  kemet-alert[status=success] * {
    color: rgb(var(--kemet-color-success));
  }

  kemet-tabs {
    --kemet-tabs-divider-color: rgb(var(--kemet-color-gray-700));
  }

  kemet-card {
    --kemet-card-border: none;
    --kemet-card-background-color: none;

    display: block;
    margin: 2rem auto;
  }

  kemet-avatar {
    color: rgb(var(--app-background-color));
    padding: 8px;
  }

  kemet-field {
    color: var(--app-color);
    text-align: left;
  }

  kemet-input {
    --kemet-input-background-color-filled: var(--app-input-filled-background-color);
  }

  kemet-select {
    --kemet-select-background-color-filled: var(--app-input-filled-background-color);
  }

  kemet-textarea {
    --kemet-textarea-background-color-filled: var(--app-input-filled-background-color);
    width: 80vw;
    max-width: 768px;
  }

  kemet-count {
    text-align: right;
  }

  kemet-modal {
    position: absolute;
    z-index: -1;
  }

  kemet-modal[opened] {
    position: relative;
    z-index: 10;
  }

  kemet-modal::part(dialog) {
    position: fixed;
  }

  ::part(input) {
    outline-offset: 6px;
  }

  ::part(input):-internal-autofill-selected {
    background-color: red !important;
  }

  ::part(overlay) {
    width: 1000vw;
    height: 1000vh;
    left: -100vw;
    top: -100vh;
    background: rgb(var(--kemet-color-black) / 40%);
  }

  ::part(textarea) {
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    line-height: 1.5;
    font-size: 1rem;
    font-weight: 400;
    font-synthesis: none;
  }

  .profile-picture {
    aspect-ratio: 1 / 1;
    min-width: 48px;
    border-radius: 50%;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  ol.abc {
    list-style-type: lower-alpha;
  }

  @media (min-width: 768px) {
    kemet-tooltip {
      --kemet-popper-width: 480px;
    }
  }
`;

export const stylesVendors = css`
  .google-btn,
  .btn-fb {
    width: 50%;
  }

  /* Facebook Button */
  .btn-fb {
    display: inline-block;
    border-radius: 3px;
    text-decoration: none;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    -webkit-transition: background-color 0.218s, border-color 0.218s,
      box-shadow 0.218s;
    transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  }

  .fb-content,
  .btn-fb,
  .btn-fb .fb-content {
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    width: 170px;
    height: 40px;
  }

  .fb-content .logo,
  .btn-fb .logo,
  .btn-fb .fb-content .logo {
    padding: 3px;
    height: inherit;
  }

  .fb-content svg,
  .btn-fb svg,
  .btn-fb .fb-content svg {
    width: 18px;
    height: 18px;
  }

  .fb-content p,
  .btn-fb,
  .btn-fb .fb-content p {
    width: 100%;
    width: 180px;
    line-height: 1;
    letter-spacing: 0.21px;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    /* font-family: "Roboto", sans-serif; */
  }

  .btn-fb {
    padding-top: 1.5px;
    background: #1877f2;
    background-color: #1877f2;
  }

  .btn-fb:hover {
    box-shadow: 0 0 3px 3px rgba(59, 89, 152, 0.3);
  }

  .btn-fb .fb-content p {
    color: rgba(255, 255, 255, 0.87);
  }

  /* Google Button */
  @import url(
    https://fonts.googleapis.com/css?family=Roboto:300,
    400,
    500,
    700&subset=cyrillic
  );

  .google-btn {
    width: 170px;
    height: 40px;
    background-color: #4285f4;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    -webkit-transition: background-color 0.218s, border-color 0.218s,
      box-shadow 0.218s;
    transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  }

  .google-btn .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 38px;
    height: 38px;
    border-radius: 2px;
    background-color: #fff;
  }

  .google-btn .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: 11px;
    width: 18px;
    height: 18px;
  }

  .google-btn .btn-text {
    float: right;
    margin: 11px 18px 0 0;
    color: #fff;
    font-size: 14px;
    letter-spacing: 0.2px;
    /* font-family: "Roboto"; */
    font-weight: 500;
  }

  .google-btn:hover {
    box-shadow: 0 0 6px #4285f4;
    cursor: pointer;
  }

  .google-btn:active {
    background: #1669f2;
  }
`;
