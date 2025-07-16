import { LitElement, html, type PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ImageProcessingService } from '~/services/image-processing.service';
import { styles } from '~/background-remover.styles';
import type { Status, ImageInterface } from '~/types';
import { t, loadLocale, setLocale, getBrowserLocale } from '~/localization';
import { RawImage, type PretrainedModelOptions } from '@huggingface/transformers';

import compareIcon from './assets/compare.svg?raw';
import downloadIcon from './assets/download.svg?raw';
import redoIcon from './assets/redo.svg?raw';
import zoomOutIcon from './assets/zoom-out.svg?raw';
import zoomInIcon from './assets/zoom-in.svg?raw';
import shinkIcon from './assets/shrink.svg?raw';

import './loading-spinner';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('background-remover')
export class BackgroundRemover extends LitElement {
  @property({ type: String })
  model = 'briaai/RMBG-1.4';

  @property({ type: String, attribute: 'data-device' })
  device: PretrainedModelOptions['device'] = 'webgpu';

  @property({ type: String, attribute: 'data-theme' })
  theme: 'light' | 'dark' | 'auto' = 'auto';

  @property({ type: String, attribute: 'data-label' })
  label = '';

  @property({ type: String, attribute: 'data-locale' })
  locale: string = getBrowserLocale();

  @state()
  private _currentStatus: Status = 'ready';

  @state()
  private _outputImageUrl: string | null = null;

  @state()
  private _outputImageName: string | null = null;

  @state()
  private _inputImageUrl: string | null = null;

  @state()
  private _errorMessage: string | null = null;

  @state()
  private _isDragActive = false;

  @state()
  private _isLocaleLoaded = false;

  @state()
  private _zoomLevel = 1.0;

  @state()
  private _isComparing = false;

  private _imageProcessingService = new ImageProcessingService();

  static override styles = styles;

  override async connectedCallback() {
    super.connectedCallback();
    await this._loadLocale();
    this._initializeModel();
    this.addEventListener('dragover', this._handleDragOver);
    this.addEventListener('dragleave', this._handleDragLeave);
    this.addEventListener('drop', this._handleDrop);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('dragover', this._handleDragOver);
    this.removeEventListener('dragleave', this._handleDragLeave);
    this.removeEventListener('drop', this._handleDrop);
  }

