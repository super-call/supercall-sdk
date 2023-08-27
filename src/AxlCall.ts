import { ethers } from "ethers";

export class AxlCall {
  chain: string;
  target: string;
  callData: string;
  subCalls: AxlCall[];
  axlSuperCall: string;
  fee: string;

  constructor(
    chain: string,
    target: string,
    callData: string,
    axlSuperCall: string = "",
    fee: string = "0"
  ) {
    this.chain = chain;
    this.target = target;
    this.callData = callData;
    this.axlSuperCall = axlSuperCall;
    this.fee = fee;

    this.subCalls = [];
  }

  getSubCall(index: number): AxlCall {
    return this.subCalls[index];
  }

  addSubCall(subCall: AxlCall): AxlCall {
    this.subCalls.push(subCall);
    return subCall;
  }

  removeSubCall(index: number): void {
    this.subCalls.splice(index, 1);
  }

  calculateTotalFee(): string {
    let fee = Number(this.fee);
    for (let i = 0; i < this.subCalls.length; i++) {
      fee += Number(this.subCalls[i].calculateTotalFee());
    }
    return fee.toString();
  }

  encode(): string {
    const call = {
      chain: this.chain,
      target: this.target,
      callData: this.callData,
      subCalls: this.subCalls,
      axlSuperCall: this.axlSuperCall,
      fee: this.fee,
    };
    return this.encodeCall(call);
  }

  private encodeCall(call: {
    chain: string;
    target: string;
    callData: string;
    subCalls: AxlCall[];
    axlSuperCall: string;
    fee: string;
  }): string {
    const obj = {
      chain: call.chain,
      target: call.target,
      callData: call.callData,
      subCalls: call.subCalls.map((subCall) => this.encodeCall(subCall)),
      axlSuperCall: call.axlSuperCall,
      fee: call.fee,
    };
    const abiEncoder = new ethers.AbiCoder();
    const encodedCall = abiEncoder.encode(
      [
        "tuple(string chain, address target, bytes callData, bytes[] subCalls, address axlSuperCall, uint fee)",
      ],
      [obj]
    );
    return encodedCall;
  }
}
