import { type PretrainedModelOptions, type TaskType } from '@huggingface/transformers';

class SegmentationPipelineWorker {
  static task: TaskType = 'image-segmentation';
  static instance: any = null;

  static async getInstance(model: string, pretrainedModelOptions: PretrainedModelOptions) {
    if (this.instance === null) {
      const { pipeline } = await import(
        // @ts-ignore
        'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.6.3'
      );

      this.instance = await pipeline(this.task, model, pretrainedModelOptions);
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const model = event.data.model as string;
    const device = event.data.device as PretrainedModelOptions['device'];
    const segmenter = await SegmentationPipelineWorker.getInstance(model, {
      progress_callback: (progress) => {
        self.postMessage({ status: 'progress', progress });
      },
      device,
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
