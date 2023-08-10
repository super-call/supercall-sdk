# SuperCall TypeScript SDK

The SuperCall SDK is a library that allows developers to interact with SuperCall smart contracts more easily. It provides the necessary tools to construct cross-chain multicall transactions. The SDK's core functionality is encapsulated within the `Call` class.

## Installation

Include the SDK in your project by adding it to your dependencies:

```bash
npm install --save @super-call/sdk
```

## Features

- **Simple Transaction Construction:** Easily create transactions for interaction with SuperCall smart contracts.
- **Sub-Calls Management:** Add, remove, and manage sub-calls within a call.
- **Fee Calculation:** Automatically calculate the total fee for the call and its sub-calls.
- **Call Encoding:** Encode the call for transaction submission.

## Quickstart

### Create a Call

```typescript
async function createCall(source, destination) {
    const chainId = destination.chainId;
    const target = destination.loggerContract.address;
    const callData = getLogCallData(`Call from ${source.chainId} to ${destination.chainId}.`);
    const lzSuperCall = destination.contract.address;
    const fee = await calculateCallFee(source, destination);
    return new Call(chainId, target, callData, lzSuperCall, fee);
}
```

### Construct Calls and Sub-Calls

```typescript
const call1 = await createCall(source, moonbeam);
call1.addSubCall(await createCall(moonbeam, fantom));
call1.addSubCall(await createCall(moonbeam, ethereum));
// ...
```

### Calculate Total Fee and Encode Calls

```typescript
const fee = calls.reduce((a, b) => (Number(a) + Number(b.calculateTotalFee())), 0).toString();
const encodedCalls = calls.map(call => call.encode());
```

### Submit Transaction

```typescript
const tx = await source.contract.aggregate(encodedCalls, { value: fee });
console.log("Submit transaction successfully: ", tx.hash);
```

## API Reference

### `Call` Class

#### Properties

- `chainId`: Number representing the blockchain chain id.
- `target`: String representing the target contract address.
- `callData`: String representing the call data.
- `subCalls`: Array of sub-call instances (`Call[]`).
- `lzSuperCall`: String representing the lzSuperCall's address.
- `fee`: String representing the fee.

#### Methods

- `getSubCall(index)`: Retrieve a sub-call by index.
- `addSubCall(subCall)`: Add a sub-call.
- `removeSubCall(index)`: Remove a sub-call by index.
- `calculateTotalFee()`: Calculate the total fee for this call and its sub-calls.
- `encode()`: Encode the call for transaction submission.

## Support

For issues and feature requests, please [open an issue](link-to-your-issue-tracker) on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.