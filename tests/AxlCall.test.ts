import { ethers } from "ethers";
import { AxlCall } from "../src/AxlCall"; // Adjust the import path as needed

describe("AxlCall class", () => {
  it("should add and get a sub-call", () => {
    const mainCall = new AxlCall("ethereum", "target1", "callData1");
    const subCall = new AxlCall("bsc", "target2", "callData2");
    mainCall.addSubCall(subCall);
    expect(mainCall.getSubCall(0)).toBe(subCall);
  });

  it("should remove a sub-call", () => {
    const mainCall = new AxlCall("ethereum", "target1", "callData1");
    const subCall = new AxlCall("bsc", "target2", "callData2");
    mainCall.addSubCall(subCall);
    mainCall.removeSubCall(0);
    expect(mainCall.getSubCall(0)).toBeUndefined();
  });

  it("should calculate total fee", () => {
    const mainCall = new AxlCall("ethereum", "target1", "callData1", "", "10");
    const subCall1 = new AxlCall("bsc", "target2", "callData2", "", "5");
    const subCall2 = new AxlCall("bsc", "target2", "callData2", "", "5");
    mainCall.addSubCall(subCall1);
    mainCall.addSubCall(subCall2);
    expect(mainCall.calculateTotalFee()).toBe("20");
  });

  it("should encode the call", () => {
    const mainCall = new AxlCall(
      "ethereum",
      ethers.ZeroAddress,
      ethers.ZeroAddress,
      ethers.ZeroAddress,
      "0"
    );
    expect(typeof mainCall.encode()).toBe("string");
  });
});
