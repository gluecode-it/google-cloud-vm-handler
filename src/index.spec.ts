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
    it("should call onStarted function", (done) => {
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
  
});
