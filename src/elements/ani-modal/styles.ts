import { css } from 'lit';

export default css`
:host {
  display: block;
}

kemet-modal {
  --kemet-modal-dialog-background-color: var(--app-background-color);
  text-align: center;
}

kemet-modal#modal-sign-in {
  --kemet-modal-dialog-max-width: 480px;
}

kemet-modal p {
  color: var(--app-color);
}

kemet-modal section {
  padding: 1rem 1.5rem;
}
`;
