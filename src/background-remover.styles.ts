import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    width: 100%;
    max-width: var(--max-width);
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    --light-background: #ffffff;
    --light-text: #212529;
    --light-icon-color: var(--light-primary);
    --light-icon-hover-color: var(--light-text);
    --light-border: #dee2e6;
    --light-primary: #0d6efd;
    --light-primary-hover: #0b5ed7;

    --dark-background: #212529;
    --dark-text: #f8f9fa;
    --dark-icon-color: var(--dark-text);
    --dark-icon-hover-color: var(--light-primary);
    --dark-border: #495057;
    --dark-primary: #000;
    --dark-primary-hover: #495057;
    --min-height: 300px;
    --max-width: 500px;

    /* Default light theme */
    --background-color: var(--light-background);
    --text-color: var(--light-text);
    --icon-color: var(--light-icon-color);
    --icon-hover-color: var(--light-icon-hover-color);
    --upload-icon-color: var(--light-primary);
    --border-color: var(--light-border);
    --primary-color: var(--light-primary);
    --primary-hover-color: var(--light-primary-hover);
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--border-color);
    border-radius: 16px; /* Larger border-radius for a softer look */
    text-align: center;
    transition:
      border-color 0.3s,
      background-color 0.3s;
    background-color: var(--background-color);
    color: var(--text-color);
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  }

  main:not(.has-image) .container {
    min-height: var(--min-height);
    border-style: dashed;
  }

  .content-display-area {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  main.dragging .container {
    border-color: var(--primary-color);
  }

  #file-input {
    display: none;
  }

  .label {
    cursor: pointer;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-color);
    font-size: 1.1rem;
  }

  .upload-icon {
    width: 48px;
    height: 48px;
    color: var(--upload-icon-color);
  }

  .upload-text {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: var(--primary-color);
    animation: spin 1s ease infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .status-text {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--text-color);
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: var(--border-color);
    border-radius: 2px;
    margin-top: 0.5rem;
  }

  .progress-bar-inner {
    width: 0;
    height: 100%;
    background-color: var(--primary-color);
    border-radius: 2px;
    transition: width 0.3s;
  }

  .image-preview {
    max-width: 100%;
    border-radius: 4px;
  }

  .image-container {
    width: 100%;
    position: relative;
    display: grid;
    place-items: center;
    overflow: scroll;
  }

  .original-image,
  .processed-image,
  .transparent-pattern {
    grid-area: 1 / 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    transition: clip-path 0.7s ease;
  }
  .original-image,
  .processed-image {
    z-index: 1;
  }
  loading-spinner {
    z-index: 2;
  }
  .transparent-pattern {
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==');
    position: absolute;
    inset: 0;
    z-index: 0;
    background-repeat: repeat;
  }

  main.status-done .original-image {
    clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
  }

  main.is-comparing .original-image {
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  }

  @keyframes reveal-image {
    from {
      clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
    }
    to {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    }
  }

  .error-message {
    color: #dc3545;
    margin-top: 1rem;
  }

  .actions-container {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    justify-content: space-between;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3 ease;
  }
  .status-done .actions-container {
    opacity: 1;
  }

  .actions-container-left,
  .actions-container-right {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .zoom-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .icon-button {
    background-color: transparent;
    border: none;
    color: var(--icon-color);
    cursor: pointer;
    padding: 0.25rem; /* Adjusted padding for icon buttons */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.3s,
      color 0.3s;
  }

  .icon-button:hover svg {
    fill: var(--icon-hover-color);
  }

  .icon-button svg {
    fill: var(--icon-color);
    width: 1.5rem;
    height: 1.5rem;
  }
  .icon-button .compare-icon svg {
    fill: transparent;
  }
  .icon-button .compare-icon svg path {
    stroke: var(--icon-color);
  }
  .icon-button:hover .compare-icon svg path {
    stroke: var(--icon-hover-color);
  }

  .icon-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary-button,
  .secondary-button {
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition:
      background-color 0.3s,
      color 0.3s,
      border-color 0.3s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .primary-button {
    background-color: var(--primary-color);

    border: 1px solid var(--primary-color);
  }
  .primary-button svg {
    fill: #fff;
  }

  .primary-button:hover {
    background-color: var(--primary-hover-color);
    border-color: var(--primary-hover-color);
  }
  .primary-button:hover svg {
    fill: #fff;
  }

  .secondary-button {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }
  .secondary-button svg {
    fill: var(--icon-color);
  }

  .secondary-button:hover {
    border: 1px solid var(--icon-hover-color);
  }
  .secondary-button:hover svg {
    fill: var(--icon-hover-color);
  }

  /* Dark Mode */
  :host([data-theme='dark']) {
    --background-color: var(--dark-background);
    --text-color: var(--dark-text);
    --icon-color: var(--dark-icon-color);
    --icon-hover-color: var(--dark-icon-hover-color);
    --upload-icon-color: var(--dark-text);
    --border-color: var(--dark-border);
    --primary-color: var(--dark-primary);
    --primary-hover-color: var(--dark-primary-hover);
  }

  @media (prefers-color-scheme: dark) {
    :host([data-theme='auto']) {
      --background-color: var(--dark-background);
      --text-color: var(--dark-text);
      --icon-color: var(--dark-icon-color);
      --icon-hover-color: var(--dark-icon-hover-color);
      --upload-icon-color: var(--dark-text);
      --border-color: var(--dark-border);
      --primary-color: var(--dark-primary);
      --primary-hover-color: var(--dark-primary-hover);
    }
  }
`;
