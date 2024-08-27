import * as StellarSDK from '@stellar/stellar-sdk';
const server = new StellarSDK.SorobanRpc.Server('https://soroban-testnet.stellar.org:443');
const sourceKeypair = StellarSDK.Keypair.fromSecret('SB66VLFNPAMBIAS5FLPY5NEKALZA64INYELFYEGPT53UI7S6ORPMSLK5');
const contractId = 'CBFXLDMHC65DVNJWALDXF7VKQIRZ7T4FHWFLLTMAU72EUXC6KET5MV45';
const sourceAccount = await server.getAccount(sourceKeypair.publicKey())
const contract = new StellarSDK.Contract(contractId);

const MIN_TEMP_TTL = 100
const MAX_PERS_TTL = 500
class LedgerEntryRentChange {
  constructor(isPersistent, oldSizeBytes, newSizeBytes, oldLiveUntilLedger, newLiveUntilLedger) {
      // Whether this is persistent or temporary entry.
      this.isPersistent = isPersistent;

      // Size of the entry in bytes before it has been modified, including the key.
      // 0 for newly-created entries.
      this.oldSizeBytes = oldSizeBytes;

      // Size of the entry in bytes after it has been modified, including the key.
      this.newSizeBytes = newSizeBytes;

      // Live until ledger of the entry before it has been modified.
      // Should be less than the current ledger for newly-created entries.
      this.oldLiveUntilLedger = oldLiveUntilLedger;

      // Live until ledger of the entry after it has been modified.
      this.newLiveUntilLedger = newLiveUntilLedger;
  }

  entryIsNew() {
      return this.oldSizeBytes === 0 && this.oldLiveUntilLedger === 0;
  }

  extensionLedgers(currentLedger) {
      const ledgerBeforeExtension = this.entryIsNew() 
          ? Math.max(currentLedger - 1, 0)
          : this.oldLiveUntilLedger;
      return exclusiveLedgerDiff(ledgerBeforeExtension, this.newLiveUntilLedger);
  }

  prepaidLedgers(currentLedger) {
      if (this.entryIsNew()) {
          return null;
      } else {
          return inclusiveLedgerDiff(currentLedger, this.oldLiveUntilLedger);
      }
  }

  sizeIncrease() {
      const increase = this.newSizeBytes - this.oldSizeBytes;
      return increase > 0 ? increase : null;
  }
}

// Reference for sorobill function
// https://github.com/kalepail/sorobill
function sorobill(sim, tx_xdr) {
  
  const events = sim.result.events.map((e) => {
    const buffer_val = Buffer.from(e, 'base64');
    let parsedEvent = StellarSDK.xdr.DiagnosticEvent.fromXDR(buffer_val);
  
    if (parsedEvent.event().type().name !== 'contract')
          return 0;

    return parsedEvent.event().toXDR().length;
  });

  console.log(sim);

  const events_and_return_bytes = (
      events.reduce(
          (accumulator, currentValue) => accumulator + currentValue, 0 // Initialize accumulator with 0
      ) + (sim.result.results[0] ? sim.result.results[0].xdr.length : 0) // Return value size
  );


  const sorobanTransactionData = StellarSDK.xdr.SorobanTransactionData.fromXDR(sim.result.transactionData, 'base64');
  const resources = sorobanTransactionData.resources();
  const stroopValue = sorobanTransactionData.resourceFee().toString();

  const xlmValue = Number(stroopValue) * 10**(-7);

  const rwro = [
      sorobanTransactionData.resources().footprint().readWrite()
      .flatMap((rw) => rw.toXDR().length),
      sorobanTransactionData.resources().footprint().readOnly()
      .flatMap((ro) => ro.toXDR().length)
  ].flat();

  // console.log("stateChanges", sim.result);
  let latestLedger =  sim.result.latestLedger;
  let arr = [];

  sim.result.stateChanges.forEach(entry => {

    if (entry.type == "created") { //TODO: Newly Created Entries
        // TODO: Persistent / Temporary Handling
    } else if (entry.type == "updated") { //TODO:  Updated Entries
      // TODO: Persistent / Temporary Handling
      console.log("Before ", entry.before.length);
      console.log("After ", entry.after.length);

    } else if (entry.type == "deleted") { // TODO: Deleted Entries
      // TODO: Persistent / Temporary Handling
    }
    // let before = StellarSDK.xdr.LedgerEntry.fromXDR(entry.before, 'base64');
    // let after = StellarSDK.xdr.LedgerEntry.fromXDR(entry.after, 'base64');   
    


    // console.log(entry)
    // const beforeSize = entry.beforeSize; // You'd need to get this from somewhere
    // const afterSize = entry.afterSize;   // This should be in the simulation result
    // console.log(entry.key.length)
    // console.log(entry.after.length)
    // console.log("________________")
    // Ledger Entry can be account or D
    // let before = StellarSDK.xdr.LedgerEntry.fromXDR(entry.before, 'base64');
    // let after = StellarSDK.xdr.LedgerEntry.fromXDR(entry.after, 'base64');   
    // arr.push(val.data().contractData().durability().name)
    // console.log(before)
    // console.log(after)
    // console.log(val.data().contractData().durability().name);
    // console.log("______________________________________________________")

    // console.log(StellarSDK.xdr.LedgerEntryData.fromXDR(val.data(), 'base64'));
    // const sizeChange = afterSize - beforeSize;
    // totalSizeChange += sizeChange;
  });

  // console.log( sorobanTransactionData.resources().footprint().readWrite()[0])
  // console.log(sim.result.results); 

  // console.log("Damn ", sorobanTransactionData.resources().footprint().readWrite()[0].contractData().key());
  const metrics = {
      mem_byte: Number(sim.result.cost.memBytes),
      cpu_insn: Number(sim.result.cost.cpuInsns)
  };

  console.log(sim.result.cost);
 
  const stats = {
      // The maximum number of instructions this transaction can use
      cpu_insns: metrics.cpu_insn,
      
      mem_bytes: metrics.mem_byte,
      entry_reads: resources.footprint().readOnly().length + resources.footprint().readWrite().length,
      entry_writes: resources.footprint().readWrite().length,
      // The maximum number of bytes this transaction can read from ledger
      read_bytes: resources.readBytes(),
      // NOTE This covers both `contractDataEntrySizeBytes` in the case of a contract invocation and `contractMaxSizeBytes` in the case of a WASM install
      // The maximum number of bytes this transaction can write to ledger
      write_bytes: resources.writeBytes(),
      events_and_return_bytes,
      /* NOTE
          This field isn't terribly useful as the actual tx size may be larger once you've added all the signatures
          If the tx doesn't even have the sorobanData or auth applied this will be even less useful (and so we `undefined` it)
      */
      min_txn_bytes: tx_xdr ? tx_xdr.length : undefined,
      ledger_data: arr,
      latestLedger: latestLedger,
    
      // max_entry_bytes: tx ? entries?.length ? Math.max(...entries) : 0 : undefined,
      resource_fee_in_xlm: xlmValue,
  };

  return stats;
}


