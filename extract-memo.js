import * as StellarSDK from '@stellar/stellar-sdk';

async function getTransactionXDR(transactionHash) {
  // Configure the Stellar SDK to use the public network
  const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');

  try {
    // Fetch the transaction using its hash
    const transaction = await server.transactions().transaction(transactionHash).call();

    // Extract the XDR data
    const envelopeXDR = transaction.envelope_xdr;
    const resultXDR = transaction.result_xdr;
    const resultMetaXDR = transaction.result_meta_xdr;
    const feeMetaXDR = transaction.fee_meta_xdr;

    return {
      envelopeXDR,
      resultXDR,
      resultMetaXDR,
      feeMetaXDR
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

// Usage example
// const transactionHash = 'cbb496a8f2a63492a8f1f5e7e521e6a48f4397459a7ab9060a88f1ff93e21365';
const transactionHash = '2cf79e771b193a89f25f8bd133ec35a840d54f8cc5ba66ac9cbf72a4d0a3a61a';

getTransactionXDR(transactionHash)
  .then(xdrData => {
    console.log('Envelope XDR:', xdrData.envelopeXDR);
    let tx = new StellarSDK.Transaction(xdrData.envelopeXDR.toString(), StellarSDK.Networks.TESTNET );
    console.log(tx.memo);
    // console.log('Result XDR:', xdrData.resultXDR);
    // console.log('Result Meta XDR:', xdrData.resultMetaXDR);
    // console.log('Fee Meta XDR:', xdrData.feeMetaXDR);
  })
  .catch(error => {
    console.error('Failed to get XDR data:', error);
  });
