import * as StellarSDK from '@stellar/stellar-sdk';
const server = new StellarSDK.Horizon.Server("https://horizon-testnet.stellar.org");
console.log(server)
const server2 = new StellarSDK.rpc.Server("https://soroban-testnet.stellar.org/");
console.log(await server2.getTransaction("d71d3f90fced581c4d432b6626a5ea3baaec36130f784fc618e42c02ddbeb307"));