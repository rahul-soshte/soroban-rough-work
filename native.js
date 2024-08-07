// import * as StellarSDK from '@stellar/stellar-sdk';

// // Base64 XDR string
// const base64XDR = 'AgAAAD7BsmYAAAAA';
// // const xdrBytes = Buffer.from(base64XDR, 'base64');
// // const scVal = StellarSDK.xdr.ScVal.fromXDR(xdrBytes);

// // Decode the base64 XDR to ScVal
// // const scVal = StellarSDK.xdr.ScVal.fromXDR(base64XDR, 'base64');

// // Convert ScVal to native value
// // const nativeValue = StellarSDK.StrKey.scValToNative(scVal);
// const decodedBytes = Buffer.from(base64XDR, 'hex');
// const decodedString = decodedBytes.toString();

// console.log(decodedString);

const result = { key: 'AgAAAD7BsmYAAAAA' }; // Your object

// Convert the object to a JSON string
const jsonString = JSON.stringify(result);

// Convert the JSON string to a Uint8Array (binary format)
const encoder = new TextEncoder();
const binaryData = encoder.encode(jsonString);

// console.log(binaryData);
const decoder = new TextDecoder();
const decodedString = decoder.decode(binaryData);
console.log(decodedString);
