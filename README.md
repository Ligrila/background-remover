# Ligrila Background Remover

![Screenshot of the component in action](https://github.com/Ligrila/background-remover/blob/main/src/assets/screenshot.webp?raw=true)

This is a web component that allows users to remove the background from images directly in the browser. It uses the [briaai/RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) model from Hugging Face for image processing and is built with [Lit](https://lit.dev/).

## Features

- **In-browser background removal:** No need to upload images to a server.
- **Drag-and-drop support:** Easy-to-use interface for selecting images.
- **Zoom and compare:** Tools to inspect the processed image.
- **Customizable:** Can be configured via HTML attributes.
- **Theme support:** Light and dark modes available.
- **Internationalization:** Support for multiple languages.

## Usage

### From CDN

The easiest way to use the component is by importing it directly from a CDN in your HTML file.

```html
<background-remover></background-remover>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@ligrila/background-remover@0.3.1/dist/background-remover.es.js"
></script>
```

### With a Bundler

If you are using a bundler like Vite or Webpack, you can install the component from npm:

```bash
# With pnpm
pnpm add @ligrila/background-remover

# With npm
npm install @ligrila/background-remover
```

Then, import it into your project:

```javascript
import '@ligrila/background-remover';
```

And use it in your HTML:

```html
<background-remover></background-remover>
```

### Attributes

- `data-model`: The Hugging Face model to use (default: `briaai/RMBG-1.4`).
- `data-theme`: The theme to use (`light`, `dark`, or `auto`; default: `auto`).
- `data-label`: The text to display in the upload area.
- `data-locale`: The language to use (default: the browser's language).

### Events

The component emits the following custom events:

- `@ligrila/background-remover/model-status`: Fired when the model status changes.
- `@ligrila/background-remover/model-progress`: Fired while the model is downloading.
- `@ligrila/background-remover/image-processed`: Fired when an image has been processed.
- `@ligrila/background-remover/error`: Fired when an error occurs.

## Development

To develop locally, clone the repository and install the dependencies:

```bash
git clone https://github.com/lopezlean/ligrila-background-remover.git
cd ligrila-background-remover
pnpm install
```

Then, you can start the development server:

```bash
pnpm run dev
```

### Scripts

- `pnpm run dev`: Starts the Vite development server.
- `pnpm run build`: Builds the component for production.
- `pnpm run preview`: Previews the production build.
- `pnpm run lint:eslint`: Lints the code for errors.

## Contributions

Contributions are welcome. Please open an issue or a pull request to discuss changes.

## License

This project is under the [MIT](LICENSE) license.
