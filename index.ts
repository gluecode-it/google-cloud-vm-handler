import { EventEmitter } from "events";
const Compute = require("@google-cloud/compute");

require("dotenv").config();

enum Event {
  START = "START",
  STARTED = "STARTED",
  STOP = "STOP",
}

export class VmHandler {
  private emitter = new EventEmitter();
  private vm: any;

  constructor(private vm: any) {}

  onStart(callback: () => void) {
    this.emitter.on(Event.START, callback);
  }

  onStarted(callback: (ip: string) => void) {
    this.emitter.on(Event.STARTED, callback);
  }

  onStop(callback: () => void) {
    this.emitter.on(Event.STOP, callback);
  }

  async start() {
    this.vm.waitFor("RUNNING", (err: Error, metadata: any) => {
      if (!err)
        this.emitter.emit(
          Event.STARTED,
          metadata?.networkInterfaces[0].accessConfigs[0].natIP
        );
    });
    await this.vm.start();
  }

  async stop() {
    await this.vm.stop();
  }
}
