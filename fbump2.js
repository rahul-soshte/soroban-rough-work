import * as StellarSDK from '@stellar/stellar-sdk';

// Define the network passphrase (use 'Testnet' for testing and 'Public Global Stellar Network ; September 2015' for production)
const networkPassphrase = StellarSDK.Networks.TESTNET;

// Create keypairs for the source account and the fee account
const sourceKeypair = StellarSDK.Keypair.fromSecret('SCOC6FE6QR2QEOPRYN4PI2HEHTCWOZX2QTSA6H75OWRQNGKPPLLXQLRP');
const feeKeypair = StellarSDK.Keypair.fromSecret('SAJL6SCPP63AMRTHRB76JZXPEFYAIXTSKULRBRLRW7F5YPFRWMR23EAD');

// Load the source account (this requires network interaction)
const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

// Construct the inner transaction
const innerTransaction = new StellarSDK.TransactionBuilder(sourceAccount, { fee: StellarSDK.BASE_FEE, networkPassphrase })
    .addOperation(StellarSDK.Operation.payment({
        destination: 'GDWH3P3MNTCMOY42CA7RVEACUUAUPZ73XDYKPYUL3TWOFRF37FD6OVM6',
        asset: StellarSDK.Asset.native(),
        amount: '10'
    }))
    .setTimeout(30)
    .build();

// Sign the inner transaction with the source account
innerTransaction.sign(sourceKeypair);

// Build the fee-bump transaction
const feeBumpTransaction = StellarSDK.TransactionBuilder.buildFeeBumpTransaction(
    feeKeypair,
    StellarSDK.BASE_FEE * 2,
    innerTransaction,
    networkPassphrase
);

// Sign the fee-bump transaction with the fee account
feeBumpTransaction.sign(feeKeypair);

// Submit the fee-bump transaction to the Stellar network
server.submitTransaction(feeBumpTransaction)
.then(response => {
        console.log('Success! Results:', response);
})
.catch(error => {
        console.error('Something went wrong!', error);
});
