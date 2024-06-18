import * as StellarSDK from '@stellar/stellar-sdk';
import fs from 'fs';

const server = new StellarSDK.SorobanRpc.Server('https://soroban-testnet.stellar.org:443');
const sourceKeypair = StellarSDK.Keypair.fromSecret('SDSANP4BT2J5IF75H53436J5A3YJ6RCX24EE5SRFUWU3SBZGXHWTWXJO');

async function buildAndSendTransaction(account, operations) {
  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: StellarSDK.Networks.TESTNET,
  })
    .addOperation(operations)
    .setTimeout(30)
    .build();

  const tx = await server.prepareTransaction(transaction);
  tx.sign(sourceKeypair);

  console.log('Submitting transaction...');
  let response = await server.sendTransaction(tx);
  const hash = response.hash;
  console.log(`Transaction hash: ${hash}`);
  console.log('Awaiting confirmation...');

  while (true) {
    response = await server.getTransaction(hash);
    if (response.status !== "NOT_FOUND") {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  if (response.status === "SUCCESS") {
    console.log('Transaction successful.');
    return response;
  } else {
    console.log('Transaction failed.');
    throw new Error('Transaction failed');
  }
}

async function uploadWasm(filePath) {
  const bytecode = fs.readFileSync(filePath);
  const account = await server.getAccount(sourceKeypair.publicKey());
  const operation = StellarSDK.Operation.uploadContractWasm({ wasm: bytecode });
  return await buildAndSendTransaction(account, operation);
}

async function deployContract(response) {
  const account = await server.getAccount(sourceKeypair.publicKey());

  const operation = StellarSDK.Operation.createCustomContract({
    wasmHash: response.returnValue.bytes(),
    address: StellarSDK.Address.fromString(sourceKeypair.publicKey()),
    salt: response.hash
  });

  const responseDeploy = await buildAndSendTransaction(account, operation);

  const contractAddress = StellarSDK.StrKey.encodeContract(StellarSDK.Address.fromScAddress(
    responseDeploy.returnValue.address()).toBuffer());

  console.log(contractAddress);
}

const wasmFilePath = '/root/contract-deploy/soroban-hello-world/target/wasm32-unknown-unknown/release/hello_world.wasm';
try {
  let uploadResponse = await uploadWasm(wasmFilePath);
  await deployContract(uploadResponse);
} catch (error) {
  console.error(error);
}
