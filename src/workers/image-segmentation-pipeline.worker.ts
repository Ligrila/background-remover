import { pipeline, type ProgressCallback, type TaskType } from '@huggingface/transformers';

class SegmentationPipelineWorker {
  static task: TaskType = 'image-segmentation';
  static instance: any = null;

  static async getInstance(model: string, progress_callback: ProgressCallback) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const model = event.data.model as string;
    const segmenter = await SegmentationPipelineWorker.getInstance(model, (progress) => {
      self.postMessage({ status: 'progress', progress });
    });

    self.postMessage({ status: 'model-ready' });

    const image = event.data.image as string;

    const result = await segmenter(image);

    self.postMessage({
      status: 'complete',
      result: result[0],
    });
  } catch (e) {
    const event = e as { message: string };
    self.postMessage({ status: 'error', error: event.message });
  }
};

export {};
