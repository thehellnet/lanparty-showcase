import { EventDispatcher, Handler } from "./event";

export class WebsocketClient {
  private readonly wsUrl: string;
  private readonly tag: string;

  private keepRunning = false;
  private running = false;

  private webSocket!: WebSocket;

  private _onConnect = new EventDispatcher<void>();
  private _onDisconnect = new EventDispatcher<void>();
  private _onMessage = new EventDispatcher<string>();

  constructor(wsUrl: string, tag: string) {
    this.wsUrl = wsUrl;
    this.tag = tag;
  }

  public start() {
    console.log("Starting Websocket");
    this.keepRunning = true;
    this.openWebsocket();
  }

  public stop() {
    console.log("Closing Websocket");
    this.keepRunning = false;
    this.closeWebsocket();
  }

  public send(message: string) {
    if (!this.running) {
      return;
    }

    this.webSocket.send(message);
  }

  public onConnect(handler: Handler<void>) {
    this._onConnect.register(handler);
  }

  public onDisconnect(handler: Handler<void>) {
    this._onDisconnect.register(handler);
  }

  public onMessage(handler: Handler<string>) {
    this._onMessage.register(handler);
  }

  private openWebsocket() {
    const url = `${this.wsUrl}/${this.tag}`;
    this.webSocket = new WebSocket(url);

    this.webSocket.onopen = ev => {
      this.running = true;
      this._onConnect.fire();
    };

    this.webSocket.onclose = ev => {
      this.running = false;
      this._onDisconnect.fire();
      this.checkRestart();
    };

    this.webSocket.onerror = ev => {
      console.log(ev);
    };

    this.webSocket.onmessage = ev => {
      const message: string = ev.data;
      this._onMessage.fire(message);
    };
  }

  private closeWebsocket() {
    this.webSocket.close();
  }

  private checkRestart() {
    if (!this.keepRunning) {
      return;
    }

    setTimeout(() => {
      this.openWebsocket();
    }, 1000);
  }
}
