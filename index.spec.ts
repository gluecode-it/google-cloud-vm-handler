import { VmHandler } from ".";

const zone = "__zone__";
const instanceName = "__instance__";

describe("", () => {
  it("should be defined", async () => {
    const handler = new VmHandler(zone, instanceName);
    expect(handler).toBeDefined();
  });
});
