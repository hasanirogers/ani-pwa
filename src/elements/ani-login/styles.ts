import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  form {
    padding: 0.5rem;
    display: flex;
    gap: 2rem;
    flex-direction: column;
    justify-content: center;
  }

  form h2 {
    text-align: center;
    margin-bottom: 0;
  }

  span {
    display: flex;
    justify-content: center;
  }

  .success {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .success h2 {
    font-size: 1.5rem;
    border-bottom: none;
  }

  .success kemet-icon {
    color: var(--app-success-color);
  }

  .social-buttons {
    list-style: none;
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      margin-bottom: 0.5rem;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      width: 100%;
      text-align: center;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
    }

    .facebook {
      color: white;
      background-color: #1877f2;
    }

    .google {
      color: white;
      background-color: #131314;
    }
  }
`;
