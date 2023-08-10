import { ethers } from 'ethers';

export class LzCall {
    chainId: number;
    target: string;
    callData: string;
    subCalls: LzCall[];
    lzSuperCall: string;
    fee: string;

    constructor(chainId: number, target: string, callData: string, lzSuperCall: string = "", fee: string = "0") {
        this.chainId = chainId;
        this.target = target;
        this.callData = callData;
        this.lzSuperCall = lzSuperCall;
        this.fee = fee;

        this.subCalls = [];
    }

    getSubCall(index: number): LzCall {
        return this.subCalls[index];
    }

    addSubCall(subCall: LzCall): LzCall {
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
            chainId: this.chainId,
            target: this.target,
            callData: this.callData,
            subCalls: this.subCalls,
            lzSuperCall: this.lzSuperCall,
            fee: this.fee
        } as LzCall
        return this.encodeCall(call);
    }

    private encodeCall(call: LzCall): string {
        const obj = {
            chainId: call.chainId,
            target: call.target,
            callData: call.callData,
            subCalls: call.subCalls.map(subCall => this.encodeCall(subCall)),
            lzSuperCall: call.lzSuperCall,
            fee: call.fee
        };
        const abiEncoder = new ethers.AbiCoder()
        const encodedCall = abiEncoder.encode(["tuple(uint16 chainId, address target, bytes callData, bytes[] subCalls, address lzSuperCall, uint fee)"], [obj]);
        return encodedCall;
    }
}
