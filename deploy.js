const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const sourceKeypair = StellarSdk.Keypair.fromSecret('YOUR_SECRET_KEY');

async function deployContract(contractID) {
  const account = await server.loadAccount(sourceKeypair.publicKey());
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(StellarSdk.Operation.createContract({
      contractId: contractID,
    }))
    .setTimeout(30)
    .build();
  
  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  console.log(result);
}

// Your contract ID here
const contractID = 'YOUR_CONTRACT_ID'; 
deployContract(contractID);
