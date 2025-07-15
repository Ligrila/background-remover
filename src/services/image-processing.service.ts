import { type ProgressInfo } from '@huggingface/transformers';
import { applyAlphaMask } from '~/apply-alpha-mask';
import type { ImageInterface } from '~/types';
import workerScriptUrl from '../workers/image-segmentation-pipeline.worker?worker&inline';

type ImageProcessingServiceCallBackProgressInfo = ProgressInfo & { total: number; loaded: number };
type ModelLoadingProgressCallback = (
  progress: ProgressInfo & { total: number; loaded: number }
) => void;

interface ImageProcessingServiceParams {
  model: string;
  onModelDownloading: ModelLoadingProgressCallback;
  onModelReady: () => void;
}
export class ImageProcessingService {
  private params!: ImageProcessingServiceParams;

  initialize(params: ImageProcessingServiceParams): void {
    this.params = params;
  }

  async processImage(originalImage: ImageInterface): Promise<Blob> {
    const worker = await new workerScriptUrl();

    const result = await new Promise<any>((resolve, reject) => {
      const imageSegmentationPipeline = async () => {
        worker.onmessage = (event: MessageEvent) => {
          const { status, result, progress, error } = event.data as {
            status: string;
            result: any;
            progress?: ProgressInfo;
            error?: string;
          };

          if (status === 'progress') {
            this.params.onModelDownloading?.(
              progress as ImageProcessingServiceCallBackProgressInfo
            );
          } else if (status === 'model-ready') {
            this.params.onModelReady?.();
          } else if (status === 'complete') {
            resolve(result);
            //setIsProcessing(false);
          } else if (status === 'error') {
            reject(new Error(`Worker error: ${error}`));
          }
        };
        worker.onerror = (event: ErrorEvent) => {
          console.error(`Error in Worker :`, event.message, event);
          worker.terminate();
          reject(new Error(`Worker error: ${event.message}`));
        };

        worker.postMessage({ model: this.params.model, image: originalImage.dataUrl });
      };
      return imageSegmentationPipeline();
    });

    const mask = result.mask;

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.rawImage.width;
    canvas.height = originalImage.rawImage.height;
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.drawImage(originalImage.rawImage.toCanvas(), 0, 0);

    const imageData = canvasContext.getImageData(
      0,
      0,
      originalImage.rawImage.width,
      originalImage.rawImage.height
    );
    const rgbaPixelData = imageData.data;

    const newPixelData = applyAlphaMask(rgbaPixelData, mask.data);

    const newImageData = new ImageData(
      newPixelData as Uint8ClampedArray,
      imageData.width,
      imageData.height
    );
    canvasContext.putImageData(newImageData, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    });
  }
}