const transaction = new StellarSDK.TransactionBuilder(sourceAccount, { fee: StellarSDK.BASE_FEE, networkPassphrase: StellarSDK.Networks.TESTNET })
  .addOperation(
    contract.call(
      "hello",
      StellarSDK.xdr.ScVal.scvSymbol('Dev'),
    ),
  )
  .setTimeout(30)
  .build();

// const tx_xdr = transaction.toEnvelope().toXDR('base64');
const setup_tx_xdr = "AAAAAgAAAABwPvpkHZrJwX92F6cNhykaUEXZPjc4CHhjZ87phJ7VigAbayoAAMELAAAAJAAAAAAAAAAAAAAAAQAAAAAAAAAYAAAAAAAAAAHs72ahm4DSe41gIbLlVFscYqT3ktEWiEAdVl41i2jaaQAAAAVzZXR1cAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAB2eylAsNzn2GQVBSDYNWv2fjfSJHfYg1rH73+Ewtw6MpAAAAAwAAAAYAAAAB7O9moZuA0nuNYCGy5VRbHGKk95LRFohAHVZeNYto2mkAAAAQAAAAAQAAAAEAAAAPAAAABU15S2V5AAAAAAAAAAAAAAYAAAAB7O9moZuA0nuNYCGy5VRbHGKk95LRFohAHVZeNYto2mkAAAAQAAAAAQAAAAEAAAAPAAAABU15S2V5AAAAAAAAAQAAAAYAAAAB7O9moZuA0nuNYCGy5VRbHGKk95LRFohAHVZeNYto2mkAAAAUAAAAAQALeW8AAAZAAAABSAAAAAAAG2rGAAAAAYSe1YoAAABAf0VHOT+ui4WgBHm9Isr9XgcLFVr8p3ego+oSK2Z0k287o1l/pRpoV9FOc8cct33brIjQOZbK/egow59+arqoBA=="
// const tx_xdr = "AAAAAgAAAACltnD2c1YcSX3Q2bOo6hoCMXXO/XPGr/i+fU/yPP0XfQAAAGQADUgRAAAABQAAAAEAAAAAAAAAAAAAAABms9ReAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABS3WNhxe6OrU2Asdy/qqCI5/PhT2Ktc2Ap/RKXF5RJ9YAAAAFaGVsbG8AAAAAAAABAAAADwAAAANEZXYAAAAAAAAAAAAAAAAA";

let requestBody = {
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "simulateTransaction",
  "params": {
    "transaction": setup_tx_xdr
    // "resourceConfig": {
    //   "instructionLeeway": 571604700
    // }
  }
}

let res = await fetch("https://soroban-testnet.stellar.org", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody),
})

let simulateResponse = await res.json();
let sorocosts = sorobill(simulateResponse, setup_tx_xdr)
// let inclusionFee = await server.getFeeStats();
// inclusionFee = inclusionFee.sorobanInclusionFee.max
// let totalEstimatedFee = sorocosts.resource_fee_in_xlm + inclusionFee
console.log("Contract Costs ", sorocosts)
// console.log("Total Fees ", totalEstimatedFee)