  protected override async updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    if (changedProperties.has('model')) {
      this._initializeModel();
    }
    if (changedProperties.has('locale')) {
      await this._loadLocale();
    }
  }

  private async _loadLocale() {
    const loaded = await loadLocale(this.locale);
    if (loaded) {
      setLocale(loaded);
    }
    this._isLocaleLoaded = true;
    this.requestUpdate();
  }

  private async _initializeModel() {
    try {
      const webgpuIsSupported = typeof navigator !== 'undefined' && 'gpu' in navigator;
      let device = this.device;
      if (!webgpuIsSupported) {
        console.warn('data-device: webgpu: This browser does not support WebGPU. Falling back to wasm');
        device = 'wasm';
      }

      this._imageProcessingService.initialize({
        model: this.model,
        device,
        onModelDownloading: (progress) => {
          this._updateStatus('downloading-model');
          this.dispatchEvent(
            new CustomEvent('@ligrila/background-remover/model-progress', {
              detail: { loaded: progress.loaded, total: progress.total },
              bubbles: true,
              composed: true,
            })
          );
        },
        onModelReady: () => {
          this._updateStatus('processing');
        },
      });
    } catch (error) {
      this._handleError(t('error.modelInitialization'), error);
    }
  }

  private _updateStatus(status: Status) {
    this._currentStatus = status;
    this.dispatchEvent(
      new CustomEvent('@ligrila/background-remover/model-status', {
        detail: { status },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleError(message: string, error: any) {
    console.error(message, error);
    this._errorMessage = message;
    this._updateStatus('error');
    this.dispatchEvent(
      new CustomEvent('@ligrila/background-remover/error', {
        detail: { message },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this._processFile(input.files[0]);
      input.value = '';
    }
  }

  private _handleDragOver(event: DragEvent) {
    event.preventDefault();
    this._isDragActive = true;
  }

  private _handleDragLeave(event: DragEvent) {
    event.preventDefault();
    this._isDragActive = false;
  }

  private _handleDrop(event: DragEvent) {
    event.preventDefault();
    this._isDragActive = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this._processFile(event.dataTransfer.files[0]);
    }
  }

  private async _processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this._handleError(t('error.invalidFileType'), null);
      return;
    }

    this._resetState();

    const dataUrl = URL.createObjectURL(file);
    const rawImage = await RawImage.fromBlob(file);
    const fileName = file.name.substring(0, file.name.lastIndexOf('.'));

    this._inputImageUrl = dataUrl;
    try {
      const imageToProcess: ImageInterface = {
        rawImage: rawImage,
        fileName: fileName,
        dataUrl: dataUrl,
      };
      const blob = await this._imageProcessingService.processImage(imageToProcess);
      this._outputImageUrl = URL.createObjectURL(blob);
      this._outputImageName = fileName + '-background-removed';

      this._updateStatus('done');
      this.dispatchEvent(
        new CustomEvent('@ligrila/background-remover/image-processed', {
          detail: { blob, url: this._outputImageUrl },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      this._handleError(t('error.imageProcessing'), error);
    }
  }

  private _resetState() {
    this._outputImageUrl = null;
    this._inputImageUrl = null;
    this._errorMessage = null;
    this._zoomLevel = 1.0;
    this._isComparing = false;
  }

  private __handleZoomReset() {
    this._zoomLevel = 1;
  }
  private _handleZoomIn() {
    this._zoomLevel = this._zoomLevel + 0.1;
  }

  private _handleZoomOut() {
    this._zoomLevel = this._zoomLevel - 0.1;
  }

  private _handleCompareStart() {
    this._isComparing = true;
  }

  private _handleCompareEnd() {
    this._isComparing = false;
  }

  override render() {
    if (!this._isLocaleLoaded) {
      return html``; // Render nothing until the locale is loaded
    }

    const containerClasses = `container`;
    const mainClasses = `${this._isDragActive ? ' dragging' : ''}${
      this._inputImageUrl ? ' has-image' : ''
    } status-${this._currentStatus}${this._isComparing ? ' is-comparing' : ''}`;

    return html`
      <main class=${mainClasses}>
        <div class=${containerClasses}>
          <input
            type="file"
            id="file-input"
            @change=${this._handleFileSelect}
            accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
          />
          <div class="content-display-area">
            ${(this._currentStatus === 'ready' || this._currentStatus === 'error') &&
            !this._inputImageUrl
              ? html`
                  <label for="file-input" class="label">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="upload-icon"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>

                    <span class="upload-text">${this.label || t('widget.label')}</span>
                  </label>
                `
              : ''}
            ${this._inputImageUrl
              ? html`
                  <div class="image-container">
                    <img
                      src=${this._inputImageUrl}
                      alt=${t('image.alt.original')}
                      class="image-preview original-image"
                      style="transform: scale(${this._zoomLevel});"
                    />
                    ${this._outputImageUrl
                      ? html`
                          <img
                            src=${this._outputImageUrl}
                            alt=${t('image.alt.processed')}
                            class="image-preview processed-image"
                            style="transform: scale(${this._zoomLevel});"
                          />
                          <div class="transparent-pattern"></div>
                        `
                      : ''}
                    ${this._currentStatus === 'processing' ||
                    this._currentStatus === 'downloading-model'
                      ? html`<loading-spinner></loading-spinner>`
                      : ''}
                  </div>
                `
              : ''}
            ${this._errorMessage
              ? html`<div class="error-message">${this._errorMessage}</div>`
              : ''}
          </div>
        </div>

        <div class="actions-container">
          <div class="actions-container-left">
            <div class="zoom-controls">
              <button
                @click=${this._handleZoomOut}
                class="icon-button"
                title=${t('button.zoomOut')}
              >
                <div class="zoom-out-icon">${unsafeHTML(zoomOutIcon)}</div>
              </button>
              <button
                @click=${this.__handleZoomReset}
                class="icon-button"
                title=${t('button.zoomReset')}
              >
                <div class="zoom-reset-icon">${unsafeHTML(shinkIcon)}</div>
              </button>
              <button @click=${this._handleZoomIn} class="icon-button" title=${t('button.zoomIn')}>
                <div class="zoom-in-icon">${unsafeHTML(zoomInIcon)}</div>
              </button>
            </div>
            <button
              @mousedown=${this._handleCompareStart}
              @mouseup=${this._handleCompareEnd}
              @mouseleave=${this._handleCompareEnd}
              @touchstart=${this._handleCompareStart}
              @touchend=${this._handleCompareEnd}
              class="icon-button compare-button"
              title=${t('button.holdToCompare')}
            >
              <div class="compare-icon">${unsafeHTML(compareIcon)}</div>
            </button>
          </div>
          <div class="actions-container-right">
            <a
              href=${this._outputImageUrl as string}
              download=${this._outputImageName as string}
              class="primary-button icon-button"
              title=${t('button.download')}
            >
              <div class="download-icon">${unsafeHTML(downloadIcon)}</div>
            </a>

            <button
              @click=${() => {
                this._resetState();
                this._updateStatus('ready');
              }}
              class="secondary-button icon-button"
              title=${t('button.processAnother')}
            >
              <div class="redo-icon">${unsafeHTML(redoIcon)}</div>
            </button>
          </div>
        </div>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'background-remover': BackgroundRemover;
  }
}
