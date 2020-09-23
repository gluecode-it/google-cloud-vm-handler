import { VmHandler, GoogleVM } from "./index";

  
describe("VmHandler", () => {
  
  it("should be defined", async () => {
    const handler = new VmHandler({} as GoogleVM);
    expect(handler).toBeInstanceOf(VmHandler);
  });

  describe("start()", () => {
    it("should call vm's start function", () => {
      const mockVM: Partial<GoogleVM> = {
        start: jest.fn(),
        waitFor: jest.fn()
      }
      const handler = new VmHandler(mockVM as GoogleVM);
      handler.start();
      expect(mockVM.start).toBeCalled()
    });
  });

  describe("waitFor()", () => {
    it("should return ip", (done) => {
      const expectedIP = '1.1.1.1'
      const mockVM: Partial<GoogleVM> = {
        start: jest.fn(),
        waitFor: (status: string, callback) => {
          setTimeout(() => {
            callback(null, {
              networkInterfaces: [{
                accessConfigs: [{
                  natIP: expectedIP
                }]
              }]
            });
          }, 1)
        }
      }
      const handler = new VmHandler(mockVM as GoogleVM);
      handler.onStarted((ip) => {
        expect(ip).toEqual(expectedIP);
        done()
      });
      handler.start();
    });
  });
  
  
  describe("stop()", () => {
    it("should call vm's stop function", () => {
      const mockVM: Partial<GoogleVM> = {
        stop: jest.fn(),
      }
      const handler = new VmHandler(mockVM as GoogleVM);
      handler.stop();
      expect(mockVM.stop).toBeCalled()
    });
  });

  describe("onStart()", () => {
    it("should call callback of onStart function", (done) => {
      const mockVM: Partial<GoogleVM> = {
        start: jest.fn(),
        waitFor: jest.fn(),
      }
      const handler = new VmHandler(mockVM as GoogleVM);
      const callback = jest.fn();
      handler.onStart(callback);
      handler.start();
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 1);
    });
  })

  describe("onStop()", () => {
    it("should call callback of onStop function", (done) => {
      const mockVM: Partial<GoogleVM> = {
        stop: jest.fn(),
      }
      const handler = new VmHandler(mockVM as GoogleVM);
      const callback = jest.fn();
      handler.onStop(callback);
      handler.stop();
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 1);
    });
  })

  describe("waitFor()", () => {
    it("should throw an error", async () => {
      const mockVM: Partial<GoogleVM> = {
        start: jest.fn(),
        waitFor: (status: string, callback) => {
          callback(new Error(), undefined);
        }
      }
      const handler = new VmHandler(mockVM as GoogleVM);
      try { 
        await handler.start(); 
        fail('should never come to this point')
      } catch {};
    });
  });

});
