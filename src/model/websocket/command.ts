export enum Action {
  DISPLAY_PANE = "DISPLAY_PANE"
}

export class Command {
  readonly action: Action;
  readonly args: any;

  constructor(action: Action, args: any = {}) {
    this.action = action;
    this.args = args;
  }
}
