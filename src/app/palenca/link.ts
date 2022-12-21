import { RenderOptions, WidgetEvent } from './types';
import { WidgetEventSignal, OnEvent } from './enums';
import { validateRenderArguments, renderFrame, removeFrame } from './utils';
import { Dispatcher } from './dispatcher';

export type PalencaLinkEventListener = (
  data: any,
  event: WidgetEventSignal,
  ...args: any[] // TODO: find a better type for ...args
) => void;

export interface LinkInterface {
  render(containerId: string, options?: RenderOptions): void;
  on(event: OnEvent, callback: PalencaLinkEventListener): void;
  destroy(): void;
}

export class Link implements LinkInterface {
  private frameId = '';
  private dispatcher = new Dispatcher<PalencaLinkEventListener>();

  constructor(private widgetId: string) {}

  private handleEvent(event: WidgetEvent): void {
    if (!event || !Object.values(WidgetEventSignal).includes(event.signal))
      return;
    this.dispatcher.dispatch(event.signal, event.response);
  }

  private messageEventListener = ({ data }: MessageEvent) => {
    this.handleEvent(data as WidgetEvent);
  };

  private registerEventLister(): void {
    window.addEventListener('message', this.messageEventListener);
  }

  public destroy() {
    window.removeEventListener('message', this.messageEventListener);
    removeFrame(this.frameId);
    this.dispatcher.clear();
  }

  public render(containerId: string, options?: RenderOptions): Link {
    validateRenderArguments(containerId, options);
    this.frameId = renderFrame(this.widgetId, containerId, options);
    this.registerEventLister();
    return this;
  }

  public on(event: OnEvent, callback: PalencaLinkEventListener): void {
    if (!Object.values(OnEvent).includes(event)) return;
    this.dispatcher.register(event, callback);
  }
}
