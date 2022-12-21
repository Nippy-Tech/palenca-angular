export interface IDispatcher<T> {
  register(event: string, callback: T): void;
  remove(event: string, callback: T): void;
  dispatch(event: string, ...args: any[]): void;
  clear(): void;
}

export class Dispatcher<T extends Function> implements IDispatcher<T> {
  events: { [key: string]: { listeners: T[] } };
  constructor() {
    this.events = {};
  }

  register(event: string, callback: T): void {
    if (typeof event !== 'string') {
      throw new Error('Event must be a string');
    }
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    if (this.events[event] === undefined) {
      this.events[event] = {
        listeners: [],
      };
    }
    this.events[event].listeners.push(callback);
  }

  remove(event: string, callback: T) {
    if (this.events[event] === undefined) {
      throw new Error('Event does not exist');
    }

    this.events[event].listeners = this.events[event].listeners.filter(
      listener => {
        return listener.toString() !== callback.toString();
      }
    );
  }

  dispatch(event: string, result: object) {
    if (this.events[event] === undefined) return;
    this.events[event].listeners.forEach(listener => {
      listener(result, event);
    });
  }

  clear() {
    Object.entries(this.events).map(([event, { listeners }]) => {
      listeners.forEach(listener => {
        this.remove(event, listener);
      });
    });
  }
}
