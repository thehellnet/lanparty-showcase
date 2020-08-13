import {AbstractService} from "@/services/abstract.service";
import {WebsocketClient} from "@/helpers/websocket.client";
import {EventDispatcher, Handler} from "@/helpers/event";
import {PathUtility} from "@/helpers/path.utility";
import {Action, Command} from "@/model/websocket/command";

const URL = "ws://127.0.0.1:8080/lanparty_manager/api/public/ws/showcase";

const TAG = PathUtility.basename(window.location.href) || "anonymous";

class WebsocketService extends AbstractService {
  private websocketClient: WebsocketClient;

  private _onConnect = new EventDispatcher<void>();
  private _onDisconnect = new EventDispatcher<void>();
  private _onMessage = new EventDispatcher<Command>();

  constructor() {
    super();

    this.websocketClient = new WebsocketClient(URL, TAG);

    this.websocketClient.onConnect(() => {
      this._onConnect.fire();
    });

    this.websocketClient.onDisconnect(() => {
      this._onDisconnect.fire();
    });

    this.websocketClient.onMessage(message => {
      this.handleMessage(message);
    });
  }

  public onConnect(handler: Handler<void>) {
    this._onConnect.register(handler);
  }

  public onDisconnect(handler: Handler<void>) {
    this._onDisconnect.register(handler);
  }

  public onMessage(handler: Handler<Command>) {
    this._onMessage.register(handler);
  }

  start(): void {
    this.websocketClient.start();
  }

  stop(): void {
    this.websocketClient.stop();
  }

  public send(command: Command): void {
    const message: string = JSON.stringify(command);
    this.websocketClient.send(message);
  }

  private handleMessage(message: string): void {
    const content = JSON.parse(message);

    const command: Command = {
      action: content.action,
      args: content.args
    };

    this._onMessage.fire(command);
  }
}

const websocketService = new WebsocketService();
websocketService.start();

export default websocketService;
