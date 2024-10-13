import * as StellarSDK from '@stellar/stellar-sdk';
const server = new StellarSDK.Horizon.Server("https://horizon-testnet.stellar.or/g");
console.log(server)