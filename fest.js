import * as StellarSDK from '@stellar/stellar-sdk';
const server = new StellarSDK.SorobanRpc.Server('https://soroban-testnet.stellar.org:443');
// Define the initial network settings and costs
const maxConfigAndCost = {
  networkSettings: {
    maxCpuInstructionsPerTxn: 100_000_000,
    maxMemoryLimitPerTxn: 40 * 1024 * 1024, // 40 MB in bytes
    maxLedgerKeySize: 250,
    maxLedgerEntrySizePerTxn: 64 * 1024, // 64 KB in bytes
    maxReadLedgerEntriesPerTxn: 40,
    maxWriteLedgerEntriesPerTxn: 25,
    maxReadBytesPerTxn: 200 * 1024, // 200 KB in bytes
    maxWriteBytesPerTxn: 65 * 1024, // 65 KB in bytes
    maxTxnSize: 70 * 1024, // 70 KB in bytes
    maxEventsReturnValueSize: 8 * 1024, // 8 KB in bytes
  },
  costs: {
    cpuInstructionPer10k: 25,
    readLedgerEntry: 6250,
    writeLedgerEntry: 10000,
    read1KBFromLedger: 1786,
    txnSizePer1KB: 1624,
    txnHistoryPer1KB: 16235,
    eventsReturnValuePer1KB: 10000,
    write1KBToLedger: 11800,
  }
};

// Function to calculate the resource fee for a single transaction
function calculateResourceFee(actualUsage, config) {
  const { costs } = config;

  const cpuFee = (actualUsage.cpuInstructionsPerTxn || 0) / 10_000 * costs.cpuInstructionPer10k;
  const readLedgerEntryFee = (actualUsage.readLedgerEntriesPerTxn || 0) * costs.readLedgerEntry;
  const writeLedgerEntryFee = (actualUsage.writeLedgerEntriesPerTxn || 0) * costs.writeLedgerEntry;
  const readBytesFee = (actualUsage.readBytesPerTxn || 0) / 1024 * costs.read1KBFromLedger;
  const writeBytesFee = (actualUsage.writeBytesPerTxn || 0) / 1024 * costs.write1KBToLedger;
  const txnSizeFee = (actualUsage.txnSize || 0) / 1024 * costs.txnSizePer1KB;
  const txnHistoryFee = (actualUsage.txnSize || 0) / 1024 * costs.txnHistoryPer1KB;
  const eventsReturnValueFee = (actualUsage.eventsReturnValueSize || 0) / 1024 * costs.eventsReturnValuePer1KB;

  const totalFee = cpuFee + readLedgerEntryFee + writeLedgerEntryFee + readBytesFee + writeBytesFee + txnSizeFee + txnHistoryFee + eventsReturnValueFee;

  return totalFee;
}

const actualUsage = {
  cpuInstructionsPerTxn: 8,
  readLedgerEntriesPerTxn: 10,
  writeLedgerEntriesPerTxn: 20,
  readBytesPerTxn: 150 * 1024, // 150 KB in bytes
  writeBytesPerTxn: 50 * 1024, // 50 KB in bytes
  txnSize: 60 * 1024, // 60 KB in bytes
  eventsReturnValueSize: 6 * 1024, // 6 KB in bytes
};

const resourceFee = calculateResourceFee(actualUsage, maxConfigAndCost);

async function fetchFeeStats() {
  try {
    const feeStats = await server.getFeeStats();
    return feeStats.sorobanInclusionFee.max;
  } catch (error) {
    console.error('Error fetching fee stats:', error);
  }
}

fetchFeeStats().then(sorobanInclusionFee => {
  let totalFee = resourceFee + sorobanInclusionFee;
  let totalFeeInXLM = totalFee * 10 ** -7;
  // console.log(`Total Fee: ${totalFee} stroops`);
  console.log(`Total Fee: ${totalFeeInXLM} XLM`);
}).catch(error => {
  console.error('Error calculating total fee:', error);
});