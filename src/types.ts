import type { RawImage } from "@huggingface/transformers";

export type Status =
  | 'initializing'
  | 'downloading-model'
  | 'ready'
  | 'processing'
  | 'done'
  | 'error'
  | 'uploading';

export interface ImageInterface {
  rawImage: RawImage;
  fileName: string;
  dataUrl: string;
}
