import { EventEmitter } from "events";

enum Event {
  START = "START",
  STARTED = "STARTED",
  STOP = "STOP",
}

interface AccessConfig {
  natIP: string
}
interface NetworkInterface {
  accessConfigs: AccessConfig[]
}

interface MetaData {
  networkInterfaces: NetworkInterface[]
}

export interface GoogleVM {
  start(): Promise<any>
  stop(): Promise<any>
  waitFor(state: "RUNNING", callback: (err: Error | null, metadata?: MetaData) => void): any
}

export class VmHandler {
  private emitter = new EventEmitter();

  constructor(private vm: GoogleVM) {}

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
    try {
    this.vm.waitFor("RUNNING", (err: Error | null, metadata?: MetaData) => {
      if (err) throw err;
      this.emitter.emit(
        Event.STARTED,
        metadata?.networkInterfaces[0].accessConfigs[0].natIP
      );
    });
  } catch(err) {
    throw err;
  }
    await this.vm.start();
    this.emitter.emit(Event.START);
  }

  async stop() {
    await this.vm.stop();
    this.emitter.emit(Event.STOP);
  }
}
